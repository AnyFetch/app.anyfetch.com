'use strict';

$(document).ready(function(){
	if(window.cookie.get('credentials') !== null){
		document.location.href = '/app.html';
	}
});