var fs = require("fs"),
  stat = fs.stat;
const path = require("path");

function copyFile(src, dst) {
  // 创建读取流
  const readable = fs.createReadStream(src);
  // 创建写入流
  const writable = fs.createWriteStream(dst);
  // 通过管道来传输流
  readable.pipe(writable);
}

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copyFolder = function(src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function(err, paths) {
    if (err) {
      throw err;
    }

    paths.forEach(function(path) {
      var _src = src + "/" + path,
        _dst = dst + "/" + path;

      stat(_src, function(err, st) {
        if (err) {
          throw err;
        }

        // 判断是否为文件
        if (st.isFile()) copyFile(_src, _dst);
        else if (st.isDirectory()) exists(_src, _dst, copyFolder);
      });
    });
  });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function(src, dst, callback) {
  fs.exists(dst, function(exists) {
    // 已存在
    if (exists) {
      callback(src, dst);
    }
    // 不存在
    else {
      fs.mkdir(dst, function() {
        callback(src, dst);
      });
    }
  });
};

function DeploySDK(localFile, option, callback) {
  const hostPath = "/Library/WebServer/Documents/test";
  const dstFile = path.resolve(hostPath, path.basename(localFile));

  if (fs.lstatSync(localFile).isFile()) {
    console.log(">>>", dstFile);

    copyFile(localFile, dstFile); // 异步
    callback();
  }
}

module.exports = DeploySDK;
