function loader(source) {
  console.log("pre2 normal");
  return source + "//pre2";
}

loader.pitch = function () {
  console.log("pre2 pithc");
};
module.exports = loader;
