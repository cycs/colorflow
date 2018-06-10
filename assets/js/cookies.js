var cookie = localStorage.getItem('cookies');

if(!(cookie == 'true')){
    document.querySelector('.cookies').classList.add('displayCookies');    

    setTimeout(function(){
        document.querySelector('.cookies').classList.add('showCookies');    
    }, 150);
}

document.querySelector('.cookies__button').addEventListener('click', function(){
    localStorage.setItem('cookies', 'true');
        document.querySelector('.cookies').classList.remove('showCookies');    

    setTimeout(function(){
        document.querySelector('.cookies').classList.remove('displayCookies');    
    }, 1500);
});