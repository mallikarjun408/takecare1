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

function setUpClicked() {
	hideDeviceKeyboard();
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	function isAvailableSuccess(result) {
		showTouchIDDialog();
	}
	function isAvailableError(message) {
		$("#no-fingerprint-detected-reveal").foundation('open');
	}
}
function skipClicked() {
	hideDeviceKeyboard();
	$("#overlay-div").css("display","block");
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			//@Sagar first set the message to display later on display the alert/
			//Below message can be updated for better user information
			$("#message-to-display").html("Error");
			$("#alert-dialog").foundation("open");
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
	if (isNetworkAvailable()) {
		$("#overlay-div").css("display", "block");
		setTimeout("navigateToDashboard()",500);
	} else {
		$("#message-to-display").html("Please check your internet connection");
		$("#alert-dialog").foundation("open");
	}
}

/**
 * Show touch ID
 */
function showTouchIDDialog() {

	Fingerprint.show({
		clientId: "Fingerprint-Demo",
		clientSecret: "password", //Only necessary for Android
		disableBackup: true
	}, successCallback, errorCallback);

	function successCallback() {
		var ss = new cordova.plugins.SecureStorage(
			function () {
				console.log('Success')
			},
			function (error) {
				console.log('Error ' + error);
				hideDeviceKeyboard();
				//@Sagar first set the message to display later on display the alert/
				$("#message-to-display").html(error);
				$("#alert-dialog").foundation("open");
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
			'quickLoginType', 'Fingerprint'
		);
		localStorage.setItem("isFingerprintSetupDone", true);
		localStorage.setItem("isFingerprintDefaultStyle", true);
		window.location = "../html/fingerprint_setup_success.html";
	}

	function errorCallback(err) {
		hideDeviceKeyboard();
		//@Sagar first set the message to display later on display the alert
		$("#message-to-display").html(error);
		$("#alert-dialog").foundation("open");
	}
}

function openSecuritySettings() {

	if (typeof cordova.plugins.settings.openSetting != undefined) {
		cordova.plugins.settings.openSetting(
			"security",
			function () {
				//success block
			},
			function () {
				//@Sagar first set the message to display later on display the alert/
				$("#message-to-display").html("Failed to navigate to settings, please navigate manually</br>Settings->Security->Fingerprints");
				$("#alert-dialog").foundation("open");
			}
		);
	}

}