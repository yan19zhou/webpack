/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 14:54:20
 * @LastEditTime: 2021-11-30 15:00:10
 * @LastEditors: zhouy
 */
class PluginA {
  apply(compiler) {
    compiler.hooks.run.tap("Plugin A", () => {
      console.log("Plugin A");
    });
  }
}


module.exports = PluginA;