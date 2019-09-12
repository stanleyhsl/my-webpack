const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "mybundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, "loaders/style-loader"),
          path.resolve(__dirname, "loaders/less-loader")
        ]
      }
    ]
  }
};
