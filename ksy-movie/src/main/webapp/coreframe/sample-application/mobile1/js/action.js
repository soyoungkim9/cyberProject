var oldPage = null;

function push(newPage) {
	var newView=document.getElementById(newPage);
	newView.style.display = 'inline';

	var width = window.innerWidth - 50;
	var browser = navigator.userAgent.toLowerCase();

	if((browser.indexOf('msie') != -1) || (browser.indexOf('firefox') != -1) || (browser.indexOf('opera') != -1)){
		newView.style.position = 'absolute';
		newView.style.top = 0;
		newView.style.left= 0;
	}else {
		newView.style.webkitTransition = '';
		newView.style.left = "0%";
		newView.style.webkitTransition = 'left 1s linear';

	}
	
	if(oldPage != null && oldPage != newPage){
		var oldView=document.getElementById(oldPage);
		
		if((browser.indexOf('msie') != -1) || (browser.indexOf('firefox') != -1) || (browser.indexOf('opera') != -1)){
			oldView.style.display = 'none';
		}else {
			oldView.style.webkitTransition = '';
			oldView.style.left = "100%";
			oldView.style.webkitTransition = 'left 1s linear';
		}
	}
	oldPage = newPage;
}
