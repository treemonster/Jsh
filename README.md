# Jsh
a simple template engine for javascript environment

---

作者：雾海树妖<admin@xdelve.com>

官网：https://xdelve.com

---

此组件为了解决两个问题：

1. js拼接多行字符串

2. 后台使用模板引擎时异步回调问题


多行字符串的语法我参考了php的表达形式，并支持直接在表达式中引用外部变量。

整体的实现相对原生js增加了三个语法：多行字符串表示方式，多行字符串内引用变量表达方式，以及返回结果调用函数。

以下为一个简单的实例。

```html

<script type="text/javascript" src='Jsh.js'></script>

<script type="text/x-template" id='sync_demo'>
var a=1234,b=5678;
var str=<<<xx
  a=${a}<br>
  b=${b}
xx;
echo(str);
</script>
<script type="text/javascript">
var j=new Jsh;
console.log(j.parse(sync_demo.innerText));
</script>

<script type="text/x-template" id='async_demo'>
var a=1234,b=5678;

echo(<<<xx
  a=${a}<br>
  b=${b}
xx);

return new Promise(function(resolve){
  setTimeout(function(){
    resolve('end');
  },1000);
});

</script>
<script type="text/javascript">
var j=new Jsh;
j.parse(async_demo.innerText).then(function(a){
  console.log('cccc'+a+'ddddddd')
});

</script>

```

---

parseHTML方法是给nodejs做模板引擎的，使用 `<?jshtml` 和 `?>`把jsh的代码包裹进去，jsh引擎会解析这些特殊的代码。如果执行结果包含异步代码，那么jsh引擎会等待所有的异步都执行完成后再返回结果。

```html

<script type="text/javascript" src='Jsh.js'></script>

<script type="text/x-template" id='html_demo'>
<div><?jshtml 

return new Promise(function(resolve){
  setTimeout(function(){
    resolve('s1 end');
  },1000);
});

?></div>xx<div><?jshtml 

return new Promise(function(resolve){
  setTimeout(function(){
    resolve('s2 end');
  },1000);
});

?></div>xx<div><?jshtml 

return new Promise(function(resolve){
  setTimeout(function(){
    resolve('s3 end');
  },1000);
});

?></div>



</script>
<script type="text/javascript">
var j=new Jsh;
j.parseHTML(html_demo.innerText).then(function(html){
  console.log(html); // after 1000 ms 
});
</script>


```


---

v1.2 更新

0. 增加兼容es6的重音符模式文本模板

0. 增加参数 syntax，默认多行语法为php风格的，如果syntax传入 es6，则采取重音符

0. 增加参数 not_support_es6，设置为true时不论当前环境是否支持es6，都当做不支持来处理

0. 修改 justParse 的结果，统一返回结果为模块定义

更新效果见 test/v1.2/demo.js

---

v1.2.1 修复parseHTML返回值问题
