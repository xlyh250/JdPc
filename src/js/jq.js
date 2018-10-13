
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
        } else if (typeof args === 'object' && !Array.isArray(args)) {
            if (args !== undefined) {    //_this是一个对象，undefined也是一个对象，区别与typeof返回的带单引号的'undefined'
                this.elements[0] = args;
            }
            // 如果是数组
        } else if (Array.isArray(args)) {
               console.log(args);
               
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

    getClass(className, parent=document) {

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
      return val.every(function(val,i,arr){
          return arr[0] === val
      })
    }
}

class Base extends Parent {

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
   
    // 遍历对象元素
    each(fn) {
        // 1.判断是否是数组
        if (Array.isArray(this.elements)) {
            for (var i = 0; i < this.elements.length; i++) {
                // var res = fn(i, this.elements[i]);
                var res = fn.call(this.elements[i], i, this.elements[i]);
               
                //返回true跳过
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
                var res = fn.call(this.elements[key], key, this.elements[key]);
                
                //返回true跳过
                if (res === true) {
                    continue;
                } else if (res === false) {
                    break;
                }
            }
        }
        return this
    };
    // 连缀调用遍历元素
    foreach(fn) {
        let arr = []
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
    css(attr, value) {

        this.each( (i, val) =>{
            if (arguments.length === 1) {
                if (window.getComputedStyle) {
                    return window.getComputedStyle(val, null)[attr]
                }
            }
            val.style[attr] = value;
        })

        return this;

    };

    // 添加class
    addClass(classs) {
        // 变量需要用new RagExp
        // let reg = new RegExp("(\\s|^)"+classs+"(\\s|$)","g")
        this.each( (i, val) =>{
            //  hasclass第二个参数名字要与addclass参数名相同
            if (!Base.hasClass(val, classs)) {

                if (val.className === '') {
                    val.className = '' + classs;
                } else {
                    val.className += ' ' + classs;
                }
            }
        })
        return this
    };

    // 删除class
    removeClass(classname) {
        let reg = new RegExp("(\\s|^)" + classname + "(\\s|$)", "g")
        // macth类似indexOf
        this.each( (i, val) =>{
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
            this.each( (i, val) =>{
                
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
            this.each( (i, val) =>{
                val.innerText = text
            })
        }
        return this;
    };
    // 返回指定位置
    index(){
        // 通过查找父元素找到子元素
        let children = this.elements[0].parentNode.children;
            for (let i = 0; i < children.length; i++) {
                if (this.elements[0] === children[i]) return i;
            }
    };
    // 获取子元素节点
    children() {
        var res = [];

       this.each((i,val) => {
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
            this.each( (i, val) =>{
                val.setAttribute(attr, value);
            })
        }
        return this;
    };
    // 获取其他兄弟元素
    siblings() {
        var res = []
        this.each( (i, val) =>{

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
            this.each( (i, val) =>{
                var temp = Base.nextsibling(val);
                if (temp !== null) {
                    res.push(temp);
                }
            });
        } else {
            // 返回指定找到的
            this.each( (i, val) =>{
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
            this.each( (i, val) => {
                var temp = Base.previoussibling(val);
                if (temp === null) return;
                res.push(temp);
            });
        } else {
            // 返回指定找到的
            this.each( (i, val) => {
                var temp = Base.previoussibling(val);
                $(sele).each( (index, v) => {
                    if (v === null || temp !== v) return;
                    res.push(v);
                })
            });
        }
        // 返回取得的元素而且把数组解构成nodelist
        return $(...res);
    };

    // 点击
    click(fn) {
        this.each( (i, val) =>{
            val.onclick = fn
        })
        return this;
    };
    // 移入移出
    hover(over, out) {

        this.each( (i, val) =>{
            val.onmouseover = over;
            val.onmouseout = out;
        })
        return this;
    };
    // 显示
    show() {
        this.each( (i, val) =>{
            val.style.display = 'block'
        })
        return this;
    };
    // 隐藏
    hide() {
        this.each( (i, val) =>{
            val.style.display = 'none'
        })
        return this;
    };
    // 绑定事件
    bind(event, fn) {
        this.each( (i, val) =>{
            Base.addEvent(val, event, fn);
        })
        return this;
    };
    //设置物体位置 ，记得要先设置 position: absolute;
    center(width, height) {
        this.each( (i, val) =>{
            val.style.top = (Base.getClient().height - height) /
                2 - 20 + 'px';
            val.style.left = (Base.getClient().width - width) /
                2 + 'px';
        })
        return this;
    };

    move(fn) {
        this.each( (i, val) =>{
            val.onmousemove = fn
        })
        return this
    };
    out(fn) {
        this.each( (i, val) =>{
            val.onmouseout = fn
        })
    };

    enter(fn) {
        this.each((i,val) => {
                val.onmouseenter = fn
        })
        console.log(66);
        return this
    }

}


 const $ = function(val){
           return new Base(val)
        }
  export{
      $,
      Base
  }






