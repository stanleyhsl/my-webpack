const path = require("path");
const deploySDK = require("./deploySDK");

class DeployPlugin {
  constructor(option) {
    this.option = option; // 上传业务需要的关键参数 
  }
  upload(filename) {
    const localFile = path.resolve(__dirname, "../dist", filename);
    return new Promise((resolve, reject) => {
      deploySDK(localFile, this.option, err => {
        err ? reject(err) : resolve();
      });
    });
  }
  apply(compiler) {
    // 核心功能，异步的方式把业务挂在webpack的钩子afterEmit上，
    // 当webpack完成打包时，会在这个钩子上调用异步函数
    compiler.hooks.afterEmit.tapPromise("DeployPlugin", compliation => {
      //取出所有文件
      const { assets } = compliation;
      const promises = [];
      Object.keys(assets).forEach(filename => {
        // 上传文件
        promises.push(this.upload(filename));
      });
      // 全部上传结束才算完成编译
      return Promise.all(promises);
    });
  }
}

module.exports = DeployPlugin;
