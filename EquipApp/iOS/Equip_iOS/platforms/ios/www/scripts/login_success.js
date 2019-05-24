function nextCliked() {
	window.location = "../html/enter_4_digit_pin-quick_pin_setup.html";
}

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", backButtonHandler, false);
}

function onDeviceReady(){
	document.addEventListener("resume", onAppResume, false);
}

function backButtonHandler() {
	//do nothing
}
