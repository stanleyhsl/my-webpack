const path = require("path");
const fs = require("fs");
//用于把源码转成ast
const babylon = require("babylon");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const ejs = require("ejs");
const template = require("./template.ejs");

class Compiler {
  constructor(config) {
    this.config = config;
    this.entryId; // "./src/index.js"
    this.modules = {}; // 需要保存所有的模块依赖
    this.entry = config.entry; // 入口文件
    this.root = process.cwd(); //工作路径
  }

  run() {
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.emitFile();
  }

  getSource(filePath) {
    return fs.readFileSync(filePath, "utf8");
  }

  buildModule(modulePath, isEntry) {
    const source = this.getSource(modulePath);
    const moduleId = "./" + path.relative(this.root, modulePath);
    if (isEntry) {
      this.entryId = moduleId;
    }
    const { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(moduleId)
    );
    this.modules[moduleId] = sourceCode;
    // console.log({ sourceCode, dependencies });

    // 递归加载依赖
    dependencies.forEach(it => {
      this.buildModule(path.join(this.root, it), false);
    });
  }
  /**
   *
   * @param {*} source 这个文件的源码
   * @param {*} parentPath 这个文件所处的目录位置
   */
  parse(source, parentPath) {
    const ast = babylon.parse(source);
    const dependencies = [];

    // 遍历ast树，把require换成__webpack_require__
    traverse(ast, {
      CallExpression(p) {
        const node = p.node;
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__";

          // 取得这个模块在整个工程中的全路径名做为id
          // 当前这个node.arguments[0].value是require的参数，它是本代码
          //文件的相对路径./sub/file.js，所以要处理成工程下的绝对路径./src/sub/file.js
          let moduleId = node.arguments[0].value;
          moduleId = moduleId + (path.extname(moduleId) ? "" : "js"); // 补齐文件后缀
          moduleId = "./" + path.join(parentPath, moduleId); //路径展平

          //替换参数把原来的./sub/file.js换成./src/sub/file.js
          node.arguments = [t.stringLiteral(moduleId)];
          dependencies.push(moduleId);
        }
      }
    });
    // 重新把ast转换成sourceCode
    const sourceCode = generator(ast).code;
    return { sourceCode, dependencies };
  }
  emitFile() {
    const output = path.join(
      this.config.output.path,
      this.config.output.filename
    );
    
    const tpl = this.getSource(path.join(this.root, './bin/template.ejs'));
    console.log({tpl });
    const code = ejs.render(tpl,{entryId:this.entryId,modules:this.modules});
    fs.writeFileSync(output,code);
  }
}

module.exports = Compiler;
