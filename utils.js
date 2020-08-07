// 获取元素样式，兼容谷、歌火狐、IE678
function getStyle(dom,attr){
    if (dom.currentStyle) {//IE
        return dom.currentStyle[attr];
    } else {
        return getComputedStyle(dom,null)[attr];
    }
}

// 获取下一个兄弟节点
function getNextNode(dom){
    if (dom.nextElementSibling) {
        return dom.nextElementSibling;
    } else {
        return dom.nextSibling;
    }
}

// 获取上一个兄弟节点
function getPrevNode(dom){
    if (dom.previousElementSibling) {
        return dom.previousElementSibling;
    } else {
        return dom.previousSibling;
    }
}

// 获取第一个子节点
function getFirstNode(dom){
    if (dom.firstElementChild) {
        return dom.firstElementChild;
    } else {
        return dom.firstChild;
    }
}

// 获取最后一个子节点
function getLastNode(dom){
    if (dom.lastElementChild) {
        return dom.lastElementChild;
    } else {
        return dom.lastChild;
    }
}

// 生成6位随机验证码（数字、字母（大小））
function randomCode(){
    var arr = [1,1,1,1,1,1];
    for (var i in arr){
        do {
            var ascii = randomInt(48,122);
        } while((ascii > 57 && ascii < 65) || (ascii > 90 && ascii < 97));
        arr[i] = String.fromCharCode(ascii);
    }
    return arr.join('');
}

// 生成区间随机整数
function randomInt(min,max){
    return Math.round(Math.random()*(max-min))+min;
}

// 生成随机的十六进制颜色值 # 
function randomColor(){
    var str = '0123456789abcdef';
    var col = '#';
    for (var i = 0; i < 6; i++){
        var index = randomInt(0,15);
        col += str[index];
    }
    return col;
}

// 添加事件监听（兼容低版本浏览器）
function addEvent(dom,type,cb){
    if (dom.attachEvent) {
        dom.attachEvent('on'+type,cb);
    } else {
        dom.addEventListener(type,cb);
    }
}

// 移除事件监听（兼容低版本浏览器）
function removeEvent(dom,type,cbName){
    if (dom.detachEvent) {
        dom.detachEvent('on'+type,cbName);
    } else {
        dom.removeEventListener(type,cbName);
    }
}

// 事件委托封装
function on(parent,type,selector,callback){
    addEvent(parent,type,function (ev){
        var e = ev || event;//事件对象
        var target = e.target || e.srcElement;//事件源
        // 获取选择器第一个字符（ . ）
        var sel_first = selector.substr(0,1);
        // 记录第一个字符之后的属性值（ add ）
        var sel_last = null;
        // 记录选择器类型（id className tagName）
        var sel_type = null;
        // 判断传入的是什么选择器
        switch(sel_first){
            case '.': // 类选择器
                sel_last = selector.slice(1);
                sel_type = 'className';
                break;
            case '#': // id选择器
                sel_last = selector.slice(1);
                sel_type = 'id';
                break;
            default:
                sel_last = selector;
                sel_type = 'tagName';
        }

        // 只有传入selector元素被点击时触发
        if (sel_type === 'tagName') {
            // 如果是标签选择器，转成大写
            sel_last = sel_last.toUpperCase();
        }
        if (target[sel_type] === sel_last){
            // callback(e);
            callback.call(target,e);
        }

        // 判断target是否为selector元素或selector的子元素
        // while(target !== parent){
        //     if (sel_type === 'tagName') {
        //         // 如果是标签选择器，转成大写
        //         sel_last = sel_last.toUpperCase();
        //     }
        //     if (target[sel_type] === sel_last) {
        //         // callback(e);
        //         callback.call(target,e);
        //     }
        //     target = target.parentNode;
        // }
    });
}

