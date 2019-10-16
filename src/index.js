const info = require("./base/a.js");

console.log(info);
const p = new Promise(resove => {
  setTimeout(()=>{
      resove(`定时返回: ${info}`)
  },1000)
});
p.then(text => {
  document.getElementById("root").innerHTML = text;
});
