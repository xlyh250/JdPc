
import 'babel-polyfill'
// import '../css/index.css'
// import '@/css/index.css';


class Parent {
    constructor(args) {

        this.elements = [];


        //  模拟$(#id p)
        if (typeof args === 'string') {
            //css模拟
            if (args.search(/\s/) !== -1) {
                //把节点拆开分别保存到数组里

                let elements = args.split(/\s/);
                //存放临时节点对象的数组，解决被覆盖的问题		
                let childElements = [];
                //用来存放父节点用的
                let node = [];
                for (let i = 0; i < elements.length; i++) {
                    //如果默认没有父节点，就把document放入
                    if (node.length === 0) node.push(document);

                    switch (elements[i].charAt(0)) {
                        case '#':
                            //清理掉临时节点，以便父节点失效，子节点有效
                            childElements = [];

                            childElements.push(this.getId(elements[i].slice(1)));
                            //保存父节点，因为childElements要清理，所以需要创建node数组
                            node = childElements;
                            break;
                        case '.':
                            childElements = [];
                            for (let j = 0; j < node.length; j++) {
                                let temps = this.getClass(elements[i].slice(1), node[j]);
                                // 取的是类数组，所以要遍历添加  
                                childElements.push(...temps);
                            }
                            node = childElements;
                            break;
                        default:
                            childElements = [];
                            for (let j = 0; j < node.length; j++) {
                                let temps = this.getTagName(elements[i], node[j]);
                                childElements.push(...temps);
                            }
                            node = childElements;
                    }
                }
                this.elements = childElements;
            } else {
                //find模拟
                switch (args.charAt(0)) {
                    case '#':
                        this.elements.push(this.getId(args.slice(1)));
                        break;
                    case '.':
                        this.elements.push(...this.getClass(args.slice(1)));
                        break;
                    default:
                        this.elements.push(...this.getTagName(args));
                }
            }
            // 加上&&!(args instanceof Array) 因为array也是对象,不加上array 就进入不了下一个判断条件
        } else if (typeof args === 'object' && !(args instanceof Array)) {
            if (args !== undefined) {
                //_this是一个对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
                this.elements[0] = args;
            }
            // 如果是数组
        } else if (Array.isArray(args)) {

            this.elements = args

        }
    };
    //设置CSS选择器子节点
    find(str) {
        let childElements = [];
        for (const iterator of Array.from(this.elements)) {

            switch (str.charAt(0)) {
                case '#':
                    childElements.push(this.getId(str.slice(1)));
                    break;
                case '.':
                    let temps = this.getClass(str.slice(1), iterator);
                    childElements.push(...temps)
                    break;
                default:
                    let arr = this.getTagName(str, iterator);
                    childElements.push(...arr)
            }
        }
        this.elements = childElements;
        return this;
    };

    getId(id) {
        return document.getElementById(id)
    };

    getClass(className, parent = document) {

        var parent = parent;

        let nodelist = parent.getElementsByClassName(className)

        return nodelist
    };
    getTagName(tagName, parent) {

        var parent = parent || document;

        let nodelist = parent.getElementsByTagName(tagName)

        return nodelist
    };
    // 寻找拥有className的祖宗元素
    parents(ele) {
        if (!ele) return;
        let parent = ele.parentNode
        while (parent.parentNode.className && parent.parentNode) {
            parent = parent.parentNode
        }
        return parent
    }

    //检查数组成员是否一样
    isEqually(val) {
        return val.every(function (val, i, arr) {
            return arr[0] === val
        })
    }
}

class Base extends Parent {

