---
title: Jquery
date: 2022-04-02 19:02:45
tags: [JQuery]
categories: JavaWeb
---

## JQuery

--------

## 第一章   快速入门

----

### 1.1概念

-----

一个JavaScript框架。简化JS开发

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>自定义JS框架</title>
    <script src="./js/js1.js"></script>
</head>
<body>

    <div id="div1">div1...</div>
    <div id="div2">div2...</div>

    <script>
        //1.根据id获取元素对象
        // var div1 = document.getElementById("div1");
        // var div2 = document.getElementById("div2");

        var div1 = get("div1");
        var div2 = get("div2");
        //2.获取标签体内容
        alert(div1.innerHTML);
        alert(div2.innerHTML);

    </script>
</body>
</html>
```

```javascript
//封装方法
function get(id) {
    var obj = document.getElementById(id);
    return obj;
}
```

JavaScript框架：本质上就是一些js文件，封装了js的原生代码而已。

----

### 1.2快速入门

---------------

1.下载

2.导入js文件：导min

3.使用：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JQuery快速入门</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>

    <div id="div1">div1...</div>
    <div id="div2">div2...</div>

<script>
    //使用JQuery获取元素对象
    var div1 = $("#div1");
    alert(div1.html());

    var div2 = $("#div2");
    alert(div2.html());

</script>

</body>
</html>
```

--------

## 第二章   JQuery对象与JS对象

------

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JQuery对象与js对象的转换</title>
    <script src="js/jquery-3.5.1.min.js"></script>
</head>
<body>

    <div id="div1">div1...</div>
    <div id="div2">div2...</div>

<script>
    //1.通过js方式来获取名称叫div的所有html元素对象
    var divs = document.getElementsByTagName("div");
    alert(divs);//可以将其当作数组来使用
    //对divs中所有的div 让其标签体内容变为"aaa"
    for (var i = 0; i < divs.length; i++) {
        divs[i].innerHTML = "aaa";
        $(divs[i]).html("aaa");//js对象转jq对象
    }

    //2.通过jq方式来获取名称叫div的所有html元素对象
    var $div = $("div");
    alert($div);//可以将其当作数组来使用

    //对divs中所有的div 让其标签体内容变为"bbb" 使用jq方式
    $div.html("bbb");
    //jq对象转js对象
    $div[0].innerHTML = "ddd";
    $div.get(1).innerHTML = "ccc";

    /*
    *   1、JQuery对象在操作时，更加方便
    *   2、JQuery对象和js对象方法是不通用的
    *   3、两者相互转换
    *       1.jq ---> js : jq对象[索引] 或者 jq对象.get(索引)
    *       2.js ---> jq : $(js对象)
    *
    * */

</script>

</body>
</html>
```

------

## 第三章   选择器

-----

### 3.1基本语法学习

----

筛选具有相似特征的元素(标签)

**一、事件绑定**

**二、入口函数**

**三、样式控制**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>事件绑定</title>
    <script src="js/jquery-3.5.1.min.js"></script>

    <script>
    //1.事件绑定
    //给b1按钮添加单机事件
    window.onload = function(){
        //1.获取b1按钮
        $("#b1").click(function () {
            alert("abc");
        });
    }

    //2.入口函数
    //jquery入口函数(dom文档加载完成之后执行该函数中的代码)
    $(function () {
        //1.获取b1按钮
        $("#b1").click(function () {
            alert("abc");
        });
    })

    /*
    * window.onload 和 $(function) 区别
    *       window.onload只能定义一次，如果多次定义，后边的会将前边的覆盖掉
    *       $(function)可以定义多次
    * */

    //3.样式控制
    $(function () {
       // $("#div1").css("background-color","red");
        $("#div1").css("backgroundColor","pink");
    });


    </script>
</head>
<body>

    <div id="div1">div1...</div>
    <div id="div2">div2...</div>
    <input type="button" value="点我" id="b1">



</body>
</html>
```

---

### 3.2分类

----

**一、基本选择器**

1、标签选择器(元素选择器)

* 语法：$("html标签名")   获得所有匹配标签名称的子元素

2、id选择器

* 语法：$("#id的属性值")   获得与指定id属性值匹配的元素

3、类选择器

* 语法：$(".class的属性值")   获得与指定的class属性值匹配的元素

4、并集选择器

