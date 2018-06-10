//https://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android

var SWIPE = (function(s) {   
    const codes = document.querySelector('.codes');

    var yDown = null;                                                        
    var yDiff = null;
    var scale = 1;
    
    var handleTouchStart = function(e)  { 
        yDown = e.touches[0].clientY;                                      
    };                                                

    var handleTouchMove = function(e) {
        if (document.documentElement.clientWidth < 800) {
            var yUp = e.touches[0].clientY;

            yDiff = yDown - yUp;

            if(yDiff < 0) return;

            scale = 1 - (yDiff / 2000);

            codes.style.transform = `translateY(${-yDiff}px) scale3d(${scale}, ${scale}, ${scale})`;                                        
            codes.style.opacity = scale;     
        }
    };
    
    var handleTouchEnd = function(e) {
        if (document.documentElement.clientWidth < 800) {

            codes.style.transform = `translateY(0) scale(1)`;         
            codes.style.opacity = 'initial';                                        

            if(yDiff > 100) {
                document.body.classList.remove('codes--active');
            }

            yDiff = null;
        }
    };
    
    codes.addEventListener('touchstart', handleTouchStart, {capture: true, passive: false});        
    codes.addEventListener('touchmove', handleTouchMove, {capture: true, passive: false});
    codes.addEventListener('touchend', handleTouchEnd, false);
    
})(SWIPE || {}); 
