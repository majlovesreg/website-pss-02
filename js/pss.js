document.getElementById('bk').style.animationPlayState = 'paused';

document.addEventListener('DOMContentLoaded', function() {
   animateRun();
}, false);

function animateRun() {
	document.getElementById('bk').style.animationPlayState = 'running';
};