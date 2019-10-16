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

  // 加载入口文件，返回exports
  return __webpack_require__("./src/index.js");
})({
  "./src/base/a.js": function(module, exports, __webpack_require__) {
    const b = __webpack_require__("./src/base/b.js");
    module.exports = b + " isa";
  },

  "./src/base/b.js": function(module, exports) {
    module.exports = "boy";
  },

  "./src/index.js": function(module, exports, __webpack_require__) {
    const info = __webpack_require__("./src/base/a.js");
    console.log(info);
  }
});
