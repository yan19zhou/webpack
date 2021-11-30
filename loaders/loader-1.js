/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 16:08:56
 * @LastEditTime: 2021-11-30 17:37:45
 * @LastEditors: zhouy
 */
// loader为函数，接受我们的源代码为参数，返回处理后的结果
function loader1(sourceCode) {
    console.log('join loader1');
  return sourceCode + "----loader1处理完的结构---";
}

module.exports = loader1