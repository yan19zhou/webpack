/*
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 15:05:38
 * @LastEditTime: 2021-11-30 17:12:22
 * @LastEditors: zhouy
 */
const fs = require("fs");
function toUnixPath(path) {
  return path.replace(/\\/g, "/");
}



function tryExtensions(modulePath, extensions, originModulePath, moduleContext) {
  if (extensions && Array.isArray(extensions)) {
    // 添加一个空以适配添加了后缀的情况
    extensions.unshift("");

    extensions.map((extension) => {
      if (fs.existsSync(modulePath + extension)) {
        return modulePath + extension;
      }
    });
  }
  return `No module, Error: Can't resolve ${originModulePath} in  ${moduleContext}`;
}
module.exports = { toUnixPath, tryExtensions };
