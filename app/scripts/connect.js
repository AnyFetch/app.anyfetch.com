'use strict';

$(document).ready(function(){
	if(cookie.get('credentials') !== null){
		document.location.href = '/app.html';
	}
});