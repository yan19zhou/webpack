/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:31
 * @LastEditTime: 2021-12-02 12:03:08
 * @LastEditors: zhouy
 */
function loader(source) {
    console.log('normal1: normal', source);
    return source + '//normal1';
  }
  
  loader.pitch = function () {
    console.log('normal1 pitch');
  };
  
  module.exports = loader;