/* Drag and drop functionality */

var DRAG = (function(dr){
    var dropzone = document.querySelector('.canvas'),
        clickUpload = document.querySelector(".upload__icon"),
        fileInput = document.querySelector(".upload__image"),
        canvas = document.querySelector(".canvas__drawon"),
        ctx = canvas.getContext("2d");
    var one = 0;
    
    clickUpload.addEventListener('click', function(){
        simulateClick(fileInput);        
    });
    
    var simulateClick = function (elem) {
        // Create our event (with options)
        var evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        // If cancelled, don't dispatch our event
        var canceled = !elem.dispatchEvent(evt);
    };
    
    var ondrop = function(e){
        const uploadOverlay = document.querySelector('.upload'),
              uploadButton = document.querySelector('.upload__icon');
        
        e.preventDefault();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        one = 0;
        
        try {
            if(e.dataTransfer.files[0].size > 5000000) throw new Error();
        } catch(err) {
            alert("Taille maximale dépassée (5 Mo)");
            
            return;
        }

        var reader = new FileReader();
        
        reader.readAsDataURL(e.dataTransfer.files[0]);
        reader.onload = function(e){
            if( e.target.readyState == FileReader.DONE) {
                document.querySelector('.description').classList.add('hide');
                uploadOverlay.classList.add('upload--hidden');
                uploadButton.classList.add('upload__icon--topcorner');
                
                CANVAS.img.src = e.target.result;
            }
        }    
    }
    
    var ondragover = function(e){
        e.preventDefault();
        if(one < 1){
            ctx.fillStyle = "rgba(255, 255, 255, .6)";
            ctx.fillRect(0, 0, canvas.width,canvas.height);
            one++;
        }

    }
    var ondragend = function(e){
        e.preventDefault();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        one = 0;
    }
    
    dropzone.addEventListener('drop', ondrop);
    dropzone.addEventListener('dragover', ondragover);
    dropzone.addEventListener('dragend', ondragend);
    dropzone.addEventListener('dragexit', ondragend);
    dropzone.addEventListener('dragleave', ondragend);
})(DRAG || {});



