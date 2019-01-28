# canvas 点线动画

代码地址：[canvas点线动画](https://github.com/zmy18232766872/demo-room/tree/master/dotline)

##### 画圆：
> arc(x, y, r, start, stop)

##### 画线：
> moveTo(x, y) 定义线条开始坐标
> 
> lineTo(x, y) 定义线条结束坐标

##### 填充：
> fill() 

##### 绘制：
> stroke()

#### 1、画一个点

##### 初始化

```
<canvas id="canvas" width="700" height="600">
  浏览器不支持canvas！
</canvas>
```

##### 找到 `<canvas> `元素
> let canvas = document.getElementById("canvas");

##### 创建 `context `对象
> let ctx = canvas.getContext("2d");

##### 画圆
```
// 坐标（x, y）、半径、开始角度、结束角度、顺时针（逆时针）
ctx.arc(70, 80, 30, 0, Math.PI * 2, false);
```

#### 2、画很多点

```
//生成点
for (let i = 0; i < dotsNum; i ++) {
  x = Math.random() * canvas.width;
  y = Math.random() * canvas.height;
  r = Math.random() * 4; // 随机生成 <4 的半径值

  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(0,0,0,.8)";
  ctx.fill();
  ctx.closePath();
}
```

#### 3、画两点一线
> 确定两个点的坐标 + lineTo 、moveTo

```
for (let i = 0; i < 2; i++) {
  ctx.beginPath()
  // 设置原点位置为（100，100），半径为10
  ctx.arc(100 + i * 150, 100 + i * 250, 10, 0, Math.PI * 2, false)

  // 两个点进行画线
  ctx.moveTo(100, 100)
  ctx.lineTo(100 + i * 150, 100 + i * 250)

  // 设置线的宽度，单位是像素
  ctx.lineWidth = 2
  ctx.stroke()

  // 实心圆 - 填充颜色,默认是黑色
  // 实心圆 - 画实心圆
  ctx.fill()
  ctx.closePath()
}
```


#### 4、画多点多线
当点很多、元素很多的时候再进行画线操作会很繁琐，对于多元素的情况，创建实例对象，把变量存储在实例对象上。

###### 定义一个Dots函数。
```
var Dots = function () {
  // 画布
  this.canvas;
  this.ctx;

  // 画点
  this.x;
  this.y;
  this.r;
};
```

###### 添加一个用于点的生成的初始化方法。
```
Dots.prototype = {
  // 初始化点的方法
  init: function (canvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.r = Math.random() * 4; // 随机生成 <4 的半径值

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.closePath();
  }
};
```

###### 在点与点之间进行画线，每两个点之间就有一条线，总共有C(n,2)条线。
```
// 绘制连线
  for (var i = 0; i < dotsNum; i ++) {
    for (var j = i + 1; j < dotsNum; j ++) {
      var tx = dotsArr[i].x - dotsArr[j].x,
          ty = dotsArr[i].y - dotsArr[j].y,
          // 三角形斜边长
          s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));

      if (s < dotsDistance) {
        ctx.beginPath();
        ctx.moveTo(dotsArr[i].x, dotsArr[i].y);
        ctx.lineTo(dotsArr[j].x, dotsArr[j].y);
        ctx.strokeStyle = 'rgba(0,0,0,'+(dotsDistance-s)/dotsDistance+')';

        ctx.strokeWidth = 1;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
```
点与点之间连线

![](https://user-gold-cdn.xitu.io/2019/1/25/16884628fae6ad8e?w=1618&h=1088&f=png&s=1962457)


限定点与点的连线距离（优化：根据点之间的距离添加连线颜色透明度）

![](https://user-gold-cdn.xitu.io/2019/1/25/1688462d88c2a92a?w=1638&h=1188&f=png&s=1984005)


#### 5、requestAnimationFrame

Canvas 画布的工作原理和显示器工作原理一样，都是通过不断的刷新绘制。浏览器的刷新是实时的，而 Canvas 的刷新是手动触发的，如果我们只想在 Canvas 上实现静态的效果，就没必不断刷新。

`requestAnimationFrame`是浏览器用于定时循环操作的一个接口，类似于setTimeout，主要用途是按`帧`对网页进行重绘。`requestAnimationFrame`不是自己指定回调函数运行的时间，而是跟着浏览器内建的刷新频率来执行回调。

###### **优势**：
浏览器可以优化并行的动画动作，更合理的重新排列动作序列，并把能够合并的动作放在一个渲染周期内完成，从而呈现出更流畅的动画效果，一旦页面不处于浏览器的当前标签，就会自动停止刷新。

###### **使用方式**：
> 持续调用 requestAnimFrame
> 
> 清除动画调用 cancelAnimationFrame

###### **动效绘制大致路数**:
```
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 画布渲染
var render = function () {
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制(在canvas画布上绘制图形的代码)
    draw();
    // 继续渲染
    requestAnimationFrame(render);
};
render();
```

上面的`draw()`就是在 canvas 画布上绘制图形的代码，但是如果仅仅有上面代码还不够，如果是同一个位置不断刷新，我们看到的还是静止不动的效果，所以还需要一个运动变量。

###### **运动坐标变量**:
```
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

// 坐标变量
var x = 0;
// 绘制方法
var draw = function () {
    ball.x = x;
};
// 画布渲染
var render = function () {
    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 位置变化
    x++;
    // 绘制
    draw();
    // 继续渲染
    requestAnimationFrame(render);
};

render();
```

#### 6、动起来的多点多线

**动的是点，画的是线**

###### 给 Dots 对象添加运动变量,sx 和 sy 两个值表示点在x轴和y轴的运动量,此处为在[-2, 2)之间运动。
```
let Dots = function () {
  // 画布
  this.canvas;
  this.ctx;

  // 画点
  this.x;
  this.y;
  this.r;

  // 移动
  // 随机确定点的移动速度与方向 速度值在 [-2, 2) 之间 提高数值可加快速度 
  //（Math.random() 随机返回[0,1)的数）
  this.sx = Math.random() * 4 - 2;
  this.sy = Math.random() * 4 - 2;
};
```

###### 添加更新点的方法`update()`
```
// 更新点位置
  update: function () {
    this.x = this.x + this.sx;
    this.y = this.y + this.sy;

    // 点超出 canvas 范围时重新初始化
    if (this.x < 0 || this.x > this.canvas.width) {
      this.init(this.canvas);
    }
    if (this.y < 0 || this.y > this.canvas.height) {
      this.init(this.canvas);
    }

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    this.ctx.fillStyle = "rgba(0,0,0,.6)";
    this.ctx.fill();
    this.ctx.closePath();
  }
```

###### 动画及连线
兼容 requestAnimationFrame
```
  let requestAnimFrame = requestAnimationFrame || webkitRequestAnimationFrame || oRequestAnimationFrame || msRequestAnimationFrame;
  requestAnimFrame(animateUpdate); // 兼容不同浏览器的 requestAnimationFrame
```

或者使用 setTimeout 向下兼容：
```
// requestAnimationFrame的向下兼容处理
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(fn) {
        setTimeout(fn, 17);
    };
}
```

由于点的位置不断变换，因此需要将画线的操作放在动画内执行，点的位置 update 一次就执行一次连线。
```
  function animateUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空canvas中原有的内容

    for (let i = 0; i < dotsNum; i ++) {
      dotsArr[i].update();
    }

    // 绘制连线
    for (let i = 0; i < dotsNum; i ++) {
      for (let j = i + 1; j < dotsNum; j ++) {
        let tx = dotsArr[i].x - dotsArr[j].x,
          ty = dotsArr[i].y - dotsArr[j].y,
          // 三角形斜边长
          s = Math.sqrt(Math.pow(tx, 2) + Math.pow(ty, 2));
        if (s < dotsDistance) {
          ctx.beginPath();
          ctx.moveTo(dotsArr[i].x, dotsArr[i].y);
          ctx.lineTo(dotsArr[j].x, dotsArr[j].y);
          ctx.strokeStyle = 'rgba(0,0,0,'+(dotsDistance-s)/dotsDistance+')';
          ctx.strokeWidth = 1;
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
    // 继续渲染
    requestAnimFrame(animateUpdate);
  }
```

#### 类似的例子
星空效果、下雨效果等



#### 你可能不知道的点
##### 1、canvas 画的圆不是圆，是椭圆
不要在style里指定 Canvas 的宽度，Canvas 画布的尺寸的大小和显示的大小是有很大的区别的，在 canvas 里面设置的是才是 Canvas 本身的大小。

> 如果不给`<canvas>`设置 width、height 属性时，则默认 width 为 300、height 为 150, 单位都是 px。也可以使用 css 属性来设置宽高，但是如宽高属性和初始比例不一致，他会出现扭曲。所以，**建议永远不要使用css属性来设置`<canvas>`的宽高。**

##### 2、不要企图通过闭合现有路径来开始一条新路径

**画新元素前记得要 beginPath()**

* 不管用 moveTo 把画笔移动到哪里，只要不调用beginPath()，一直都是在画一条路径
* fillRect 与 strokeRect 这种直接画出独立区域的函数，也不会打断当前的path