* 语法：$("选择器1,选择器2...")   获得多个选择器选中的所有元素

**二、层级选择器**

1、后代选择器

* 语法：$("A B")   选择A元素内部的所有B元素

2、子选择器

* 语法：$("A > B")   选择A元素内部的所有B子元素

**三、属性选择器**

1、属性名称选择器

* 语法：$("A[属性名]")   包含指定属性的选择器

2、属性选择器

* 语法：$("A[属性名 = '值']")   包含指定属性等于指定值的xzq

3、复合属性选择器

* 语法：$("A[属性名 = '值'] [ ]...")   包含多个属性条件的选择器

```javascript
<script type="text/javascript">
   $(function () {
      // <input type="button" value=" 含有属性title 的div元素背景色为红色"  id="b1"/>
      $("#b1").click(function () {
         $("div[title]").css("backgroundColor","pink");
           });
      // <input type="button" value=" 属性title值等于test的div元素背景色为红色"  id="b2"/>
           $("#b2").click(function () {
               $("div[title='test']").css("backgroundColor","pink");
           });
      // <input type="button" value=" 属性title值不等于test的div元素(没有属性title的也将被选中)背景色为红色"  id="b3"/>
           $("#b3").click(function () {
               $("div[title!='test']").css("backgroundColor","pink");
           });
      // <input type="button" value=" 属性title值 以te开始 的div元素背景色为红色"  id="b4"/>
           $("#b4").click(function () {
               $("div[title^='te']").css("backgroundColor","pink");
           });
      // <input type="button" value=" 属性title值 以est结束 的div元素背景色为红色"  id="b5"/>
           $("#b5").click(function () {
               $("div[title$='est']").css("backgroundColor","pink");
           });
      // <input type="button" value="属性title值 含有es的div元素背景色为红色"  id="b6"/>
           $("#b6").click(function () {
               $("div[title*='es']").css("backgroundColor","pink");
           });
      // <input type="button" value="选取有属性id的div元素，然后在结果中选取属性title值含有“es”的 div 元素背景色为红色"  id="b7"/>
           $("#b7").click(function () {
               $("div[id][title*='es']").css("backgroundColor","pink");
           });

       });
   
   
</script>

//注意正则表达式
```

**四、过滤选择器**

1、首元素选择器

* 语法：:first   获得选择的元素中的第一个元素

2、尾元素选择器

* 语法：:last   获得选择的元素中的最后一个元素

3、非元素选择器

* 语法：:not(selector)   不包含指定内容的元素

4、偶数选择器

* 语法：:even   偶数，从0开始计数

5、奇数选择器

* 语法：:odd   奇数，从0开始计数

6、等于索引选择器

* 语法：:eq(index)   指定索引元素

7、大于索引选择器

* 语法：:gt(index)   大于指定索引元素

8、小于索引选择器

* 语法：:lt(index)   小于指定索引元素

9、标题选择器

* 语法：:header   获得标题元素，固定写法

**五、表单过滤选择器**

1、可用元素选择器

* 语法：:enabled   获得可用元素

2、不可用元素选择器

* 语法：:disabled   获得不可用元素

3、选中选择器

* 语法：:checked   获得单选/复选框选中的元素

4、选中选择器

* 语法：:selected   获得下拉框选中的元素

-----

## 第四章   DOM操作

---

### 4.1内容操作

----

**一、html()**

获取/设置元素的标签体内容   

`<a><font>内容</font></a>`--->`<font>内容</font>`

**二、text()**

获取/设置元素的标签体纯文本内容 

`<a><font>内容</font></a>`--->`内容`

**三、val()**

获取/设置元素的value值

```html
<!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <title></title>
      <script src="../js/jquery-3.5.1.min.js"></script>
      <script>

         $(function () {
                // 获取myinput 的value值
            var value = $("#myinput").val();
            alert(value);
                $("#myinput").val("李四");
                // 获取mydiv的标签体内容
            var html = $("#mydiv").html();
            alert(html);
                $("#mydiv").html("<p>aaaa</p>");
                // 获取mydiv文本内容
                var text = $("#mydiv").text();
                alert(text);
                $("#mydiv").text("bbb");

            });

      </script>
      
   </head>
   <body>
      <input id="myinput" type="text" name="username" value="张三" /><br />
      <div id="mydiv"><p><a href="#">标题标签</a></p></div>
   </body>
</html>
```

