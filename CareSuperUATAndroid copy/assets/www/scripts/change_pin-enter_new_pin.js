function onLoadPage() {
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
	if((document.querySelector('body')).classList.contains('is-reveal-open')){
    	return false;
    } else {
        onBackClick();
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

				var sum = 0;
				var dateChk = new Date().getFullYear();
				var val = parseFloat(firstDigit);
				var planNo = localStorage.getItem("EmployeeNumber");
				var memberNo = localStorage.getItem("Membernumber");
				if (this.id == 'FourthDigit') {

					$("#FourthDigit").blur();
					if (n.length == 4) {
						
						if (firstDigit == secondDigit && secondDigit == thirdDigit && thirdDigit == fourthDigit && fourthDigit == firstDigit) {
							$("#wrong-pin-reveal").foundation('open');
							document.getElementById('FirstDigit').value = '';
							document.getElementById('SecondDigit').value = '';
							document.getElementById('ThirdDigit').value = '';
							document.getElementById('FourthDigit').value = '';
						}
						else if (firstDigit == val && secondDigit == val + 1 && thirdDigit == val + 2 && fourthDigit == val + 3) {
							$("#wrong-pin-reveal").foundation('open');
							document.getElementById('FirstDigit').value = '';
							document.getElementById('SecondDigit').value = '';
							document.getElementById('ThirdDigit').value = '';
							document.getElementById('FourthDigit').value = '';
						}
						else if (firstDigit == val && secondDigit == val - 1 && thirdDigit == val - 2 && fourthDigit == val - 3) {
							$("#wrong-pin-reveal").foundation('open');
							document.getElementById('FirstDigit').value = '';
							document.getElementById('SecondDigit').value = '';
							document.getElementById('ThirdDigit').value = '';
							document.getElementById('FourthDigit').value = '';
						}
						else {
							var firstDigit = document.getElementById('FirstDigit').value;
							var secondDigit = document.getElementById('SecondDigit').value;
							var thirdDigit = document.getElementById('ThirdDigit').value;
							var fourthDigit = document.getElementById('FourthDigit').value;
							var digitPin = firstDigit + secondDigit + thirdDigit + fourthDigit;

							checkForSamePIN(digitPin);

						}
					}
					else {
						clearAllBoxes();
						$("#message-to-display_new_pin").html(NOT_VALID_PIN);
						$("#alert-dialog_new_pin").foundation("open");
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

function checkForSamePIN(digitPin) {

	hideDeviceKeyboard();
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			//@Sagar first set the message to display later on display the alert-- >
			//Below message can be updated for better user information-- >
			$("#message-to-display_new_pin").html("Error");
			$("#alert-dialog_new_pin").foundation("open");
		},
		'my_app'
	);
	ss.get(
		function (value) {
			if (value == digitPin) {

				$("#message-to-display_new_pin").html("Entered PIN is same as Current PIN. Please enter a different PIN.");
				$("#alert-dialog_new_pin").foundation("open");

				document.getElementById('FirstDigit').value = '';
				document.getElementById('SecondDigit').value = '';
				document.getElementById('ThirdDigit').value = '';
				document.getElementById('FourthDigit').value = '';

			} else {

				localStorage.setItem("digitPin", digitPin);
				localStorage.setItem('userNavigatefrom', 'confirmPinSetup');
                window.location = '../html/enter_4_digit_pin-quick_pin_setup.html';
				// window.location = "../html/change_pin-confirm_new_pin.html";
				document.getElementById('FirstDigit').value = '';
				document.getElementById('SecondDigit').value = '';
				document.getElementById('ThirdDigit').value = '';
				document.getElementById('FourthDigit').value = '';

			}

		},
		function (error) {
			console.log('Error ' + error);
		},
		'devicepin'
	);

}

function textBoxFocus(textBox) {
	textBox.value = '';
}

function okclicked() {
	clearAllBoxes();
	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);
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

function onBackClick() {
    localStorage.setItem('userNavigatefrom', 'hamburgerpage');
    window.location = "../html/enter_4_digit_pin-quick_pin_setup.html";
}
