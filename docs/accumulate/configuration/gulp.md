# Gulp 前端构建工具

`Gulp`是一个自动化的前端构建工具，具有一些优点：
* 易于使用：通过代码优于配置的策略，Gulp 让简单的任务简单，复杂的任务可管理。
* 构建快速：利用 Node.js 流的威力，你可以快速构建项目并减少频繁的 IO 操作。
* 高质量的插件：Gulp 严格的插件指南确保插件如你期望的那样简洁高质得工作。
* 易于学习：通过最少的 API，掌握 Gulp 毫不费力，构建工作尽在掌握：如同一系列流管道。

### 1、Gulp的安装
- 1、首先安装nodejs环境
- 2、全局安装Gulp
```
npm install -g gulp
```
- 3、项目中安装gulp
切换目录到要使用gulp的项目，在命令中执行
```
npm install gulp
```
- 4、若想在安装的时候把gulp写进项目package.json中，需要在命令行中加上--save-dev
```
npm install --save-dev gulp
```

对于全局安装gulp后还要在项目内再进行一次gulp安装的原因是为了版本的灵活性。

### 2、使用
#### 2.1、创建主文件
创建一个主文件夹，命名为`gulpfile.js`,同时将该文件放于使用gulp的项目目录中。gulpfile.js文件用于定义我们的任务，以下为一个简单的gulpfile.js文件的示例：
```
var gulp = require('gulp')
gulp.task('default',function(){
   console.log('hello world')
});
```
此时目录结构为：
```
|--gulpfile.js
|--node_modules
|   |--gulp
|-- package.json
```
#### 2.2、运行gulp任务
切换到gulpfile.js文件的目录下，执行命令
> gulp

如果要执行特定的任务，这执行命令：
> gulp task

如果没有指定任务，则执行任务名为default的默认任务。

### 3、Gulp 的API
gulp常用的API有4个：
- gulp.task()
- gulp.src()
- gulp.dest()
- gulp.watch()

#### 3.1 gulp.src()
Gulp是以stream为媒介的，它不需要频繁的生成临时文件,
`gulp.src()` 正是用于获取流的。这个流的内容是一个虚拟文件对象流(Vinyl files)，虚拟文件对象中存储着原始文件的路径、文件名、内容等信息。语法为：
> gulp.src(globs[, options])

* **globs**参数是文件匹配模式(类似正则表达式)，用来匹配文件路径(包括文件名)，当然这里也可以直接指定某个具体的文件路径。当有多个匹配模式时，该参数可以为一个数组。
* **options**为可选参数。通常情况下我们不需要用到。

