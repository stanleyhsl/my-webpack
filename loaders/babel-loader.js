const babel = require("@babel/core");
const loaderUtils = require("loader-utils");
function loader(source) {
  const options = loaderUtils.getOptions(this); // 取出在webpack.config.js里填写的配置
  const cb = this.async();
  babel.transform(source, { 
    ...options, // preset-env
     sourceMap: true, // 允许生成source
     filename:this.resourcePath.split('/').pop() // 生成的map文件名
    }, function(
    err,
    result
  ) {
    cb(err, result.code, result.map); // 异步返回
  });
}

module.exports = loader;
