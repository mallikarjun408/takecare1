function onLoad() {
	localStorage.setItem('ls_incorrectPinCounter', 5);
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);

	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	//if fingerprint is available then display fingerprint button
	function isAvailableSuccess(result) {

		var isFingerprintSetupDone = localStorage.getItem("isFingerprintSetupDone");
		var isFingerprintDefaultStyle = localStorage.getItem("isFingerprintDefaultStyle");

		if (isFingerprintSetupDone) {
			document.getElementById("fingerprint-error-div").style.display = "none";
			document.getElementById("fingerprint-setup-done-div").style.display = "unset";
			document.getElementById("fingerprint-setup-div").style.display = "none";
			var fpSwitch = document.getElementById('security-switch-ip');
			var fpDefault = document.getElementById('fingerprint-default');
			var fpNotDefault = document.getElementById('fingerprint-not-default');
			if (isFingerprintDefaultStyle == "true") {
				fpSwitch.checked = true;
				fpDefault.style.display = "block";
				fpNotDefault.style.display = "none";
			} else {
				fpSwitch.checked = false;
				fpDefault.style.display = "none";
				fpNotDefault.style.display = "block";
			}

			//@Sagar setting visibility of both div to none
			//since the value is set in the div next to switch
			fpDefault.style.display = "none";
			fpNotDefault.style.display = "none";

		} else {
			document.getElementById("fingerprint-error-div").style.display = "none";
			document.getElementById("fingerprint-setup-done-div").style.display = "none";
			document.getElementById("fingerprint-setup-div").style.display = "unset";
		}
	}

	function isAvailableError(message) {

		var isFingerprintSetupDone = localStorage.getItem("isFingerprintSetupDone");

		if (isFingerprintSetupDone) {
			document.getElementById("fingerprint-error-div").style.display = "unset";
			document.getElementById("fingerprint-setup-done-div").style.display = "none";
			document.getElementById("fingerprint-setup-div").style.display = "none";
		} else {
			document.getElementById("fingerprint-error-div").style.display = "none";
			document.getElementById("fingerprint-setup-done-div").style.display = "none";
			document.getElementById("fingerprint-setup-div").style.display = "unset";
		}
	}

	var fpSwitch = document.getElementById('security-switch-ip');

	fpSwitch.onchange = function () {
		if (fpSwitch.checked) {
			$("#def-login-style").text("Fingerprint login is now enabled");
			localStorage.setItem("isFingerprintDefaultStyle", true);
		} else {
			$("#def-login-style").text("Fingerprint login is disabled");
			localStorage.setItem("isFingerprintDefaultStyle", false);
		}
	};
}

function setupFingerprint() {

	var incorrectPinCounter = localStorage.getItem("ls_incorrectPinCounter");
	var counter = parseInt(incorrectPinCounter);
	if (counter <= 0) {
		//@Sagar first set the message to display later on display the alert
		$("#max-attempts-message").html("You have no more attempts left for identity verification.</br>Please login with your website login credentials");
		$("#max-attempts-alert-dialog").foundation("open");
	} else {
		hideDeviceKeyboard();
		$("#fp-info-dialog").foundation("open");
	}

}

function dismissDialog() {
	$("#fp-info-dialog").foundation("close");
}

function verifyUserIdentity() {
	$("#fp-verify-dialog").foundation("open");
	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);
}

