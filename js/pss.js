document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('bk').style.animationPlayState = 'paused';
}, false);

window.addEventListener('load', () => {

   console.log( 'Initial load: ' + new Date() );

   document.getElementById('bk').style.animationPlayState = 'running';

   window.setInterval( () => {

   	console.log( 'Background image reload: ' + new Date() );

   	let bk = document.getElementById('bk');
   	let bkclone = bk.cloneNode(true);
		bk.parentNode.replaceChild(bkclone, bk);
   
   }, 1000 * 60 * 10 );

}, false);