// 支持的属性：left  top   right  bottom  width  height  marginLeft  marginTop  ... 属性值带单位px的属性
// 支持 透明度切换，支持 scrollLeft  scrollTop
// 支持多属性同时运动
// function animate(dom,attr,target){// 单属性  当前值 -> 目标值
function animate(dom,attr_obj,callback){// 多属性  当前值 -> 目标值
    // 获取每一个属性的current和target，重新整理attr_obj对象
    // attr_obj = {
    //     'width': {
    //         'current': 属性当前值,
    //         'target': 300
    //     },
    //     'height': {
    //         'current': 属性当前值,
    //         'target': 300
    //     },
    //     ...
    // }
    for (var attr in attr_obj){
        // 获取当前值和目标值
        if (attr === 'opacity') {
            var current = parseInt( getComputedStyle(dom,null)[attr]*100 );
            var target = attr_obj[attr]*100;
        } else if ( attr.indexOf('scroll') !== -1 ) {
            var current = dom[attr];
            var target = attr_obj[attr];
        } else {
            var current = parseInt( getComputedStyle(dom,null)[attr] );
            var target = attr_obj[attr];
        }
        attr_obj[attr] = {
            'current': current,
            'target': target
        }
    }
    
    clearInterval(dom.timer);
    dom.timer = setInterval(function (){
        for (var attr in attr_obj){
            var current = attr_obj[attr].current;
            var target = attr_obj[attr].target;
            // 不断变化的速度
            var speed = (target - current) / 10;
            // 小数计算有误差，容易造成数据丢失 => 取整
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            // 判断到达目的地：剩余运动量 <= 每次的运动量
            if (Math.abs(target - current) <= Math.abs(speed)) {
                if (attr === 'opacity') {
                    dom.style[attr] = target / 100;
                } else if (attr.indexOf('scroll') !== -1) {
                    dom[attr] = target;
                } else {
                    dom.style[attr] = target + 'px';
                }
                // 从attr_obj对象中删除已完成运动的属性
                delete attr_obj[attr];

                // 如果对象中还有其他属性，此时不应该终止计时器
                for (var key in attr_obj){
                    // 有其他属性未完成动画
                    return;
                }

                // console.log( '运动结束' );
                clearInterval(dom.timer);//终止计时器
                // if (callback) {
                //     callback();
                // }
                // callback ? callback() : '';
                typeof callback === 'function' ? callback() : '';
            } else {
                // 此时不能直接使用current，因为它是一个临时变量
                // current += speed;
                // 使用对象中的数据进行累加
                attr_obj[attr].current += speed;
                if (attr === 'opacity') {
                    dom.style[attr] = attr_obj[attr].current / 100;
                } else if (attr.indexOf('scroll') !== -1) {
                    dom[attr] = attr_obj[attr].current;
                } else {
                    dom.style[attr] = attr_obj[attr].current + 'px';
                }
            }
        }
    },20);
}

// dom.offsetParent 指向离他最近定位父级
// 获取元素到body的距离(包含父级边框)
function offset(dom,bool){
    var l = 0, t = 0;
    var bdleft = dom.clientLeft;//初始元素的左边框
    var bdtop = dom.clientTop;//初始元素的上边框
    while(dom){
        l = l + dom.offsetLeft + dom.clientLeft;
        t = t + dom.offsetTop + dom.clientTop;
        dom = dom.offsetParent;
    }
    if (bool) {
        // 元素边框外侧到body的距离
        return {left: l-bdleft, top: t-bdtop};
    } else {
        // 元素内容外侧到body的距离
        return {left: l, top: t};
    }
    
}

// 获取url中的某个参数值
function getQueryString(key){
    var url = location.href;
    var searchStr = url.split('?')[1];
    var reg = new RegExp('[&]?'+key+'=([^&#]*)[&]?','i');
    var arr = searchStr.match(reg);
    // console.log(arr[1]);
    // console.log( RegExp.$1 );
    return (RegExp.$1);
}

// 判断是否为对象
function isObject(obj){
    if (Object.prototype.toString.call(obj) === '[object Object]'){
        return true;
    }
    return false;
}