$(".pin-textbox").keyup(
	function (event) {
		if (isNumberKey(event)) {

			if (this.value.length == this.maxLength) {

				if (this.id == "FirstDigit") {
					$("#firstDiv").css("display", "flex");
					$("#FirstDigit").css("display", "none");

					var hiddenDiv = $(this).next('.empty-hidden-field').next('#secondDiv');
					hiddenDiv.next('.pin-textbox').focus();

				} else if (this.id == "SecondDigit") {
					$("#secondDiv").css("display", "flex");
					$("#SecondDigit").css("display", "none");

					var hiddenDiv = $(this).next('.empty-hidden-field').next('#thirdDiv');
					hiddenDiv.next('.pin-textbox').focus();

				} else if (this.id == "ThirdDigit") {
					$("#thirdDiv").css("display", "flex");
					$("#ThirdDigit").css("display", "none");

					var hiddenDiv = $(this).next('.empty-hidden-field').next('#fourthDiv');
					hiddenDiv.next('.pin-textbox').focus();

				} else if (this.id == "FourthDigit") {
					$("#fourthDiv").css("display", "flex");
					$("#FourthDigit").css("display", "none");
				}

				var firstDigit = document.getElementById('FirstDigit').value;
				var secondDigit = document.getElementById('SecondDigit').value;
				var thirdDigit = document.getElementById('ThirdDigit').value;
				var fourthDigit = document.getElementById('FourthDigit').value;
				var digitPin = firstDigit + secondDigit + thirdDigit + fourthDigit;
				var n = digitPin.toString();

				if (this.id == 'FourthDigit') {

					$("#FourthDigit").blur();

					if (n.length == 4) {					

						document.getElementById('FourthDigit').blur();
						var ss = new cordova.plugins.SecureStorage(
							function () {
							},
							function (error) {
								console.log('Error ' + error);
								//@Sagar first set the message to display later on display the alert
								//Below message can be updated for better user information
								$("#message-to-display").html("Error");
								$("#alert-dialog").foundation("open");
							},
							'my_app'
						);
						ss.get(
							function (value) {

								document.getElementById('FirstDigit').value = '';
								document.getElementById('SecondDigit').value = '';
								document.getElementById('ThirdDigit').value = '';
								document.getElementById('FourthDigit').value = '';

								if (value == digitPin) {
									$("#fp-verify-dialog").foundation("close");
									localStorage.setItem('ls_incorrectPinCounter', 5);
									showFPDialog();
								} else {

									var incorrectPinCounter = localStorage.getItem('ls_incorrectPinCounter');
									var counter = parseInt(incorrectPinCounter)
									counter = incorrectPinCounter - 1;
									localStorage.setItem('ls_incorrectPinCounter', counter);

									$("#firstDiv").css("display", "none");
									$("#FirstDigit").css("display", "flex");
									$("#FirstDigit").focus();

									$("#secondDiv").css("display", "none");
									$("#SecondDigit").css("display", "flex");

									$("#thirdDiv").css("display", "none");
									$("#ThirdDigit").css("display", "flex");

									$("#fourthDiv").css("display", "none");
									$("#FourthDigit").css("display", "flex");

									if (counter <= 0) {
										document.getElementById('incorrect-attempts-counter').style.display = "none";
										$("#fp-verify-dialog").foundation("close");
										//@Sagar first set the message to display later on display the alert
										$("#max-attempts-message").html("Incorrect PIN entered.</br>You have no more attempts.</br>Please login with your website login credentials");
										$("#max-attempts-alert-dialog").foundation("open");

									} else {
										document.getElementById('incorrect-attempts-counter').style.display = "unset";
										$("#incorrect-attempts-counter").html("Incorrect PIN entered</br>You have " + counter + " more attempts left");
										document.getElementById('FirstDigit').focus();

									}
								}

							},
							function (error) {
								console.log('Error ' + error);
							},
							'devicepin'
						);

					}
					else {

						clearAllBoxes();
						$("#message-to-display").html("Not a valid PIN, please re-enter");
						$("#alert-dialog").foundation("open");

					}

				}

			}
		} else {
			var charCode = (event.which) ? event.which : event.keyCode
			//char code for the delete button is 8
			if (charCode == 8) {

				if (this.id == "SecondDigit") {
					$("#firstDiv").css("display", "none");
					$("#FirstDigit").css("display", "flex");
					$("#FirstDigit").focus();
				} else if (this.id == "ThirdDigit") {
					$("#secondDiv").css("display", "none");
					$("#SecondDigit").css("display", "flex");
					$("#SecondDigit").focus();
				} else if (this.id == "FourthDigit") {
					$("#thirdDiv").css("display", "none");
					$("#ThirdDigit").css("display", "flex");
					$("#ThirdDigit").focus();
				}

			} else {
				this.value = "";
			}
		}
	}
);

function textBoxFocus(textBox) {
	textBox.value = '';
}

