---
title: Bootstrap基础
date: 2022-01-24 17:23:12
tags: [Bootstrap,前端框架]
categories: JavaWeb
---

## Bootstrap基础

----------

## 第一章   概述

---

### 1.1概述

----

1.概念：一个前端开发的框架，是美国Twitter公司的设计师Mark Otto和Jacob Thornton合作基于HTML、CSS、JavaScript开发的简洁、直观、强悍的前端开发框架，使得 Web 开发更加快捷。

* 框架：一个半成品软件，开发人员可以在框架基础上，再进行开发，简化编码。

* 好处：

  1.定义了很多的CSS样式和js插件。开发人员可以直接使用这些样式和插件得到丰富的页面效果。

  2.响应式布局。

  * 同一套页面可以兼容不同分辨率的设备。

-------

## 第二章   快速入门

------

1.下载Bootstrap

2.在项目中将这三个文件夹复制

3.创建html页面，引入必要的资源文件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
</head>

<body>
    <h1>你好，世界！</h1>
</body>

</html>
```

---------

### 2.1响应式布局

-----

* 同一套页面可以兼容不同分辨率的设备。
* 实现：依赖于栅格系统：将一行平均分成12个格子，可以指定元素占几个格子。

* 步骤：

  1.定义容器。相当于table

  * 容器分类：

    1.container：两边留白

    2.container-fluid：每一种设备都是100%宽度

  2.定义行。相当于tr  样式：row

  3.定义元素。相当于td。指定该元素在不同设备上，所占的格子数目。样式：`col-设备代号-格子数目`。![20220318190859](https://tonkyshan.cn/img/202203182302772.png)

  

* 注意：

  1.一行中如果格子数目超过12，则超出部分自动换行。

  2.栅格类属性可以向上兼容。栅格类适用于与屏幕宽度大于或等于分界点大小的设备。

  3.如果真实设备宽度小于了设置栅格类属性的设备代码的最小值，会一个元素占满一整行。

  ```html
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
  
      <!-- Bootstrap -->
      <link rel="stylesheet" href="css/bootstrap.min.css">
  
      <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
      <script src="js/jquery-3.5.1.min.js"></script>
      <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
      <script src="js/bootstrap.min.js"></script>
      <style>
          .inner {
              border: 1px solid red;
          }
      </style>
  </head>
  
  <body>
      <!--        定义容器-->
      <div class="container-fluid">
          <!--            定义行-->
          <div class="row">
              <!--                定义元素-->
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
              <div class="col-lg-1 col-sm-2 inner">栅格</div>
          </div>
      </div>
  </body>
  
  </html>
  ```

-----

### 2.2CSS样式和JS插件

----

**全局CSS样式：**

* 按钮：`class="btn btn-default"`
* 图片：
  * `class="img-responsive"`：图片在任意尺寸都占100%
  * 图片形状：
    * `<img src="..." alt="..." class="img-rounded">`：方形
    * `<img src="..." alt="..." class="img-circle">`：圆形
    * `<img src="..." alt="..." class="img-thumbnail">`：相框
* 表格
  * `table`
  * `table-bordered`
  * `table-hover`
* 表单：给表单项添加：`class="form-control"`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
    <![endif]-->
    <style>

    </style>
</head>
<body>

    <a class="btn btn-default" href="#" role="button">Link</a>
    <button class="btn btn-default" type="submit">Button</button>
    <input class="btn btn-default" type="button" value="Input">
    <input class="btn btn-default" type="submit" value="Submit">
    <br>
    <!-- Standard button -->
<button type="button" class="btn btn-default">（默认样式）Default</button>

<!-- Provides extra visual weight and identifies the primary action in a set of buttons -->
<button type="button" class="btn btn-primary">（首选项）Primary</button>

<!-- Indicates a successful or positive action -->
<button type="button" class="btn btn-success">（成功）Success</button>

<!-- Contextual button for informational alert messages -->
<button type="button" class="btn btn-info">（一般信息）Info</button>

<!-- Indicates caution should be taken with this action -->
<button type="button" class="btn btn-warning">（警告）Warning</button>

<!-- Indicates a dangerous or potentially negative action -->
<button type="button" class="btn btn-danger">（危险）Danger</button>

<!-- Deemphasize a button by making it look like a link while maintaining button behavior -->
<button type="button" class="btn btn-link">（链接）Link</button>

</body>
</html>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
</head>

<body>

    <table class="table table-bordered table-hover">
        <tr>
            <th>编号</th>
            <th>姓名</th>
            <th>年龄</th>
        </tr>
        <tr>
            <td>001</td>
            <td>张三</td>
            <td>23</td>
        </tr>
        <tr>
            <td>002</td>
            <td>张三</td>
            <td>23</td>
        </tr>
        <tr>
            <td>003</td>
            <td>张三</td>
            <td>23</td>
        </tr>
    </table>

    <hr>
    <hr>
    <hr>
    <form class="form-horizontal">
        <div class="form-group">
            <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
            <div class="col-sm-10">
                <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
            </div>
        </div>
        <div class="form-group">
            <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
            <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <div class="checkbox">
                    <label>
                <input type="checkbox"> Remember me
              </label>
                </div>
            </div>
        </div>
        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-default">Sign in</button>
            </div>
        </div>
    </form>

</body>

</html>
```

