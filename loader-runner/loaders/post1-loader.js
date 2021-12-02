/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:50
 * @LastEditTime: 2021-12-02 12:04:23
 * @LastEditors: zhouy
 */
function loader(source) {
    console.log('post1: normal', source);
    return source + '//normal1';
  }
  
  loader.pitch = function () {
    console.log('post1 pitch');
  };
  
  module.exports = loader;