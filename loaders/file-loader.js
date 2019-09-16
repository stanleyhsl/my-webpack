const loaderUtils = require("loader-utils");

function loader(source) {
  const filename = loaderUtils.interpolateName(this, "[hash].[ext]", {
    content: source
  });
  // 复制文件
  this.emitFile(filename, source);
  return `module.exports = "${filename}"`;
}
// 以地进制方式 source值为地二进制
loader.raw = true;

module.exports = loader;
