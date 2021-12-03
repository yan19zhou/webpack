/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 14:54:20
 * @LastEditTime: 2021-12-03 15:00:58
 * @LastEditors: zhouy
 */
class PluginA {
  apply(compiler) {
    compiler.hooks.run.tap("Plugin A", (compilation, cb) => {
      console.log("Plugin A");
    });
    compiler.hooks.compilation.tap("compilationPlugin", (compilation) => {
      // 现在可以通过compilation 绑定这种钩子
      compilation.hooks.optimize.tap("compilationPlugin", () => {
        console.log("资源已完成优化");
      });
    });

    // 绑定异步操作
    compiler.hooks.emit.tapAsync("AsyncEmit", (compilation, cb) => {
      // 执行异步操作
      setTimeout(() => {
        cb();
      }, 0);
    });
    //tapPromise必须返回一个promise，执行之后要返回resolve
    compiler.hooks.emit.tapPromise("TapPromise", (compilation) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 0);
      });
    });
  }
}

module.exports = PluginA;
