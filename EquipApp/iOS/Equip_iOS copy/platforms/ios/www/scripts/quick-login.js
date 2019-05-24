function showLoadingIndicator() {
    document.getElementById("loading-img-container").style.display = "block";
    document.getElementById("loading-img-container").style.marginTop = "70px";
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

function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("backbutton", backButtonHandler, false);
}

function onDeviceReady() {

    document.addEventListener("resume", onAppResume, false);

    if (localStorage.getItem("ThreeDeeNavigation") == "true") {
        $("#btn-balance-without-pin").css("display", "none");
        localStorage.removeItem("ThreeDeeNavigation");
        var swiperObject = document.querySelector('.swiper-container').swiper
        swiperObject.slideNext();
    }


    //@Sagar displaying the splash screen based on platform only
    //Since in iOS the splash screen are displayed in the launchscreen file
    var devicePlatform = device.platform;
    if (devicePlatform == "Android")
        navigator.splashscreen.hide();
    cordova.getAppVersion.getVersionNumber(function (version) {
        $("#version-details").html("version :" + version);
    });
    cordova.getAppVersion.getVersionCode(function (versionCode) {
        $("#version-code-details").html("version code:" + versionCode);
    });
    window.plugins.touchid.isAvailable(
        // success callback, invoked when it's available
        function (msg) {


        },

        // error callback, invoked when it's not available
        function (msg) {

            document.getElementById("list-item-login-settings").style.display = "none";


        });

    manageQBVisibility(true);
    getUserDetails();
    ThreeDeeTouch.onHomeIconPressed = function (payload) {
        //console.log("Icon pressed. Type: " + payload.type + ". Title: " + payload.title + ".");
        if (payload.type == 'share' || payload.type == 'checkin') {
            localStorage.setItem("ThreeDeeNavigation", true);
            document.location = '../html/quick-login.html';
        } else {
            // hook up any other icons you may have and do something awesome (e.g. launch the Camera UI, then share the image to Twitter)
            //console.log(JSON.stringify(payload));
        }
    }

}
function manageQBVisibility(isFromDeviceReady) {
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            hideDeviceKeyboard();
            //@Sagar first set the message and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );

    ss.get(
        function (value) {
            if (value == 'true') {


                document.getElementById("btn-balance-without-pin").style.display = "none";
                if (!isFromDeviceReady) {
                    displayQuickBalance();
                }
            }
        },
        function (error) {
            console.log('Error ' + error);
        },
        'isBalanceWithoutEnabled'
    );
}

function displayQuickBalance() {
    hideDeviceKeyboard();
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            //@Sagar first set the message and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.set(
        function (key) {
            if (isNetworkAvailable()) {
                $("#btn-balance-without-pin").css("display", "none");
                hideAvailableBalance();
                getUserBalanceDetails();
            } else {
                hideLoadingIndicator();
                showAvailableBalance();
                $("#user-balance-para").html("No Internet connection</br>Please try again later");
                //$("#message-to-display").html("Please check your internet connection");
                //$("#alert-dialog").foundation("open");
            }
        },
        function (error) {
            console.log('Error ' + error);
        },
        'isBalanceWithoutEnabled', 'true'
    );
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
        $("#log-out-dialog").foundation('open');
    }
}

function dismissDialog() {
    $("#log-out-dialog").foundation('close');
}

function exitApplication() {
    $("#log-out-dialog").foundation('close');
    navigator.app.exitApp();
}

