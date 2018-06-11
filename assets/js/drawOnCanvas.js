var DRAW = (function(d, u){
    var isDrawing = false,
        isInCanvas = false,
        rect = {};
        
    const canvas = document.getElementById('canvas2');
    const ctx = canvas.getContext("2d"),
          top = canvas.getBoundingClientRect().top,
          left = canvas.getBoundingClientRect().left,
          right = canvas.getBoundingClientRect().right,
          offsetLeft = u.getOffsetLeft(canvas),
          offsetTop = u.getOffsetTop(canvas);     
    
    const bod = document.querySelector('body');
    let offsetLeftB = u.getOffsetLeft(bod),
        offsetTopB = u.getOffsetTop(bod);
    
    var drawClip = function(e){
        
        if (!isDrawing || !isInCanvas) return;       
            
            rect.w = e.pageX - rect.startXb;
            rect.h = e.pageY - rect.startYb;       


        // When the canvas is resized, the values have to be recomputed from the original canvas size
        let ratioX = canvas.clientWidth / canvas.width,
            ratioY = canvas.clientHeight / canvas.height,
            startXRatio = (rect.startX)/ratioX,
            startYRatio = (rect.startY)/ratioY,
            widthRatio = rect.w/ratioX,
            heightRatio = rect.h/ratioY;    
        
        ctx.clearRect(0, 0, canvas.clientWidth*2, canvas.clientHeight*2);
        
        ctx.beginPath(); // Without it, rectangles are saved then redrawn
        ctx.fillStyle="rgba(255, 255, 255, .6)";
        
        ctx.fillRect(startXRatio, startYRatio, widthRatio, heightRatio);
        

    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;

        if(e.target.id == "canvas2"){
            isInCanvas = true;
        }
        
        rect.startX = e.offsetX;
        rect.startY = e.offsetY;
        rect.startXb = e.pageX;
        rect.startYb = e.pageY;
    });
    
    var getClipRect = function(){
        isDrawing = false;
        
        // When the canvas is resized, the values have to be recomputed from the original canvas size
        let ratioX = canvas.clientWidth / canvas.width,
            ratioY = canvas.clientHeight / canvas.height,
            startXRatio = (rect.startX)/ratioX,
            startYRatio = (rect.startY)/ratioY,
            widthRatio = rect.w/ratioX,
            heightRatio = rect.h/ratioY; 
        
        if(Math.abs(rect.w) < 10 || Math.abs(rect.h) < 10){ // avoid drawing too small rect and getting errors
            ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);   
            return false;
        };

        ctx.clearRect(0,0,canvas.clientWidth*2,canvas.clientHeight*2);
        ctx.rect(startXRatio, startYRatio, widthRatio, heightRatio);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        rect.startXRatio = startXRatio;
        rect.startYRatio = startYRatio;
        rect.widthRatio = widthRatio;
        rect.heightRatio = heightRatio;
        
        return rect;
    }

    document.addEventListener('mousemove', drawClip);
    canvas.addEventListener('mouseup', function(){      
        document.querySelector('body').classList.remove('noselect');
                });
    
    //    Public method
    d.getClipRect = getClipRect;
    d.rect = rect;
    d.isDrawing = isDrawing;
    
    return d;
    
})(DRAW || {}, UTIL);