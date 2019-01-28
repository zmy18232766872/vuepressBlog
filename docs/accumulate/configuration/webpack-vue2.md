# webpack4 + vue2

#### webpack4以上对webpack 和 webpack-cli 进行了拆分

需要同时安装webpack和webpack-cli，命令：
> npm install webpack webpack-cli --save-dev

#### webpack4新增了mode

可以在命令行中输入 `npx webpack --mode=production`,或者在webpack.config.js配置文件中进行配置：`mode:production`。

- 在mode模式下，会自动注入process.env.NODE_ENV变量，在不同的环境下执行不同的操作
- webpack4以下需要进行配置

可针对不同环境进行不同操作
```
//判断是线上环境还是开发环境
if(process.env.NODE_ENV === 'production'){
    console.log('This is production mode!')
} else {
    console.log('This is development mode!')
}
```

### 配置webpack4
#### 1、安装依赖
> npm init

#### 2、安装webpack-cli
> npm add webpack webpack-cli

添加webpack、webpack-cli。

`webpack4以上`对`webpack`和`webpack-cli`进行了拆分，所以需要同时安装webpack和webpack-cli。

#### 3、新建index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>webpack v4</title>
</head>
<body>
    <div id="root"></div>
    <script src="dist/main.js"></script>
</body>
</html>
```
#### 4、新建src文件夹，在文件夹下创建index.js文件
```
console.log('hello webpack v4');
```
#### 5、打包
```
//终端执行
webpack
```
在命令行中直接输入webpack执行的是`全局webpack`，在项目环境中执行可以使用`npx webpack` 或者在`package.json`中配置命令行

##### 打包结果
![](https://user-gold-cdn.xitu.io/2018/8/23/16564b7dce1cea76?w=1142&h=542&f=png&s=128979)

打包后文件夹中新增一个dist文件夹，包含main.js文件，此时的main.js是已经被打包压缩过的。但是终端会有一个WARNING，提示没有设置mode,将会以使用production：

![](https://user-gold-cdn.xitu.io/2018/8/23/16564c73e84c9e3f?w=1136&h=218&f=png&s=50274)

下面就是配置mode。

#### 6、在package.json中配置mode
```
{
  "name": "",
  "version": "",
  "dependencies": {
    "webpack": "^4.17.1",
    "webpack-cli": "^3.1.0"
  },
  "scripts":{
    "start":"--mode development",
    "build": "--mode production"
 	}
}
```
其中start设置为开发模式，build为生产环境（压缩）

#### 7、再次打包
```
//终端
npm start //开发模式
npm build //生产环境
```

#### 8、配置webpack-dev-server

配置webpack-dev-server自动打开浏览器，终端执行下述命令，添加webpack-dev-server

```
npm add webpack-dev-server
```
修改index.html
```
<script src="main.js"></script>
```
![](https://user-gold-cdn.xitu.io/2018/8/23/16564d53ad0cb1f5?w=860&h=240&f=png&s=69056)

修改package.json
```
"scripts": {
    "start": "webpack-dev-server --mode development --open",
    "build": "webpack --mode production"
}
```
再执行命令进行打包,此时发现浏览器自动打开：
```
npm start
```
#### 9、添加vue
添加vue依赖
```
npm add vue
```
![](https://user-gold-cdn.xitu.io/2018/8/23/16564d71296a766b?w=820&h=242&f=png&s=61479)

在src下面新建文件夹pages,在pages里面新建app.vue文件。
```
<template>
  <section class="main">
    <p>Here is {{name}}</p>
  </section>
</template>
 
<script>
export default {
  data () {
    return {
        name:"vue + webpack"
    }
  }
}
</script>
 
<style>
.main > p{
  color: #000;
}
</style>
```
修改index.js
```
import Vue from 'vue'
import App from './pages/app.vue'
 
