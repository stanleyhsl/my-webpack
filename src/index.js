const info = require("./base/a.js");
import p from './base/a.png';

console.log(info);
  document.getElementById("root").innerHTML = info;

  const img = document.createElement('img');
  img.src =p;
  document.body.appendChild(img);

