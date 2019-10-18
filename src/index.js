const info = require("./base/a.js");
import p from "./base/a.png";

console.log(info);
/* 组合内容 */
const text = 'I am' + info;
document.getElementById("root").innerHTML = text;

const img = document.createElement("img");
img.src = p;
document.body.appendChild(img);
