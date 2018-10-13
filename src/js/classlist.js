

function classlist(e) {
    if (e.classlist) {
        return e.classList
    } else {
        return new Cssclasslist(e)
    }
}

function Cssclasslist(e) {
    this.e = e
}
// 检测类名
Cssclasslist.prototype.contions = function (c) {

    try {
        if (!c.length || !c.includes('.')) throw '类名不存在'

    } catch (e) {
        console.log(e);
    };

    if (c.trim) c.trim()
    else {
        c.replace(/^\s+|\s$/, '')
    }
         
    if (typeof this.e === undefined) {
        throw new Error('类名不存在')
    }

    let el = this.e.className;
    let res = c.slice(c.indexOf('.') + 1)

    if (el.indexOf(res) !== -1) {
        return true
    }

}
// 添加类名
Cssclasslist.prototype.add = function (c) {

    if (this.contions(c)) return;

    let C = this.e.className;
    let res = c.slice(c.indexOf('.') + 1)

    if (C && C[C.length - 1] !== " ") {
        this.e.className += ' ' + res
    }
}
// 删除类名
Cssclasslist.prototype.remove = function (c) {

    if (c.length === 0 || c.includes(" ")) {
        throw new Error('不合法类名')
    }

    let reg = new RegExp("\\b" + c + "\\b\\s*", "g")
    this.e.className = this.e.className.replace(reg, '')

}
// 切换类名
Cssclasslist.prototype.toggle = function (c) {
    if (this.contions(c)) {
        this.remove(c);
        return false;
    }
    else {
        this.add(c);
        return true
    }
}

export {
    classlist
}

