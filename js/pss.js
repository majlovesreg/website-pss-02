document.addEventListener('DOMContentLoaded', () => {
   document.getElementById('bk').style.animationPlayState = 'paused';
}, false);

window.addEventListener('load', () => {

   document.getElementById('bk').style.animationPlayState = 'running';

   window.setInterval( () => {

   	let bk = document.getElementById('bk');
		let bkclone = bk.cloneNode(true);
		bk.parentNode.replaceChild(bkclone, bk);
   
   }, 1000 * 60 * 10 );

}, false);