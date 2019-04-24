var empNo, planNo, password
/**
 * User has maximum 4 attempts to enter correct pin, on the 5th attempt take the user back to login screen
 * 
 * If the valid pin is entered then check if TnC is accepted if Yes then display AEM page else display TnC page
 */
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

//					$("#FourthDigit").blur();

					if (n.length == 4) {

						var ss = new cordova.plugins.SecureStorage(
							function () {
								//successfully init Secure Storage
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
								if (value == digitPin) {

									if (isNetworkAvailable()) {
										$("#overlay-div").css("display", "block");
										navigateToDashboard();
									} else {
										$("#message-to-display").html("Please check your internet connection");
										$("#alert-dialog").foundation("open");
									}

								} else {

									document.getElementById('FirstDigit').value = '';
									document.getElementById('SecondDigit').value = '';
									document.getElementById('ThirdDigit').value = '';
									document.getElementById('FourthDigit').value = '';

									var incorrectPinCounter = localStorage.getItem('incorrectPinCounter');
									var counter = parseInt(incorrectPinCounter)
									counter = incorrectPinCounter - 1;
									localStorage.setItem('incorrectPinCounter', counter);
									if (counter == 0) {
										//@Sagar first set the message to display later on display the alert
										$("#max-attempts-message").html("Incorrect PIN entered.</br>You have no more attempts.</br>Please login with your website login credentials");
										$("#max-attempts-alert-dialog").foundation("open");

									} else {
										//@Sagar first set the message to display later on display the alert
										$("#message-to-display").html("Incorrect PIN entered</br>You have " + counter + " more attempts left");
										$("#alert-dialog").foundation("open");

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

/**
 * Remove pin from device storage and navigate to the login screen 
 */
function forgotCodeButtonClicked() {
	clearRequiredData();
	window.location = "../index.html";
}

function textBoxFocus(textBox) {
	textBox.value = '';
}

function onLoad() {
	localStorage.setItem('incorrectPinCounter', 5);
	document.addEventListener("deviceready", onDeviceReady, false);
	document.addEventListener("backbutton", backButtonHandler, false);
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
		//window.history.back();
		return false;
	}
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);
	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);

	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	//if fingerprint is available then display fingerprint button
	function isAvailableSuccess(result) {

		var isFingerprintSetupDone = localStorage.getItem("isFingerprintSetupDone");
		//checking the value of whether the maximum attempts have been reached on the quick login page or not
		var qlFpMaxAttemptsReached = localStorage.getItem("qlFpMaxAttemptsReached");
		//checking the default login style
		var isFingerprintDefaultStyle = localStorage.getItem("isFingerprintDefaultStyle");

		if (isFingerprintSetupDone && qlFpMaxAttemptsReached && (isFingerprintDefaultStyle && !(isFingerprintDefaultStyle == 'true'))) {
			document.getElementById('btnFingerprint').style.visibility = 'unset';
			document.getElementById('lblFingerprintPrintOR').style.visibility = 'unset';
		}
	}
	//if fingerprint is not available then don't do anything
	function isAvailableError(message) {
		//fingerprint button and the label are already hidden
		//hiding the login settings if the fingerprint is not setup
		document.getElementById("list-item-login-settings").style.display = "none";
	}

}

function openFingerprint() {

	hideDeviceKeyboard();
	Fingerprint.show({
		clientId: "Fingerprint-Demo",
		clientSecret: "password", //Only necessary for Android
		disableBackup: true

	}, successCallback, errorCallback);

	function successCallback() {
		if (isNetworkAvailable()) {
			$("#overlay-div").css("display", "block");
			setTimeout("navigateToDashboard()", 500);
		} else {
			$("#message-to-display").html("Please check your internet connection");
			$("#alert-dialog").foundation("open");
		}
	}

	function errorCallback(err) {
		if (!(err == "Cancelled")) {
			$("#message-to-display").html("Invalid authentication/Fingerprint max attempts reached");
			$("#alert-dialog").foundation("open");
		}
	}

}

function navigateToLoginPage() {
	clearRequiredData();
	setTimeout(function(){window.location = '../index.html';},1000*2)

}
function okclicked() {
	clearAllBoxes();
	document.getElementById('FirstDigit').focus();
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