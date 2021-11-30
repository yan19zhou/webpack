/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 16:09:04
 * @LastEditTime: 2021-11-30 17:37:58
 * @LastEditors: zhouy
 */
function loader2(sourceCode) {
    console.log('join loader2');
  return sourceCode + "----loader2处理完的结构---";
}
module.exports = loader2