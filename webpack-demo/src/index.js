/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-09 10:38:50
 * @LastEditTime: 2021-12-10 11:11:46
 * @LastEditors: zhouy
 */
// 给body添加一个元素
import "./index.css";
import prinitMe from "./print.js";
/**
 * @description: 使用ECMA规范 import()动态引入，里面会调用promise 
 * 所以低版本浏览器如果使用import()的话要加载polyfill
 * @param {*}
 * @return {*}
 */
function getComponent() {
  return import("lodash")
    .then(({ default: _ }) => {
      const element = document.createElement("div");
      element.innerHTML = _.join(["Hello", "webpack"], "_ _");
      return element;
    })
    .catch((error) => "An error occurred while loading the component");
}
/**
 * @description: 因为import()返回一个promise 所以也可以和async函数一起使用
 * @param {*}
 * @return {*}
 */
/* async function getComponent() {
  const { default: _ } = await import("lodash");
}
 */
getComponent().then((component) => {
  document.body.appendChild(component);
});
