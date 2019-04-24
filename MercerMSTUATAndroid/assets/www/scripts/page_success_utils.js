function onLoad(){
    document.addEventListener("backbutton", backButtonHandler, false);
}

function backButtonHandler() {
    //on this page it is valid to navigate the user back to the quick login page
    window.location = "../html/quick-login.html"
}

function doWebLogin(){
    if (isNetworkAvailable()) {
        document.getElementById("overlay-div").style.display = "block";
        setTimeout("navigateToDashboard()",500);
    } else {
        $("#message-to-display").html("Please check your internet connection");
		$("#alert-dialog").foundation("open");
    }
}