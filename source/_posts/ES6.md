---
title: ES6
date: 2022-11-24 15:52:20
tags: [ES6]
categories: ES6
---

## ES6快速入门

-----

## 第一章   快速入门

----

### 1.1简介

------

ECMAScript6(简称ES6)是于2015年6月正式发布的JavaScript语言的标准，正式名为ECMAScript 2015(ES2015)。它的目标是使得JavaScript语言可以用来编写复杂的大型应用程序，成为企业级开发语言。

另外，一些情况下ES6也泛指ES2015及之后的新增特性，虽然之后的版本应当称为ES7、ES8等。

---

### 1.2ES6新特性-let&const

-----

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <script>
        var a = 1;
        console.info(a);

        //ES6常量  不能修改
        const b = 2;
        console.info(b);

        //使用var声明变量往往会越域
        //let声明的变量有严格的局部作用域,let同一个变量名只能声明一次
        {
            var a = 1;
            let c = 3;
        }
        console.info(a); //1
        console.info(c); //报错

        //var会变量提升,let不会变量提升
        //var可以先使用,后声明。let不可以
        console.log(a)
        var a = 1;
        console.log(b)
        let b = 2;
    </script>
</body>

</html>
```

-----

### 1.3ES6新特性-结构&字符串

----

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script>
        //数组的解构
        let arr = [1, 2, 3];
        let a = arr[0];
        let b = arr[1];
        let c = arr[2];
        console.info(a, b, c) //1 2 3

        //ES6:数组解构表达式
        let [aa, bb, cc] = arr;
        console.info(aa, bb, cc) //1 2 3
    </script>

    <script>
        //对象
        let persion = {
            name: 'Jack',
            age: 21,
            hobbies: ['唱歌', '跳舞']
        }

        let name = persion.name;
        console.info(name);

        //ES6:对象解构表达式
        let [name, age, hobbies] = persion;
        console.info(name, age, hobbies);
    </script>

    <script>
        //ES6:字符串模板
        let html = "<div>" +
            "<a>你好</a>" +
            "</div>";

        let esHtml = `<div>
            <a>你好</a>
            </div>`;

        console.info(esHtml);
    </script>

    <script>
        //ES6:字符串内置函数
        let str = "hello.vue"
        console.log(str.startsWith("hello")) //true 以...开头
        console.log(str.endsWith(".vue")) //true 以...结尾
        console.log(str.includes("e")) //true 包含...
    </script>

    <script>
        //对象
        let persion = {
            name: 'Jack',
            age: 21,
            hobbies: ['唱歌', '跳舞']
        }

        function fun() {
            return "这是一个函数"
        }

        //ES6:对象解构表达式
        let [name, age, hobbies] = persion;
        //ES6:字符串插入变量和表达式，变量名写在${},${}中可以放入js表达式
        console.info(`名字是：${name},年龄：${age},爱好：${hobbies},${fun()}`)
    </script>

</body>

</html>
```

------

### 1.4ES6新特性-函数优化

----

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script>
        //1.函数的参数默认值  ES6之前:
        function add(a) {
            if (!a) {
                a = 1;
            }
            console.info(a);
        }
        add();

        //2.函数的参数默认值  ES6:
        function add(a = 1) {
            console.info(a);
        }
        add(); //1
        add(2); //2

        //二、可变长度参数
        //ES6之前:
        function add1(a) {
            console.info(a);
        }
        add([1, 2]);
        //ES6:
        function add2(...a) {
            console.info(a);
        }
        add(1, 2, 3);
    </script>

    <script>
        //ES6:参数解构
        let nums = {
            a: 1,
            b: 2
        }

        function add({
            a,
            b
        }) {
            console.info(a + b);
        }

        add(nums);
        //箭头函数  lambda  =>

        function add(a, b) {
            return a + b;
        }

        console.info(add(1, 2));

        //ES6:
        let add = (a, b) => a + b;
        console.info(add(1, 2))
    </script>

</body>

