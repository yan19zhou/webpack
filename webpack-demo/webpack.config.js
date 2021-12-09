/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-09 10:55:38
 * @LastEditTime: 2021-12-09 16:23:44
 * @LastEditors: zhouy
 */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
          test:/\.(gif|jpg|png|svg|woff|woff2|eot|ttf|otf)$/i,
          type:"asset/resource"   // 使用webpack5自带的asset modules加载图片和font字体
      }
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
};
