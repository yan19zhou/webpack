/*
 * @Description: 实现loader-runner
 * @Author: zhouy
 * @Date: 2021-12-02 17:29:39
 * @LastEditTime: 2021-12-03 09:34:21
 * @LastEditors: zhouy
 */

const fs = require("fs");
/**
 * @description:
 * @param {*} options:resource,loaders,context,fs.readFile
 * @param {*} cb
 * @return {*}
 */
function runLoaders(options, cb) {
  // 分解参数options
  //  需要出来的资源绝对路径
  const resource = options.resource || "";
  // 需要处理的loaders组成的绝对路径数组
  let loaders = options.loaders || [];
  // loader上下文
  const context = options.context || {};
  // 读取文件的方法
  const readResource = options.readResource || fs.readFile.bind(fs);

  // 根据loaders绝对路径创建loaders对象
  loaders = loaders.map(createLoaderObject);
  
  // 处理loaderContext 也就是loader中的this对象
  loaderContext.resourcePath = resource; // 资源路径绝对地址
  loaderContext.readResource = readResource; // 读取资源文件的方法
  loaderContext.loaderIndex = 0; // 我们通过loaderIndex来执行对应的loader
  loaderContext.loaders = loaders; // 所有的loader对象
  loaderContext.data = null;
  // 标志异步loader的对象属性
  loaderContext.async = null;
  loaderContext.callback = null;
  // request 保存所有loader路径和资源路径
  // 这里我们将它全部转化为inline-loader的形式(字符串拼接的"!"分割的形式)
  // 注意同时在结尾拼接了资源路径哦～
  Object.defineProperty(loaderContext, "request", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders
        .map((l) => l.request)
        .concat(loaderContext.resourcePath || "")
        .join("!");
    },
  });
  // 保存剩下的请求 不包含自身(以LoaderIndex分界) 包含资源路径
  Object.defineProperty(loaderContext, "remainingRequest", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders
        .slice(loaderContext + 1)
        .map((i) => i.request)
        .concat(loaderContext.resourcePath)
        .join("!");
    },
  });
  // 保存剩下的请求，包含自身也包含资源路径
  Object.defineProperty(loaderContext, "currentRequest", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders
        .slice(loaderContext)
        .map((l) => l.request)
        .concat(loaderContext.resourcePath)
        .join("!");
    },
  });
  // 已经处理过的loader请求 不包含自身 不包含资源路径
  Object.defineProperty(loaderContext, "previousRequest", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders
        .slice(0, loaderContext.index)
        .map((l) => l.request)
        .join("!");
    },
  });
  // 通过代理保存pitch存储的值 pitch方法中的第三个参数可以修改 通过normal中的this.data可以获得对应loader的pitch方法操作的data
  Object.defineProperty(loaderContext, "data", {
    enumerable: true,
    get: function () {
      return loaderContext.loaders[loaderContext.loaderIndex].data;
    },
  });
}

function createLoaderObject(loader) {
  const obj = {
    normal: null, // loader normal 函数本身
    pitch: null, // loader pitch 函数
    raw: null, // 表示normal loader处理文件内容时 是否需要将内容转为buffer对象
    // pitch阶段通过给data赋值 normal阶段通过this.data取值 用来保存传递的data
    data: null,
    pitchExecuted: false, // 标记这个loader的pitch函数时候已经执行过
    normalExecuted: false, // 表示这个loader的normal阶段是否已经执行过
    request: loader, // 保存当前loader资源绝对路径
  };
  // 按照路径加载loader模块 真实源码中通过loadLoader加载还支持ESM模块 咱们这里仅仅支持CJS语法
  const normalLoader = require(obj.request);
  // 赋值
  obj.normal = normalLoader;
  obj.pitch = normalLoader.pitch;
  // 转化时需要buffer/string   raw为true时为buffer false时为string
  obj.raw = normalLoader.raw;
  return obj;
}


module.exports = runLoaders