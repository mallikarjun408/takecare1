function showLoadingIndicator() {
    document.getElementById("loading-img-container").style.display = "block";
}

function hideLoadingIndicator() {
    document.getElementById("loading-img-container").style.display = "none";
}

function showAvailableBalance() {
    document.getElementById("quick-balance-slide-container").style.display = "block";
}

function hideAvailableBalance() {
    document.getElementById("quick-balance-slide-container").style.display = "none";
}

function onload() {

    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {

            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );



    ss.get(
        function (value) {
            if (value == 'true') {
                // //this variable is used for checking whether the user has navigated back from the T&C page after accepting the same

                setTimeout("showLoadingIndicator(),hideAvailableBalance()", 100); // after 0.1 sec
                setTimeout("showAvailableBalance(),hideLoadingIndicator()", 5000); // after 5 secs
            } else {

                document.getElementById("message-to-Enable-QB").style.display = "block";

            }
        },
        function (error) {
            console.log('Error ' + error);
        },
        'isBalanceWithoutEnabled'
    );

}


function quickLoginClicked() {
    var isFingerPrintSetupDone = localStorage.getItem("isFingerprintSetupDone");


    if (isFingerPrintSetupDone) {
        openFingerprint();

    } else {

        window.location = '../html/enter_device_pin.html';
    }
}

function openFingerprint() {
    var accessMesg = localStorage.getItem("accessMesg");
    if (accessMesg == null)
        accessMesg = "Scan your Touch ID please";
    window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
        accessMesg, // this will be shown in the native scanner popup
        'Enter PIN', // this will become the 'Enter password' button label
        function (msg) {
            if (isNetworkAvailable()) {
                $('#overlay-div').css("display", "block");
                navigateToDashboard();
            } else {
                $("#message-to-display").html("Please check your internet connection");
                $("#alert-dialog").foundation("open");
            }

        }, // success handler: fingerprint accepted
        function (msg) {


            if (msg.code == "-3") {
                window.location = '../html/enter_device_pin.html';
            } else if (msg.code == "-1") {
                if (accessMesg == "Scan your Face ID please")
                    $("#message-to-display-FP").html("Invalid authentication/Face ID max attempts reached. You can Use 4-digit PIN");
                else
                    $("#message-to-display-FP").html("Invalid authentication/Touch ID max attempts reached. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            } else if (msg.code == "-8") {
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            }
            else if (msg.code == "-2") {
                //console.log("Cancel Clicked" + msg.code);
            } else {
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            }

        } // error handler with errorcode and localised reason
    );

}

function enterPINPage() {
    window.location = "../html/enter_device_pin.html";
}

function gotoEnterPin() {
    $("#max-attempts-dialog").foundation("close");
    window.location = "../html/enter_device_pin.html"
}
