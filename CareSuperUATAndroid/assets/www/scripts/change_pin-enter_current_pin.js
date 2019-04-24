function onLoadPage() {
    document.getElementById('FirstDigit').focus();
    localStorage.setItem('incorrectPinCounter', INCORRECT_PIN_COUNTER);
	document.addEventListener("backbutton", backButtonHandler, false);
	document.addEventListener("deviceready", onDeviceReady, false);

	$(".is-reveal-open").on("click", function(e) { $("#alert-dialog_current_pin").foundation("open");
       // rest of handler
    });
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);

	//focussing on the first field
	document.getElementById('FirstDigit').focus();
	//forcibly displaying the keyboard on the focus in the first field
	//after timeout of 0.5 sec for better behaviour
	setTimeout("Keyboard.show()", 500);
}

function backButtonHandler() {
	//over riding back button for not allowing user to perform any operations
	if((document.querySelector('body')).classList.contains('is-reveal-open')){
	    return false;
	} else{
	    onBackClick();
	}
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

						var ss = new cordova.plugins.SecureStorage(
							function () {
								console.log('Success')
							},
							function (error) {
								console.log('Error ' + error);
								//@Sagar first set the message to display later on display the alert
								//Below message can be updated for better user information
								$("#message-to-display_current_pin").html("Error");
								$("#alert-dialog_current_pin").foundation("open");
							},
							'my_app'
						);
						ss.get(
							function (value) {
								console.log('Success, got ' + value);
								localStorage.setItem('userNavigatefrom', 'newPinSetup');
								if (value == digitPin) {
									//window.location = '../html/change_pin-enter_new_pin.html';
									window.location = '../html/enter_4_digit_pin-quick_pin_setup.html';
								} else {


								var incorrectPinCounter = localStorage.getItem('incorrectPinCounter');
                                var counter = parseInt(incorrectPinCounter)
                                counter = incorrectPinCounter - 1;
                                localStorage.setItem('incorrectPinCounter', counter);
                            //    INCORRECT_PIN_COUNTER = counter;
                                if (counter == 0) {
                                    //@Sagar first set the message to display later on display the alert
                                    $("#max-attempts-message").html(NO_MORE_ATTEMPTS_MSG);
                                    $("#max-attempts-alert-dialog").foundation("open");
                                    localStorage.setItem("isServiceFirstRun", false);

                                } else {
                                    //@Sagar first set the message to display later on display the alert
                                    $("#message-to-display_current_pin").html("Incorrect PIN entered</br>You have " + counter + " more attempts left");
                                    $("#alert-dialog_current_pin").foundation("open");
                                    document.getElementById('FirstDigit').value = '';
                                    document.getElementById('SecondDigit').value = '';
                                    document.getElementById('ThirdDigit').value = '';
                                    document.getElementById('FourthDigit').value = '';
                                    document.getElementById('FirstDigit').focus();

                                }
									//@Sagar first set the message to display later on display the alert
									// $("#message-to-display_current_pin").html("That PIN is incorrect. Please try again.");
									// $("#alert-dialog_current_pin").foundation("open");


								}

							},
							function (error) {
								console.log('Error ' + error);
							},
							'devicepin'
						);
					} else {
						clearAllBoxes();
						$("#message-to-display_current_pin").html(NOT_VALID_PIN);
						$("#alert-dialog_current_pin").foundation("open");
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


/*
function onBackClick() {
    //window.location = "../html/quick-login.html";
    window.history.back();
} */

function onBackClick() {

    var isPinSetBack = localStorage.getItem("pinSetBackClick");

    if(isPinSetBack == "fromFingerPrintSetupBack"){

        window.location = "../html/quick_pin_setup_success.html";

    }

    else if (isPinSetBack == "fromQuickLoginBack"){

        window.location = "../html/quick-login.html";

    }

}