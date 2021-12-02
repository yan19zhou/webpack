/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:19
 * @LastEditTime: 2021-12-02 12:04:03
 * @LastEditors: zhouy
 */
function loader(source) {
    console.log('inline2: normal', source);
    return source + '//inline2';
  }
  
  loader.pitch = function () {
    console.log('inline2 pitch');
  };
  
  module.exports = loader;