var EGG = (function(eg){
    
    // Type any color name from the 1704 array colors to change color circle of the radial input
    var konamiCode = function(data){ 
        let colors = data.map(d => {
            return Object.keys(d)[0];
        });
        
        let code = '';
        window.addEventListener('keypress', function(e){
            let keycode = e.key;
            code += keycode;
            
            if(code.length > 20){
                code = code.slice(code.length-20, code.length);
            }

            data.forEach(color => {
                let name = Object.keys(color)[0].toLowerCase();

                if (code.includes(name)){
                let rgb = color[Object.keys(color)[0]];
                   document.querySelector('.circle').style.background = rgb;
               } 
            });
        });
    }
    
    fetch('colors.json').then(r => r.json()).then(data => konamiCode(data));
})(EGG || {});