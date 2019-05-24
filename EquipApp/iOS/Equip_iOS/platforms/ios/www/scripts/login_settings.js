function onLoad() {
	localStorage.setItem('ls_incorrectPinCounter', 5);
	document.addEventListener("deviceready", onDeviceReady, false);
}
var accessType = "";
function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);
	window.plugins.touchid.isAvailable(
		// success callback, invoked when it's available
		function (msg) {
			accessType = msg;
			if (msg == "face") {
				$('#reveal-msg-para').text("Before setting up Face ID access, it's important to note that anyone who stores their Face ID on this device will have access to your account/s.");
				$('#setup-title').text("Now you can log in more easily using only your Face ID.");
				$('#setup-para').text("Tap below to enable / disable Face ID as your preferred login method.");
				$('#fingerprint-default').text("Face ID is enabled");
				$('#fingerprint-not-default').text("Face ID is disabled");
				$('#login-settings-mesg').text("This application has support for Face ID login");
				$('#login-settings-para').text("It seems that you have not yet setup Face ID on your device</br>Click below to go to settings and setup Face ID");
				$('#login-settings-description1').text("This application has support for Face ID");
				$('#login-settings-description2').text("Setup Face ID now for quick login");
				$('#setup-button').text("Setup Face ID");
			}
			else {
				$('#reveal-msg-para').text("Before setting up Touch ID access, it's important to note that anyone who stores their Touch ID on this device will have access to your account/s.");
				$('#setup-title').text("Now you can log in more easily using only your Touch ID.");
				$('#setup-para').text("Tap below to enable / disable Touch ID as your preferred login method.");
				$('#fingerprint-default').text("Touch ID is enabled");
				$('#fingerprint-not-default').text("Touch ID is disabled");
				$('#login-settings-mesg').text("This application has support for Touch ID");
				$('#login-settings-para').text("It seems that you have not yet setup Touch ID on your device</br>Click below to go to settings and setup Touch ID");
				$('#login-settings-description1').text("This application has support for Touch ID");
				$('#login-settings-description2').text("Setup Touch ID now for quick login");
				$('#setup-button').text("Setup Touch ID");
			}
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
			} else {
				document.getElementById("fingerprint-error-div").style.display = "none";
				document.getElementById("fingerprint-setup-done-div").style.display = "none";
				document.getElementById("fingerprint-setup-div").style.display = "unset";
			}


		}
		, // error callback, invoked when it's not available
		function (msg) {


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






			if (msg.code == '-6') {
				//$("#fingerprint-not-availabl").foundation('open');


			}
			else {

			}
		});

	var fpSwitch = document.getElementById('security-switch-ip');
	var fpDefault = document.getElementById('fingerprint-default');
	var fpNotDefault = document.getElementById('fingerprint-not-default');

	fpSwitch.onchange = function () {
		if (fpSwitch.checked) {
			fpDefault.style.display = "block";
			fpNotDefault.style.display = "none";
			localStorage.setItem("isFingerprintDefaultStyle", true);
		} else {
			fpDefault.style.display = "none";
			fpNotDefault.style.display = "block";
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
	document.getElementById('FirstDigit').focus();
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

                               clearAllBoxes();
                               
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
	window.location = '../index.html';
}


function showFPDialog() {
	var accessMesg = "";
	if (accessType == "face")
		accessMesg = "Scan your Face ID please";
	else
		accessMesg = "Scan your Touch ID please";
	localStorage.setItem("accessMesg", accessMesg);
	window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
		accessMesg, // this will be shown in the native scanner popup
		'Skip', // this will become the 'Enter password' button label
		function (msg) {
			if (accessType == "face")
				$("#fp-message").html("Face ID setup successful!!</br>It has been set as the default login style and can be changed any time from the app menu");
			else
				$("#fp-message").html("Touch ID setup successful!!</br>It has been set as the default login style and can be changed any time from the app menu");
			$("#fingerprint-dialog").foundation("open");
		}, // success handler: fingerprint accepted
		function (msg) {


			if (msg.code == "-3") {
				window.location = '../html/enter_device_pin.html';
			} else if (msg.code == "-1") {
				if (accessMesg == "Scan your Face ID please")
					$("#message-to-display-FP").html("Invalid authentication/Face ID max attempts reached.");
				else
					$("#message-to-display-FP").html("Invalid authentication/Touch ID max attempts reached.");
				$("#alert-dialog-FP").foundation("open");
			} else if (msg.code == "-8") {
				$("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts.");
				$("#alert-dialog-FP").foundation("open");
			}
			else if (msg.code == "-2") {
				//console.log("Cancel Clicked" + msg.code);
			} else {
				$("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. Please Unlock Device to continue");
				$("#alert-dialog-FP").foundation("open");
			}

		} // error handler with errorcode and localised reason
	);

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

	document.getElementById('fingerprint-default').style.display = "block";
	document.getElementById('fingerprint-not-default').style.display = "none";

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
//    $("#FirstDigit").focus();

	$("#secondDiv").css("display", "none");
	$("#SecondDigit").css("display", "flex");

	$("#thirdDiv").css("display", "none");
	$("#ThirdDigit").css("display", "flex");

	$("#fourthDiv").css("display", "none");
	$("#FourthDigit").css("display", "flex");
    document.getElementById('incorrect-attempts-counter').style.display = "none";

}
