
import animation from './animate.js'
import Swiper from 'swiper'
import ajax from "./ajax.js";
import { classlist } from './classlist.js'
import { $ } from './jq.js'

// es7
import 'babel-polyfill'

// import '@/css/swiper.min.css';
import '@/css/base.css';
import '@/css/index.css';
import '@/css/font/style.css';
import '@/css/seckill.css';


// 热更新
if (module.hot) {
  module.hot.accept()
}

window.onload=function(){


     show();
  
     hide();

     search();
      //  轮播图
     carousel();

     seckill();
     tab()

}



  // 多图轮播图
   new Swiper('.swiper-container', {
      slidesPerView: 3,
      spaceBetween: 6,
      slidesPerGroup: 3,
      loop: true,
      loopFillGroupWithBlank: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    // 显示隐藏
  function show(){    
    var timer;  
           
    $('#cate').hover(function(){
        $('.cate_part').show();
      clearTimeout(timer)
    },function(){
      timer = setTimeout(() => {
        $('.cate_part').hide()
      },500)
    })

    $('.cate_part').hover(function(){
        clearTimeout(timer);
        $('.cate_part').show()
    },() =>{
      timer = setTimeout(()=> {
        $('.cate_part').hide()
      },500)
    })

 };
     // 选项卡切换
      function tab() {
        // 箭头函数内没有this
        $('.bottom ul').children().enter(function () {
          $('.bottom ul').children().attr('class', '');
          $('#wrap div').css('display', 'none')
          $(this).attr('class', 'on');
          $('#wrap div').eq($(this).index()).css('display', 'block');
        })
      }

  //动画隐藏顶栏
   var hide = function() {
     
     $('.close-banner').click(() => {  
       let json = {"opacity":0};
      //  获取自身
       var navImg = $('.top-nav').first();
       animation(navImg, json)
   })
   
}

  //搜索框
  function search(){
      
       ajax.getJSON('GET','../test.json',true).then((json) => {
              
          let str = json[0].goods.slice(0,json[0].goods.indexOf('刺身百香果'))
          let index = 0;
          let timer;
          timeout();

          function timeout() {
            $('#sea').attr('placeholder',`${str[index]}`)
                index++;
              if (index > str.length - 1) {
                index = 0;
              }
          }
          //赋值
          timer = setInterval(timeout, 3000);
          
          $('#form').move( () => {
            clearInterval(timer);
          })
          //离开再次开启
         $('#form').out( () => {
            timer = setInterval(timeout, 3000);
          })
        }, (err) => {
          console.log(err);
        })
      }

 // 轮播图
    var carousel = function () { 

      let banner = document.querySelector('.carousel');
      let [imageBox, prev, next, pointBox] = [...banner.children];
      
      let oli = pointBox.getElementsByTagName('a');
      let width = banner.offsetWidth;
      let timer = null;
      let index = 1;
              
   
      let addTransition = () => {
        imageBox.style.webkitTransition = "all .5s";
        imageBox.style.mozTransition = "all .5s";
        imageBox.style.transition = "all .5s";
      };
      let removeTransition = () => {
        imageBox.style.webkitTransition = "none";
        imageBox.style.mozkitTransition = "none";
        imageBox.style.transition = "none";
      };

      let setTranslateX = (translateX) => {
        imageBox.style.webkitTransform = "translateX(" + translateX + "px)";
        imageBox.style.mozkitTransform = "translateX(" + translateX + "px)";
        imageBox.style.transform = "translateX(" + translateX + "px)";
      };

       clearInterval(timer)

   // 设置向右自然滚动 
   function time(){

    timer = setInterval( () => {
        index++;
        // 过渡      
        addTransition();        
        // 改变位移   
        setTranslateX(-index*width); 
        setPoint();    
       }, 4000);
    }
  
   time();
     //绑定过渡结束事件   设置无缝滚动和无缝滑动
   banner.addEventListener('transitionend', function(){    
         //无缝滚动            
        if (index >= 5) {
          index = 1;                                  
        // 清除过渡    
         removeTransition();     
          //定位                
         setTranslateX(-index*width);          
          }
          //无缝滑动
        else if (index <= 0) {
            index = 4;            
            removeTransition();
            setTranslateX(-index*width);    
          }  
         setPoint();      
   });
    
     // 点移动
     function setPoint(){    
      for (let i = 0; i < oli.length; i++) {   	   
          classlist(oli[i]).remove('.now');
        classlist(oli[index - 1]).add('.now');
      }
    };

   banner.onmouseover = function () {
     clearInterval(timer);
   }

   banner.onmouseout = function () {
      time();
   }   
   
    //向左滚动事件
   prev.onclick = function() {
     setPoint();

      index--;        	    	
    // imageBox.style.left = -index*width+'px';
    imageBox.style.transition = 'all 0.5s';
    imageBox.style.transform ='translateX('+(-index*width)+'px)';
      
      // 添加过渡结束事件
       clearInterval(timer);  
     banner.addEventListener('transitionend', function() {
          if (index <= 0) index = 4;
           
           removeTransition();                  
           setTranslateX(-index*width);          
       },false);
      
    }   

  // 向右滚动
    next.onclick = function() {  
       setPoint();
       index++;     
    imageBox.style.transition = 'all 0.5s';
    imageBox.style.transform ='translateX('+(-index*width)+'px)';
     // 添加过渡结束事件
     clearInterval(timer);
      banner.addEventListener('transitionend', function() {
           if(index >= 5 ) index = 1;
                                 
       });            	
    }
  
 // 获取当前索引值
     for (let i = 0; i < oli.length; i++) {         
            oli[i].index = i
     	oli[i].onmousemove = function() {
     		   for (let i = 0; i < oli.length; i++) {
     		    
                  classlist(oli[i]).remove('.now');
                  classlist(oli[this.index]).add('now'); 
     		     }   
          imageBox.style.transition = 'all 0.5s';
          imageBox.style.transform = 'translateX(' + (-[this.index + 1] * width) + 'px)';                   
          index = [this.index+1];
     	}
     }

  }  
 

  var seckill = function () {

    /*需要倒计时的时间*/
    let time = 24 * 60 * 60;
    let span = $('.SecKill-left').eq(0).find('span');

    //初始化
    setInterval(timer, 1000);
    function timer() {
      if (time <= 0){
        clearInterval(timer);
        return false;
      }
      time--;

      /*格式化*/
      let h = Math.floor(time / 3600);
      let m = Math.floor(time % 3600 / 60);
      let s = time % 60;
      
      // 封装的foreach方法
      span.foreach((i,val) => {
        switch (i) {
          case 0:
            val.html(Math.floor(h / 10));
            break;
          case 1:
            val.html((h % 10));
            break;
          case 3:
            val.html(Math.floor(m / 10));
            break;
          case 4:
            val.html(m % 10);
            break;
          case 6:
            val.html(Math.floor(s / 10));
            break;
          case 7:
            val.html(s % 10);
            break;
          default:
            break;
        }
      });
    }

    timer();
  }


console.log($('.bottom ul').children());
  