-----

### 4.2属性操作

----

**一、通用属性操作**

1.attr()：获取/设置元素的属性

2.removeAttr()：删除属性

3.prop()：获取/设置元素的属性

4.removeProp()：删除属性

区别：如果操作的是元素的固有属性，则建议使用prpo，如果操作的是元素自定义的属性，则建议使用attr

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>获取属性</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
     <script src="../js/jquery-3.5.1.min.js"></script>
   
   
   <style type="text/css">
         div,span{
             width: 140px;
             height: 140px;
             margin: 20px;
             background: #9999CC;
             border: #000 1px solid;
            float:left;
             font-size: 17px;
             font-family:Roman;
         }
         
         div.mini{
             width: 30px;
             height: 30px;
             background: #CC66FF;
             border: #000 1px solid;
             font-size: 12px;
             font-family:Roman;
         }
         
         div.visible{
            display:none;
         }
    </style>
    
   <script type="text/javascript">
      $(function () {
            //获取北京节点的name属性值
         var name = $("#bj").attr("name");
         //alert(name);
            //设置北京节点的name属性的值为dabeijing
            $("#bj").attr("name","dabeijing");
            //新增北京节点的discription属性 属性值是didu
            $("#bj").attr("discription","didu");
            //删除北京节点的name属性并检验name属性是否存在
            $("#bj").removeAttr("name");
            //获得hobby的的选中状态
         var checked = $("#hobby").prop("checked");
         alert(checked);

            //var checked = $("#hobby").attr("checked"); //获取不到，弹出undefined

        });

      
   </script>
   
   
   </head>
    
   <body>
            
       <ul>
          <li id="bj" name="beijing" xxx="yyy">北京</li>
          <li id="tj" name="tianjin">天津</li>
       </ul>
       <input type="checkbox" id="hobby"/>
       
      
   </body>
   
   
   
</html>
```

**二、对class属性操作**

1.addClass()：添加class属性值

2.removeClass()：删除class属性值

3.toggleClass()：切换class属性值

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>样式操作</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
     <script src="../js/jquery-3.5.1.min.js"></script>
   <style type="text/css">
         .one{
             width: 200px;
             height: 140px;
             margin: 20px;
             background: red;
             border: #000 1px solid;
            float:left;
             font-size: 17px;
             font-family:Roman;
         }
      
         div,span{
             width: 140px;
             height: 140px;
             margin: 20px;
             background: #9999CC;
             border: #000 1px solid;
            float:left;
             font-size: 17px;
             font-family:Roman;
         }
         
         div .mini{
             width: 40px;
             height: 40px;
             background: #CC66FF;
             border: #000 1px solid;
             font-size: 12px;
             font-family:Roman;
         }
         div .mini01{
             width: 40px;
             height: 40px;
             background: #CC66FF;
             border: #000 1px solid;
             font-size: 12px;
             font-family:Roman;
         }
         
         /*待用的样式*/
         .second{
            width: 300px;
             height: 340px;
             margin: 20px;
             background: yellow;
             border: pink 3px dotted;
            float:left;
             font-size: 22px;
             font-family:Roman;
         }
         
         
    </style>
    <script type="text/javascript">

      $(function () {
            //<input type="button" value="采用属性增加样式(改变id=one的样式)"  id="b1"/>
         $("#b1").click(function () {
            $("#one").prop("class","second");
            });
            //<input type="button" value=" addClass"  id="b2"/>
            $("#b2").click(function () {
                $("#one").addClass("second");
            });
            //<input type="button" value="removeClass"  id="b3"/>
            $("#b3").click(function () {
                $("#one").removeClass("second");
            });
            //<input type="button" value=" 切换样式"  id="b4"/>
            $("#b4").click(function () {
                $("#one").toggleClass("second");
            });
            //<input type="button" value=" 通过css()获得id为one背景颜色"  id="b5"/>
            $("#b5").click(function () {
                var backgroundColor = $("#one").css("backgroundColor");
                alert(backgroundColor);

            });
            //<input type="button" value=" 通过css()设置id为one背景颜色为绿色"  id="b6"/>
            $("#b6").click(function () {
                 $("#one").css("backgroundColor","green");

            });

        });

       
       
   
   </script>
   
   </head>
    
   <body>
            
       <input type="button" value="保存"  class="mini" name="ok"  class="mini" />
       <input type="button" value="采用属性增加样式(改变id=one的样式)"  id="b1"/>
       <input type="button" value=" addClass"  id="b2"/>
       <input type="button" value="removeClass"  id="b3"/>
       <input type="button" value=" 切换样式"  id="b4"/>
       <input type="button" value=" 通过css()获得id为one背景颜色"  id="b5"/>
       <input type="button" value=" 通过css()设置id为one背景颜色为绿色"  id="b6"/>
 
       <h1>有一种奇迹叫坚持</h1>
       <h2>自信源于努力</h2>
       
        <div id="one">
           id为one 
       </div>
      
       <div id="two" class="mini" >
             id为two   class是 mini 
             <div  class="mini" >class是 mini</div>
      </div>
      
       <div class="one" >
             class是 one 
             <div  class="mini" >class是 mini</div>
            <div  class="mini" >class是 mini</div>
       </div>
       
       <div class="one" >
           class是 one 
             <div  class="mini01" >class是 mini01</div>
            <div  class="mini" >class是 mini</div>
      </div>
      
      

      <span class="spanone">    span
      </span>
      
   </body>
   
   
</html>
```

