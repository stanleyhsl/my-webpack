const less = require("less");

function loader(source) {
  let css;
  less.render(source, function(error, c) {
    css = c.css;
  });
  
  return css;
}

module.exports = loader;
