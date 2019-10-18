const path = require("path");
const DeployPlugin = require("./plugins/deployPlugin");
const CommentRemover = require("./plugins/CommentRemover");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  resolveLoader: {
    // 加载loader的方式
    // 查找loader的路径顺序
    modules: ["node_modules", path.resolve(__dirname, "loaders")],
    alias: {
      // loader的别名
      loader1: path.resolve(__dirname, "loaders", "someloader")
    }
  },
  devtool: "source-map", // 生成map
  module: {
    rules: [
      {
        test: /\.png|jpg|jpeg$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 20 * 1024 // 小于20k会转换成base64
          }
        }
      },
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
  },
  plugins: [
    new DeployPlugin({
      host: "172.16.2.35/test",
      secretKey: "esdfsd"
    }),
    new CommentRemover()
  ]
};
