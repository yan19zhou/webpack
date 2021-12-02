/*
 * @Description: @Descriptione
 * @Author: zhouy
 * @Date: 2021-12-02 12:02:11
 * @LastEditTime: 2021-12-02 14:25:01
 * @LastEditors: zhouy
 */
function loader(source) {
  console.log("pre2 normal");
  return source + "// pre2";
}

loader.pitch = function () {
  console.log("pre2 pithc");
};
module.exports = loader;
