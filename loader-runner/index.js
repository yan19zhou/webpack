/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 11:59:27
 * @LastEditTime: 2021-12-02 15:35:04
 * @LastEditors: zhouy
 */
// loader-runner 入口文件
const fs = require("fs");
const path = require("path");
const { runLoaders } = require("loader-runner");
//模块路径
const filePath = path.resolve(__dirname, "./title.js");
// 模拟模块内容 和title.js 一样的内容
const request = "inline1-loader!inline2-loader!./title.js";

// 模拟webpack配置
const rules = [
  // 普通loader
  {
    test: /\.js$/,
    use: ["normal1-loader", "normal2-loader"],
  },
  // 前置loader
  {
    test: /\.js$/,
    use: ["pre1-loader", "pre2-loader"],
  },
  // 后置loader
  {
    test: /\.js$/,
    use: ["post1-loader", "post2-loader"],
  },
];
// 从文件引入路径中提取inline loader 同时将文件路径中的 -!、!!、! 等标志inline-loader的规则删除掉
const parts = request.replace(/^-?!+/, "").split("!");
// 获取文件路径
const sourcePath = parts.pop();
//获取inline-loader
const inlineLoaders = parts;

// 处理rules中的loader规则
const preLoaders = [],
  normalLoaders = [],
  postLoaders = [];

rules.forEach((rule) => {
  if (rule.test.test(sourcePath)) {
    switch (rule.enforce) {
      case "pre":
        preLoaders.push(...rule.use);
        break;
      case "post":
        postLoaders.push(...rule.use);
        break;
      default:
        normalLoaders.push(...rule.use);
        break;
    }
  }
});
/* 
    根据inlineLoader 过滤需要的loader
    !  排除所有normal-loader
    !! 仅剩余inline-loader 排除所有(pre-loader post-loader normal-loader)
    -! 禁用所有pre-loader normal-loader，剩余post和inline-loader
*/
let loaders = [];
if (request.startsWith("!!")) {
  loaders.push(...inlineLoaders);
} else if (request.startsWith("-!")) {
  loaders.push(...postLoaders, ...inlineLoaders);
} else if (request.startsWith("!")) {
  loaders.push(...postLoaders, ...inlineLoaders, ...preLoaders);
} else {
  loaders.push(...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders);
}

// webpack下默认是针对于配置中的resolveLoader的路径进行解析 这里为了模拟我们省略了webpack中的路径解析

const resolveLoader = (loader) => path.resolve(__dirname, "./loaders", loader);

// 获得需要处理的loaders路径
loaders = loaders.map(resolveLoader);

runLoaders(
  {
    resource: filePath, // 加载的模块路径
    loaders, //需要处理的loader数组
    context: { name: "qct" }, // 传递的上下文对象
    readResource: fs.readFileSync.bind(fs), //读取文件的方法
    //processResource
  },
  (error, result) => {
    console.log(error, "存在的错误");
    console.log(result, "结果");
  }
);
