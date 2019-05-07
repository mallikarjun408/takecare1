function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("backbutton", backButtonHandler, false);
	$("#showLogo").css("display", "none");
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

/**
 * check if fingerprint/touchid is availble, if yes then show touch id dialog else show informative reveal
 */
function nextButtonClicked() {
	hideDeviceKeyboard();
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	function isAvailableSuccess(result) {
		showTouchIDDialog();
	}
	function isAvailableError(message) {
		$("#no-fingerprint-detected-reveal").foundation('open');
	}
}

function exitButtonClicked() {
	moveTo4digitPinsetupScreen() ;
}

/**
 * make AEM page post method request
 */
function makeAEMPageRequset() {
	var options = {};
	var form = document.createElement("form");
	var url = "https://www.youraccountonline.com/secure";
	form.setAttribute("method", "post");
	form.setAttribute("action", url);
	for (var data in options) {
		var hiddenField = document.createElement("input");
		hiddenField.setAttribute("type", "hidden");
		hiddenField.setAttribute("name", data);
		hiddenField.setAttribute("value", options[data]);
		form.appendChild(hiddenField);
	}
	document.body.appendChild(form);
	form.submit();
}

/**
 * if fingerprint / touch id is availble and no fingers enrolled then open settings app
 */
function setUpTouchIDClicked() {
	$("#no-fingerprint-detected-reveal").foundation('close');
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);

	function isAvailableSuccess(result) {
		//do nothing
	}

	function isAvailableError(message) {
		if (typeof cordova.plugins.settings.openSetting != undefined) {
			cordova.plugins.settings.openSetting(
				"security",
				function () {
					console.log("opened security settings")
				},
				function () {
					console.log("failed to open security settings")
				}
			);
		}
	}
}

/**
 * show native touch id dialog using plugin
 */
function showTouchIDDialog() {

	hideDeviceKeyboard();
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
				//@Sagar first set the message to display later on display the alert
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
		window.location = "../html/terms_and_conditions.html";
	}

	function errorCallback(err) {
		//@Sagar first set the message to display later on display the alert
		$("#message-to-display").html(error);
		$("#alert-dialog").foundation("open");
	}
}

function isMydeviceCompatibleCliked() {
	hideDeviceKeyboard();
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	function isAvailableSuccess(result) {
		$("#device-is-compatible-reveal").foundation('open')
	}
	function isAvailableError(message) {
		$("#device-is-not-compatible-reveal").foundation('open');
	}
}
