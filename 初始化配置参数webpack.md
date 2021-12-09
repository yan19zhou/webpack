<!--
 * @Description: @Description
 * @Author: zhouy
 * @Date: 2021-11-30 15:41:23
 * @LastEditTime: 2021-12-09 18:03:02
 * @LastEditors: zhouy
-->
- 初始化配置参数
  - webpack.config.js 和shell传入的参数合并之后得到webpack最终的配置参数
- 开始编译
  - 调用webpack方法 返回compiler() 创建compiler对象，注册plugin,通过配置文件找到entry入口文件，调用compiler.run()开始编译
- 编译
  - 从入口文件开始，通过匹配文件的loader对文件进行处理，
  - 对处理好的文件进行编译
  - 分析入口文件依赖，进行递归处理12
  - 编译处理完的文件生成一个个包含多个模块的chunk
- 编译完成
  - 文件处理完成，并得到通过loader处理好而生成的依赖关系
- 文件输出
  - 整理好文件依赖并输出到output磁盘目录
  
- runtime--->浏览器中模块连接和加载逻辑  __webpack__require() --->通过manifest  module.id :path 找出对应的模块
- manifest----> compiler 执行的过程中，处理过的模块会记录详细要点到manifest