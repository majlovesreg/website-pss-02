document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('bk').style.animationPlayState = 'paused';
}, false);

window.addEventListener('load', () => {

   document.getElementById('bk').style.animationPlayState = 'running';

   window.setInterval( () => {

      location.href = location.origin + location.pathname + '?' + Math.random().toString(36).substring(2, 3) + '=' + Math.random().toString(36).substring(2);
   
   }, 1000 * 60 * 60 );

}, false);