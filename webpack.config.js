const path = require("path");
class MyPlug{
  apply(compiler){
    compiler.hooks.emit.tap('emit',function(name){
      console.log('emit:',name);
    });
  }
}
class Plug2{
  apply(compiler){
    compiler.hooks.emit.tap('PLUG2',function(name){
      console.log('PLUG2:',name);
    });
  }
}

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
  },
  plugins:[
    new MyPlug(),
  ]
};
