# 一文读懂 Animation 中的时间函数 steps

利用 CSS3 的 Animation 可以创建动画，在许多页面中能够替代 Flash、JS 等，提升页面加载速度。众所周知，Animation 有 8 大属性，如下所述：

|属性名|简介|
|:-------:|:----------:|
| animation-name| 规定需要绑定到选择器的 keyframe 名称 |
|animation-duration |完成动画所花费的时间，以秒或毫秒计 |
|animation-timing-function |规定动画的速度曲线 |
|animation-delay |动画开始前的延迟 |
|animation-iteration-count |动画播放次数|
|animation-direction |规定是否应该轮流反向播放动画 |
|animation-play-state |指定动画是否正在运行或已暂停 |
|animation-fill-mode |当动画不播放时（动画完成或动画延迟），要应用到元素的样式 |
以上这 8 个属性就决定了 Animation 能够实现一个什么样的动画效果。 

本文主要介绍 `timing-function`中的`steps()`函数。Animation 在执行动画时默认以 `ease`函数进行过渡，ease 会在每个关键帧之间插入补间动画，所以动画效果是连贯的。
除了ease函数之外，`linear`和`cubic-bezier`（贝塞尔曲线）等过渡函数也会为其插入补间动画。

但有的时候某些效果不需要补间，只需要在关键帧之间进行跳跃，这时就用到了steps()过渡方式。

#### 1、什么是 steps？
`steps()`是 Animation 中的一个`timing-function`函数， 能够实现动画的阶跃式变化，而非两个状态间的线性过渡。 
`steps()` 接收两个参数：
> steps ( n, [start | end] )

- 第一个参数是一个正值，指定动画分割的段数
- 第二个参数定义动画执行开始点，可设定为 start 或 end，这个值为可选值，当未传入参数时默认以 end 方式执行


#### 2、如何使用 steps？
大家都见过很经典的菊花 loading 效果图，其实现原理很简单：
一张静态图片，然后为其添加动画：

> 设定在固定步数内旋转(rotate) 360 度即可实现 loading 效果，具体实现方式如下：

```
<div> 
    <img class = "loading-dot-step" src="./loading.png">
</div>

...
.loading-dot-step {
  animation: loading 1s infinite steps(12,start);
}
@keyframes loading {
  0% {transform: rotate(0deg);}
  100% {transform: rotate(360deg);}
}
```

静态图片如图所示：

![d28d47a5312384f4d49495b747dc59f9.png](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p86)

给上面的静态图片添加动画，steps 设定 12 步完成两个关键帧间的动作轨迹，即从当前状态旋转 360 度，实现下面 gif 的动画效果。

![22ec24282082019180067d78a434e1e1.gif](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p87)

除了菊花 loading 效果，很常见的还有线性 loading，其实现方式是：
利用 `timing-function` 的 `linear` 线性过渡函数，实现图片的连续旋转，此时的效果在视觉上就是连续的动画，如下图所示：

![26a53021e49fc537394c490d76e4dc53.gif](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p88)

对于两种 loading 效果图，第一种为 `steps` 方式，第二种为`线性过渡`方式。
两者实现原理类似：

> 均在两个关键帧之间将图片从当前状态旋转至 360 度，当 timing-function 设置为 linear 时，从 0% 到 100% 的状态变化为匀速线性变化；
当动作设定为 steps 时，将从 0 度旋转至 360 度的整个动画分为 12 步执行完，且每步之间是跳跃的，因此出现了经典的菊花 loading 效果。

#### 3、分清 start 和 end

steps 的执行点 start 和 end 是许多人存在疑惑的地方，误用 start 和 end 可能会出现和理想情况下不一致的动画效果，许多人分不清两者的区别在哪里，下面以几个简单的 demo 来辅助理解这两个属性值的区别。

`steps()` 可简化出 `step-start` 和 `step-end` 这两个关键字。
- step-start 等同 steps ( 1, start ) ，动画分成 1 步，动画执行时以左侧端点为开始
- step-end 等同 steps ( 1, end ) ，动画分成 1 步，动画执行时以结尾端点为开始 
```
<p>1、steps（1， start）</p>
<div class="a box"></div>
<p>2、steps（1， end）</p>
<div class="b box"></div>

...
.a{
  animation:changeColor 4s infinite steps(1, start);
}
.b{
  animation:changeColor 4s infinite steps(1, end);
}
@keyframes changeColor{
  0%{ background-color: red; }
  100%{ background-color: blue; }
}
```

上述代码显示效果如下图所示：
1、steps（1， start）

![999b40426c1ee5430669be43d195b6e0.png](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p89)

2、steps（1， end）

![7d05e8f564dcc2aa2a9db5c191256efb.png](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p90)

代码可见，两者设定的均为 1 步执行完动画，实现将 div 的颜色`从红色变为蓝色`，但是我们看到的结果却是不同的，这就是由于 `start` 和 `end` 两个属性的执行点不同造成的结果差异。

规范文档中给出了关于 `steps()` 的函数图，如下图所示：

![8543b141331fbf04ed951579b81f942d.jpeg](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p91)

对比 steps 函数中的 start 和 end 两个执行点，由上图中步数为 1 的两图可见：