------

### 4.3CRUD操作

-----

1. append()：父元素将子元素追加到末尾

  * 对象1.append(对象2)：将对象2添加到对象1元素内部，并且在末尾

2.  prepend():父元素将子元素追加到开头

  * 对象1.prepend(对象2)：将对象2添加到对象1元素内部，并且在开头

3. appendTo():

  * 对象1.appendTo(对象2)：将对象1添加到对象2内部，并且在末尾

4. prependTo() :

  * 对象1.prependTo(对象2)：将对象1添加到对象2内部，并且在开头

5. after()：添加元素到元素后边

* 对象1.after(对象2)：将对象2添加到对象1后边。对象1和对象2是兄弟关系

5. before()：添加元素到元素前边

* 对象1.before(对象2)：将对象2添加到对象1前边。对象1和对象2是兄弟关系

5. insertAfter()

* 对象1.insertAfter(对象2)：将对象2添加到对象1后边。对象1和对象2是兄弟关系

5. insertBefore()

* 对象1.insertBefore(对象2)∶将对象2添加到对象1前边。对象1和对象2是兄弟关系

9. remove()

  * 对象.remove()：将对象删除掉

10. empty()

  * 对象.empty()：将对象的后代元素全部清空，但是保留当前对象以及其属性节点

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>内部插入脚本</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
     <script src="../js/jquery-3.5.1.min.js"></script>
   <style type="text/css">
         div,span{
             width: 140px;
             height: 140px;
             margin: 20px;
             background: #9999CC;
             border: #000 1px solid;
            float:left;
             font-size: 17px;
             font-family:Roman;
         }
         
         div .mini{
             width: 30px;
             height: 30px;
             background: #CC66FF;
             border: #000 1px solid;
             font-size: 12px;
             font-family:Roman;
         }
         
         div.visible{
            display:none;
         }
    </style>
    <script type="text/javascript">

       $(function () {
             // <input type="button" value="将反恐放置到city的后面"  id="b1"/>

          $("#b1").click(function () {
             //append
             //$("#city").append($("#fk"));
             //appendTo
                 $("#fk").appendTo($("#city"));
             });
             // <input type="button" value="将反恐放置到city的最前面"  id="b2"/>
             $("#b2").click(function () {
                 //prepend
                 //$("#city").prepend($("#fk"));
                 //prependTo
                 $("#fk").prependTo($("#city"));
             });
             // <input type="button" value="将反恐插入到天津后面"  id="b3"/>
             $("#b3").click(function () {
                 //after
             //$("#tj").after($("#fk"));
                 //insertAfter
                 $("#fk").insertAfter($("#tj"));

             });
             // <input type="button" value="将反恐插入到天津前面"  id="b4"/>
             $("#b4").click(function () {
                 //before
                 //$("#tj").before($("#fk"));
                 //insertBefore
                 $("#fk").insertBefore($("#tj"));

             });
         });


      
   </script>
    
    
   </head>
    
   <body>

      <input type="button" value="将反恐放置到city的后面"  id="b1"/>
      <input type="button" value="将反恐放置到city的最前面"  id="b2"/>
      <input type="button" value="将反恐插入到天津后面"  id="b3"/>
      <input type="button" value="将反恐插入到天津前面"  id="b4"/>
       <ul id="city">
          <li id="bj" name="beijing">北京</li>
          <li id="tj" name="tianjin">天津</li>
          <li id="cq" name="chongqing">重庆</li>
       </ul>
       
       
        <ul id="love">
          <li id="fk" name="fankong">反恐</li>
          <li id="xj" name="xingji">星际</li>
       </ul>
      
      <div id="foo1">Hello1</div> 
       
   </body>
   
   
   
