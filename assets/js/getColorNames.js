// formulas : http://www.easyrgb.com/en/math.php
//https://www.rapidtables.com

var NAMES = (function(n, u) {
    var colorNames;
    
    var hexToVBCode = function(hexCode){
        let index = hexCode.substr(1);
        return parseInt(index, 16);
    }
    
    var getColorNamesJSON = function(data){
        let colors = [];
        
        data.forEach((color) => {
            let key = Object.keys(color),
                regex = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/,
                r = parseInt(color[key].match(regex)[1]),
                g = parseInt(color[key].match(regex)[2]),
                b = parseInt(color[key].match(regex)[3]);

            let hexCode = u.rgbToHex(r, g, b),
                VbCode = hexToVBCode(hexCode),
                hsvCode = rgbToHsv(r, g, b),
                labCode = rgbToLab(r, g, b);

            colors.push({name : key[0], hex : hexCode, lab : labCode, hsv : hsvCode, rgb : [r,g,b]});
        });
        
        colors.sort((a, b) => {
            return a.vb - b.vb;
        });
        
        return colors;
    }
    
    /* Source : http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c */
    var rgbToHsv = function (r, g, b){
        r = r/255, g = g/255, b = b/255;
        let max = Math.max(r, g, b), 
            min = Math.min(r, g, b);
        
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if(max == min){
            h = 0; // achromatic
        }else{
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        h = parseFloat(h.toFixed(5))*360;
        s = parseFloat(s.toFixed(3))*100;
        v = parseFloat(v.toFixed(3))*100;
        
        let hsv = [h, s, v];
        
        // Formating to 2 decimals if floating number
        for(let i = 0; i< hsv.length; i++){
            if(hsv[i] !== Math.round(hsv[i])) {
                hsv[i] = parseFloat(hsv[i].toFixed(1));
            }    
            // Round number if the first if turns up to be xxx.00 
            if(hsv[i] == Math.round(hsv[i])) {
                hsv[i] = Math.round(hsv[i]);    
            }  
        }
        
        return hsv;
    }
    
    var rgbToHsl = function(r, g, b){
        let h, s, l;
        r = r/255, g = g/255, b = b/255;
        
        let max = Math.max(r, g, b), 
            min = Math.min(r, g, b),
            delta = max - min;
        
        l = (max + min) / 2;
        if (delta == 0){ // gray, no chroma
            h = 0
            s = 0
        } else { // chromatic
            if ( l < 0.5 ) {
                s = delta / ( max + min )
            } else {
                s = delta / ( 2 - max - min )
            }           

            let delta_r = ( ( ( max - r ) / 6 ) + ( delta / 2 ) ) / delta,
                delta_g = ( ( ( max - g ) / 6 ) + ( delta / 2 ) ) / delta,
                delta_b = ( ( ( max - b ) / 6 ) + ( delta / 2 ) ) / delta;

            if (r == max) {
                h = delta_b - delta_g; 
            } else if (g == max) {
                h = ( 1 / 3 ) + delta_r - delta_b;
            } else if (b == max){
                h = ( 2 / 3 ) + delta_g - delta_r;
            }

            if ( h < 0 ) h += 1
            if ( h > 1 ) h -= 1
        }
        
        h = parseFloat(h.toFixed(5))*360;
        s = parseFloat(s.toFixed(3))*100;
        l = parseFloat(l.toFixed(3))*100;
        
        let hsl = [h, s, l];
        
//        console.log(hsl);
        // Formating to 2 decimals if floating number
        for(let i = 0; i< hsl.length; i++){
            if(hsl[i] !== Math.round(hsl[i])) {
                hsl[i] = hsl[i].toFixed(1);
            }    
                
            // Round number if the first if turns up to be xxx.00 
            if(hsl[i] == Math.round(hsl[i])) {
                hsl[i] = Math.round(hsl[i]);    
            }  
        }
        
        return hsl;

    }
    
    var rgbToCmjn = function(r, g, b){
        let c = 1 - (r / 255),
            m = 1 - (g / 255),
            j = 1 - (b / 255),
            n = 1;

        if (c < n) {
            n = c
        }
        if (m < n) {
            n = m
        }
        if (j < n) {
            n = j
        }
        
        if (n == 1) {
            c = 0;          
            m = 0;
            j = 0;
        } else {
            c = (c - n) / (1 - n);
            m = (m - n) / (1 - n);
            j = (j - n) / (1 - n);
        }
        
        c = (parseFloat(c.toFixed(1))*100);
        m = (parseFloat(m.toFixed(1))*100);
        j = (parseFloat(j.toFixed(1))*100);
        n = (parseFloat(n.toFixed(1))*100);
        
        let cmjn = [c, m, j, n];
        
        for(let i = 0; i< cmjn.length; i++){
            if(cmjn[i] !== Math.round(cmjn[i])) {
                cmjn[i] = cmjn[i].toPrecision(1);
            }    
        }
        
        return cmjn;
    }
    
    var rgbToLab = function(r, g, blue){ 
        //https://github.com/antimatter15/rgb-lab/blob/master/color.js
        let x, y, z;
        
        r = r / 255,
        g = g / 255,
        blue = blue / 255,

        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        blue = (blue > 0.04045) ? Math.pow((blue + 0.055) / 1.055, 2.4) : blue / 12.92;

        x = (r * 0.4124 + g * 0.3576 + blue * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + blue * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + blue * 0.9505) / 1.08883;

        x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

        let l = (116 * y) - 16,
            a = 500 * (x - y),
            b = 200 * (y - z);
        
        l = Math.round(l),
        a = Math.round(a),
        b = Math.round(b);
        
        return [l, a, b];        
    }
    
    var mostSimilarColor = function(colorNames, lab){
        // algorithm : http://www.easyrgb.com/en/math.php
        
        let mostSimilarColors = colorNames.reduce((correct, color) => {

            let l1 = color.lab[0], 
                a1 = color.lab[1], 
                b1 = color.lab[2],          
                l2 = lab[0], 
                a2 = lab[1], 
                b2 = lab[2],         
                wl, wc, wh;                //Weighting factors

            let xC1 = Math.sqrt((Math.pow(a1, 2)) + (Math.pow(b1,2))),
                xC2 = Math.sqrt((Math.pow(a2, 2)) + (Math.pow(b2,2))),
                xDL = l2 - l1,
                xDC = xC2 - xC1,
                xDE = Math.sqrt(((l1-l2) * (l1-l2)) + ((a1-a2) * (a1-a2)) + ((b1-b2)*(b1-b2))),
                xDH = (xDE*xDE) - (xDL*xDL) - (xDC*xDC);

            if (xDH > 0){
               xDH = Math.sqrt(xDH);
            } else {
               xDH = 0;
            }

            let xSC = 1 + (0.045 * xC1),
                xSH = 1 + (0.015 * xC1);

            let dE94 = Math.sqrt(Math.pow(xDL, 2) + Math.pow(xDC, 2) + Math.pow(xDH, 2));
            
            if(dE94 < 15){
                correct.push({color, dE94});
            }
            return correct;
        }, []);
        
        let mostSimilarColor = mostSimilarColors[0]; 
        mostSimilarColors.forEach(color => {
            if(color.dE94 < mostSimilarColor.dE94){
                mostSimilarColor = color;
            }
        });
        
        return mostSimilarColor.color;
    }
    

    
//    Public methods
    n.getColorNamesJSON = getColorNamesJSON;
    n.hexToVBCode = hexToVBCode;
    n.rgbToHsv = rgbToHsv;
    n.rgbToHsl = rgbToHsl;
    n.rgbToCmjn = rgbToCmjn;
    n.rgbToLab = rgbToLab;
    n.mostSimilarColor = mostSimilarColor;
    
    return n;
    
})(NAMES || {}, UTIL);  
