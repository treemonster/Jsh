var fs=require('fs');
var Jsh=require('../../Jsh');

var jsh=new Jsh(null,'es6',true);

var w=fs.readFileSync('./a.js','utf8');
fs.writeFileSync('./aa.js',jsh.parse(w,null,true));
require('./aa.js').then(function(a){
  console.log(a);
});


var h=fs.readFileSync('./a.jshtml','utf8');
fs.writeFileSync('./aa.jshtml.js',jsh.parseHTML(h,null,true));
require('./aa.jshtml.js').then(function(a){
  console.log(a);
});