</html>
```

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>删除节点</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
     <script src="../js/jquery-3.5.1.min.js"></script>
   <style type="text/css">
         div,span{
             width: 140px;
             height: 140px;
             margin: 20px;
             background: #9999CC;
             border: #000 1px solid;
            float:left;
             font-size: 17px;
             font-family:Roman;
         }
         
         div.mini{
             width: 30px;
             height: 30px;
             background: #CC66FF;
             border: #000 1px solid;
             font-size: 12px;
             font-family:Roman;
         }
         
         div.visible{
            display:none;
         }
    </style>
    <script type="text/javascript">
   $(function () {
        // <input type="button" value="删除<li id='bj' name='beijing'>北京</li>"  id="b1"/>
      $("#b1").click(function () {
         $("#bj").remove();
        });
        // <input type="button" value="删除city所有的li节点   清空元素中的所有后代节点(不包含属性节点)"  id="b2"/>
        $("#b2").click(function () {
            $("#city").empty();
        });
    });

   
      
      
   
   </script>
   </head>
    
   <body>
   <input type="button" value="删除<li id='bj' name='beijing'>北京</li>"  id="b1"/>
   <input type="button" value="删除所有的子节点   清空元素中的所有后代节点(不包含属性节点)"  id="b2"/>

       <ul id="city">
          <li id="bj" name="beijing">北京</li>
          <li id="tj" name="tianjin">天津</li>
          <li id="cq" name="chongqing">重庆</li>
       </ul>
       <p class="hello">Hello</p> how are <p>you?</p> 
   </body>
   
   
   
</html>
```

------

### 4.4案例

----

**QQ表情选择**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8" />
    <title>QQ表情选择</title>
    <script  src="../../js/jquery-3.5.1.min.js"></script>
    <style type="text/css">
    *{margin: 0;padding: 0;list-style: none;}

    .emoji{margin:50px;}
    ul{overflow: hidden;}
    li{float: left;width: 48px;height: 48px;cursor: pointer;}
    .emoji img{ cursor: pointer; }
    </style>
   <script>
        //需求：点击qq表情，将其追加到发言框中
        $(function () {
            //1.给img图片添加onclick事件
            $("ul img").click(function(){
                //2.追加到p标签中即可。
                $(".word").append($(this).clone());//clone方法
            });

        });

      
    </script>
   
</head>
<body>
    <div class="emoji">
        <ul>
            <li><img src="img/01.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/02.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/03.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/04.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/05.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/06.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/07.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/08.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/09.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/10.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/11.gif" height="22" width="22" alt="" /></li>
            <li><img src="img/12.gif" height="22" width="22" alt="" /></li>
        </ul>
        <p class="word">
            <strong>请发言：</strong>
            <img src="img/12.gif" height="22" width="22" alt="" />
        </p>
    </div>
