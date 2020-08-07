      var mask = document.querySelector(".mask");
      var left = document.querySelector(".left");
      var right = document.querySelector(".right");
      window.onscroll=function(){
          console.log(document.documentElement.scrollTop);
      }
      
      left.onmousemove = function (e) {
          var bodyTop=document.body.scrollTop;
          right.style.display = "block";
          mask.style.display = "block";
          var e = e || event;
          var l = e.clientX - offset(left, false).left - 100;
          var t = e.clientY - offset(left, false).top - 100+document.documentElement.scrollTop;
          if (l <= 0) {
              l = 0;
          } else if (l >= 159) {
              l = 159;
          }
          if (t <= 0) {
              t = 0;
          } else if (t >= 159) {
              t = 159;
          }
          mask.style.left = l + "px";
          mask.style.top = t + "px";
          var scaleL = l / (359 - 200);
          var scaleT = t / (359 - 200);
          right.style.backgroundPositionX = -500 * scaleL + "px";
          right.style.backgroundPositionY = -500 * scaleT + "px";
      };
      left.onmouseleave = function (e) {
          mask.style.display = "none";
          right.style.display = "none";
      };




      //tab选项卡

      var imgs = document.querySelectorAll(".tab img");
      var ld = document.querySelector(".l-de");
      var rd = document.querySelector(".r-de");
      var tab = document.querySelector(".tab");
      for (var i = 0; i < imgs.length; i++) {
          imgs[i].index = i;
          imgs[i].onmouseenter = function () {
              for (var i = 0; i < imgs.length; i++) {

                  imgs[i].style.border = "2px solid #fff";

              }
              imgs[this.index].style.border = "2px solid red";
              var num = imgs[this.index].src.indexOf("img");
              left.style.background = "url(" + imgs[this.index].src.slice(num) + ") no-repeat";
              left.style.backgroundSize = "360px 360px";

              right.style.background = "url(" + imgs[this.index].src.slice(num) + ") no-repeat";
              right.style.backgroundSize = "1000px 1000px";
          }
          imgs[i].onmouseleave = function () {
              // imgs[this.index].style.border="2px solid #fff";
          }
      }
      console.log(tab.scrollLeft);
      var timer, timer2;
      ld.onclick = function () {
        //   animate(tab,{
        //       scrollLeft:0
        //   })
        timer=setInterval(function(){
            if(tab.scrollLeft>0){
                tab.scrollLeft-=5;
            };
            if(tab.scrollLeft<=0){
                tab.scrollLeft=0;
                clearInterval(timer);
            }
        },1);
    }
      
      rd.onclick = function () {
        // animate(tab,{
        //     scrollLeft:322
        // })
        timer2=setInterval(function(){
            if(tab.scrollLeft<322){
                tab.scrollLeft+=5;
            };
            if(tab.scrollLeft>=322){
                tab.scrollLeft=322;
                clearInterval(timer2);
            }
        },1);
      }

      function offset(dom, bool) {
          var l = 0,
              t = 0;
          var bdleft = dom.clientLeft; //初始元素的左边框
          var bdtop = dom.clientTop; //初始元素的上边框
          while (dom) {
              l = l + dom.offsetLeft + dom.clientLeft;
              t = t + dom.offsetTop + dom.clientTop;
              dom = dom.offsetParent;
          }
          if (bool) {
              // 元素边框外侧到body的距离
              return {
                  left: l - bdleft,
                  top: t - bdtop
              };
          } else {
              // 元素内容外侧到body的距离
              return {
                  left: l,
                  top: t
              };
          }

      }



      //ajax
      var pps=document.querySelectorAll(".sizeRight p");
      var title=document.querySelector(".tit");
      for(var i=0;i<pps.length;i++){
          pps[i].index=i;
          pps[i].onclick=function(){
            // var _this=this;

            // ajax({
            //     url:'./tits.json',
            //     type:'get',
            //     data:{},
            //     dataType:'json',
            //     success:function(data){
            //         var json=JSON.parse(data);
            //         console.log(json[_this.index]);
            //     },
            //     error:function(){
            //         alert(status)
            //     }
            // });

            // var data=this.innerText;
            // var _this=this;
            //   var xhr = new XMLHttpRequest();
            //   xhr.open('get','./tits.json',true);
            //   xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            //   xhr.send();
            //   xhr.onreadystatechange = function (){
            //     if (xhr.readyState === 4) {// 请求完成状态
            //         if (xhr.status >= 200 && xhr.status < 300) {// 请求成功，可以拿到数据
            //             var json = JSON.parse(xhr.responseText);//转成json对象
            //             console.log(json[_this.index].tit);
            //             // json.forEach(item => {
                            
            //             //     if(item.small_tit===data){
            //             //         console.log(12);
            //             //         console.log(item.tit);
            //             //         title.innerText = item.tit;
            //             //     }
            //             //     // show.innerHTML += `<p>${item.title}</p>`;
            //             // });
            //         } else {
            //             console.log(xhr.status);
            //         }
            //     }
            // }



               var _this=this;
              var data=this.innerText;
              var xhr = new XMLHttpRequest();
              xhr.open('get','./tits.json',true);
              xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
              xhr.send();
              xhr.onreadystatechange = function (){
                if (xhr.readyState === 4) {// 请求完成状态
                    if (xhr.status >= 200 && xhr.status < 300) {// 请求成功，可以拿到数据
                        var json = JSON.parse(xhr.responseText);//转成json对象
                        json.forEach(item => {
                            
                            if(item.small_tit===data){
                                console.log(12);
                                console.log(item.tit);
                                title.innerText = item.tit;
                            }
                            // show.innerHTML += `<p>${item.title}</p>`;
                        });
                    } else {
                        console.log(xhr.status);
                    }
                }
            }
          }
      }
      
      
      //右边轮播图
      var curWrap=document.querySelector(".curWrap");
      var cur=document.querySelector(".cur");
      var curTop=document.querySelector(".curTop");
      var curBot=document.querySelector(".curBot");
      curTop.onclick=function(){
          animate(curWrap,{
              scrollTop:0
          })
      }
      curBot.onclick=function(){
        animate(curWrap,{
            scrollTop:450
        })
    }
      
      // 判断是否为对象
function isObject(obj){
    if (Object.prototype.toString.call(obj) === '[object Object]'){
        return true;
    }
    return false;
}
 

        //动画封装
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


   