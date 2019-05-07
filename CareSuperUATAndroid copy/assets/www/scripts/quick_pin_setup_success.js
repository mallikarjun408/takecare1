function onLoad(){
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", backButtonHandler, false);
}

function onDeviceReady(){
	document.addEventListener("resume", onAppResume, false);
}

function backButtonHandler() {
    //on this page it is valid to navigate the user back to the quick login page
    window.location = "../html/quick-login.html"
}

function performLoginRequest(){
    if (isNetworkAvailable()) {
        document.getElementById("overlay-div").style.display = "block";
        setTimeout("navigateToDashboard()",500);
    } else {
        $("#message-to-display").html(INTERNET_AVAILABILITY_MSG);
		$("#alert-dialog").foundation("open");
    }
}