// ajax封装
function ajax(options){
    // 1.创建XMLHttpRequest对象（数据交互对象或ajax对象）
    var xhr = new XMLHttpRequest();// 除了IE56其他都支持
    // var xhr = new ActiveXObject('Microsoft.XMLHTTP');//IE56

    // 对传入参数进行格式化 'abc=123&www=baidu'
    var data = '';
    if (typeof options.data === 'string') {
        data = options.data;
    }
    // if (typeof options.data === 'object'&&options.data.constructor === 'Obejct'&& options.data !== null) {
    if ( isObject(options.data) ){
        for (var key in options.data){
            data += key+'='+options.data[key]+'&';
        }
        // 'abc=123&www=baidu&'
        data = data.substring(0,data.length-1);
        // 'abc=123&www=baidu'
    }

    if (options.type.toLowerCase() === 'get') {
        xhr.open(options.type,options.url+'?'+data+'&_='+Date.now());
        xhr.send(null);
    }else if (options.type.toLowerCase() === 'post'){
        xhr.open(options.type,options.url);
        // POST请求需要在send之前设置请求头，模拟表单的post提交
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        // 3.发送请求
        xhr.send(data);//post请求要发送的数据放参数里面
    } else {
        alert('目前只支持get和post请求方式');
        return false;
    }

    // 4.请求/响应状态
    // xhr.readyState  0-4
    // xhr.readyState属性发送变化时会触发一个事件，readystatechange
    xhr.onreadystatechange = function (){
        // console.log( xhr.readyState );// 2 3 4
        if (xhr.readyState === 4) {// 请求完成状态
            // http状态码 xhr.status
            if (xhr.status >= 200 && xhr.status < 300) {// 请求成功，可以拿到数据
                // xhr.responseText  返回文本数据
                // xhr.responseXML  返回 XML数据
                if (options.dataType === 'xml') {
                    options.success(xhr.responseXML);
                } else {
                    options.success(xhr.responseText);
                }
            } else {
                options.error(xhr.status);
            }
        }
    }
}

// 基于promise封装ajax
function pajax(options){
    return new Promise((resolve,reject)=>{
        // 1.创建XMLHttpRequest对象（数据交互对象或ajax对象）
        var xhr = new XMLHttpRequest();// 除了IE56其他都支持
        // var xhr = new ActiveXObject('Microsoft.XMLHTTP');//IE56

        // 对传入参数进行格式化 'abc=123&www=baidu'
        var data = '';
        if (typeof options.data === 'string') {
            data = options.data;
        }
        // if (typeof options.data === 'object'&&options.data.constructor === 'Obejct'&& options.data !== null) {
        if ( isObject(options.data) ){
            for (var key in options.data){
                data += key+'='+options.data[key]+'&';
            }
            // 'abc=123&www=baidu&'
            data = data.substring(0,data.length-1);
            // 'abc=123&www=baidu'
        }

        if (options.type.toLowerCase() === 'get') {
            xhr.open(options.type,options.url+'?'+data+'&_='+Date.now());
            xhr.send(null);
        }else if (options.type.toLowerCase() === 'post'){
            xhr.open(options.type,options.url);
            // POST请求需要在send之前设置请求头，模拟表单的post提交
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            // 3.发送请求
            xhr.send(data);//post请求要发送的数据放参数里面
        } else {
            alert('目前只支持get和post请求方式');
            return false;
        }

        // 4.请求/响应状态
        // xhr.readyState  0-4
        // xhr.readyState属性发送变化时会触发一个事件，readystatechange
        xhr.onreadystatechange = function (){
            // console.log( xhr.readyState );// 2 3 4
            if (xhr.readyState === 4) {// 请求完成状态
                // http状态码 xhr.status
                if (xhr.status >= 200 && xhr.status < 300) {// 请求成功，可以拿到数据
                    // xhr.responseText  返回文本数据
                    // xhr.responseXML  返回 XML数据
                    if (options.dataType === 'xml') {
                        resolve(xhr.responseXML);
                    } else {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(xhr.status);
                }
            }
        }
    })
}

// jsonp封装
function jsonp(options){
    // 把options.success变成全局函数
    window[options.jsonpCallback] = options.success;

    // 格式化参数
    var data = '';
    if (typeof options.data === 'string') {
        data = options.data;
    }
    if (isObject(options.data)) {
        for (var key in options.data){
            data += key+'='+options.data[key]+'&';
        }
        data = data.substring(0,data.length-1);
    }

    // 创建 script 标签
    var oScript = document.createElement('script');
    // 把数据地址、参数、回调函数拼接赋值给src
    oScript.src = options.url+'?'+data+'&'+options.jsonp+'='+options.jsonpCallback;
    // 添加到body中
    document.body.appendChild(oScript);
    // 数据加载完成后删除script标签
    oScript.onload = function (){
        document.body.removeChild(oScript);
    }
}

// 获取元素
function $1(selector){
    return document.querySelector(selector);
}
function $2(selector){
    return document.querySelectorAll(selector);
}
