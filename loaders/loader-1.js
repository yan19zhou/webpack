

// loader为函数，接受我们的源代码为参数，返回处理后的结果
function loader1(sourceCode) {
    console.log('join loader1');
  return sourceCode + "----loader1处理完的结构---";
}

module.exports = loader1