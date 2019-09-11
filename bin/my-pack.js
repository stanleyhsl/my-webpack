#! /usr/bin/env node


// 
const path = require('path');

const config = require('../webpack.config.js');
const Compiler =require('./compiler.js');

console.log('start my-pack...\n')


const compiler =new Compiler(config);
compiler.run();