new Vue({
  el:"#root",
  render:h=>h(App)
})
```
执行命令：`npm start `
会发现有错误：

##### 错误 1
![](https://user-gold-cdn.xitu.io/2018/8/23/16564dda66a5c042?w=990&h=332&f=png&s=69793)

提示模块解析失败，需要一个加载程序来处理这个文件类型。
##### 解决 1

- 安装vue-loader
```
npm add vue-loader
```
- 新建一个webpack.config.js文件
```
module.exports = {
    module:{
        rules:[
            {test:/\.vue$/,use:'vue-loader'}
        ]
    }
}
```
vue-loader在15之后需要在webpack.config.js中当插件引入,完整的如下(`注意`：css这个必须引入，不然在.vue文件使用样式会报错)
```
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
 
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin()
  ]
}
```
再次执行命令：`npm start `，发现还是报错
##### 错误 2
![](https://user-gold-cdn.xitu.io/2018/8/23/165658a60e4330bc?w=1140&h=352&f=png&s=99061)

提示babel-loader找不到，因此安装babel-loader
##### 解决 2
```
npm add babel-loader
```
其余的问题也是，提示哪个module不存在就安装哪个，命令是：
> npm add ...

#### 错误 3
![](https://user-gold-cdn.xitu.io/2018/8/23/165659076bf2cdbc?w=1128&h=266&f=png&s=58674)
提示css-loader不存在

##### 解决 3
> npm add css-loader

执行了一系列add 或者install操作后，再执行：npm start，此时页面显示如下：
![](https://user-gold-cdn.xitu.io/2018/8/23/165659f72c8f9cb9?w=878&h=374&f=png&s=37015)

此时，webpack4+vue2项目搭建完成，但是还有一些需要优化的点。

#### 从js中分离css
![](https://user-gold-cdn.xitu.io/2018/8/23/16565a3d689bfe71?w=1302&h=638&f=png&s=130939)

查看网页代码发现样式被塞进了head内，我们如果要将css代码分离出来需要安装extract-text-webpack-plugin@next插件
> npm add extract-text-webpack-plugin@next

安装后需要在webpack.config.js中进行配置：
```
//引入插件
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin'); 

module.exports = {
    module:{
        rules:[
            { 
                test: /\.vue$/, 
                loader: 'vue-loader',
                options: { 
                    loaders: { 
                        css: ExtractTextWebapckPlugin.extract({ use: 'css-loader' }) 
                    }
                }
            }
        ]
    },
    plugins:[
        new ExtractTextWebapckPlugin('style.css')
    ]
}
```
执行命令：
> npm run build
在dist文件夹下出现main.js和style.css文件

#### 处理图片
新建一个img文件夹来存放图片
```
<template>
  <section class="main">
    <p>Here is {{name}}</p>
    <img src="../img/1.jpg" alt="">
  </section>
</template>
 
<script>
export default {
  data () {
    return {
        name:"vue + webpack"
    }
  }
}
</script>
 
<style>
.main > p{
  color: #000;
}
</style>
```
当执行 npm start 后，发现终端报错：

![](https://user-gold-cdn.xitu.io/2019/1/28/168927b01c694fb9?w=1680&h=506&f=png&s=643880)

不能处理图片，因此安装处理图片的相关loader。

> npm add file-loader url-loader

其次修改 webpack.config.js 配置文件：
```
...
rule:[
    ...
    { 
        test: /\.(png|jpg|gif)$/, 
        use: [{ loader: 'url-loader',options: { limit: 8192 } }] 
    }
    ...
]
...
```
执行npm start后也会将图片文件进行打包：

![](https://user-gold-cdn.xitu.io/2019/1/28/168927bfd179ba99?w=1682&h=550&f=png&s=649929)

#### 处理ES6、ES7语法
安装相关依赖包
> npm install babel-core babel-loader babel-preset-env babel-preset-latest --save-dev

并在webpack.config.js文件中进行配置：

![](https://user-gold-cdn.xitu.io/2019/1/28/168927c9dfbe4e04?w=1180&h=576&f=png&s=274031)

  
  
















