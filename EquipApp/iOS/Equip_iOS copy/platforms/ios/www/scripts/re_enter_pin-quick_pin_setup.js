$(".pin-textbox").keyup(
	function (event) {
		if (isNumberKey(event)) {
			$("#FirstDigit").attr('maxlength', '1');
			$("#SecondDigit").attr('maxlength', '1');
			$("#ThirdDigit").attr('maxlength', '1');
			$("#FourthDigit").attr('maxlength', '1');
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
							document.getElementById('FourthDigit').blur();
							$("#pin-doesnt-match-reveal").foundation('open');
							document.getElementById('FirstDigit').value = '';
							document.getElementById('SecondDigit').value = '';
							document.getElementById('ThirdDigit').value = '';
							document.getElementById('FourthDigit').value = '';
						}

					} else {

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
	}
);

//Store the pin on the device
function storeDetails() {
	hideDeviceKeyboard();
	try {

		var ss = new cordova.plugins.SecureStorage(
			function () {
			},
			function (error) {
				console.log('Error ' + error);
				//@Sagar first set the message to display and then display the alert
				$("#message-to-display").html(error);
				$("#alert-dialog").foundation("open");
			},
			'my_app'
		);

		var digitPin = localStorage.getItem("digitPin").toString();
		ss.set(
			function (key) {
				//removing digit pin from local storage due to security
				localStorage.removeItem("digitPin");
				ss.set(
					function (key) {
					},
					function (error) {
						console.log('Error ' + error);
					},
					'quickLoginType', 'Device Pin'
				);
				window.plugins.touchid.isAvailable(
					// success callback, invoked when it's available
					function (msg) {
						if (msg == "face")
							$('#user-authentication').text("Face ID is available for this device. Would you like to set up Face ID now?");
						else
							$('#user-authentication').text("Touch ID is available for this device. Would you like to set up Touch ID now?");
						localStorage.setItem("isFingerPrintAvail", true);
						$("#fingerprint-basic").foundation('open');
					},

					// error callback, invoked when it's not available
					function (msg) {

						localStorage.setItem("isFingerPrintAvail", false);
						window.location = '../html/quick_pin_setup_success.html';



					});
			},
			function (error) {
				console.log('Error ' + error);
			},
			'devicepin', digitPin
		);
	}
	catch (err) {
		//@Sagar first set the message to display and then display the alert
		$("#message-to-display").html("Error in storing pin on device, please check security settings on your device");
		$("#alert-dialog").foundation("open");
	}
}

function textBoxFocus(textBox) {
	textBox.value = '';
}

function openFingerPrintSetup() {
	$("#fingerprint-basic").foundation('close');
	window.location = "../html/fingerprint_login_setup.html";
}

function goBackToPrevious() {
	window.history.back();
}

function navigateToTerms() {
	$("#fingerprint-basic").foundation('close');
	window.location = '../html/quick_pin_setup_success.html';
}
function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}
function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);
	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);
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