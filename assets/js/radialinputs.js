// Based on https://codepen.io/MyXoToD/pen/xGRrgQ

var RADIAL = function(circle, button, input, defaultvalue){
    let is_dragging = false;
    this.colors = input;
    
    button.style.transform = "rotate(" + (defaultvalue-1)*36 + "deg)";
    input.innerHTML = defaultvalue;
    input.dataset.key = defaultvalue;

    
    circle.addEventListener("mousedown", () => is_dragging = true, {passive: true});
    circle.addEventListener("touchstart", () => {
        is_dragging = true;       document.body.classList.add('disableScroll');
    }, {passive: true});
    document.addEventListener("mouseup", () => {
        is_dragging = false; 
    });
    document.addEventListener("touchend", () => {
        is_dragging = false;
        document.body.classList.remove('disableScroll');
    });
    
    var changeValue = function(e) {
        let angle, center_x, center_y, delta_x, delta_y, pos_x, pos_y, touch, value;
        
        if (is_dragging) {

//        circle = document.querySelector(".circle");
        touch = void 0;
        if (e.touches) {
            touch = e.touches[0];
        }
            
        center_x = (circle.offsetWidth / 2) + circle.getBoundingClientRect().left;
        center_y = (circle.offsetHeight / 2) + circle.getBoundingClientRect().top;
            
        pos_x = e.clientX || touch.clientX;
        pos_y = e.clientY || touch.clientY;
            
        delta_y = center_y - pos_y;
        delta_x = center_x - pos_x;
            
        angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI); // Calculate Angle between circle center and mouse pos
        angle -= 90;
            
        if (angle < 0) {
            angle = 360 + angle; // Always show angle positive
        }
            
        angle = Math.round(angle);
            
        if (angle < 60 && angle >= 20){
            angle = 40;
            value = 3;
        } else if (angle < 100 && angle >= 60){
            angle = 80;
            value = 4;
        } else if (angle < 140 && angle >= 100){
            angle = 120;
            value = 5;
        } else if (angle < 180 && angle >= 140){
            angle = 160;
            value = 6;
        } else if (angle < 220 && angle >= 180){
            angle = 200;
            value = 7;
        } else if (angle < 260 && angle >= 220){
            angle = 240;
            value = 8;
        } else if (angle < 300 && angle >= 260){
            angle = 280;
            value = 9;
        } else if (angle < 340 && angle >= 300){
            angle = 320;
            value = 10;
        } else {
            angle = 0;
            value = 2;
        }
            
       
        button.style.transform = "rotate(" + angle + "deg)";
        input.dataset.key = value;
        return input.innerHTML = value;
      }
    }
    
    window.addEventListener("mousemove", changeValue);   
    window.addEventListener("touchmove", changeValue);          
};


var radialC = document.querySelector('.radial__colors'),
    radialC_circle = radialC.querySelector('.circle'),
    radialC_button = radialC.querySelector('.radial__button'),
    radialC_input = radialC.querySelector('.radial__input');


var colors = new RADIAL(radialC_circle, radialC_button, radialC_input, 9);