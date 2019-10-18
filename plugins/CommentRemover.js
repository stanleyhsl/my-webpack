const path = require("path");

class CommentRemover {
  constructor(options) {
    this.options = options;
    this.externalModules = {};
  }

  apply(compiler) {
    var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)|(\/\*\*\*\*\*\*\/)/g;
    compiler.hooks.emit.tap("CommentRemover", compilation => {
      console.log("CommentRemover");
      Object.keys(compilation.assets).forEach(data => {
        let content = compilation.assets[data].source(); // 欲处理的文本
        const extname = path.extname(data);
        // 只处理js文件
        if (extname !== ".js") return;
        console.log(extname, data);
        content = content.replace(reg, function(word) {
          const after =
            /^\/{2,}/.test(word) ||
            /^\/\*/.test(word) ||
            /^\/\*{3,}\//.test(word)
              ? ""
              : word;


          // 去除注释后的文本
          return after;
        });
        compilation.assets[data] = {
          source() {
            return content;
          },
          size() {
            return content.length;
          }
        };
      });
    });
  }
}

module.exports = CommentRemover;
