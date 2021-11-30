/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 11:53:29
 * @LastEditTime: 2021-11-30 17:20:13
 * @LastEditors: zhouy
 */
/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 11:53:29
 * @LastEditTime: 2021-11-30 14:27:32
 * @LastEditors: zhouy
 */

const webpack = require("./webpack");
const config = require("../example/src/webpack.config");

const compiler = webpack(config);

compiler.run(()=>{
    console.log("注册plugin和编译文件");
})