

export default function animation(ele, json, fn) {

    clearInterval(ele.timer)
    ele.timer = setInterval( () => {

        let bool = true;

        for (var k of Object.keys(json)) {
            let current;
              
            if (k === "opacity") current = window.getComputedStyle(ele, null)[k] * 100 || 1
            else {
                current = parseInt(window.getComputedStyle(ele, null)[k]) || 0
            }
             
            let speed = (json[k] - current) / 10

            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed)
             
            // 距离累加
            current = current + speed
              
            switch (k) {
                case "opacity": 
                    ele.style[k] = current / 100;
                    
                     if (ele.style[k] <= 0) {
                         ele.style.display = 'none';
                     }
                    break;
                case "zIndex": 
                    ele.style[k] = current;
                    break;
                default:
                    ele.style[k] = current + "px";
                    break;
            }
            if (json[k] !== current) {
                bool = false
            }
        }
        // 存在则清除定时器
        if (bool) {
            clearInterval(ele.timer);
            if (fn) {
                fn()
            }
        }

    }, 25)
}