</body>
</html>
```

------

## 第五章   动画

-----

### 5.1三种方式显示和隐藏元素

----

1.默认显示和隐藏方式

* `show([speed,[easing],[fn]])`
* `hide([speed,[easing],[fn]])`
* `toggle([speed],[easing],[fn])`

2.滑动显示和隐藏方式

* `slideDown([speed],[easing],[fn])`
* `slideUp([speed,[easing],[fn]])`
* `slideToggle([speed],[easing],[fn])`

3.淡入淡出显示和隐藏方式

* `fadeIn([speed],[easing],[fn])`
* `fadeOut([speed],[easing],[fn])`
* `fadeToggle([speed,[easing],[fn]])`

**参数：**

1、speed：动画的速度。三个预定义的值("slow","normal","fast")或表示动画时长的毫秒数值(如:1000)

2、easing：用来指定切换效果，默认是"swing"，可用参数"linear"

* swing：动画执行时的效果是，先慢，中间快，最后又慢
* linear：动画执行时速度是均匀的

3、fn：在动画完成时执行的函数，每个元素执行一次

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Insert title here</title>
    <script type="text/javascript" src="../js/jquery-3.5.1.min.js"></script>


    <script>
        //隐藏div
        function hideFn(){
           /* $("#showDiv").hide("slow","swing",function(){
                alert("隐藏了...")
            });*/


           //默认方式
           //  $("#showDiv").hide(5000,"swing");



            //滑动方式
            // $("#showDiv").slideUp("slow");



            //淡入淡出方式
            $("#showDiv").fadeOut("slow");
        }

        //显示div
        function showFn(){
            /*$("#showDiv").show("slow","swing",function(){
                alert("显示了...")
            });*/

            /*
            //默认方式
            $("#showDiv").show(5000,"linear");
            */
/*
            //滑动方式
            $("#showDiv").slideDown("slow");
            */

            //淡入淡出方式
            $("#showDiv").fadeIn("slow");
        }


        //切换显示和隐藏div
        function toggleFn(){

            /*
            //默认方式
            $("#showDiv").toggle("slow");
*/
            /*
            //滑动方式
            $("#showDiv").slideToggle("slow");
*/

            //淡入淡出方式
            $("#showDiv").fadeToggle("slow");
        }




    </script>

</head>
<body>
<input type="button" value="点击按钮隐藏div" onclick="hideFn()">
<input type="button" value="点击按钮显示div" onclick="showFn()">
<input type="button" value="点击按钮切换div显示和隐藏" onclick="toggleFn()">

<div id="showDiv" style="width:300px;height:300px;background:pink">
    div显示和隐藏
</div>
</body>
</html>
```

---------

## 第六章   遍历

------

一、js遍历方式

* for(初始化值;循环结束条件;步长)

二、jq的遍历方式

* jq对象.each(callback)
* $.each(object,[callback])
* for...of;

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
/*

        遍历
            1. js的遍历方式
             * for(初始化值;循环结束条件;步长)
            2. jq的遍历方式
                1. jq对象.each(callback)
                2. $.each(object, [callback])
                3. for..of:jquery 3.0 版本之后提供的方式

*/
            $(function () {
               //1.获取所有的ul下的li
                var citys = $("#city li");
               /* //2.遍历li
                for (var i = 0; i < citys.length; i++) {
                    if("上海" == citys[i].innerHTML){
                        //break; 结束循环
                        //continue; //结束本次循环，继续下次循环
                    }
                    //获取内容
                    alert(i+":"+citys[i].innerHTML);

                }*/

/*
                //2. jq对象.each(callback)
                citys.each(function (index,element) {
                    //3.1 获取li对象 第一种方式 this
                    //alert(this.innerHTML);
                    //alert($(this).html());
                    
                    //3.2 获取li对象 第二种方式 在回调函数中定义参数   index（索引） element（元素对象）
                    //alert(index+":"+element.innerHTML);
                    //alert(index+":"+$(element).html());

                    //判断如果是上海，则结束循环
                    if("上海" == $(element).html()){
                        //如果当前function返回为false，则结束循环(break)。
                        //如果返回为true，则结束本次循环，继续下次循环(continue)
                        return true;
                    }
                    alert(index+":"+$(element).html());
                });*/


                //3 $.each(object, [callback])
               /* $.each(citys,function () {
                    alert($(this).html());
                });*/


               //4. for ... of:jquery 3.0 版本之后提供的方式

                for(li of citys){
                    alert($(li).html());
                }


            });


    </script>
</head>
<body>
<ul id="city">
    <li>北京</li>
    <li>上海</li>
    <li>天津</li>
    <li>重庆</li>
</ul>
</body>
</html>
```

-----

## 第七章   事件绑定

-------

**一、jquery标准的绑定方法**

* jq对象.事件方法(回调函数);

**二、on绑定事件/off解除绑定**

* jq对象.on("事件名称",回调函数)
* jq对象.off("事件名称")

**三、事件切换(toggle)**

* jq对象.toggle(fn1,fn2...)

```html
//一、jquery标准的绑定方法
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">

        $(function () {
           //1.获取name对象，绑定click事件
           $("#name").click(function () {
               alert("我被点击了...")
           });

           //给name绑定鼠标移动到元素之上事件。绑定鼠标移出事件
            $("#name").mouseover(function () {
               alert("鼠标来了...")
            });

            $("#name").mouseout(function () {
                alert("鼠标走了...")
            });

            //简化操作，链式编程
            $("#name").mouseover(function () {
                alert("鼠标来了...")
            }).mouseout(function () {
                alert("鼠标走了...")
            });
            alert("我要获得焦点了...")
            $("#name").focus();//让文本输入框获得焦点
            //表单对象.submit();//让表单提交
        });


    </script>
