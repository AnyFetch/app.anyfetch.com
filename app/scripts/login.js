'use strict';

var cookie_life = 365; //Days

$(document).ready(function(){
	$('#login_form').submit(function(){
		var expiration = $('#remember').is(':checked') ? cookie_life : null ;
		window.cookie.set('credentials', btoa($('#email').val() + ':' + $('#password').val()), expiration);
		document.location.href = '/app.html';
		return false;
	});
});