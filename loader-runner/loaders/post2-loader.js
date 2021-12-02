/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-02 12:01:54
 * @LastEditTime: 2021-12-02 14:11:35
 * @LastEditors: zhouy
 */
function loader(source) {
    console.log('post2: normal', source);
    return source + '//post2';
  }
  
  loader.pitch = function () {
    console.log('post2 pitch');
  };
  
  module.exports = loader;