</head>
<body>
<input id="name" type="text" value="绑定点击事件">
</body>
</html>
```

```html
//二、on绑定事件/off解除绑定
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        $(function () {
           //1.使用on给按钮绑定单击事件  click
           $("#btn").on("click",function () {
               alert("我被点击了。。。")
           }) ;

           //2. 使用off解除btn按钮的单击事件
            $("#btn2").click(function () {
                //解除btn按钮的单击事件
                //$("#btn").off("click");
                $("#btn").off();//将组件上的所有事件全部解绑
            });
        });


    </script>
</head>
<body>
<input id="btn" type="button" value="使用on绑定点击事件">
<input id="btn2" type="button" value="使用off解绑点击事件">
</body>
</html>
```

```html
//三、事件切换(toggle)
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title></title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script src="../js/jquery-migrate-1.0.0.js" type="text/javascript" charset="utf-8"></script>

    <script type="text/javascript">
        $(function () {
           //获取按钮，调用toggle方法
           $("#btn").toggle(function () {
               //改变div背景色backgroundColor 颜色为 green
               $("#myDiv").css("backgroundColor","green");
           },function () {
               //改变div背景色backgroundColor 颜色为 pink
               $("#myDiv").css("backgroundColor","pink");
           });
        });

    </script>
</head>
<body>

    <input id="btn" type="button" value="事件切换">
    <div id="myDiv" style="width:300px;height:300px;background:pink">
        点击按钮变成绿色，再次点击红色
    </div>
</body>
</html>
```

-------

## 第八章   案例

--------

**一、广告的显示与隐藏**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>广告的自动显示与隐藏</title>
    <style>
        #content{width:100%;height:500px;background:#999}
    </style>

    <!--引入jquery-->
    <script type="text/javascript" src="../js/jquery-3.5.1.min.js"></script>
    <script>
        /*
            需求：
                1. 当页面加载完，3秒后。自动显示广告
                2. 广告显示5秒后，自动消失。

            分析：
                1. 使用定时器来完成。setTimeout (执行一次定时器)
                2. 分析发现JQuery的显示和隐藏动画效果其实就是控制display
                3. 使用  show/hide方法来完成广告的显示
         */

        //入口函数，在页面加载完成之后，定义定时器，调用这两个方法
        $(function () {
           //定义定时器，调用adShow方法 3秒后执行一次
           setTimeout(adShow,3000);
           //定义定时器，调用adHide方法，8秒后执行一次
            setTimeout(adHide,8000);
        });
        //显示广告
        function adShow() {
            //获取广告div，调用显示方法
            $("#ad").show("slow");
        }
        //隐藏广告
        function adHide() {
            //获取广告div，调用隐藏方法
            $("#ad").hide("slow");
        }



    </script>
</head>
<body>
<!-- 整体的DIV -->
<div>
    <!-- 广告DIV -->
    <div id="ad" style="display: none;">
        <img style="width:100%" src="../img/adv.jpg" />
    </div>

    <!-- 下方正文部分 -->
    <div id="content">
        正文部分
    </div>
</div>
</body>
</html>
```

