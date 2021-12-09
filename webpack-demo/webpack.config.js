/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-12-09 10:55:38
 * @LastEditTime: 2021-12-09 18:32:15
 * @LastEditors: zhouy
 */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: "development",
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "share",
    },
    print: {
      import: "./src/print.js",
      dependOn: "share",
    },
    share:["lodash"]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
  },
  devtool: "inline-source-map",
  devServer: {
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(gif|jpg|png|svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource", // 使用webpack5自带的asset modules加载图片和font字体
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "Development",
      template: "./index.html",
    }),
  ],
};
