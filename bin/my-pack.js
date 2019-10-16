#! /usr/bin/env node

const config = require('../webpack.config.js');

// 仿webpack编译器，核心文件
const Compiler =require('./compiler.js');

// 加载配置
const compiler =new Compiler(config);

// 执行打包
compiler.run();