function quickLoginClicked() {

    localStorage.setItem("lastLoginDate", new Date());

    var isFingerprintSetupDone = localStorage.getItem("isFingerprintSetupDone");
    if (isFingerprintSetupDone) {
        //if the fingerprint setup is done and it is the default login style
        //then display the fingerprint dialog
        var isFingerprintDefaultStyle = localStorage.getItem("isFingerprintDefaultStyle");
        if (isFingerprintDefaultStyle == "true") {
            openFingerprint();
        } else {
            //navigate to the enter pin page
            window.location = "../html/enter_device_pin.html"
        }

    } else {
        //navigate to the enter pin page
        window.location = "../html/enter_device_pin.html"
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
            document.getElementById("overlay-div").style.display = "block";
            if (isNetworkAvailable()) {
                $('#overlay-div').css("display", "block");
                navigateToDashboard();
            } else {
                $("#message-to-display").html("Please check your internet connection");
                $("#alert-dialog").foundation("open");
            }
        }, // success handler: fingerprint accepted
        function (msg) {
            localStorage.setItem("qlFpMaxAttemptsReached", true);

            if (msg.code == "-3") {
                window.location = '../html/enter_device_pin.html';
            } else if (msg.code == "-1") {
                if (accessMesg == "Scan your Face ID please")
                    $("#max-attempts-msg").html("Invalid authentication/Face ID max attempts reached</br>Try login with your pin, you will now be taken there");
                else
                    $("#max-attempts-msg").html("Invalid authentication/Touch ID max attempts reached</br>Try login with your pin, you will now be taken there");
                $("#max-attempts-dialog").foundation("open");
            } else if (msg.code == "-8") {
                if (accessMesg == "Scan your Face ID please")
                    $("#max-attempts-msg").html("Invalid authentication/Face ID max attempts reached</br>Try login with your pin, you will now be taken there");
                else
                    $("#max-attempts-msg").html("Invalid authentication/Touch ID max attempts reached</br>Try login with your pin, you will now be taken there");
                $("#max-attempts-dialog").foundation("open");
            }
            else if (msg.code == "-2") {
                //console.log("Cancel Clicked" + msg.code);
            } else {
                $("#message-to-display-FP").html("Device is locked due to Many Incorrect Attempts. You can Use 4-digit device PIN");
                $("#alert-dialog-FP").foundation("open");
            }

        } // error handler with errorcode and localised reason
    );

}


function gotoEnterPin() {
    $("#max-attempts-dialog").foundation("close");
    window.location = "../html/enter_device_pin.html"
}



function enterPINPage() {
    window.location = "../html/enter_device_pin.html";
}


function navigateToLoginPage() {
    clearRequiredData();
    window.location = "../index.html";
}

function getUserDetails() {

    if (isNetworkAvailable()) {

        $("#user-data-loading-img-container").css("marginTop", "70px");
        $("#user-data-loading-img-container").css("display", "block");
        getLoggedInUserDetails();
    } else {
        $("#logged-in-user-details").css("margin-top", "50px");
        $("#logged-in-user-details").html("No internet connection</br>Please try again later");
    }

}

