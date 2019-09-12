#! /usr/bin/env node

const path = require('path');

const config = require('../webpack.config.js');
// 仿webpack编译器，核心文件
const Compiler =require('./compiler.js');
// 加载配置
const compiler =new Compiler(config);
compiler.run();



