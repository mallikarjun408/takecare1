function onLoad() {
	document.addEventListener("backbutton", backButtonHandler, false);
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);

	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);

	//check if fingerprint is available or not to display the login settings
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	function isAvailableSuccess() {
		//do nothing as the login settings option is required to be displayed
	}
	function isAvailableError() {
		document.getElementById("list-item-login-settings").style.display = "none";
	}

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
	}
	//do not perform any operation in the else block of isHamburgerMenuOpen
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
						
						if (localStorage.getItem("digitPin") == digitPin) {
							//Add the pin in secure storage / keychain
							storeDetails();
						} else {
							//@Sagar first set the message to display later on display the alert
							$("#message-to-display").html("PIN does not match, Please enter correct PIN");
							$("#alert-dialog").foundation("open");
							document.getElementById('FirstDigit').value = '';
							document.getElementById('SecondDigit').value = '';
							document.getElementById('ThirdDigit').value = '';
							document.getElementById('FourthDigit').value = '';
						}
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

function storeDetails() {

	hideDeviceKeyboard();
	var ss = new cordova.plugins.SecureStorage(
		function () {
			//secure storage object successfully initialized
		},
		function (error) {
			console.log('Error in Change Pin Confirm New Pin ' + error);
			//@Sagar first set the message to display later on display the alert
			//Below message can be updated for better user information
			$("#message-to-display").html("Error");
			$("#alert-dialog").foundation("open");
		},
		'my_app'
	);

	var digitPin = localStorage.getItem("digitPin").toString();
	ss.set(
		function (key) {
			//removing digit pin from local storage due to security
			localStorage.removeItem("digitPin");
			$("#change-pin-success-reveal").foundation('open');
		},
		function (error) {
			console.log('Error ' + error);
		},
		'devicepin', digitPin
	);

	ss.get(
		function (value) {
			//successfully fetched value
		},
		function (error) {
			console.log('Error in fetching value' + error);
		},
		'devicepin'
	);

}

function textBoxFocus(textBox) {
	textBox.value = '';
}


function goToEnterNewPIN() {
	window.location = "../html/change_pin-enter_new_pin.html";

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