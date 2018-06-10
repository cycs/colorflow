// sources meidan cut algorithm :
// https://en.wikipedia.org/wiki/Median_cut
// http://collaboration.cmc.ec.gc.ca/science/rpn/biblio/ddj/Website/articles/DDJ/1994/9409/9409e/9409e.htm
// http://www.leptonica.com/papers/mediancut.pdf
// http://www.leptonica.com/color-quantization.html

var UTIL = (function(u, can) {    
    
    /*
    CHECK IF ARRAY IS IN NESTED ARRAY
    */
    
    var isAlreadyInArray = function(needle, haystack){
        var flag = false;
        for(var i = 0; i<haystack.length; i++){
            var compare = 0;
            for(var j = 0; j<haystack[i].length; j++){
                if(needle[j] === haystack[i][j]){
                    compare++; 
                }
                if(compare == needle.length){
                    flag = true;   
                }
            }
        }
        return flag;
    }
    var sortObject = function(object){
        var sortable = [];
            for (var value in object) {
                sortable[sortable.length] = [value, object[value]];
            }
        
        return sortable;
    }
    
    var rgbToHex = function (r, g, b) {
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }
        
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    
    var sortAllColors = function(reduced, all, splits){
        let median = u.medianCut(reduced);

        let key = parseInt(Object.keys(median)[0]);
        let dominantSort = sortByDominantColor(all, key);
        
        let mappedColors = u.getBucketsSplit(dominantSort,  median, splits);

        return mappedColors;
    };
    
    var getBucketsSplit = function(dominantSort, median, splits){
        let bucket = [],
            count = 0,
            increment = 2;
        
        let splitBucket = u.twoBucketSplit(dominantSort, median, bucket, count);
        
        while(increment < splits){
            let medianCut1 = u.medianCut(bucket[count]);
            let key1 = parseInt(Object.keys(medianCut1)[0]);
            
            let lastCount = count;
            count = count + 1;
        
            splitBucket = u.twoBucketSplit(bucket[lastCount], medianCut1, bucket, count);

            /* Remove the non-split sub bucket*/
            splitBucket = splitBucket.slice(count, splitBucket.length);
            
            increment = increment + 1;
        }
        
        /* Prevent getting empty arrays if number of colors is less than number of splits */
        var NoEmptyBucket = splitBucket.filter(bucket => bucket.length != 0);
        
        var mappedColors = u.averageColor(NoEmptyBucket);
        
        return mappedColors;

    }
    
    var sortByBucketSize = function(buckets){
        buckets.sort((a, b) => {
            return b.length - a.length
        });
        
        var newBucket = Array.from(buckets);
        var sizeBuckets = newBucket.reduce((a, b) => {
            return a + (b.length);
        }, 0);
        
        var sortedBuckets = buckets.map(b => {
            var pourcentage = ((b.length)/sizeBuckets*100).toFixed(1);
            return [b, pourcentage];
        });
        
        return sortedBuckets;
    }
    
    var averageColor = function(buckets){
        var mappedColors = [];
        
        var bucketsSorted = sortByBucketSize(buckets);
        
        bucketsSorted.forEach(bucket => {
                var reduced = bucket[0].reduce((accumulator, val) => {

                    accumulator[0] = accumulator[0] + val[0];
                    accumulator[1] = accumulator[1] + val[1];
                    accumulator[2] = accumulator[2] + val[2];
           
                    return accumulator;

                });

                var zero = Math.round(reduced[0]/bucket[0].length);
                var one = Math.round(reduced[1]/bucket[0].length);
                var two = Math.round(reduced[2]/bucket[0].length);
                reduced = [zero, one, two];
            mappedColors.push([reduced, bucket[1]]);
        });
        
        return mappedColors;
    }
    
    
    var medianCut = function(colors){
        var rMin = 255, rMax = 0, gMin = 255, gMax = 0, bMin = 255, bMax = 0;
        
        for(var i=0; i<colors.length; i++){
            var r = colors[i][0];
            var g = colors[i][1];
            var b = colors[i][2];
            
            rMin = r < rMin ? r : rMin;
            rMax = r > rMax ? r : rMax;
            
            gMin = g < gMin ? g : gMin;
            gMax = g > gMax ? g : gMax;
            
            bMin = b < bMin ? b : bMin;
            bMax = b > bMax ? b : bMax;
        }
        
        var rMed = rMax - rMin;
        var gMed = gMax - gMin;
        var bMed = bMax - bMin;
        
        var med = function(r, g, b){
            var widest = r > g ? r : g;
            widest = widest > b ? widest : b;
            
            var wideObj = {}
            switch(widest){
                case r : wideObj[0] = Math.floor((rMax + rMin) / 2); 
                    break;
                case g : wideObj[1] = Math.floor((gMax + gMin) / 2); 
                    break;
                case b : wideObj[2] = Math.floor((bMax + bMin) / 2); 
            }
            return wideObj;
        }
        
        var median = med(rMed, gMed, bMed);
        return median;
   
    }
    var twoBucketSplit = function(colors, median, bucket, count){
        var key = Object.keys(median)[0],
            bucketLengthFloor = Math.floor(colors.length / 2),
            bucketLengthCeil = Math.ceil(colors.length / 2);
        
        var bucket1 = [],
            bucket2 = [];
        
        colors.forEach(color => {
            if(color[key] > median[key]) {
                bucket1[bucket1.length] = color;
            } else {
                bucket2[bucket2.length] = color;
            }     
        });
 
        bucket.push(bucket1, bucket2);
        
        return bucket;
    };
    
    var sortByDominantColor = function(arrayColors, key){
        var dominants = arrayColors.sort(function(a, b) {
                a = a[key];             
                b = b[key]; 

                return b - a;   
            });
        
        return dominants;
    }
    
    var getOffsetLeft = function(elem){
        var offsetLeft = 0;
        do {
            if (!isNaN(elem.offsetLeft)){
              offsetLeft += elem.offsetLeft;
            }
        } while(elem = elem.offsetParent);
        
        return offsetLeft;
    }   
    var getOffsetTop = function(elem){
        var offsetTop = 0;
        do {
            if (!isNaN(elem.offsetTop)){
              offsetTop += elem.offsetTop;
            }
        } while(elem = elem.offsetParent);
        
        return offsetTop;
    }
    
    var randomNumber = function(max, word){
        let r = Math.floor(Math.random() * max);
        
        while(word[r] == ' '){ // spaces can't be colored
            r = Math.floor(Math.random() * max);
        }
        return r;
    }
    
    var coloredLetter = function(word, number, hex){
        let span = document.createElement('span');
        span.setAttribute('data-hex', hex);
        span.innerHTML = word[number];
        
        let letter = `<span data-hex='${hex}'>${word[number]}</span>`;
        
        let newWord = word.replace(word[number], letter); 
        return newWord;
    }
    
    //    public methods
    u.isAlreadyInArray = isAlreadyInArray;
    u.sortObject = sortObject;
    u.rgbToHex = rgbToHex;
    u.medianCut = medianCut;
    u.sortAllColors = sortAllColors;
    u.twoBucketSplit = twoBucketSplit;
    u.getBucketsSplit = getBucketsSplit;
    u.averageColor = averageColor;
    u.getOffsetTop = getOffsetTop;
    u.getOffsetLeft = getOffsetLeft;
    u.randomNumber = randomNumber;
    u.coloredLetter = coloredLetter;
        
    return u;
})(UTIL || {});