

import '@/css/base.css'
import '@/css/apple.css'
import '@/css/font2/style.css'

import ajax from './ajax.js'
import {classlist} from './classlist.js'
import { $ } from './jq.js'

// 热更新
if (module.hot) {
    module.hot.accept()
}
     init()
  
//  初始化
    function init(){

        let doc = document;
        window.data = 'DATA';
        let Location = doc.querySelector('.location');
        let address = doc.getElementsByClassName('address')[0];
        let oli = address.getElementsByTagName('ul')[0];
        let html,str;

        //  接受数据
        ajax.getJSON("GET", "../test.json", true).then(function (Json) {

             let JsonData = Json[0].address

                for (let i = 0; i < JsonData.length; i++) {
                    html +=`<li><a href="javascript:;" class="As">${JsonData[i]}</a></li>`
                }
            //    处理html元素
                str = [...html.split('undefined')].join('');
                oli.innerHTML = str;

            let oA = document.querySelectorAll('.address_list li a')
        
            let DATA = JSON.parse(window.localStorage.getItem(data || '北京'))
            // 如果本地存储不存在
                    if (!DATA) {
                        Location.innerText = '北京';

                        oA.forEach((item, index) => {
                            if (index === 0) {
                                classlist(item).toggle('.now')
                            }
                        })
                    } else {
                      
                        for (const iterator of oA) {
                            if (iterator.innerText === DATA) {
                                classlist(iterator).toggle('.now')
                                Location.innerText = DATA
                            }
                        }

                    }
            
         address.onclick = function (ev) {
                var ev = ev
                var target = ev.target;
        
             oA.forEach(item => {
                 
                classlist(item).remove('.now');

                 if (target.nodeName.toLowerCase() === 'a') {
                        classlist(target).add('.now')
                        Location.innerText = target.innerText
                    }
             })              
                window.localStorage.setItem(data, JSON.stringify(Location.innerText))
            }
                
        }, function (error) {
            console.error('出错了', error);
        });
      
        Location.innerText = JSON.parse(window.localStorage.getItem(data || '北京'))
        // return 
 }

function show(){
    var timer;
    $('#sit').hover(function () {
        $('.new_address').addClass('show');
        clearTimeout(timer)
    }, function () {
        timer = setTimeout(() => {
            $('.new_address').removeClass('show')
        }, 500)
    })
    $('.new_address').hover(function () {
        clearTimeout(timer);
        $('.new_address').addClass('show')
    }, () => {
        timer = setTimeout(() => {
            $('.new_address').removeClass('show')
        }, 500)
    })
}
show()


function dialog(){
    $('.love').bind('click',(ev) => {
        $('.bomb_box').fadeIn()
        $(this).stop(ev)
    })
    $('.close').click((ev) => {        
        $('.bomb_box').fadeOut()
        $(this).stop(ev)
    })
}
dialog()

function tab() {

        $('#diya li').click(function () {
            var index = $(this).index()
           $(this).siblings().removeClass('on')
           $(this).addClass('on')
            var $div = $('#wrap div').eq(index);
            $div.siblings().removeClass('show')
            $div.addClass('show')
        })
}

tab()

function magnifier(){
        $('.big');

        $('.small').move((ev) => {
            // 获取自身
            let mask = $('.mask').first();
            $('.big').show()
            //ev.clientX当前鼠标可视区位置

              //初始化，使方形箭头处于黄色区域中间
            let maskX = ev.pageX - $('.small').parentElement().offsetLeft - (mask.offsetWidth / 2);
            let maskY = ev.pageY - $('.small').parentElement().offsetTop - (mask.offsetHeight / 2);
            
            // 方形箭头超过大图片X轴的范围则执行对应操作
            if (maskX >= 0 && maskX <= $('.small').parentElement().offsetWidth - mask.offsetWidth) {
                maskX = maskX + "px";
            } else if (maskX < 0) {
                maskX = 0 + "px";
            } else if (maskX > $('.small').parentElement().offsetWidth - mask.offsetWidth) {
                maskX = $('.small').parentElement().offsetWidth - mask.offsetWidth + "px";
            };
            
             // 方形箭头超过大图片Y轴的范围则执行对应操作
            if (maskY >= 0 && maskY <= $('.small').parentElement().offsetWidth - mask.offsetHeight) {
                maskY = maskY + "px";
            } else if (maskY < 0) {
                maskY = 0 + "px";
            } else if (maskY > $('.small').parentElement().offsetWidth - mask.offsetHeight) {
                maskY = $('.small').parentElement().offsetWidth - mask.offsetHeight + "px";
            }
            //  小图片的距离
            mask.style.left = maskX;
            mask.style.top = maskY;

           let Left =  -(800 / 350) * parseInt(mask.style.left)
           let Top = -(800 / 350) * parseInt(mask.style.top)
             
            $('#bigImg').css('left',Left+'px')
            $('#bigImg').css('top',Top+'px')

        })

        $('.small').out(() =>{
            $('.big').hide()
        }) 

}

magnifier()





