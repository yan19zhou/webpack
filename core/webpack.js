/*
 * @Description: webpack实现
 * @Author: zhouy
 * @Date: 2021-11-30 11:57:59
 * @LastEditTime: 2021-11-30 17:18:34
 * @LastEditors: zhouy
 */

const process = require("process");
const Compiler = require("./compiler");

function webpack(options) {
  // 合并参数
  const mergeOptions = _mergeOption(options);
  // 创建compiler对象
  const compiler = new Compiler(mergeOptions);
  // 加载插件
  _loadPlugin(options.plugins, compiler);
  return compiler;
}
function _mergeOption(options) {
  const shellOptions = process.argv.slice(2).reduce((pre, cur) => {
    const [key, value] = cur.split("=");
    if (key && value) {
      const praKey = key.slice(2);
      pre[praKey] = value;
    }
    return pre;
  }, {});
  return { ...options, ...shellOptions };
}

function _loadPlugin(plugins, compiler) {
  if (plugins && Array.isArray(plugins)) {
    plugins.forEach((plugin) => {
        // 每个plugin都是一个类，必须存在一个apply方法，没有apply方法接收个compiler对象
      plugin.apply(compiler);
    });
  }
}

module.exports = webpack;
