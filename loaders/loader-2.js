
function loader2(sourceCode) {
    console.log('join loader2');
  return sourceCode + "----loader2处理完的结构---";
}
module.exports = loader2