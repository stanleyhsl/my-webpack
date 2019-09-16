const loaderUtils = require("loader-utils");
const mime = require("mime");

function loader(source) {
  const { limit } = loaderUtils.getOptions(this); // 取出在webpack.config.js里填写的配置

  if (limit && limit < source.length) {
    return require("./file-loader").call(this, source); // 保证数据是file-loader需要的raw
  } else {
    // 字符串拼接一定不要错！！
    return `module.exports = "data:${mime.getType(
      this.resourcePath
    )};base64,${source.toString("base64")}"`;
  }
}
// 以地进制方式 source值为地二进制
loader.raw = true;

module.exports = loader;
