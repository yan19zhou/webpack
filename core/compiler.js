/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 14:28:16
 * @LastEditTime: 2021-11-30 18:06:49
 * @LastEditors: zhouy
 */
/* 
    关于这三个属性的值就是我们上文提到前置知识的tapable的SyncHook方法，本质上你可以简单将SyncHook()方法理解称为一个Emitter Event类。
    当我们通过new SyncHook()返回一个对象实例后，我们可以通过this.hook.run.tap('name',callback)方法为这个对象上添加事件监听，然后在通过this.hook.run.call()执行所有tap注册的事件。
*/
const path = require("path");
const { SyncHook } = require("tapable");
const { toUnixPath, tryExtensions } = require("./utils");
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

class Compiler {
  constructor(options) {
    this.options = options;

    this.rootPath = options.context || toUnixPath(process.cwd());
    // 创建plugin hooks
    this.hooks = {
      // 开始编译
      run: new SyncHook(),
      // 编译到文件输出到output前
      emit: new SyncHook(),
      // 编译完成后
      done: new SyncHook(),
    };
    /* 
        1.入口文件匹配的loader进行处理
        2.处理好的文件进行编译
        3.分析入口文件依赖进行loader处理-->编译
        4.对内层依赖进行递归处理-->编译
        5.组装成一个个包含多个模块的chunk
    */

    // 保存所有入口模块对象
    this.entries = new Set();
    // 保存所有依赖模块对象
    this.modules = new Set();
    // 保存所有的代码块对象
    this.chunks = new Set();
    // 本次产出所有文件对象
    this.assets = new Set();
    // 本次产出所有文件目录
    this.files = new Set();
  }

  // run方法启动编译，同时调用回调函数
  run(cb) {
    // 触发run钩子，执行挂到run上面的plugin
    this.hooks.run.call();
    // 拿到入口文件路径
    const entry = this.getEntry();

    // 编译入口文件
    this.buildEntryModule(entry);
  }

  getEntry() {
    let entry = Object.create(null);
    // entry的几种情况 对象，字符串
    const optionEntry = this.options.entry;
    if (typeof optionEntry === "string") {
      entry.main = optionEntry;
    } else {
      entry = optionEntry;
    }
    // 拼接成绝对路径
    Object.keys(entry).forEach((key) => {
      const value = entry[key];
      if (!path.isAbsolute(value)) {
        entry[key] = toUnixPath(path.join(this.rootPath, value));
      }
    });

    return entry;
  }

  buildEntryModule(entry) {
    Object.keys(entry).forEach((entryName) => {
      const entryPath = entry[entryName];
      // 模块编译
      const entryObject = this.buildMoudle(entryName, entryPath);
      this.entries.add(entryObject);
    });
  }
  buildMoudle(name, path) {
    /* 
        1.根据路径使用fs读取源码文件
        2.根据匹配的loader处理文件，生成处理后代码块
        3.通过babel分析处理后的文件，进行编译
        4.如果有依赖的话递归处理依赖
    */

    // 读取原始代码
    const originSourceCode = (this.originSourceCode = fs.readFileSync(path, "utf-8"));

    //编译后代码
    this.moduleCode = originSourceCode;
    this.handleLoader(path);
    // 调用webpack对源码进行编译，得到最终的module对象
    const module = this.handleWebpackCompiler(name, path);
    return module;
  }
  // 调用webpack进行模块编译
  handleWebpackCompiler(moduleName, modulePath) {
    // 将当前模块相对于项目启动根目录计算出相对路径并作为模块id
    const moduleId = "./" + toUnixPath(path.relative(this.rootPath, modulePath));
    console.log(moduleId);
    const module = {
      id: moduleId,
      dependencies: new Set(), //该模块依赖的绝对路径
      name: [moduleName], // 该模块所属的入口文件
    };

    // 调用babel分析代码 生成ast
    console.log(this.moduleCode);
    const ast = parser.parse(this.moduleCode, {
      sourceType: "module",
    });

    traverse(ast, {
      CallExpression: (nodePath) => {
        const node = nodePath.node;
        if (node.callee.name === "require") {
          // 获得源代码中引入模块相对路径
          const moduleName = node.arguments[0].value;
          // 寻找模块绝对路径 当前模块路径+require()对应相对路径
          const moduleDirName = path.posix.dirname(modulePath);
          const absolutePath = tryExtensions(path.posix.join(moduleDirName, moduleName), this.options.resolve.extensions, moduleName, moduleDirName);
          // 生成moduleId - 针对于跟路径的模块ID 添加进入新的依赖模块路径
          const moduleId = "./" + path.relative(this.rootPath, absolutePath);
          // 通过babel修改源代码中的require变成__webpack_require__语句
          node.callee = t.identifier("__webpack_require__");
          // 修改源代码中require语句引入的模块 全部修改变为相对于跟路径来处理
          node.arguments = [t.stringLiteral(moduleId)];
          // 为当前模块添加require语句造成的依赖(内容为相对于根路径的模块ID)
          module.dependencies.add(moduleId);
        }
      },
    });

    const { code } = generator(ast);
    module._source = code;
    return module;
  }
  handleLoader(path) {
    const mathLoaders = [];
    // 拿到配置中的loaders
    const rules = this.options.module.rules;
    rules.map((rule) => {
      const loaderTest = rule.test;

      if (loaderTest.test(path)) {
        // test匹配上了
        // rules：[{test://,loader:''},{test://,use:[]}]
        if (rule.loader) {
          mathLoaders.push(rule.loader);
        } else {
          mathLoaders.push(...rule.use);
        }
      }
      for (let i = 0; i < mathLoaders.length; i++) {
        // 引入loader 传入源码
        const loaderFn = require(mathLoaders[i]);
        this.moduleCode = loaderFn(this.moduleCode);
      }
    });
  }
}

module.exports = Compiler;
