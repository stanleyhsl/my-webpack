const path = require("path");
const fs = require("fs");

//用于把源码转成ast
const babylon = require("babylon");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

const {SyncHook} = require("tapable");
// 打包后的bundle模板
const ejs = require("ejs");

class Compiler {
  constructor(config) {
    this.config = config;
    this.entryId; // "./src/index.js"
    this.modules = {}; // 需要保存所有的模块依赖
    this.entry = config.entry; // 入口文件
    this.root = process.cwd(); //工作路径

    // plugin处理
    this.hooks ={
      entryOption:new SyncHook(),
      compile:new SyncHook(),
      afterCompile:new SyncHook(),
      afterPlugins:new SyncHook(),
      run:new SyncHook(),
      emit:new SyncHook(['name']),
      done:new SyncHook(),
    }
    // 如果传递了plugins
    const {plugins} =this.config;
    if(Array.isArray(plugins)){
      plugins.forEach(it=>{
        it.apply(this);
      })
    }
    this.hooks.afterPlugins.call();
  }

  run() {
    this.hooks.run.call();
    this.hooks.compile.call();
    this.buildModule(path.resolve(this.root, this.entry), true);
    this.hooks.afterCompile.call();
    this.emitFile();
    this.hooks.emit.call('stan');
    console.log(this.hooks.emit.taps)
    this.hooks.done.call();
  }

  getSource(filePath) {
    let code = fs.readFileSync(filePath, "utf8");

    const { rules = [] } = this.config.module || {};
    let { length } = rules;
    while (length > 0) {
      length -= 1;
      const { test, use } = rules[length];
    if (!test.test(filePath)) continue;

      // 一个文件类型可能使用多个loader,这里默认为数组todo
      let len = use.length;
    while (len > 0) {
        len -= 1;
        const loader = require(use[len]);
        code = loader(code);
      }
    }

    return code;
  }

  buildModule(modulePath, isEntry) {
    const moduleId = "./" + path.relative(this.root, modulePath);
    const source = this.getSource(modulePath);

    // 只处理js文件
    if (!/\.js$/.test(moduleId)) {
      this.modules[moduleId] = source;
      return;
    }
    if (isEntry) {
      this.entryId = moduleId;
    }
    const { sourceCode, dependencies } = this.parse(
      source,
      path.dirname(moduleId)
    );
    this.modules[moduleId] = sourceCode;

    // 递归加载依赖，-> 依赖
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

  // 把处理完成的数据套入打包模板，并写入文件
  emitFile() {
    const output = path.join(
      this.config.output.path,
      this.config.output.filename
    );

    const tpl = this.getSource(path.join(this.root, "./bin/template.ejs"));
    const code = ejs.render(tpl, {
      entryId: this.entryId,
      modules: this.modules
    });
    this.assets = {};
    this.assets[output] = code;
    fs.writeFileSync(output, code);
  }
}

module.exports = Compiler;