</html>
```

---

### 1.5ES6新特性-对象优化-merged

---

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script>
        //1.对象的内置函数
        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        console.info(Object.keys(person)); //["name", "age", "language"]
        console.info(Object.values(person)); //["jack", 21, Array(3)]
        console.info(Object.entries(person)); //[Array(2), Array(2), Array(2)]

        //对象合并
        const target = {
            a: 1
        };
        const source1 = {
            b: 2
        };
        const source2 = {
            c: 3
        };

        //参数说明第一个参数是需要合并的对象―其他参数会合并到第一个参数上面
        //如果有重复的属性,会以后面的进行覆盖

        object.assign(target, source1, source2);
        console.log(target); //{a:1,b:2,C:3}
    </script>

    <script>
        let name = "jack";
        let age = 21;

        //ES6之前：
        let person = {
            name: name,
            age: age
        }

        //ES6：对象声明属性的简写:如果属性名和引用的变量名是相同的就可以省略赋值，它会自动调用相同名字的变量
        let person = {
            name,
            age
        }
        console.info(person)
    </script>

    <script>
        //ES6之前：
        let person = {
            name: "jack",
            eat: function(food) {
                console.info(this.name + "吃了：" + food)
            },
            //ES6：通过箭头函数声明，如果要调用本对象的属性this会失效，需要使用对象.属性
            eat2: (food) => console.info(person.name + "吃了：" + food),
            eat3(food) {
                console.info(this.name + "吃了：" + food)
            }
        }

        person.eat("米饭");
        person.eat2("馒头");
        person.eat3("水果");
    </script>

    <script>
        //对象的扩展运算符
        //拷贝对象
        let person = {
            name: "jack",
            age: 21,
            wife: {
                name: "tom"
            }
        }
        let person2 = {...person
        };
        console.info(person2)

        //合并对象
        const target = {
            a: 1
        };
        const source1 = {
            b: 2
        };
        const source2 = {
            c: 3
        };
        let newObject = {
            ...target,
            ...source1,
            ...source2
        };
        console.info(newObject)
    </script>

</body>

</html>
```

-----

### 1.6ES6新特性-promise异步编排

-----

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script>
        // ES6: promise异步编排
        new Promise((resolve, reject) => {
                // 1，请求用户名是否存在
                $.ajax({
                    url: "http: / /localhost:8811/user/existUsername",
                    success: function(result) {
                        resolve(result);
                    },
                    error: function(err) {
                        reject(err);
                    }
                })
            })
            // 2.手机是否存在
            .then(result => {
                return new Promise((resolve, reject) => {
                    if (result.data) {
                        alert('用户名不存在!')
                        $.ajax({
                            url: "http://localhost:8811/user/existPhone",
                            success: function(result) {
                                resolve(result);
                            },
                            error: function(err) {
                                reject(err);
                            }
                        })
                    } else {
                        alert(result.message)
                    }
                })

            })
            .then(result => {
                return new Promise((resolve, reject) => {
                    if (result.data) {
                        alert('手机不存在!') //注册用户
                        $.ajax({
                            url: "http:/ /localhost:8811/user/registryUser",
                            success: function(result) {
                                resolve(result);
                            },
                            error: function(err) {
                                reject(err);
                            }
                        })
                    } else {
                        //手机号已存在
                        alert(result.message)
                    }
                })
            })
            .then(result => {
                if (result.data) {
                    alert(result.message)
                }
            })
            .catch(err => {
                alert('服务器异常')
            })
    </script>

</body>

</html>
```

-----

### 1.7ES6新特性-模块化

----

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script type="module">
        /*import语法 import 组件名from js文件路径 组件名∶{需要导入的组件}多个用逗号分隔，用过组件有很多可以写成*，就不需要,但是还需要使用as取别名*/ 
        import { User } from './user.js'; console.info(User); 
        //非默认组件一定要用大括号，默认组件不能写在大括号里面
    </script>

</body>

</html>
```

```javascript
export let User = {
    usermame: "jack",
    age: "21",
    print() {
        console.info(`姓名:${this.usermame},年龄:${this.age}`)
    }
}

let gril = {
    realName: "tom",
    cup: "E"
}

//需要导入，先导出
//1.直接写在组件上面(变量、对象、函数....) export let User
//2.写在底部(批量导出) export {User, girl}

//3.导出默认组件
```
