
/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 11:53:29
 * @LastEditTime: 2021-12-01 09:40:26
 * @LastEditors: zhouy
 */

const webpack = require("./webpack");
const config = require("../example/src/webpack.config");

const compiler = webpack(config);

compiler.run(()=>{
    console.log("注册plugin和编译文件");
})


