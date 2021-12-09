/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-09 10:38:50
 * @LastEditTime: 2021-12-09 16:03:55
 * @LastEditors: zhouy
 */
// 给body添加一个元素
import "./index.css";
import _ from "lodash";
import bg from "./bg.jpg";
function component() {
  let el = document.createElement("div");
  el.classList.add("wb");
  el.innerHTML = _.join(["hello", "888234webpack"], "_._");
  return el;
}

function mount() {
//   document.body.style.width = "100vw";
//   document.body.style.height = "100vh";
//   document.body.style.background = `url(${bg})`;
  document.body.appendChild(component());
}
mount();
