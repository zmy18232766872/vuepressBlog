# webpack学习笔记

#### 1、什么是webpack
模块打包工具 ：分析项目结构，找到JS模块以及其它的一些浏览器不能直接运行的语言（less等），并将其打包为合适的格式以供浏览器使用。

#### 2、webpack核心概念
主要有 6 部分：
* Entry : 输入入口，webpack构建第一步从这里开始
* Moudle ：一个模块对应一个文件，从entry 开始递归找到所有依赖的模块
* Chunk：代码块，一个 Chunk 由多个模块组合而成，用于代码合并与分割
* Loader：模块转换器，将模块原内容按照需求转换成新内容
* Plugin：扩展插件，在 Webpack 构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情
* Output：输出，在 Webpack 经过一系列处理并得出最终想要的代码后输出结果

#### 3、webpack 的工作流程
项目当作一个整体，通过给定的主文件，webpack从主文件开始找到项目所有依赖的文件，再用loaders处理这些文件，最后打包为一个浏览器可识别的javascript文件。

#### 4、执行流程
1. 递归解析 entry 依赖的所有 module；
2. 每找到一个module，根据配置的loader去找相应的转换规则；
3. 对module进行转换后再解析当前module所依赖的module；
4. 这些模块以以恶搞entry为分组，以一个entry和依赖的module就是一个chunk；
5. webpack将所有chunk 转换成文件输出，并在一定时候执行plugin逻辑。
![](https://user-gold-cdn.xitu.io/2019/1/25/168844ec783d6879?w=1600&h=728&f=png&s=227446)

#### 5、配置（[https://segmentfault.com/a/1190000006178770#articleHeader2](https://segmentfault.com/a/1190000006178770#articleHeader2)）
##### 1、全局安装webpack
$ sudo npm install -g webpack (全局安装）

##### 2、创建package.json文件夹
$ npm init
在终端中使用命令可以自动创建这个package.json文件。输入这个命令后，终端会问你一系列诸如项目名称，项目描述，作者等信息，不过不用担心，如果你不准备在npm中发布你的模块，这些问题的答案都不重要，回车默认即可

##### 3、在项目中安装Webpack作为依赖包npm install --save-dev webpack

##### 4、创建两个文件夹
app文件夹和public文件夹，app文件夹用来存放原始数据和我们将写的JavaScript模块，public文件夹用来存放之后供浏览器读取的文件（包括使用webpack打包生成的js文件以及一个index.html文件）。接下来我们再创建三个文件:
* index.html --放在public文件夹中;
* Greeter.js-- 放在app文件夹中;
* main.js-- 放在app文件夹中;

##### 5、在index.html中写入代码
目的在于引入打包后的js文件（这里我们先把之后打包后的js文件命名为bundle.js）
![](https://user-gold-cdn.xitu.io/2019/1/25/168845254dd021fe?w=1030&h=558&f=png&s=263583)

##### 6、在Greeter.js中写入代码
定义一个返回包含问候信息的html元素的函数,并依据CommonJS规范导出这个函数为一个模块
![](https://user-gold-cdn.xitu.io/2019/1/25/1688452dc87fd3af?w=1438&h=344&f=png&s=260907)

##### 7、在main.js中写入代码
用以把Greeter模块返回的节点插入页面
![](https://user-gold-cdn.xitu.io/2019/1/25/1688453632d053a9?w=1638&h=214&f=png&s=181545)

#### 6、通过配置文件使用webpack
定义一个配置文件，将所有与打包相关信息均放在配置文件中。新建webpack.config.js文件，写入配置信息，主要涉及到的内容是入口文件路径和打包后文件的存放路径。
![](https://user-gold-cdn.xitu.io/2019/1/25/1688454a77fa291a?w=1590&h=350&f=png&s=301829)

有了这个配置之后，再打包文件，只需在终端里运行 **webpack(非全局安装需使用node_modules/.bin/webpack)** 命令就可以了

![](https://user-gold-cdn.xitu.io/2019/1/25/1688455f9ce6add9?w=1594&h=548&f=png&s=1082655)

#### 7、更快捷的执行打包任务
可以通过在package.json中对scripts对象进行相关设置即可，设置方法如下：

![](https://user-gold-cdn.xitu.io/2019/1/25/16884590685803af?w=1100&h=556&f=png&s=545160)
配置后执行npm start即可进行快速打包

#### 8、webpack其他强大功能
（1）source maps
source maps 提供编译文件和源文件的对应。
配置后，webpack 就可以在打包时为我们生成`source maps`，这为我们提供了一种对应编译文件和源文件的方法，使得编译后的代码可读性更高，也更容易调试。在webpack的配置文件中配置`source maps`，需要配置 `devtool`:

|devtool选项 | 配置结果 |
|:--|--|
|source-map|在一个单独的文件中产生一个完整且功能完全的文件。这个文件具有最好的source map，但是它会减慢打包速度；|
|cheap-module-source-map|在一个单独的文件中生成一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号），会对调试造成不便；|
|eval-source-map|使用eval打包源文件模块，在同一个文件中生成干净的完整的source map。这个选项可以在不影响构建速度的前提下生成完整的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定不要启用这个选项；|
|cheap-module-eval-source-map|这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；|

对小到中型的项目，eval-source-map 是一个很好的选项，只应该开发阶段使用它，继续对上文新建的webpack.config.js，进行如下配置:

![](https://user-gold-cdn.xitu.io/2019/1/25/168845c32fc887ed?w=1508&h=370&f=png&s=321013)

(2)构建本地服务器
通过构建本地服务器，可以让浏览器监听代码修改，自动刷新修改后的结果，改构建基于node.js，不过它是一个单独的组件，在webpack中进行配置之前需要单独安装它作为项目依赖。

> npm install --save-dev webpack-dev-server

`dev-server`的配置项如下所示：

|devserver的配置选项|功能描述|
|:--|--|
|contentBase|默认webpack-dev-server会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录（本例设置到“public"目录）|
|port|设置默认监听端口，如果省略，默认为”8080“|
|inline|设置为true，当源文件改变时会自动刷新页面|
|historyApiFallback|在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html|

配置dev-server 位置在webpack.config.js中，配置添加后如下图所示：

![](https://user-gold-cdn.xitu.io/2019/1/25/168845dd22608de4?w=1306&h=538&f=png&s=407372)

在配置好dev-server后还需要再package.json 的 scripts 中配置运行命令，如下图所示：

![](https://user-gold-cdn.xitu.io/2019/1/25/168845e295f5e255?w=1314&h=620&f=png&s=405474)

(3）Loaders
通过使用不同的`loader`，`webpack`有能力调用外部的脚本或工具，实现对不同格式的文件的处理，比如说分析转换scss为css，或者把下一代的JS文件（ES6，ES7)转换为现代浏览器兼容的JS文件，对React的开发而言，合适的Loaders可以把React的中用到的JSX文件转换为JS文件。
Loaders 需要单独安装，且配置在webpack.config.js 中的 modules 关键字下进行配置，配置项：
* test：匹配 loaders 所处理文件的拓展名的正则表达式（必须）
* loader : loader 名称 （必须）
* include /exclude : 手动添加需要处理的文件（文件夹） 或 屏蔽不需要处理的文件（文件夹）（可选）
* query : 为loader提供额外的设置选项（可选）
(4）Babel
babel 是一个js编译平台，可以编译ES6 、ES7，也可使用JSX等语法
安装ES6以及JSX解析包
> // npm一次性安装多个依赖模块，模块之间用空格隔开 npm install --save-dev babel-core babel-loader babel-preset-env babel-preset-react

在webpack中配置babel ：

![](https://user-gold-cdn.xitu.io/2019/1/25/168845ede35cb592?w=1262&h=880&f=png&s=523568)

（5）插件（Plugins）
插件用于扩展webpack。
plugins和loaders的区别：
* loaders 是在打包构建过程中用来处理源文件的（JSX，Scss，Less..），一次处理一个；
* plugins 插件并不直接操作单个文件，它直接对整个构建过程其作用。
插件的使用需要用npm安装，然后在webpack配置中plugins字段下添加实例：

![](https://user-gold-cdn.xitu.io/2019/1/25/168845f55c8c7f69?w=1136&h=642&f=png&s=609278)

打包后的文件就会添加版权声明。
一些插件：
* Hot Module Replacement 允许你在修改组件代码后，自动刷新实时预览修改后的效果。
* HtmlWebpackPlugin 依据一个简单的index.html模板，生成一个自动引用你打包后的JS文件的新index.html

#### 问题记录
1、在安装时提示没有权限

![](https://user-gold-cdn.xitu.io/2019/1/25/168845faedce6e66?w=1250&h=610&f=png&s=1088739)

解决：mac 电脑有权限限制，需要使用 sudo 进行安装




