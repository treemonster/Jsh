/*!
 * jsh library v1.2.1
 * https://xdelve.com/
 * author: treemonster
 * email: <admin@xdelve.com>
 *
 * Copyright treemonster
 * Released under the MIT license
 *
 * Date: 2016-12-15T06:20:58.824Z
 */


function Jsh(global,syntax,not_support_es6){
  var support_es6=false;
  if(!not_support_es6) try{
    eval('``');
    support_es6=true;
  }catch(e){}
  var cbwrap=function(str){
    return "\
    void function(){\
    var _str=<str>;\
    if(typeof define!=='undefined' && define.amd)\
      define(function(){return _str;});\
    else if(typeof module!=='undefined')\
      module.exports = _str;\
    }();".replace(/\<str\>/g,str);
  };
  var s=syntax==='es6'?
    /(\`)((?:[^\`]|\\\`)*?)\1/gi:
    /\<\<\<([a-z\d]+)(?:(\n[\s\S]+?|.*?))\n[\x20\x09]*\1\b/gi;
  function _jsh2js(str,data,justParse){
    str='(function(){\n\
      /* global is allowed here*/\n\
      var echo=function(str){\n\
        echo._str+=str;\n\
      };\n\
      echo._str="";echo._res=function(){'+
    (function(){
      var ret=[];
      for(var k in data) ret.push(' var '+k+'='+JSON.stringify(data[k])+';');
      if(justParse)
        ret.unshift('\n/** when using justParse , data here is not effective \n *  please replace this block before use'),
        ret.push(' */');
      ret.unshift(''),ret.concat('');
      return ret.concat('').join('\n');
    })()+
    (support_es6?str:str.replace(s,function(){
      var a=arguments;
      var html=a[2].substr(1);
      var er='"'+html.replace(/\$\{([^\}]+)\}|"|[\n\r]/g,function(){
        var a=arguments;
        switch(true){
          case a[0]==='"': return '\\"';
          case a[0]==='\n': return '\\n';
          case !!a[1]: return '"+('+a[1]+')+"';
          case a[0]==='\r': return '';
        }
      })+'"';
      return er;
    }))+
    ';}();return echo._res && typeof echo._res.then==="function" ? echo._res.then(function(a){return echo._str+(a||"");}) :echo._str;})()';
    return str;
  }
  this.parse=function(jsh,data,justParse){
    var res=_jsh2js(jsh,data,justParse);
    try{
      return justParse?cbwrap(res):eval(res);
    }catch(e){
      return e;
    }
  };

  this.parseHTML=function(jshtml,data,justParse){
    if(typeof Promise==='undefined' || typeof JSON==='undefined')
      throw new Error('the javascript environment must support `Promise` and `JSON`');

    var htm=jshtml.split(/\<\?jshtml[\s\S]+?(?:\?\>|$)/g);
    var par=function(str){
      return justParse?JSON.stringify(str):str;
    };
    var jshs=[];
    jshtml.replace(/\<\?jshtml([\s\S]+?)(?:\?\>|$)/g,function(){
      jshs.push(par(htm.shift()),_jsh2js(arguments[1],data,justParse));
    });
    jshs=jshs.concat(htm.map(par));
    return justParse?
      cbwrap('Promise.all(['+jshs.join(',')+']).then(function(res){return res.join("");})'):
      Promise.all(jshs).then(function(res){return res.join('');});
  };

}
// for amd
if(typeof define!=='undefined' && define.amd)
  define('Jsh',function(){return Jsh;});
// for nodejs
else if(typeof module!=='undefined')
  module.exports=Jsh;