function navigateToLoginPage() {
	hideDeviceKeyboard();
	var ss = new cordova.plugins.SecureStorage(
		function () {
			//successfully initialized secure storage
		},
		function (error) {
			console.log('Error ' + error);
			//@Sagar first set the message to display later on display the alert
			//Below message can be updated for better user information
			$("#message-to-display").html("Error");
			$("#alert-dialog").foundation("open");
		},
		'my_app'
	);
	ss.remove(
		function (key) {
			console.log('Removed ' + key);
		},
		function (error) {
			console.log('Error, ' + error);
		},
		'devicepin'
	);
	ss.remove(
		function (key) {
			console.log('Removed ' + key);
		},
		function (error) {
			console.log('Error, ' + error);
		},
		'quickLoginType'
	);
	ss.set(
		function (key) {

		},
		function (error) {
			console.log('Error ' + error);
		},
		'isBalanceWithoutEnabled', 'false'
	);
	localStorage.clear();
	var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close,clearsessioncache=yes";
    var inAppBrowserObject = cordova.InAppBrowser.open("", '_blank', option);
    //setTimeout(function(){window.location = "../index.html"},10);
    window.location = "../index.html"
}

function showFPDialog() {

	$("#fp-info-dialog").foundation("close");
	hideDeviceKeyboard();
	Fingerprint.show({
		clientId: "Fingerprint-Demo",
		clientSecret: "password", //Only necessary for Android
		disableBackup: true

	}, successCallback, errorCallback);

	function successCallback() {

		$("#fp-message").html("Fingerprint set-up successful!!</br>It has been set as the default login style and can be changed any time from the app menu");
		$("#fingerprint-dialog").foundation("open");

	}

	function errorCallback(err) {
		if (!(err == "Cancelled")) {
			$("#message-to-display").html("Invalid authentication/Fingerprint max attempts reached");
			$("#alert-dialog").foundation("open");
		}
	}

}

function displayFPSettings() {

	hideDeviceKeyboard();
	document.getElementById("overlay-div").style.display = "none";
	$("#fingerprint-dialog").foundation("close");

	localStorage.setItem("isFingerprintSetupDone", true);
	localStorage.setItem("isFingerprintDefaultStyle", true);

	var fpSwitch = document.getElementById('security-switch-ip');
	fpSwitch.checked = true;

	document.getElementById("fingerprint-setup-done-div").style.display = "unset";
	document.getElementById("fingerprint-setup-div").style.display = "none";

	//@Sagar setting visibility of both div to none
	//since the value is set in the div next to switch
	document.getElementById('fingerprint-default').style.display = "none";
	document.getElementById('fingerprint-not-default').style.display = "none";

	$("#def-login-style").text("Default login style : Fingerprint");

}

function updateBackground() {
	document.getElementById("overlay-div").style.display = "block";
	setTimeout("displayFPSettings()", 1000);
}

function gotoSettings() {
	if (window.cordova && window.cordova.plugins.settings) {
		window.cordova.plugins.settings.open("security", function () {
			//settings opened successfully
		},
			function () {
				console.log('failed to open settings');
			}
		);
	} else {
		console.log('openNativeSettingsTest is not active!');
	}
}

function firstDivClick() {
	$("#firstDiv").css("display", "none");
	$("#FirstDigit").css("display", "flex");
	$("#FirstDigit").focus();
	openDeviceKeyboard();
}

function secondDivClick() {
	$("#secondDiv").css("display", "none");
	$("#SecondDigit").css("display", "flex");
	$("#SecondDigit").focus();
	openDeviceKeyboard();
}

function thirdDivClick() {
	$("#thirdDiv").css("display", "none");
	$("#ThirdDigit").css("display", "flex");
	$("#ThirdDigit").focus();
	openDeviceKeyboard();
}

function fourthDivClick() {
	$("#fourthDiv").css("display", "none");
	$("#FourthDigit").css("display", "flex");
	$("#FourthDigit").focus();
	openDeviceKeyboard();
}

function clearAllBoxes() {

	document.getElementById('FirstDigit').value = '';
	document.getElementById('SecondDigit').value = '';
	document.getElementById('ThirdDigit').value = '';
	document.getElementById('FourthDigit').value = '';

	$("#firstDiv").css("display", "none");
	$("#FirstDigit").css("display", "flex");
	$("#FirstDigit").focus();

	$("#secondDiv").css("display", "none");
	$("#SecondDigit").css("display", "flex");

	$("#thirdDiv").css("display", "none");
	$("#ThirdDigit").css("display", "flex");

	$("#fourthDiv").css("display", "none");
	$("#FourthDigit").css("display", "flex");

}