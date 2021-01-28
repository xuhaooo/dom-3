// 在 jquery.js 里面写了第一句话，在这里使用它
// window.jQuery() 因为它是全局函数，可以掉 window 使用
// jQuery()

// 我们先把我们的第一句代码写一下，获取一个元素，去实现它
// 测试 
// const api = jQuery('.test') // 不返回元素们，它返回一个 api 对象
// api.addClass('red').addClass('blue') // api 里面有什么呢，有个 addClass，功能就是我给你一个 'red'，你把它添加到 div 上面
// 现在有个问题，我获取到的 api 操作的元素是几个呢，不清楚，怎么办，遍历呗
// 那 addClass 的实现就是，遍历所有刚才获取到的元素，然后添加 .red
// 具体实现看 jquery.js 里面，最后 addClass 返回什么呢，不需要返回，可以不写那就返回 undefined，当然写成 return undefined 也行

// jQuery('.test')
//     .addClass('red')
//     .addClass('blue')
//     .addClass('green')

// 测试 find
// const api1 = jQuery('.test')
// api1.addClass('blue')

// const api2 = api1.find('.child').addClass('red')

// api1.addClass('green')

// 我在 jQuery('.test').find('.child').addClass('red') 之后，突然想回过头去操作 .test 怎么弄，我可以这样
jQuery('.test')
    .find('.child')
    .addClass('red')
    .addClass('blue')
    .addClass('green')
    .end() // 这个 end 的作用就是返回到上一个 api
    .addClass('yellow') // 即这里的 yellow 会加到 .test 身上

// find 里的 return jQuery(array) 会 return 一个新的 api 对象，这个 api 对象目前只知道我要操作的元素是 array，那么之前的元素我是完全不知道的啊，那怎么办呢，传给它不就完了么
// 这样，我们把之前的数据（旧的 api）放在 array 身上，const oldApi = this
// 然后实现 end，很简单，end(){return this.oldApi}，这个我们的 api 已经不是旧的 api 了，而是新的当前的 api 了
// find 里面的 this 是旧的 api，end 里面的 this 是新的 api
// 为什么会变呢，为了方便起见，命名中间过程
// const api1 = jQuery('.test')
// const api2 = api1.find('child').addClass('red').addClass('blue').addClass('green')
// const oldApi = api2.end().addClass('yellow')
// 第一个 api1 是 jQuery 返回的来操作 .test 的，没问题；第二个 api2 是 find 返回的用来操作 .child 的 api 对象；这个时候 api2.end() api2 调用 end，end 的 this 是哪个 api 啊，肯定是 api2，因为你调用 end 肯定是用新的 api 去调用 end，不然你调用它干嘛，所以 return this.oldApi 这里的 this 是新的 api
// 报错，因为把旧的 api 放到了数组身上，数组当然没有 addClass 方法了，那就把 oldApi 复制过来，放到返回的 api 对象的里面，oldApi = selectorOrArray.oldApi，这样我们的 api 也有 oldApi 了


// 测试 each
const x = jQuery('.test').find('.child')
x.each((xyz)=>log(xyz))

// 测试 parent
const y = jQuery('.test')
y.parent().print()
// 打印出 3 个 body，因为有 3 个 .test，应该是一个呀，怎么办呢，push 的时候判断一下

// 测试 children
const z = jQuery('.test')
z.children().print()