gulp匹配具有一定的规则及文件匹配技巧：
* `*`匹配文件路径中的0个或多个字符，但不会匹配路径分隔符，除非路径分隔符出现在末尾
* `**`匹配路径中的0个或多个目录及其子目录,需要单独出现，即它左右不能有其他东西了。如果出现在末尾，也能匹配文件。
* `?` 匹配文件路径中的一个字符(不会匹配路径分隔符)
* `[...]` 匹配方括号中出现的字符中的任意一个，当方括号中第一个字符为^或!时，则表示不匹配方括号中出现的其他字符中的任意一个，类似js正则表达式中的用法
* `!(pattern|pattern|pattern)` 匹配任何与括号中给定的任一模式都不匹配的
* `?(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或1次，类似于js正则中的(pattern|pattern|pattern)?
* `+(pattern|pattern|pattern)` 匹配括号中给定的任一模式至少1次，类似于js正则中的(pattern|pattern|pattern)+
* `*(pattern|pattern|pattern)` 匹配括号中给定的任一模式0次或多次，类似于js正则中的(pattern|pattern|pattern)*
* `@(pattern|pattern|pattern)` 匹配括号中给定的任一模式1次，类似于js正则中的(pattern|pattern|pattern)

有多种匹配模式时可以使用数组：
```
//使用数组的方式来匹配多种文件
gulp.src(['js/*.js','css/*.css','*.html'])
```
使用数组还可以很方便的使用排除模式，在数组中的单个匹配模式前加上!即是排除模式，在匹配结果中排除这个匹配，但是不能在数组中的第一个元素中使用排除模式。

> gulp.src([*.js,'!b*.js']) //匹配所有js文件，但排除掉以b开头的js文件
> gulp.src(['!b*.js',*.js]) //不会排除任何文件，因为排除模式不能出现在数组的第一个元素中

#### 3.2 gulp.task()
`gulp.task`方法用来定义任务:
> gulp.task(name[, deps], fn)

- **name** 为任务名
- **deps** 是当前定义的任务需要依赖的其他任务，为一个数组。当前定义的任务会在所有依赖的任务执行完毕后才开始执行。如果没有依赖，则可省略这个参数
- **fn** 为任务函数，我们把任务要执行的代码都写在里面。该参数也是可选的。

定义一个有依赖的任务：
```
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() { 
  // Do something
});
```
`gulp.task()`任务的执行顺序为：当任务相互之间没有依赖时，任务会按照书写的顺序来执行，如果有依赖的话则会先执行依赖的任务（当依赖的任务是同步的）。
当依赖的任务为异步时，gulp并不会等依赖执行完,而是紧接着执行后续的任务。

如果想要在异步任务执行完再执行后续的任务，有三种方式：

**1、异步操作完成时设置回调函数通知gulp异步任务已经完成，此时的回调函数就是任务函数的第一个参数**
```
gulp.task('one',function(cb){ //cb为任务函数提供的回调，用来通知任务已经完成
  //one是一个异步执行的任务
  setTimeout(function(){
    console.log('one is done');
    cb();  //执行回调，表示这个异步任务已经完成
  },5000);
});

//这时two任务会在one任务中的异步操作完成后再执行
gulp.task('two',['one'],function(){
  console.log('two is done');
});
```
**2、定义任务时返回一个流对象。适用于任务就是操作gulp.src获取到的流的情况。**
```
gulp.task('one',function(cb){
  var stream = gulp.src('client/**/*.js')
      .pipe(dosomething()) //dosomething()中有某些异步操作
      .pipe(gulp.dest('build'));
    return stream;
});

gulp.task('two',['one'],function(){
  console.log('two is done');
});
```
**3、返回一个promise对象**
```
var Q = require('q'); //一个著名的异步处理的库 https://github.com/kriskowal/q
gulp.task('one',function(cb){
  var deferred = Q.defer();
  // 做一些异步操作
  setTimeout(function() {
     deferred.resolve();
  }, 5000);
  return deferred.promise;
});

gulp.task('two',['one'],function(){
  console.log('two is done');
});
```


#### 3.3 gulp.dest()
`gulp.src()` 用于写文件，其语法为：
语法为：
> gulp.dest(path[,options])

* **path**为写入文件的路径
* **options**为一个可选的参数对象，通常我们不需要用到

gulp的`使用流程`如下：
首先通过`gulp.src()`方法获取到我们想要处理的文件流，然后把文件流通过`pipe`方法导入到gulp的插件中，最后把经过插件处理后的流再通过`pipe`方法导入到`gulp.dest()`中，`gulp.dest()`方法则把流中的内容写入到文件中，这里首先需要弄清楚的一点是，我们给`gulp.dest()`传入的路径参数，只能用来指定要生成的文件的目录，而不能指定生成文件的文件名，它生成文件的文件名使用的是导入到它的文件流自身的文件名，所以生成的文件名是由导入到它的文件流决定的，即使我们给它传入一个带有文件名的路径参数，然后它也会把这个文件名当做是目录名，例如：
```
var gulp = require('gulp');
gulp.src('script/jquery.js')
    .pipe(gulp.dest('dist/foo.js'));
//最终生成的文件路径为 dist/foo.js/jquery.js,而不是dist/foo.js
```

生成的文件与传入`gulp.dest()`的参数有一定的联系，`gulp.dest(path)`生成的文件路径是我们传入的path参数后面再加上`gulp.src()`中有通配符开始出现的那部分路径。

```
var gulp = reruire('gulp');
//有通配符开始出现的那部分路径为 **/*.js
gulp.src('script/**/*.js')
    .pipe(gulp.dest('dist')); //最后生成的文件路径为 dist/**/*.js
