function loader(source){
    /**
   * webpack打包时，实际上把代码转成了字符串，如果字符串内有\nf时，会被认为是换行
   * 执行``(模板字符串)时会执行一次转义，所以要把真实的转再多转一层\\n，在
   * eval时才会是真正的\n也是就换行
   */
  source = source.replace(/\n/g,'\\n');

    const st =  `
    const style = document.createElement('style');
    style.innerHTML=${JSON.stringify(source)};
    document.head.appendChild(style);
    `
    return st;
}
    
module.exports = loader;
