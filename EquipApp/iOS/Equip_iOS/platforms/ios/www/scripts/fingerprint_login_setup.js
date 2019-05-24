function onLoad() {
    document.addEventListener("backbutton", backButtonHandler, false);
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {
            if (msg == "face") {
                $('#setup-title').text("Face ID setup");
                $('#user-authentication').text("Before setting up Face ID access, it's important to note that anyone who stores their Face ID on this device will have access to your account/s.");
                $('#detect-title').text("No Face ID detected");
                $('#detect-para').text("This might be because your device isn't Face ID compatible, or because you haven't stored any Face ID on it.");
                $('#setup-button').text("Setup Face ID");
                $('#cancel-message').text("Cancel Face ID set-up");
            } else {
                $('#setup-title').text("Touch ID setup");
                $('#user-authentication').text("Before setting up Touch ID access, it's important to note that anyone who stores their Touch ID on this device will have access to your account/s.");
                $('#detect-title').text("No Touch ID detected");
                $('#detect-para').text("This might be because your device isn't Touch ID compatible, or because you haven't stored any Touch ID on it.");
                $('#setup-button').text("Setup Touch ID");
                $('#cancel-message').text("Cancel Touch ID set-up");
            }
        },
        // error callback, invoked when it's not available
        function (msg) {

        });

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
    } else {
        window.history.back();
    }
}

function setUpClicked() {
    hideDeviceKeyboard();
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {
            if (msg == "face")
                $('#user-authentication').text("Before setting up Face ID access, it's important to note that anyone who stores their Face ID on this device will have access to your account/s.");
            else
                $('#user-authentication').text("Before setting up Touch ID access, it's important to note that anyone who stores their Touch ID on this device will have access to your account/s.");
            showTouchIDDialog(msg);
        },

        // error callback, invoked when it's not available
        function (msg) {
            $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. Please unlock the Touch ID option. ");
            $("#alert-dialog-FP").foundation("open");
        });
}

function skipClicked() {
    hideDeviceKeyboard();
    $("#overlay-div").css("display", "block");
    var ss = new cordova.plugins.SecureStorage(
        function () {
            console.log('Success')
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display later on display the alert/
            //Below message can be updated for better user information
            $("#message-to-display").html("Error");
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.set(
        function (key) {
            console.log('Set ' + key);
        },
        function (error) {
            console.log('Error ' + error);
        },
        'isQuickLoginSetup', 'false'
    );
    if (isNetworkAvailable()) {
        $('#overlay-div').css("display", "block");
        navigateToDashboard();
    } else {
        $("#message-to-display").html("Please check your internet connection");
        $("#alert-dialog").foundation("open");
    }
}

/**
 * Show touch ID
 */



function showTouchIDDialog(accessType) {
    var accessMesg = "";
    if (accessType == "face")
        accessMesg = "Scan your Face ID please";
    else
        accessMesg = "Scan your Touch ID please";
    localStorage.setItem("accessMesg", accessMesg);
    window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(
        accessMesg, // this will be shown in the native scanner popup
        'Skip', // this will become the 'Enter password' button label
        function (msg) {



            var ss = new cordova.plugins.SecureStorage(
                function () {
                    console.log('Success')
                },
                function (error) {
                    console.log('Error ' + error);
                    hideDeviceKeyboard();
                    //@Sagar first set the message to display later on display the alert/
                    $("#message-to-display").html(error);
                    $("#alert-dialog").foundation("open");
                },
                'my_app'
            );
            ss.set(
                function (key) {
                    console.log('Set ' + key);
                },
                function (error) {
                    console.log('Error ' + error);
                },
                'quickLoginType', 'Fingerprint'
            );
            localStorage.setItem("isFingerprintSetupDone", true);
            localStorage.setItem("isFingerprintDefaultStyle", true);
            window.location = "../html/fingerprint_setup_success.html";

        }, // success handler: fingerprint accepted
        function (msg) {

            if (msg.code == "-3") {


                skipClicked();


            } else if (msg.code == "-1") {
                if (accessMesg == "Scan your Face ID please")
                    $("#max-attempts-msg").html("Invalid authentication/Face ID max attempts reached.");
                else
                    $("#max-attempts-msg").html("Invalid authentication/Touch ID max attempts reached.");
                $("#max-attempts-dialog").foundation("open");
            } else if (msg.code == "-8") {
                hideDeviceKeyboard();
                if (accessMesg == "Scan your Face ID please")
                    $("#max-attempts-msg").html("Invalid authentication/Face ID max attempts reached.");
                else
                    $("#max-attempts-msg").html("Invalid authentication/Touch ID max attempts reached.");
                $("#max-attempts-dialog").foundation("open");
            }
            else if (msg.code == "-2") {
                //console.log("Cancel Clicked" + msg.code);
            } else {
                hideDeviceKeyboard();
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts.");
                $("#alert-dialog-FP").foundation("open");
            }

        } // error handler with errorcode and localised reason
    );




}