//如果 **/*.js 匹配到的文件为 jquery/jquery.js ,则生成的文件路径为 dist/jquery/jquery.js
```

通过指定`gulp.src()`方法配置参数中的`base`属性，我们可以更灵活的来改变`gulp.dest()`生成的文件路径。
当我们没有在`gulp.src()`方法中配置`base`属性时，`base`的默认值为通配符开始出现之前那部分路径，例如：
> gulp.src('app/src/**/*.css') //此时base的值为 app/src

实际上，`gulp.dest()`所生成的文件路径的规则，其实也可以理解成，用我们给`gulp.dest()`传入的路径替换掉`gulp.src()`中的`base`路径，最终得到生成文件的路径。

```
gulp.src('app/src/**/*.css') //此时base的值为app/src,也就是说它的base路径为app/src
     //设该模式匹配到了文件 app/src/css/normal.css
    .pipe(gulp.dest('dist')) //用dist替换掉base路径，最终得到 dist/css/normal.css
```
所以改变base路径后，gulp.dest()生成的文件路径也会改变

```
gulp.src(script/lib/*.js) //没有配置base参数，此时默认的base路径为script/lib
    //假设匹配到的文件为script/lib/jquery.js
    .pipe(gulp.dest('build')) //生成的文件路径为 build/jquery.js

gulp.src(script/lib/*.js, {base:'script'}) //配置了base参数，此时base路径为script
    //假设匹配到的文件为script/lib/jquery.js
    .pipe(gulp.dest('build')) //此时生成的文件路径为 build/lib/jquery.js    
```

用`gulp.dest()`把文件流写入文件后，文件流仍然可以继续使用


#### 3.4 gulp.watch()
`gulp.watch()`用来监视文件的变化，当文件发生变化后，我们可以利用它来执行相应的任务，例如文件压缩等.
> gulp.watch(glob[, opts], tasks)

**glob** 为要监视的文件匹配模式，规则和用法与`gulp.src()`方法中的`glob`相同。
**opts** 为一个可选的配置对象，通常不需要用到
**tasks** 为文件变化后要执行的任务，为一个数组

另一种使用方式为：
> gulp.watch(glob[, opts, cb])

**glob** 和 **opts** 参数与第一种用法相同
**cb** 为一个函数。每当监视的文件发生变化时，就会调用这个函数,并且会给它传入一个对象，该对象包含了文件变化的一些信息，type属性为变化的类型，可以是added,changed,deleted；path属性为发生变化的文件的路径

```
gulp.watch('js/**/*.js', function(event){
    console.log(event.type); //变化类型 added为新增,deleted为删除，changed为改变 
    console.log(event.path); //变化的文件的路径
}); 
```

### 4、常用插件
#### 4.1 自动加载插件(gulp-load-plugins)
命令：
> npm install --save-dev gulp-load-plugins

#### 4.2 重命名(gulp-rename)
命令：
> npm install --save-dev gulp-rename

#### 4.3 js文件压缩(gulp-uglify)
命令：
> npm install --save-dev gulp-uglify

#### 4.4 css文件压缩(gulp-minify-css)
命令：
> npm install --save-dev gulp-minify-css

#### 4.5 html文件压缩(gulp-minify-html)
命令：
> npm install --save-dev gulp-minify-html

#### 4.6 js代码检查(gulp-jshint)
命令：
> npm install --save-dev gulp-jshint

#### 4.7 文件合并(gulp-concat)
命令：
> npm install --save-dev gulp-concat

#### 4.8 less 和 sass 编译(gulp-less/gulp-sass)
命令：
>npm install --save-dev gulp-less

>npm install --save-dev gulp-sass

#### 4.9 图片压缩(gulp-imagemin)
命令：
> npm install --save-dev gulp-imagemin
#### 4.10 自动刷新（gulp-livereload）
命令：
> npm install --save-dev gulp-livereload



