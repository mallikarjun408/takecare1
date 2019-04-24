function nextCliked() {
	moveTo4digitPinsetupScreen() ;
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