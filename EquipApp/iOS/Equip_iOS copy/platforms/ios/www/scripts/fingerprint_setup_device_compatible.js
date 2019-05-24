var accessMesg = "";
function onLoad() {
    document.addEventListener("backbutton", backButtonHandler, false);
    document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);
    accessMesg = localStorage.getItem("accessMesg");
    if (accessMesg == "Scan your Face ID please") {
        $('#login-setup-title').text("Face ID setup");
        $('#login-setup-para').text("If your device is compatible you can use stored Face ID to quickly access your accounts.");
        $('#not-availabe-title').text("Face ID not available");
        $('#not-availabe-para').text("This might be because your device isn't Face ID compatible.");
        $('#no-detect-title').text("No Face ID detected");
        $('#no-detect-para').text("This might be because your device isn't Face ID compatible, or because you haven't stored any Touch ID on it.");
        $('#setup-button').text("No Face ID detected");
    }
    else {
        $('#login-setup-title').text("Touch ID setup");
        $('#login-setup-para').text("If your device is compatible you can use stored Touch ID to quickly access your accounts.");
        $('#not-availabe-title').text("Touch ID not available");
        $('#not-availabe-para').text("This might be because your device isn't Touch ID compatible.");
        $('#no-detect-title').text("No Touch ID detected");
        $('#no-detect-para').text("This might be because your device isn't Touch ID compatible, or because you haven't stored any Touch ID on it.");
        $('#setup-button').text("No Touch ID detected");
    }
}


/*input param : none
 output param : none
 description : check if fingerprint/touchid is availble, if yes then show touch id dialog else show informative reveal
 */
function nextButtonClicked() {
    var ss = new cordova.plugins.SecureStorage(function () {
        console.log('Success')
        localStorage.setItem('isDeviceSecure', 'true');
    }, function (error) {
        console.log('Error ' + error);
        localStorage.setItem('isDeviceSecure', 'false');
    }, 'my_app');
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {
            showTouchIDDialog();
        }
        , // error callback, invoked when it's not available
        function (msg) {

        });
}
/*--input param : none-->
 <!--output param : none-->
 <!--description : make AEM page post method request*/
function exitButtonClicked() {
    //< !--makeAEMPageRequset(); -->
    window.location = '../html/enter_4_digit_pin-quick_pin_setup.html';
}

function makeAEMPageRequset() {
    var options = {};
    var form = document.createElement("form");
    var url = "https://www.youraccountonline.com/secure";
    form.setAttribute("method", "post");
    form.setAttribute("action", url);
    for (var data in options) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", data);
        hiddenField.setAttribute("value", options[data]);
        form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
}
/*input param : none
 output param : non
 description : show native touch id dialog using plugin- */
function showTouchIDDialog() {
    //var accessMesg = localStorage.getItem("accessMesg");
    if (accessMesg == null)
        accessMesg = "Scan your Touch ID please";
    window.plugins.touchid.verifyFingerprint(accessMesg, // this will be shown in the native scanner popup
        //'Reset Quick Login',
        // success callback, invoked when the users input was accepted
        function (msg) {
            var ss = new cordova.plugins.SecureStorage(function () {
                console.log('Success')
            }, function (error) {
                console.log('Error ' + error);
            }, 'my_app');
            ss.set(function (key) {
                console.log('Set ' + key);
            }, function (error) {
                console.log('Error ' + error);
            }, 'quickLoginType', 'Fingerprint');
            window.location = 'terms_and_conditions.html';
        }
        , // error callback, invoked when there was no match,
        // essentially meaning the dialog was closed by pressing 'cancel'
        function (msg) {
            if (msg.code == "-3") {
                var ss = new cordova.plugins.SecureStorage(function () {
                    console.log('Success');
                }, function (error) {
                    console.log('Error ' + error);
                }, 'my_app');
                ss.remove(function (key) {
                    console.log('Removed ' + key);
                }, function (error) {
                    console.log('Error, ' + error);
                }, 'quickLoginType');
            }
        });
}
/*nput param : none
 output param : non
 description : if fingerprint / touch id is availble and no fingers enrolled then open settings app */
function setUpTouchIDClicked() {
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {

        }
        , // error callback, invoked when it's not available
        function (msg) {

        });
}

function isMydeviceCompatibleCliked() {
    $("#no-fingerprint-detected-reveal").foundation('open');
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {
            $("#device-is-compatible-reveal").foundation('open')
        }
        , // error callback, invoked when it's not available
        function (msg) {

        });
}

function showTouchIDDialog1() {
    var accessMesg = localStorage.getItem("accessMesg");
    if (accessMesg == null)
        accessMesg = "Scan your Touch ID please";
    window.plugins.touchid.verifyFingerprintWithCustomPasswordFallbackAndEnterPasswordLabel(accessMesg, // this will be shown in the native scanner popup
        'Enter PIN', // this will become the 'Enter password' button label
        function (msg) {
            var ss = new cordova.plugins.SecureStorage(function () {
                console.log('Success')
            }, function (error) {
                console.log('Error ' + error);
            }, 'my_app');
            ss.set(function (key) {
                console.log('Set ' + key);
            }, function (error) {
                console.log('Error ' + error);
            }, 'quickLoginType', 'Fingerprint');
            window.location = 'terms_and_conditions.html';
        }, // success handler: fingerprint accepted
        function (msg) {
            if (msg.code == "-3") {
                var ss = new cordova.plugins.SecureStorage(function () {
                    console.log('Success');
                }, function (error) {
                    console.log('Error ' + error);
                }, 'my_app');
                ss.remove(function (key) {
                    console.log('Removed ' + key);
                }, function (error) {
                    console.log('Error, ' + error);
                }, 'quickLoginType');
            }
            else if (msg.code == "-1") {
                if (accessMesg == "Scan your Face ID please")
                    $("#message-to-display-FP").html("Invalid authentication/Face ID max attempts reached. You can Use 4-digit PIN");
                else
                    $("#message-to-display-FP").html("Invalid authentication/Touch ID max attempts reached. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            }
            else if (msg.code == "-8") {
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            }
            else if (msg.code == "-2") {
                window.location = '../html/enter_device_pin.html';
            }
            else {
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. You can Use 4-digit PIN");
                $("#alert-dialog-FP").foundation("open");
            }
        } // error handler with errorcode and localised reason
    );
}
