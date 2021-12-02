/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:39
 * @LastEditTime: 2021-12-02 12:04:13
 * @LastEditors: zhouy
 */
function loader(source) {
    console.log('normal2: normal', source);
    return source + '//normal1';
  }
  
  loader.pitch = function () {
    console.log('normal2 pitch');
  };
  
  module.exports = loader;