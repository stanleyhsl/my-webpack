const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolveLoader: { // 加载loader的方式
    // 查找loader的路径顺序
    modules: ["node-modules", path.resolve(__dirname, "loaders")],
    alias: { // loader的别名
      loader1: path.resolve(__dirname, "loaders", "someloader")
    }
  },
  devtool:'source-map', // 生成map
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
