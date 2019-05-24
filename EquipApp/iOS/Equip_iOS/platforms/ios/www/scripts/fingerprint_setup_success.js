function onLoad() {
    document.addEventListener("backbutton", backButtonHandler, false);
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {
	document.addEventListener("resume", onAppResume, false);
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {
            if (msg == "face")
                $('#user-authentication').text("The Face ID has been setup successfully. On your next login, all you need is your Face ID for this device.");
            else
                $('#user-authentication').text("The Touch ID has been setup successfully. On your next login, all you need is your Touch ID for this device.");
        },
        // error callback, invoked when it's not available
        function (msg) {
            console.log("Error ::" + msg);

        });

}

function backButtonHandler() {
    //on this page it is valid to navigate the user back to the quick login page
    window.location = "../html/quick-login.html"
}

function performLoginRequest() {
    //document.getElementById("overlay-div").style.display = "block";
    if (isNetworkAvailable()) {
        $('#overlay-div').css("display", "block");
        setTimeout("navigateToDashboard()", 500);
    } else {
        $("#message-to-display").html("Please check your internet connection");
        $("#alert-dialog").foundation("open");
    }
}



