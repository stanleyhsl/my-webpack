(function(modules) {
  var installedModules = {}; // 缓冲区

  // 自己定义的require
  function __webpack_require__(moduleId) {
    // 检查，这个模块是不是已经被缓冲过了
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    // 缓冲这个模块
    var module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    });

    // 执行这个模块，有递归，注意call的用法，第二个才是参数
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    return module.exports;
  }

  // Load entry module and return exports
  return __webpack_require__("./src/index.js");
})({
  
    "./src/index.js":
    function(module, exports, __webpack_require__) {
      eval(`const info = __webpack_require__("./src/base/a.js");

console.log(info);

__webpack_require__("./src/index.less");

console.log('info');`)
    },
  
    "./src/base/a.js":
    function(module, exports, __webpack_require__) {
      eval(`const b = __webpack_require__("./src/base/b.js");

module.exports = b + " isa";`)
    },
  
    "./src/base/b.js":
    function(module, exports, __webpack_require__) {
      eval(`module.exports = 'boy';`)
    },
  
    "./src/index.less":
    function(module, exports, __webpack_require__) {
      eval(`
    const style = document.createElement('style');
    style.innerHTML="body {\\n  background-color: antiquewhite;\\n}\\nbody .title {\\n  color: red;\\n}\\n";
    document.head.appendChild(style);
    `)
    },
  
  
});