    // 获取可视区高宽    
    static getClient() {
        if (typeof document.documentElement !== 'undefined') {
            return {
                height: document.documentElement.clientHeight,
                width: document.documentElement.clientWidth
            }
        } else {
            return {
                width: document.body.clientWidth,
                height: document.body.clientHeight
            }
        }

    };
    // 判断元素是否存在className
    static hasClass(element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };
    // 获取下一元素节点
    static nextsibling(n) {
        var x = n.nextSibling;
        while (x != null && x.nodeType != 1) {
            x = x.nextSibling;
        }
        return x;
    };
    // 获取上一元素节点
    static previoussibling(n) {
        var x = n.previousSibling;
        while (x != null && x.nodeType != 1) {
            x = x.previousSibling;
        }
        return x;
    };
    // 事件处理兼容
    static addEvent(obj, type, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(type, fn)
        } else {
            obj['on' + type] = fn
        }
    };
    // 删除数组空值
    static removeEmptyArrayEle(arr) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === undefined) {
                arr.splice(i, 1);
                // i - 1 ,因为空元素在数组下标 某个位置，删除空之后，后面的元素要向前补位，
                i = i - 1;
            }
        }
        return arr;
    };
    // 封装遍历
    static each(obj,fn) {
        if (obj instanceof Array){
            for (const [index,iterator] of obj.entries()) {
                var res = fn.bind(iterator,index,iterator)
                if(res()===true){
                    continue;
                }else if(res()===false){
                    return false
                }
            }
        }else if(typeof obj === 'object'){
            for (const [index, iterator] of obj.entries()) {
                var res = fn.bind(iterator, index, iterator)
                if (res() === true) {
                    continue;
                } else if (res() === false) {
                    return false
                }

            }
        }
        return obj
    };
    // 获取外部样式表的样式
    static getStyle(attr,val) {

         var res = []
         
         if(typeof attr=== 'string'){
             return window.getComputedStyle(val,null)[attr]
         }

        Base.each(val,(i,value) => {
           
            if(window.getComputedStyle){
                
              res.push(window.getComputedStyle(value, null)[attr])
            }else{
              res.push(value.currentStyle[attr])
            }
        })
        return res.join('')
    };

    // 遍历元素
    foreach(fn) {

        if (Array.isArray(this.elements)) {
            for (var i = 0; i < this.elements.length; i++) {
                // var res = fn(i, this.elements[i]);
                var res = fn.call(this.elements[i], i, $(this.elements[i]));

                // 如果返回true跳过
                if (res === true) {
                    continue;
                } else if (res === false) {
                    break;
                }
            }
        }
        // 2.判断是否是对象
        else if (typeof this.elements === 'undefined') {
            for (var key in this.elements) {
                // var res = fn(key, this.elements[key]);
                var res = fn.call(this.elements[key], key, $(this.elements[key]));

                // 如果调用了跳过
                if (res === true) {
                    continue;
                } else if (res === false) {
                    break;
                }
            }
        }
        return this
    };
    // 设置style属性    
    css(attr, value) {

        if (arguments.length === 1) {

            return Base.getStyle(attr,this.elements)
        }
        Base.each(this.elements,(i,val) => {
            val.style[attr] = value;
        })
    
        return this;
    };

    // 添加class
    addClass(classs) {
        // 变量需要用new RagExp
        // let reg = new RegExp("(\\s|^)"+classs+"(\\s|$)","g")
        Base.each(this.elements,(i, val) => {
            //  hasclass第二个参数名字要与addclass参数名相同
            if (!Base.hasClass(val, classs)) {

                val.className === val.className ? val.className += ' ' + classs: val.className = '' + classs;
            }
        })
        return this
    };

    // 删除class
    removeClass(classname) {
        let reg = new RegExp("(\\s|^)" + classname + "(\\s|$)", "g")
        // macth类似indexOf
        Base.each(this.elements,(i, val) => {
            if (Base.hasClass(val, classname)) {

                val.className = val.className.replace(reg, '')
            }
        })
        return this
    };
    // 获取或者设置innerHTML 
    html(html) {

        if (arguments.length === 0) {
            return this.elements[0].innerHTML
        } else {
            Base.each(this.elements,(i, val) => {

                val.innerHTML = html
            })
        }
        return this;
    };

    //设置innerText
    value(text) {

        if (arguments.length === 0) {
            return this.elements[0].innerText
        }
        else {
            Base.each(this.elements,(i, val) => {
                val.innerText = text
            })
        }
        return this;
    };
    // 返回指定位置
    index() {
        // 通过查找父元素找到子元素
        let children = this.elements[0].parentNode.children;
        for (let i = 0; i < children.length; i++) {
            if (this.elements[0] === children[i]) return i;
        }
    };
    // 获取子元素节点
    children() {
        var res = [];
           
        Base.each(this.elements,(i, val) => {
            // 获取val.children的父元素
            res.push(...val.children)
            
        })

        return $(res)
    };
    //获取某一个节点，并返回这个节点对象
    getElement(num) {
        return this.elements[num];
    };
    //连缀调用版本获取某一个节点，并返回这个节点对象
    getEle(num) {
        var res = this.elements[num]
        return $(res);
    };
    getAllelement() {
        return this.elements
    };
    //通过index获取某一个节点，并且Base对象
    eq(num) {
        // 找到指定位置的元素
        let element = this.elements[num];
        
        this.elements = [];
        // 再把指定位置的元素赋给数组
        this.elements[0] = element;
        
        // 第二种
        // this.elements[num] = element;
        // Base.removeEmptyArrayEle(this.elements)
        return this;
    };
    //获取自身，并返回这个节点对象
    first() {
        return this.elements[0];
    };
    // 返回父节点
    parentElement() {
        for (let i = 0; i < this.elements.length; i++) {
            return this.elements[i].parentNode;
        }
    };
    // 返回父节点连缀调用版本
    parent() {
        for (let i = 0; i < this.elements.length; i++) {
            return this.elements[i].parentNode;
        }
        return this
    };
    // 返回子节点 非连缀 
    childrenElement() {
        for (let i = 0; i < this.elements.length; i++) {
            return this.elements[i].children;
        }
    };
    //获取某一个节点的属性
    attr(attr, value) {
        if (arguments.length === 1) {
            return this.elements[0].getAttribute(attr);
        }
        else if (arguments.length === 2) {
            Base.each(this.elements,(i, val) => {
                val.setAttribute(attr, value);
            })
        }
        return this;
    };
    // 获取其他兄弟元素
    siblings() {
        var res = []
        Base.each(this.elements,(i, val) => {

            let prev = val
            //先往上查询兄弟节点
            while (prev) {
                if (prev.nodeType === 1 && prev !== val) {
                    res.unshift(prev);
                }
                //把上一节点赋值给prev
                prev = prev.previousSibling;
            }
            let next = val
            // 往下查询兄弟节点
            while (next) {
                if (next.nodeType === 1 && next !== val) {
                    res.push(next);
                }
                //下一节点赋值给next，用于循环
                next = next.nextSibling;
            }
        })
        return $(res)
    };
    //获取某个节点的下一个元素节点
    next(sele) {
        var res = [];
        if (arguments.length === 0) {

            // 返回所有找到的
            Base.each(this.elements,(i, val) => {
                var temp = Base.nextsibling(val);
                if (temp !== null) {
                    res.push(temp);
                }
            });
        } else {
            // 返回指定找到的
            Base.each(this.elements,(i, val) => {
                var temp = Base.nextsibling(val)
                $(sele).each(function (k, v) {
                    if (v === null || v !== temp) return;
                    res.push(v);
                });
            });
        }
        // 返回取得的元素组成的数组而且把数组解构成元素节点
        return $(...res);
    };

    //获取当前节点的上一个元素节点
    prev(sele) {
        var res = [];
        if (arguments.length === 0) {
            // 返回所有找到的
            Base.each(this.elements,(i, val) => {
                var temp = Base.previoussibling(val);
                if (temp === null) return;
                res.push(temp);
            });
        } else {
            // 返回指定找到的
            Base.each(this.elements,(i, val) => {
                var temp = Base.previoussibling(val);
                $(sele).each((index, v) => {
                    if (v === null || temp !== v) return;
                    res.push(v);
                })
            });
        }
        // 返回取得的元素而且把数组解构成nodelist
        return $(...res);
    };

    // 点击事件
    click(fn) {
        Base.each(this.elements,(i, val) => {
            val.onclick = fn
        })
        return this;
    };
    // 移入移出事件
    hover(over, out) {

        Base.each(this.elements,(i, val) => {
            val.onmouseover = over;
            val.onmouseout = out;
        })
        return this;
    };
   
    // 绑定事件
    bind(event, fn) {
        Base.each(this.elements,(i, val) => {
            Base.addEvent(val, event, fn);
        })
        return this;
    };
    //设置物体位置 ，记得要先设置 position: absolute;
    center(width, height) {
        Base.each(this.elements,(i, val) => {
            val.style.top = (Base.getClient().height - height) /
                2 - 20 + 'px';
            val.style.left = (Base.getClient().width - width) /
                2 + 'px';
        })
        return this;
    };
    // 进入事件   
    move(fn) {
        Base.each(this.elements,(i, val) => {
            val.onmousemove = fn
        })
        return this
    };
    // 离开事件    
    out(fn) {
        Base.each(this.elements,(i, val) => {
            val.onmouseout = fn
        })
        return this
    };
    // 进入事件，与move不同的是，这个事件发生在真正执行事件的元素   
    enter(fn) {
        Base.each(this.elements,(i, val) => {
            val.onmouseenter = fn
        })
        return this
    };
    // 离开事件，与out不同的是，这个事件发生在真正执行事件的元素   
    leave(fn) {
        Base.each(this.elements,(i, val) => {
            val.onmouseleave = fn
        })
        return this
    };
    // 显示
    show() {
        Base.each(this.elements, (i, val) => {
            val.style.display = 'block'
        })
        return this;
    };
    // 隐藏
    hide() {
        Base.each(this.elements, (i, val) => {
            val.style.display = 'none'
        })
        return this;
    };
    //  动画淡入  
    fadeIn() {
        // 设置opacity属性
        this.css('opacity', '0')
        
        Base.each(this.elements, (i, val) => {
          
            let current = parseInt(Base.getStyle('opacity', val)) 
            let finall = 100;
            var timer = setInterval(() => {
                let speed = (finall - current) / 100
               
                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
                
                current = current + speed
                val.style.opacity = (current /100)

                if (current ===100){
                  val.style.display = 'block'
                    clearInterval(timer)
                }
            })
          }, 20)
        return this;
    };
    // 动画淡出
    fadeOut(ev) {
        // 设置opacity属性
        this.css('opacity', '1')

        Base.each(this.elements, (i, val) => {

            let current = parseInt(Base.getStyle('opacity', val)) *100
            let finall = 0;
            var timer = setInterval(() => {
                let speed = -(finall - current) / 100

                speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)

                current = current - speed
                val.style.opacity = (current / 100)
                
                if (current === 0) {
                    clearInterval(timer)
                    val.style.display = 'none'
                }
            })
        }, 20)
        return this;
    }
    // 阻止冒泡/捕获
    stop(ev){
        ev.stopPropagation()
    };
    
}


const $ = function (val) {
    return new Base(val)
}
export {
    $,
    Base
}