- 整个动作只有一步，在时间为 0 处，position 设置为 start 时动画的第一步已执行完成
- 相同情况下，position 设置为 end ，当时间为 0 时动画的第一步尚未开始

同样，当步数等于 3 时，肉眼可见的 start 的执行点为第一步执行结束的位置，end 的执行点则为第一步尚未开始的位置 。由于动画执行的步数相同但起点不同，因此动画的结束点也不相同，设置为 start 的情况下，结束点为动画结束的最后一步的状态，而 end 为结束前一步的状态。

为了更加直观地展示两者执行的开始点和结束点的区别，本文以横向坐标图的方式对执行过程进行示意：

![5eabc1db3ae9ad6ce3e8db7491aefeac.png](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p92)

- 属性值设置为 start 时，在动画开始后，动画的第一段会马上完成。以左侧端点为起点，立即跳到第一个 step 的结尾处，并且保持这样的状态直到第一步的持续时间结束（后面的每一帧都将按照此模式来完成动画）。
- 属性值设置为 end 时，在动画执行的每一帧中，动画都保持当前状态直到这一段的持续时间完成，才会跳到下一步的起点（后面的每一帧都按照这个模式来进行）。

现在可以解释上述 demo 中两个 div 颜色显示不一样的原因了，对于 steps 属性值为 start 的 a-box，进入画面时动画的第一阶段已经完成，因此我们不会看到红色，直接显示蓝色；对于 steps 属性值为 end 的 b-box，动画保持第一帧的状态直到结束，因此始终显示为红色。

#### 4、何时使用 steps？
并非所有的动画都是连续的，对于某些非连续变化的效果就需要用到 steps 来实现。 例如钟表秒针阶跃式的转动，或者在动画中模仿人物或动物的脚印行走效果，再或者利用雪碧图实现人物跑动的效果等等。下面详细介绍一下人物跑动效果的实现方式。

> 人物奔跑 demo
```
<div class="person"></div>

...
.person {
  background: url('person.jpg') no-repeat;
  background-size: 800%;
  // 动画名称 持续时间 运动曲线（steps()分为几步）循环次数
  animation: personBlast .8s steps(7) infinite; 
}
@keyframes personBlast {
  0% { background-position: left; }
  100% { background-position: right; }
}
```
其中 person.jpg 为人物动作分割的雪碧图：

![a8c05ae4b22e3cacf73788ab59bf8a8a.jpeg](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p93)

本文奔跑动作实现方式为`将原始雪碧图进行按图形帧数的倍数放大`，然后设定steps 为雪碧图的帧数减 1（8 帧分为 7 步执行完），关键帧的动作为从 (from) 雪碧图左侧阶跃式跳跃到(to)右侧，最终实现下面的跑动效果：

![666cd74c4d456703a6c41fbf8e9d6247.gif](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p94)

【 注：此奔跑效果的实现方式不尽相同，此处只是其中一种，这样做是为了让大家更好的理解 steps 的应用场景，还有其他更友好的实现方式欢迎大家一起交流 】

#### 5、请注意 ！！！

对于 Animation 的 timing-function 有一个需要引起注意的点，即：

> timing-function 的执行位置为两个关键帧之间，而非整个动画

此处的 timing-function 指的是本文所讲的 steps 函数以及 linear、ease、cubic-bezier 等函数。
这里还是通过一个简单的 demo 来了解这个点。首先看一下下面的动画效果：

![e2afad170aa3518c01729b46162bc98f.gif](evernotecid://457479B4-69A2-490F-9145-4981FF917E86/appyinxiangcom/19092618/ENResource/p95)

实现代码为：
```
<div class="test test-a"></div>
<div class="test test-b"></div>

...
.test-a {
  animation: changeColorOne 1s steps(1) infinite;
}
.test-b {
  animation: changeColorTwo 1s steps(1) infinite;
}

@keyframes changeColorOne {
  0% { background-color: red; }
  100% { background-color: blue; }
}
@keyframes changeColorTwo {
  0% { background-color: red; }
  25%{ background-color: blue; }
  75%{ background-color: red; }
  100% { background-color: blue; }
```
- 对于 class 为 test-a 的 div，为其添加的 changeColorOne 动画为 1 秒内完成 0% 及 100% 两个关键帧之间的颜色变化，其执行位置为 0% 到 100% 之间，因此始终显示红色（不设置 start 还是 end 时默认为 end）
- 对于 test-b，changeColorTwo 的关键帧有 4 个，因此这时的 steps(1) 的执行位置为 0% - 25% 两个关键帧中间执行一次、25% - 75% 两个关键帧中间执行一次、75% - 100% 两个关键帧中间执行一次，一共执行3次。由于执行点设定为 end， 因此 0% - 25% 显示红色，25% - 75% 显示蓝色，75% - 100% 显示红色，动画整体效果即为上图 gif 所示。

因此：**steps 并非作用于整个动画，而是作用于每两个关键帧之间，与动画的时长、播放次数等都无关，所以整个动画的执行时间还是 Animation 中设定的 1s**。

#### 6、结束语
Animation 时间函数中的 steps() 确实不好理解，但是一旦掌握了它会为我们的开发工作带来很大的效率提升，节省很多调试时间，也能帮助我们快速定位问题。 希望本文的讲解可以帮助你更好的理解和使用 steps()。
感谢阅读，欢迎互相交流！

