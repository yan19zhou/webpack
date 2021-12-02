/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:05
 * @LastEditTime: 2021-12-02 12:02:43
 * @LastEditors: zhouy
 */
// 每一个loader文件中都存在对应的 normal loader和 pitch loader
// normal loader中打印一句 文件名: normal 和 对应的接受参数
// pitch loader 中打印一句 文件名 pitch
function loader(source) {
    console.log('inline1: normal', source);
    return source + '//inline1';
  }
  
  loader.pitch = function () {
    console.log('inline1 pitch');
  };
  
  module.exports = loader;
  