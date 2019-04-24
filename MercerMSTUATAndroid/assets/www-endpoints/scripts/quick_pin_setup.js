function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("backbutton", backButtonHandler, false);
}

function onDeviceReady(){
	document.addEventListener("resume", onAppResume, false);
}

function backButtonHandler() {
	//get the list of classes applied on the app hamburger menu
	var classList = document.getElementById('app-hamburger-menu').className.split(/\s+/);
	var isHamburgerMenuOpen = false;
	for (var i = 0; i < classList.length; i++) {
		if (classList[i] === 'open') {
			isHamburgerMenuOpen = true;
			break;
		}
	}
	if (isHamburgerMenuOpen) {
		$("#menu-link").click();
	} else {
		window.history.back();
	}
}

/*
	input param : none
	output param : none
	description : user selects device pin , start pin setup
*/

function devicePinSetUpCliked() {
	var isSecure = localStorage.getItem("isDeviceSecure");
	hideDeviceKeyboard();
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			ss = null;
		},
		'my_app'
	);
	if (isSecure == 'true') {
		ss.set(
			function (key) {
				console.log('Set ' + key);
			},
			function (error) {
				console.log('Error ' + error);
			},
			'isQuickLoginSetup', 'true'
		);
		window.location = "../html/enter_4_digit_pin-quick_pin_setup.html";
	} else {
		alert('This device is not seure, Quick Login feature will be disabled');
	}
}

/*
	input param : none
    output param : none
    description : user selects fingerprint , fingerprint setup
*/

function fingerPrintSetUpCliked() {
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			alert(error);
		},
		'my_app'
	);
	ss.set(
		function (key) {
			console.log('Set ' + key);
		},
		function (error) {
			console.log('Error ' + error);
		},
		'isQuickLoginSetup', 'true'
	);
	window.location = "../html/fingerprint_login_setup.html";
}

/*
	input param : none
	output param : none
	description : skip quick login setup show tnc
*/

function skipCliked() {
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			alert(error);
		},
		'my_app'
	);
	ss.set(
		function (key) {
			console.log('Set ' + key);
		},
		function (error) {
			console.log('Error ' + error);
		},
		'isQuickLoginSetup', 'false'
	);
	window.location = '../html/terms_and_conditions.html';
}
