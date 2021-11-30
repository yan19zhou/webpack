/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 11:44:17
 * @LastEditTime: 2021-11-30 17:42:11
 * @LastEditors: zhouy
 */
const path = require('path')
const PluginA= require('../../plugins/pluginA');
const PluginB= require('../../plugins/PluginB');
const process = require("process")
// 引入loader和plugin ...
module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(__dirname, './entry1.js'),
    second: path.resolve(__dirname, './entry2.js'),
  },
  devtool: false,
  // 基础目录，绝对路径，用于从配置中解析入口点(entry point)和 加载器(loader)。
  // 换而言之entry和loader的所有相对路径都是相对于这个路径而言的
  context: process.cwd(),
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js',
  },
  plugins: [new PluginA(), new PluginB()],
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: [
          // 使用自己loader有三种方式 这里仅仅是一种
          path.resolve(__dirname, '../../loaders/loader-1.js'),
          path.resolve(__dirname, '../../loaders/loader-2.js'),
        ],
      },
    ],
  },
};