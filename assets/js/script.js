/* CANVAS */

var CANVAS = (function(can, u, d, dr, n, s){    
    let canvas = document.getElementById("canvas"),
        canvas2 = document.getElementById("canvas2"),
        canvas3 = document.getElementById("canvas3"),
        upload = document.querySelector('.upload__image'),
        getColorsButton = document.querySelector(".getcolors"),
        ctx = canvas.getContext("2d"),
        ctx2 = canvas2.getContext("2d"),
        ctx3 = canvas3.getContext("2d"),
        init = false;
    
    let img = new Image();
    let firstVisit = true;
    
    img.onload = function (e) {
        if (!firstVisit){                      
            document.querySelector('.description').classList.add('hide');
        }    
        
        let largest = 600;
        
         let checked = document.querySelector('.tgl[type="checkbox"]:checked') === null ? false : true;
        let largestSmall = 100,
            highest = 400;
        
        if(checked) largestSmall = 800;
        
        if(img.width > img.height){
            if(img.height > highest && img.width < largest){
                var widthCanvas = img.width / (img.height / highest);  
                canvas.width = canvas2.width = widthCanvas;
                canvas.height = canvas2.height = highest;     
            } else {
                var heightCanvas = img.height / (img.width / largest);  
                canvas.width = canvas2.width = largest;
                canvas.height = canvas2.height = heightCanvas;
            }
            
            var heightCanvas3 = img.height / (img.width / largestSmall);  
            canvas3.width = largestSmall;
            canvas3.height = heightCanvas3;
        } else {
            var widthCanvas = img.width / (img.height / highest);  
            canvas.width = canvas2.width = widthCanvas;
            canvas.height = canvas2.height = highest;    
            
            var widthCanvas3 = img.width / (img.height / largestSmall);  
            canvas3.width = widthCanvas3;
            canvas3.height = largestSmall;    
        }
        ctx.drawImage(img,0,0,img.width,img.height,0,0,canvas.width, canvas.height);
    
        var data = ctx.getImageData(0,0,canvas.width,canvas.height);
        
        /* smaller size canvas */
        ctx3.drawImage(img,0,0,img.width,img.height,0,0,canvas3.width, canvas3.height);
        data =  ctx3.getImageData(0,0,canvas3.width,canvas3.height);
        
        /* using a new typed object is faster */
        var sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
        var sourceBuffer32 = new Int32Array(data.data.buffer);
        
        allColors.bind(this, sourceBuffer8, sourceBuffer32, data)();

        if(init){
            init = !init;
        }
        
        /* change the numbers of colors */
        let radial = document.querySelector('.radial__colors .radial__input'),
            radialCircle = document.querySelector('.radial__colors .circle'),
            radialKey = radial.dataset.key,
            isDragging = false;

        radialCircle.addEventListener("mousedown", () => isDragging = true);
        radialCircle.addEventListener("touchstart", () => isDragging = true, {passive: true});
        
        document.addEventListener("touchend", () => {
            /* recalculate on change (numbers of colors) */
            if(isDragging){
                let data =  ctx3.getImageData(0,0,canvas3.width,canvas3.height),
                    sourceBuffer8 = new Uint8ClampedArray(data.data.buffer),
                    sourceBuffer32 = new Int32Array(data.data.buffer);

                allColors.bind(this, sourceBuffer8, sourceBuffer32, data)();
            }
            isDragging = false;
        });
        document.addEventListener('mouseup', function(){
            // recalculate on change (numbers of colors)
            if(isDragging){
                let data =  ctx3.getImageData(0,0,canvas3.width,canvas3.height);
                let sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
                let sourceBuffer32 = new Int32Array(data.data.buffer);
                
                allColors.bind(this, sourceBuffer8, sourceBuffer32, data)();
            }
            isDragging = false;
            
            /* recalculate on draw */
            if(d.isDrawing) return;
            var clippedRect = d.getClipRect();
            
            if(Object.keys(clippedRect).length < 4 || !clippedRect) return;
            
            if(clippedRect.w) {
                let data = ctx.getImageData(clippedRect.startXRatio,
                                            clippedRect.startYRatio,
                                            clippedRect.widthRatio,
                                            clippedRect.heightRatio);

                let sourceBuffer8 = new Uint8ClampedArray(data.data.buffer);
                let sourceBuffer32 = new Int32Array(data.data.buffer);

                allColors.bind(this, sourceBuffer8, sourceBuffer32, data)();

                Object.keys(d.rect).forEach(k => delete d.rect[k]); // Reset rectangle to avoid multiple draws on click
            }
        });        
    }
    
    upload.addEventListener('change', function(e){
        const uploadOverlay = document.querySelector('.upload'),
              uploadButton = document.querySelector('.upload__icon');
        let files = e.target.files,
            file = files[0],
	        reader = new FileReader();
        
        if(!file) return;
        reader.readAsDataURL(file);
        reader.onload = function(e){
            if( e.target.readyState == FileReader.DONE) {
                firstVisit = false;
                uploadOverlay.classList.add('upload--hidden');
                uploadButton.classList.add('upload__icon--topcorner');
                img.src = e.target.result;
            }
        }    
    }); 
    
    var numberOfColors = function(sourceBuffer8, sourceBuffer32, data){
        var nbOfColors = {},
            countColors = [], 
            last = [], 
            current = [];
        
        for(var i = 0, k=0; i<sourceBuffer32.length; i+=4, k++){   
            if (sourceBuffer32[k] !== 0) {
                current = [sourceBuffer8[i], sourceBuffer8[i+1], sourceBuffer8[i+2]];
                var every =  current.every(function(element, index) {
                    return element === last[index]; 
                });
                if(every){
                    if(!u.isAlreadyInArray(current, countColors)){
                        // .push() is slower than inline code
                        countColors[countColors.length] = current;
                        
                        nbOfColors[current.join('-')] = 1;
                    } else {
                        nbOfColors[current.join('-')]++;  
                    }
                }
                last = [sourceBuffer8[i], sourceBuffer8[i+1], sourceBuffer8[i+2], sourceBuffer8[i+3]];
            }
        }
        
        return countColors;
        
    }
    
    var allColors = function(sourceBuffer8, sourceBuffer32, data){
        let splitsValue = document.querySelector(".radial__colors .radial__input").dataset.key;
        var nbOfColors = {},
            countColors = [], 
            last = [], 
            current = [],
            inputValueParsed = parseInt(splitsValue.value),
            splits = parseInt(splitsValue);
        
        
        for(var i = 0, k=0; i<sourceBuffer8.length; i+=4, k++){ 
            if (sourceBuffer32[k] !== 0) { // ignore black pixels
                current = [sourceBuffer8[i], sourceBuffer8[i+1], sourceBuffer8[i+2]];
                countColors[countColors.length] = current;
            }
                
        }        
        var mappedColors = u.sortAllColors(can.numberOfColors(sourceBuffer8, sourceBuffer32, data), countColors, splits);
        
        can.displayCommonColors(mappedColors);
    }
    
    var displayCommonColors = function(colors){
        
        const colorsDiv = document.querySelector('.palette .colors');        
        
        fetch('colors.json').then(r => r.json()).then(data => {
            var colorNames = n.getColorNamesJSON(data);

            colorsDiv.innerHTML = '';
            colors.map((c, key) => {
                let hexCode = u.rgbToHex(parseInt(c[0][0]), parseInt(c[0][1]), parseInt(c[0][2]));
                let percent = c[1] + "%";
                let color = (parseInt(c[0][0])+parseInt(c[0][1])+parseInt(c[0][2])) > 382 ? "black" : "white";
                let colorText = "text--" + color;
                let vbCode = n.hexToVBCode(hexCode);
                let hsv = n.rgbToHsv(c[0][0], c[0][1], c[0][2]);
                let hsl = n.rgbToHsl(c[0][0], c[0][1], c[0][2]);
                let cmjn = n.rgbToCmjn(c[0][0], c[0][1], c[0][2]);
                let lab = n.rgbToLab(c[0][0], c[0][1], c[0][2]);
                
                let mostSimilarColor = n.mostSimilarColor(colorNames, lab);
                
                //Easter egg
                eggCount(mostSimilarColor.name);
                
                let li = document.createElement('li');
                li.setAttribute('class', 'colors__box');
                li.setAttribute('data-hex', hexCode);
                
                let span = document.createElement('span');
                span.setAttribute('class', colorText);
                span.innerHTML = percent;    
                li.appendChild(span);
                
                let spanName = document.createElement('span');
                spanName.classList.add(`${colorText}`);
                spanName.classList.add('box__name');
                spanName.innerHTML = mostSimilarColor.name;
                li.appendChild(spanName);
                
                li.addEventListener('mousemove', function(e){
                    const x = e.pageX - e.target.offsetLeft;
                    const y = e.pageY - e.target.offsetTop;
                    
                    let hsl1 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]-20}%, 1)`, 
                        hsl2 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]-5}%, 1)`,
                        hsl3 = `hsla(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%, 1)`;
                    
                    e.target.style.setProperty('--x', `${x}px`);
                    e.target.style.setProperty('--y', `${y}px`);
                    e.target.style.setProperty('--color1', hsl1);
                    e.target.style.setProperty('--color2', hsl2);
                    e.target.style.setProperty('--color3', hsl3);
                });
                
                li.addEventListener('click', displayCodes.bind(this, mostSimilarColor.name, hsv, cmjn, lab, hsl, hexCode, [parseInt(c[0][0]), parseInt(c[0][1]), parseInt(c[0][2])]));
                colorsDiv.appendChild(li);
            });

            var lis = colorsDiv.querySelectorAll(".colors__box");
            lis.forEach(l => {
                l.style.background = l.dataset.hex; 
            });
        });
    }
    
    const hexSpan = document.querySelector('.code__hex .code__color'),
    rgbSpan = document.querySelector('.code__rgb .code__color'),
    labSpan = document.querySelector('.code__lab .code__color'),
    cmjnSpan = document.querySelector('.code__cmjn .code__color'),
    hsvSpan = document.querySelector('.code__hsv .code__color'),
    hslSpan = document.querySelector('.code__hsl .code__color'),
    colorsTitle = document.querySelector('.codes__title');
        
    var actionCopy = function(e){
        document.execCommand("copy");
    }
    var copyToClipboard = function(e){   
        e.preventDefault();
        
        // remove any copy of the copied alert
        if(this.parentElement.children.length > 2 ) {
            this.parentElement.removeChild(this.parentElement.querySelector('.code__copy'));
        }
        
        const copyLi = this.parentElement;
        
        if (e.clipboardData) {
            e.clipboardData.setData("text/plain", this.textContent);
            
            let div = document.createElement('div');
                div.setAttribute('class', 'code__copy');
            
            let p = document.createElement('p'),
                newContent = document.createTextNode("copié"); 
                
            p.appendChild(newContent);
            div.appendChild(p);
            div.appendChild(s);
            
            copyLi.appendChild(div);
            
            setTimeout(() => {
                if(this.parentElement.children.length > 2 ) {
                    this.parentElement.removeChild(this.parentElement.querySelector('.code__copy'));
                }
            }, 2000);
            
        }
    }
    
    hexSpan.addEventListener('copy', copyToClipboard);
    hexSpan.addEventListener('click', actionCopy);
    
    rgbSpan.addEventListener('copy', copyToClipboard);
    rgbSpan.addEventListener('click', actionCopy);
    
    labSpan.addEventListener('copy', copyToClipboard);
    labSpan.addEventListener('click', actionCopy);
    
    cmjnSpan.addEventListener('copy', copyToClipboard);
    cmjnSpan.addEventListener('click', actionCopy);
    
    hslSpan.addEventListener('copy', copyToClipboard);
    hslSpan.addEventListener('click', actionCopy);
    
    hsvSpan.addEventListener('copy', copyToClipboard);
    hsvSpan.addEventListener('click', actionCopy);

    
    var displayCodes = function(name, hsv, cmjn, lab, hsl, hex, rgb){
        document.body.classList.add('codes--active');
                
        let randomNumber = u.randomNumber(name.length, name),
            coloredWord = u.coloredLetter(name, randomNumber, hex);
        
        colorsTitle.innerHTML = coloredWord;
        
        const spanColor = colorsTitle.querySelector('span');
        spanColor.style.color = spanColor.dataset.hex;
        
        hexSpan.innerHTML = hex;
        rgbSpan.innerHTML = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
        hslSpan.innerHTML = `${hsl[0]}, ${hsl[1]}, ${hsl[2]}`;
        hsvSpan.innerHTML = `${hsv[0]}, ${hsv[1]}, ${hsv[2]}`;
        cmjnSpan.innerHTML = `${cmjn[0]}, ${cmjn[1]}, ${cmjn[2]}, ${cmjn[3]}`;
        labSpan.innerHTML = `${lab[0]}, ${lab[1]}, ${lab[2]}`;
    }
    
    var initialize = function(){
        init = true;
        img.src = "assets/img/img10.jpg";
    }
    
    // hide overlay of codes
    const overlay = document.querySelector('.codes__close');
    var hideOverlay = function(){
       document.body.classList.remove('codes--active'); 
    }
    overlay.addEventListener('touch', hideOverlay);
    overlay.addEventListener('click', hideOverlay);
    
    initialize();
    
    // Display help overlay
    const helpIcon = document.querySelector('.icon--help');
    const help = document.querySelector('.help');
    const questions = document.querySelectorAll('.question__title');
    const overlayHelp = document.querySelector('.overlay');
    
    var displayHelp = function(e){
        e.preventDefault();
        overlayHelp.classList.add('overlay--active');

        help.classList.add('help--ready');

        setTimeout(function(){
            help.classList.add('help--active');
            window.addEventListener('click', hideHelpOverlay);
        }, 150);
        
    }
    
    function hideHelpOverlay(e){
            if (!help.contains(e.target)){
                overlayHelp.classList.remove('overlay--active');
                help.classList.remove('help--active');
                
                setTimeout(function(){
                help.classList.remove('help--ready');
                    window.removeEventListener('click', hideHelpOverlay);
                }, 150);
            } 
    }
    
    helpIcon.addEventListener('click', displayHelp);
    
    var faq = function(){
        let p = this.parentElement;
        if(p.classList.contains('help__question--active')){
            p.classList.remove('help__question--active');
        } else {  
            questions.forEach(question => {
                question.parentElement.classList.remove('help__question--active')});
            p.classList.add('help__question--active');
        }
    }
    
    questions.forEach(question => {
       question.addEventListener('click', faq);
    });
    
    // Easter egg counter
    const eggEl = document.querySelector('.egg__count');
    let eggInit = JSON.parse(localStorage.getItem("egg"));
    
    if(eggInit || eggInit == 0){
        eggEl.dataset.count = eggInit.length;
        eggEl.innerHTML = eggInit.length;
    }
    
    var eggCount = function(name){
        let eggColors = JSON.parse(localStorage.getItem("egg"));
        
        if(eggColors){
            if(!eggColors.includes(name)){
                eggColors.push(name);
                localStorage.setItem("egg", JSON.stringify(eggColors));
                
                // Increase counter
                let count = parseInt(eggEl.dataset.count) + 1;
                eggEl.dataset.count = count;
                eggEl.innerHTML = count;
                
            }
        } else {
            let eggArray = [name];
            localStorage.setItem("egg",  JSON.stringify(eggArray));
            
            // Increase counter
            const eggEl = document.querySelector('.egg__count');
            let count = parseInt(eggEl.dataset.count) + 1;
            eggEl.dataset.count = count;
            eggEl.innerHTML = count;
        }
    } 

    //    public methods
    can.img = img;
    can.displayCommonColors = displayCommonColors;
    can.numberOfColors = numberOfColors;
    can.img = img;
    can.firstVisit = firstVisit;
    
    return can; 
})(CANVAS || {}, UTIL, DRAW, DRAG, NAMES, SVG);



