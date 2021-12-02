/*
 * @Description: @Descriptionp
 * @Author: zhouy
 * @Date: 2021-12-02 12:02:06
 * @LastEditTime: 2021-12-02 14:14:01
 * @LastEditors: zhouy
 */
function loader(source){
    console.log("pre1 normal",source);
    return source+"\\ pre1"
}

loader.pitch=function(){
    console.log("pre1 pitch");
}
module.exports = loader;