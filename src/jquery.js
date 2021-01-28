// 改写 console.log()
window.log = console.log.bind(console)

// 首先第一句话就令人费解，为什么要是一个函数呢，先别管
// window.jQuery = function() {
//     log('我是 jquery!')
// }

// 实现获取一个元素的功能
window.$ = window.jQuery = function(selectorOrArray) {
    // const elements
    // 变量提升，否则只在判断的花括号里面复制
    // 另外 const 声明必须同时赋值，那就用 let
    let elements
    if(typeof selectorOrArray === 'string') {
        elements = document.querySelectorAll(selectorOrArray)
    } else if(selectorOrArray instanceof Array){
        elements = selectorOrArray
        // 如果你传入的是数组，那就是数组呗，我 elements 就是想用是数组，后面用的都是遍历
    }
    // return elements
    // 注意在这句话这里 jQuery 就产生了一个跟我们直观上非常冲突的地方，它不 return elements
    // 它 return 一个对象 
    // const api =
    return {
        // 事实上这么写也是可以的：
        // "addClass": function(className){ for... }
        // 不过是 ES6 出现了一个新语法，就是下面这种写法，跟上面的意思一模一样
        addClass(className) {
            for(let i=0;i<elements.length;i++){
                elements[i].classList.add(className)
            }
            return this // return api // return undefined
            // 这里我有一个疑惑：对象里面的函数，为什么可以返回外面的对象
        },

        // 用于查找 #xxx 里面的 .red 元素，即在查找元素里面再查找元素
        find(selector) {
            // 给我一个选择器，有一个问题啊，你不是要在一个 div 里面去找这个选择器内容，我肯定在这里不能用 document.queryS，因为我需要一个范围啊
            // 我怎么拿到那个范围呢，我要在 #test1 里面找这个 .child，我怎么知道 test1 呢，注意除了 this 是一个 api 之外，还有一个变量 elements
            // elements 是一个数组，数组肯定不能 queryS，所以用一个临时数组来储存我们新查找的元素，然后遍历 elements，即使只有一个也要遍历
            let array = []
            for (let i = 0; i < elements.length; i++) {
                const elements2 = Array.from(elements[i].querySelectorAll(selector))
                array = array.concat(elements2)
                // 相当于 array = array + elements2
            }
            array.oldApi = this

            // const newApi = jQuery(array)
            // return newApi
            return jQuery(array)


            // 但是又有一个问题了，测试中的 const x1 = jQuery('.test').find('.child')，这个 x1 就没有链式操作了，它就是一个彻彻底底的数组啊
            // 那能不能 return this 呢，不能，因为如果 return this，那么之后 jQuery('.test').find('.child').addClass('red') ，你直觉上是不是把 red 加到了 find('.child') 这里啊，但事实上会加到 test 上，因为 .find('.child') 返回的是它前面的元素的 api（this），所以实际上加到了 jQuery('.test') 上，即 test 上，那我实际上是要操作 child 的，那怎么办呢，只能重新封装一下得到一个新的 api 才可以
            // 可能会觉得，在里面改一下 elements 不就好了么，在 find 里面 elements = array，可能效果上可以的，但是因为 elements 会被其他的引用，你在这里改了会导致 bug，这就是使用 const 的原因
            // 重新封装一个 jQuery 函数，jQuery 不就是获取到一些元素吗，我把这些元素递给 jQuery 不行嘛，以前你接受一个选择器对吧，现在你能不能封装一个数组啊，我把数组给你，你给我封装一个新的 api，这个 api 跟刚才的结构一样，但是保存的 elements 不一样
            // 所以 return 一个 newApi，怎么得到 newApi，jQuery 是不是可以创造一个，那他它只接受一个选择器怎么办，我让它不只接受选择器 jQuery(selector) 改成 jQuery(selectorOrArray)，然后判断到底是选择器还是数组，这里我就可以把 array 传进去，然后返回 newApi
            // 这个 newApi 就跟之前的 api 是完全不同的对象，跟最开始 const api = jQuery('#test') 给我一个选择器我给你返回一个 api 没什么区别，就是给我一个数组我给你返回一个新的 newApi，const newApi = jQuery(array)
            // 新的 api 与原来的 api 不同之处就是操作的对象不同，因为如果是同一个操作对象，就会相互污染，就是之前说的在这里 return this 会造成互相影响，所以你一定要得到一个新的对象
            // 判断选择器还是数组，之前学过的重载
            // 这句代码乍看很烧脑，为什么要把数组重新传给 jQuery，实际上我要得到一个新的 api 对象，用来操作这个 array，总结一句话就是 jQuery 你给我传什么，我就会返回一个对象操作什么
        },

        // 用于返回操作上一级 jQuery 对象的 end
        oldApi: selectorOrArray.oldApi,
        end(){
            return this.oldApi
        },

        // 用于实现遍历的 each
        each(fn){
            for(let i=0;i<elements.length;i++){
                fn.call(null, elements[i], i)
            }
            return this //要记住，this 就是 api 对象
        },

        // 用于获取爸爸的 parent
        parent(){
            const array = []
            this.each((node) => { // 要记住，this 就是当前的没有名字的 api 对象
                if(array.indexOf(node.parentNode) === -1){
                    array.push(node.parentNode)
                }
            })
            return jQuery(array) // 当然不会返回不能操作爸爸的数组，返回一个 jQuery 返回一个可以操作爸爸的对象 
        },

        // 用于打印出当前元素的 print
        print(){
            console.log(elements)
        },

        // 用于获取儿子的 children
        children(){
            const array = []
            this.each((node) => {
                    array.push(...node.children)
            })
            return jQuery(array)
        }

    }
    // return api

    // jquery 不 return elements，它 return 的是可以操作 elements 的 api，先不管 addClass 的功能
    // 第一次出现的一个新手想不到的地方
    // jquery 的核心代码就是它接受一个选择器，然后根据这个选择器得到一些元素，然后返回一个对象，这个对象有个方法可以操作这些元素，对吧

    // 闭包，addClass 访问了外部变量 elements，这里先记住用到了闭包，之后再说有什么作用
    // 好了，现在到 main.js 里面去测试

    // 继续，addClass 返回的是一个空，那是不是可以返回 api 啊，就把前面的 api 返回行不行，能返回
    // 那如果能的话，那我们返回的值就是，调用的时候 api.addClass('add') 前面的 api 啊
    // 那是不是说明意味着我可以继续点啊，api.addClass('red').addClass('blue')
    // 链式操作，你用 api 调用一个函数，而这个函数返回你前面的那个东西（api），于是你就可以继续在后面调用 addClass，实现的方法就是 return 那个对象，骚操作

    // 好了继续，接下来的骚操作就是
    // 之前说过，函数你用一个对象来调用，那么函数里面的 this 就是前面的那个对象啊
    // obj.fn(p1) 等价于 obj.fn.call(obj, p1)
    // 那么这里 addClass 里面的 this 就是 api，那我是不是可以 return this，不 return api，可以，那就这么做

    // 为什么要改写成 this 呢，api 不出更好懂吗，因为 api 这个对象根本就没有名字
    // 既然 jQuery 这个函数最后是 return api，那我可以把 const api = 这几个字符换成 return ，然后删除最后的 return api，至此终于明白为什么要写成 this 了吗，因为它没有名字
    // 那它名字在哪里呢，外面有啊，main.js 里面 const api = jQuery('#test')

    // jQuery 的源代码大概就是这样写的
    // 阶段性的总结 jQuery 的核心代码：
    // 精髓一：「闭包」它提供一个函数，这个函数接受一个选择器，你给他选择器它就会获取到元素，但它不会返回给你这些元素，它返回一个对象，这个对象里面有一些方法（函数），这些函数会操作获取的这些元素；就是用闭包去维持这些获取的 elements，只要你这个函数不死，这个 elements 就是不死的，因为这个函数在访问 elements，而被访问的东西是不能随便删掉的，浏览器不会轻易把 elements 删掉因为一旦删掉就报错了
    // 精髓二：「链式操作」这个函数它可以猜到你在调用它的时候，肯定是通过你得到的那个 ”api“ 的，肯定是这样调用的，所以它才会大胆的 return this，它 return this 的目的是什么呢，它希望把 . 前面调用的东西作为函数的返回值，this 是调用后的时候确定的，这相当于这个东西从前面传递到了后面，后面就又可以继续 .，继续传递；这个 api 叫什么无所谓，叫 x 都行，那还叫啥 x 呢，直接不叫了获取元素之后直接用呗，jQuery('.test').addClass('red').addClass('blue')，事实上就是简化了声明之后再使用的步骤


}

// window.$ = window.jQuery
// 简写到开头，注意如果两个 = 在同一行是从右边先执行的

