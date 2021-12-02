/*
 * @Description: loader实现
 * @Author: zhouy
 * @Date: 2021-12-02 10:49:35
 * @LastEditTime: 2021-12-02 11:57:47
 * @LastEditors: zhouy
 */
/* 
    在webpack中的_doBuild函数中调用了runLoaders方法，而runLoaders方法正是来自于loader-runner库。
    简单来说webpack在进行模块编译时会调用_doBuild，在doBuild方法内部通过调用runLoaders方法调用loader处理模块。
*/
/**
 * @description:
 * @param {
 *  resource 需要加载的资源路径
 *  loaders：需要处理的loader的绝对路径拼接的字符串，!分割
 *  context：loader上下文，webpack在进入loader前会创建一系列的属性挂载到一个object上面传递给loader内部
 *  processResource： 读取源文件的方法
 * }
 * @return {*}
 */
function runLoader(resource, loaders, context, processResource) {
    
}