**组件：**

* 导航条

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
</head>

<body>

    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <!-- Brand and toggle get grouped for better mobile display -->
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
                <a class="navbar-brand" href="#">Brand</a>
            </div>

            <!-- Collect the nav links, forms, and other content for toggling -->
            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Link <span class="sr-only">(current)</span></a></li>
                    <li><a href="#">Link</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#">Separated link</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#">One more separated link</a></li>
                        </ul>
                    </li>
                </ul>
                <form class="navbar-form navbar-left">
                    <div class="form-group">
                        <input type="text" class="form-control" placeholder="Search">
                    </div>
                    <button type="submit" class="btn btn-default">Submit</button>
                </form>
                <ul class="nav navbar-nav navbar-right">
                    <li><a href="#">Link</a></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li role="separator" class="divider"></li>
                            <li><a href="#">Separated link</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- /.navbar-collapse -->
        </div>
        <!-- /.container-fluid -->
    </nav>

</body>

</html>
```

* 分页条

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
</head>

<body>

    <nav aria-label="Page navigation">
        <ul class="pagination">
            <li class="disabled">
                <a href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li><a href="#">1</a></li>
            <li class="active"><a href="#">2</a></li>
            <li><a href="#">3</a></li>
            <li><a href="#">4</a></li>
            <li><a href="#">5</a></li>
            <li>
                <a href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>

</body>

</html>
```

**插件：**

* 轮播图

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- Bootstrap -->
    <link rel="stylesheet" href="css/bootstrap.min.css">

    <!-- jQuery (Bootstrap 的所有 JavaScript 插件都依赖 jQuery，所以必须放在前边) -->
    <script src="js/jquery-3.5.1.min.js"></script>
    <!-- 加载 Bootstrap 的所有 JavaScript 插件。你也可以根据需要只加载单个插件。 -->
    <script src="js/bootstrap.min.js"></script>
</head>

<body>

    <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
        <!-- Indicators -->
        <ol class="carousel-indicators">
            <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
            <li data-target="#carousel-example-generic" data-slide-to="1"></li>
            <li data-target="#carousel-example-generic" data-slide-to="2"></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
            <div class="item active">
                <img src="img/wallhaven-9mzjwk.jpg" alt="...">
                <div class="carousel-caption">
                    ...
                </div>
            </div>
            <div class="item">
                <img src="img/wallhaven-76ydg3.jpg" alt="...">
                <div class="carousel-caption">
                    ...
                </div>
            </div>
            <div class="item">
                <img src="img/wallhaven-8o5v1k.jpg" alt="...">
                <div class="carousel-caption">
                    ...
                </div>
            </div>

        </div>

        <!-- Controls -->
        <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
            <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a>
    </div>

</body>

</html>
```
