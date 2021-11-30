/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 14:54:28
 * @LastEditTime: 2021-11-30 15:00:23
 * @LastEditors: zhouy
 */
class PluginB {
  apply(compiler) {
    compiler.hooks.emit.tap("Plugin B", () => {
      console.log("Plugin B");
    });
  }
}
module.exports = PluginB;