**二、抽奖**

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>jquery案例之抽奖</title>
    <script type="text/javascript" src="../js/jquery-3.5.1.min.js"></script>

    <script language='javascript' type='text/javascript'>

        /*
            分析：
                1. 给开始按钮绑定单击事件
                    1.1 定义循环定时器
                    1.2 切换小相框的src属性
                        * 定义数组，存放图片资源路径
                        * 生成随机数。数组索引


                2. 给结束按钮绑定单击事件
                    1.1 停止定时器
                    1.2 给大相框设置src属性

         */
        var imgs = ["../img/man00.jpg",
                    "../img/man01.jpg",
                    "../img/man02.jpg",
                    "../img/man03.jpg",
                    "../img/man04.jpg",
                    "../img/man05.jpg",
                    "../img/man06.jpg",
                    ];
        var startId;//开始定时器的id
        var index;//随机角标
        $(function () {
            //处理按钮是否可以使用的效果
            $("#startID").prop("disabled",false);
            $("#stopID").prop("disabled",true);


           //1. 给开始按钮绑定单击事件
            $("#startID").click(function () {
                // 1.1 定义循环定时器 20毫秒执行一次
                startId = setInterval(function () {
                    //处理按钮是否可以使用的效果
                    $("#startID").prop("disabled",true);
                    $("#stopID").prop("disabled",false);


                    //1.2生成随机角标 0-6
                    index = Math.floor(Math.random() * 7);//0.000--0.999 --> * 7 --> 0.0-----6.9999
                    //1.3设置小相框的src属性
                    $("#img1ID").prop("src",imgs[index]);

                },20);
            });


            //2. 给结束按钮绑定单击事件
            $("#stopID").click(function () {
                //处理按钮是否可以使用的效果
                $("#startID").prop("disabled",false);
                $("#stopID").prop("disabled",true);


               // 1.1 停止定时器
                clearInterval(startId);
               // 1.2 给大相框设置src属性
                $("#img2ID").prop("src",imgs[index]).hide();
                //显示1秒之后
                $("#img2ID").show(1000);
            });
        });




    </script>

</head>
<body>

<!-- 小像框 -->
<div style="border-style:dotted;width:160px;height:100px">
    <img id="img1ID" src="../img/man00.jpg" style="width:160px;height:100px"/>
</div>

<!-- 大像框 -->
<div
        style="border-style:double;width:800px;height:500px;position:absolute;left:500px;top:10px">
    <img id="img2ID" src="../img/man00.jpg" width="800px" height="500px"/>
</div>

<!-- 开始按钮 -->
<input
        id="startID"
        type="button"
        value="点击开始"
        style="width:150px;height:150px;font-size:22px">

<!-- 停止按钮 -->
<input
        id="stopID"
        type="button"
        value="点击停止"
        style="width:150px;height:150px;font-size:22px">


</body>
</html>
```

-----

## 第九章   插件

-----

增强JQuery的功能

**一、实现方式：**

* $.fn.extend(object)
  * 增强通过JQuery获取的对象的功能   $("#id")
* $.extend(object)
  * 增强JQuery对象自身的功能   $/jQuery

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>01-jQuery对象进行方法扩展</title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
       //使用jquery插件 给jq对象添加2个方法 check()选中所有复选框，uncheck()取消选中所有复选框
        
        
        //1.定义jqeury的对象插件
        $.fn.extend({
            //定义了一个check()方法。所有的jq对象都可以调用该方法
            check:function () {
               //让复选框选中

                //this:调用该方法的jq对象
                this.prop("checked",true);
            },
            uncheck:function () {
                //让复选框不选中

                this.prop("checked",false);
            }
            
        });

        $(function () {
           // 获取按钮
            //$("#btn-check").check();
            //复选框对象.check();

            $("#btn-check").click(function () {
                //获取复选框对象
                $("input[type='checkbox']").check();

            });

            $("#btn-uncheck").click(function () {
                //获取复选框对象
                $("input[type='checkbox']").uncheck();

            });
        });


    </script>
</head>
<body>
<input id="btn-check" type="button" value="点击选中复选框" onclick="checkFn()">
<input id="btn-uncheck" type="button" value="点击取消复选框选中" onclick="uncheckFn()">
<br/>
<input type="checkbox" value="football">足球
<input type="checkbox" value="basketball">篮球
<input type="checkbox" value="volleyball">排球

</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>01-jQuery对象进行方法扩展</title>
    <script src="../js/jquery-3.5.1.min.js" type="text/javascript" charset="utf-8"></script>
    <script type="text/javascript">
        //对全局方法扩展2个方法，扩展min方法：求2个值的最小值；扩展max方法：求2个值最大值
        
        $.extend({
            max:function (a,b) {
                //返回两数中的较大值
                return a >= b ? a:b;
            },
            min:function (a,b) {
                //返回两数中的较小值
                return a <= b ? a:b;
            }
            
            
        });

        //调用全局方法
        var max = $.max(4,3);
        alert(max);

        var min = $.min(1,2);
        alert(min);
    </script>
</head>
<body>
</body>
</html>
```
