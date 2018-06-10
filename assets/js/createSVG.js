var SVG = (function(s){    
    let xmlns = "http://www.w3.org/2000/svg",
        boxWidth = 358.5,
        boxHeight = 389.5;
    
    let svgElem = document.createElementNS(xmlns, "svg");
    
        svgElem.setAttributeNS(null, "viewBox", "0 0 " + boxWidth + " " + boxHeight);
        svgElem.setAttributeNS(null, "width", boxWidth);
        svgElem.setAttributeNS(null, "height", boxHeight);
        svgElem.setAttributeNS(null, "class", 'code__copied');
        svgElem.style.display = "block";
    
    let g = document.createElementNS(xmlns, "g");
    
    g.setAttributeNS(null, 'data-name', 'copy_icon');
    
    let defs = document.createElementNS(xmlns, "defs");
    
    let gradA = document.createElementNS(xmlns, "linearGradient"),
        gradB = document.createElementNS(xmlns, "linearGradient"),
        gradC = document.createElementNS(xmlns, "linearGradient");
    
    gradA.setAttributeNS(null, "id", "a");
    gradA.setAttributeNS(null, "x1", "20.764");
    gradA.setAttributeNS(null, "x2", "338.74");
    gradA.setAttributeNS(null, "y1", "192.65");
    gradA.setAttributeNS(null, "y2", "192.65"); 
    gradA.setAttributeNS(null, "gradientUnits", "userSpaceOnUse"); 
    
    gradB.setAttributeNS(null, "id", "b");
    gradB.setAttributeNS(null, "x2", "358.5");
    gradB.setAttributeNS(null, "y1", "194.75");
    gradB.setAttributeNS(null, "y2", "194.75");  
    gradB.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "#a");  
    
    gradC.setAttributeNS(null, "id", "c");
    gradC.setAttributeNS(null, "x1", "21.033");
    gradC.setAttributeNS(null, "x2", "338.39");
    gradC.setAttributeNS(null, "y1", "192.82");
    gradC.setAttributeNS(null, "y2", "192.82");
    gradC.setAttributeNS('http://www.w3.org/1999/xlink', "xlink:href", "#a");
    
    let stop1 = document.createElementNS(xmlns, "stop"),
        stop2 = document.createElementNS(xmlns, "stop"),
        stop3 = document.createElementNS(xmlns, "stop"),
        stop4 = document.createElementNS(xmlns, "stop"),
        stop5 = document.createElementNS(xmlns, "stop"),
        stop6 = document.createElementNS(xmlns, "stop"),
        stop7 = document.createElementNS(xmlns, "stop"),
        stop8 = document.createElementNS(xmlns, "stop"),
        stop9 = document.createElementNS(xmlns, "stop"),
        stop10 = document.createElementNS(xmlns, "stop"),
        stop11 = document.createElementNS(xmlns, "stop"),
        stop12 = document.createElementNS(xmlns, "stop");
        
    stop1.setAttributeNS(null, "offset", 0);
    stop1.setAttributeNS(null, "stop-color", "#49a0c5");  
    gradA.appendChild(stop1);
    
    stop2.setAttributeNS(null, "offset", .09156);
    stop2.setAttributeNS(null, "stop-color", "#4c9cc3");  
    gradA.appendChild(stop2); 
    
    stop3.setAttributeNS(null, "offset", .17751);
    stop3.setAttributeNS(null, "stop-color", "#5491bd");  
    gradA.appendChild(stop3); 
    
    stop4.setAttributeNS(null, "offset", .26126);
    stop4.setAttributeNS(null, "stop-color", "#637eb3");   
    gradA.appendChild(stop4); 
    
    stop5.setAttributeNS(null, "offset", .34365);
    stop5.setAttributeNS(null, "stop-color", "#7763a5");   
    gradA.appendChild(stop5); 
    
    stop6.setAttributeNS(null, "offset", .42426);
    stop6.setAttributeNS(null, "stop-color", "#914194");   
    gradA.appendChild(stop6);
    
    stop7.setAttributeNS(null, "offset", .5);
    stop7.setAttributeNS(null, "stop-color", "#af1a7f");  
    gradA.appendChild(stop7); 
    
    stop8.setAttributeNS(null, "offset", .55544);
    stop8.setAttributeNS(null, "stop-color", "#b32579");   
    gradA.appendChild(stop8);
    
    stop9.setAttributeNS(null, "offset", .65195);
    stop9.setAttributeNS(null, "stop-color", "#bf416a");  
    gradA.appendChild(stop9);
    
    stop10.setAttributeNS(null, "offset", .778);
    stop10.setAttributeNS(null, "stop-color", "#d27051");  
    gradA.appendChild(stop10);
    
    stop11.setAttributeNS(null, "offset", .9271);
    stop11.setAttributeNS(null, "stop-color", "#ecaf2e");   
    gradA.appendChild(stop11);
    
    stop12.setAttributeNS(null, "offset", 1);
    stop12.setAttributeNS(null, "stop-color", "#fad11c");  
    gradA.appendChild(stop12);
    
    defs.appendChild(gradA);
    defs.appendChild(gradC);
    defs.appendChild(gradB);
    svgElem.appendChild(defs);
    
    let path1 = document.createElementNS(xmlns, "path");
        path1.setAttributeNS(null, 'class', "code__copy1");
        path1.setAttributeNS(null, 'd', "m334.5 24c-35.532 35.532-137 192.5-138 341.5 0-126-172.5-236.5-172.5-236.5");   
    
    let path2 = document.createElementNS(xmlns, "path");
        path2.setAttributeNS(null, 'class', "code__copy2");
        path2.setAttributeNS(null, 'd', "m334.5 24c-35.532 35.532-137 192.5-138 341.5 0-126-172.5-236.5-172.5-236.5");   
    
    let path3 = document.createElementNS(xmlns, "path");
        path3.setAttributeNS(null, 'class', "code__copy3");
        path3.setAttributeNS(null, 'd', "m334.5 24c-35.532 35.532-137 192.5-138 341.5 0-126-172.5-236.5-172.5-236.5");
    
    g.appendChild(path1);
    g.appendChild(path2);
    g.appendChild(path3);
    svgElem.appendChild(g);
    
    return svgElem;

})(SVG || {});