function getLoggedInUserDetails() {

    var accessTokenValue;
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open")
        },
        'my_app'
    );

    ss.get(
        //successfully got required value from secure storage
        function (value) {
            accessTokenValue = value;
            $.ajax({
                   url: "https://uat.services.mercerfinancialservices.com/v1/customer",
                type: "GET",
   //             url: "https://services.mercerfinancialservices.com/v1/customer",
                async: false,
                timeout: 40000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessTokenValue
                },
                success: function (data) {
                    localStorage.setItem("user_details_retry", false);
                    $("#user-data-loading-img-container").css("display", "none");
                    if (data && data.givenNames && data.surname) {
                        $("#logged-in-user-details").css("margin-top", "30px");
                        if (data.title) {
                            $("#logged-in-user-details").html("Hi " + data.title + " " + data.givenNames + " " + data.surname + "</br>Welcome to Equip</br>Swipe left to see</br>your balance");
                        } else {

                            $("#logged-in-user-details").html("Hi " + data.givenNames + " " + data.surname + "</br>Welcome to Equip</br>Swipe left to see</br>your balance");
                        }

                    } else {
                        $("#logged-in-user-details").css("margin-top", "30px");
                        $("#logged-in-user-details").html(" 555 There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                    }

                },
                error: function (error) {
                    $("#user-data-loading-img-container").css("display", "none");
                    $("#logged-in-user-details").css("margin-top", "30px");
                    if (error.status === 0) {
                        $("#logged-in-user-details").html("The server is taking too long to respond");
                    } else {
                        if (localStorage.getItem("user_details_retry") == "true") {

                            localStorage.setItem("user_details_retry", false);
                            $("#logged-in-user-details").html(" 444 There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");

                        } else {
                            if (error.responseText) {
                                var errorObject = JSON.parse(error.responseText);
                                if (errorObject && errorObject.fault && errorObject.fault.faultstring) {
                   
                                    if ((errorObject.fault.faultstring == "Access Token expired")
                                        || (errorObject.fault.faultstring == "Invalid Access Token")) {
                                        if (isNetworkAvailable()) {
                                            //displaying the loading indicator for refresh request
                                            $("#user-data-loading-img-container").css("marginTop", "70px");
                                            $("#user-data-loading-img-container").css("display", "block");
                                            getRefreshToken("user_details");
                                        } else {
                                            $("#logged-in-user-details").html("Please check your internet connection");
                                        }
                                    } else {
                                        $("#logged-in-user-details").html("333 There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                    }
                                } else {
                                    $("#logged-in-user-details").html("222 There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                }
                            } else {
                                $("#logged-in-user-details").html("111 There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                            }
                        }
                    }
                }

            });
        },
        //failed to get required value from secure storage
        function (error) {
            console.log('Error ' + error);
        },
        'AccessToken'
    );

}

function getUserBalanceDetails() {

    //since this method would be only invoked from the quick login js file
    //it would always have the definition for the show loading indicator method
    //hence making the request here
    showLoadingIndicator();
    var accessTokenValue;
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open")
        },
        'my_app'
    );

    ss.get(
        //successfully got required value from secure storage
        function (value) {
            accessTokenValue = value;
            $.ajax({
                   url: "https://uat.services.mercerfinancialservices.com/v1/customer/balance",
                type: "GET",
  //              url: "https://services.mercerfinancialservices.com/v1/customer/balance",
                async: false,
                timeout: 40000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessTokenValue
                },
                success: function (data) {
                    localStorage.setItem("balance_retry", false);
                    hideLoadingIndicator();
                    showAvailableBalance();
                    if (data && data.balance) {
                        document.getElementById("btn-balance-without-pin").style.display = "none";

                        //this is the success scenario where the app was able to fetch the data from webservice
                        var userBalance;

                        if(accounting){
                            userBalance = accounting.formatMoney(data.balance,"$");
                        }else{
                            userBalance = "$ "+data.balance;
                        }

                        var balanceOnDate = data.calculatedAt;

                        
                        $("#user-balance-para").html("<b>" + userBalance + "</b></br>Account balance at</br>" + formatDate(new Date(data.calculatedAt)));
                        ThreeDeeTouch.isAvailable(function (avail) {

                            if (avail) {
                                ThreeDeeTouch.configureQuickActions([
                                    {
                                        type: 'checkin',
                                        title: userBalance,
                                        subtitle: 'as on ' + formatDate(new Date(balanceOnDate)),
                                        iconTemplate: 'balanceIcon' // optional
                                    },
                                    {
                                        type: 'share',
                                        title: 'Update Quick Balance',
                                        subtitle: '',
                                    }
                                ]);
                            }

                        });

                    } else {
                        $("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                    }
                },
                error: function (error) {
                    hideLoadingIndicator();
                    showAvailableBalance();
                    if (error.status === 0) {
                        $("#user-balance-para").html("The server is taking</br>too long to respond");
                    } else {
                        //allowing one retry for getting the refresh token else displaying
                        if (localStorage.getItem("balance_retry") == "true") {
                            localStorage.setItem("balance_retry", false);
                            $("#btn-balance-without-pin").css("display", "none");
                            $("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                        } else {

                            if (error.responseText) {
                                var errorObject = JSON.parse(error.responseText);
                                if (errorObject && errorObject.fault && errorObject.fault.faultstring) {

                                    if ((errorObject.fault.faultstring == "Access Token expired")
                                        || (errorObject.fault.faultstring == "Invalid Access Token")) {
                                        if (isNetworkAvailable()) {
                                            console.log("getUserBalanceDetails getRefreshToken Called");
                                            getRefreshToken("balance_details");
                                        } else {
                                            $("#user-balance-para").html("Please check your internet connection");
                                        }
                                    } else {
                                        $("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                    }

                                } else {
                                    $("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                }
                            } else {
                                $("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                            }

                        }
                    }

                }
            });

        },
        //failed to get required value from secure storage
        function (error) {
            console.log('Error ' + error);
        },
        'AccessToken'
    );

}
