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
    localStorage.setItem('pinSetBackClick','fromQuickLoginBack');
    localStorage.setItem('pinSetSuccessfully','fromQuickLoginPage');
}

function onDeviceReady() {
    initCrashlytics();
	document.addEventListener("resume", onAppResume, false);

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

	//check if fingerprint is available or not to display the login settings
	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	function isAvailableSuccess() {
		//do nothing as the login settings option is required to be displayed
	}
	function isAvailableError() {
		document.getElementById("list-item-login-settings").style.display = "none";
	}

	getUserDetails();

}

function manageQBVisibility() {
	var ss = new cordova.plugins.SecureStorage(
		function () {
		    ss.get(
        		function (value) {
        			if (value == 'true') {
        				document.getElementById("btn-balance-without-pin").style.display = "none";
        				displayQuickBalance();
        			}
        		},
        		function (error) {
        			console.log('Error ' + error);
        		},
        		'isBalanceWithoutEnabled'
        	);
		},
		function (error) {
			hideDeviceKeyboard();
			//@Sagar first set the message and then display the alert
			$("#message-to-display").html(error);
			$("#alert-dialog").foundation("open");
		},
		'my_app'
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
	    if((document.querySelector('body')).classList.contains('is-reveal-open')){
            $(".popupClose").click();
        } else{
           $("#menu-link").click();
        }
	} else {
	    if((document.querySelector('body')).classList.contains('is-reveal-open')){
            return false;
        } else{
           $("#log-out-dialog").foundation('open');
        }

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

	Fingerprint.isAvailable(isAvailableSuccess, isAvailableError);
	//if fingerprint is available then display dialog to perform fingerprint login
	function isAvailableSuccess(result) {
		//check whether the fingerprint setup was done or not
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
	/**
	 * Even if the fingerprint is setup but it is now unavailable due to some reasons
	 * then too navigate the user to the enter device pin page 
	 */
	function isAvailableError(message) {
		//navigate to the enter pin page
		window.location = "../html/enter_device_pin.html"
	}
}

function openFingerprint() {

	hideDeviceKeyboard();
	Fingerprint.show({
		clientId: "Fingerprint-Demo",
		clientSecret: "password", //Only necessary for Android
		disableBackup: true

	}, successCallback, errorCallback);

	function successCallback() {
		hideDeviceKeyboard();
		if (isNetworkAvailable()) {
			document.getElementById("overlay-div").style.display = "block";
			setTimeout("navigateToDashboard()", 500);
		} else {
			document.getElementById("overlay-div").style.display = "none";
			$("#message-to-display").html(INTERNET_AVAILABILITY_MSG);
			$("#alert-dialog").foundation("open");
		}
	}

	function errorCallback(err) {
		if (!(err == "Cancelled")) {
			//setting the flag for the fingerprints max attempts to avoid display of the fingerprint option on the enter pin page
			localStorage.setItem("qlFpMaxAttemptsReached", true);
			$("#max-attempts-msg").html(INVALID_MAX_ATTEMPTS);
			$("#max-attempts-dialog").foundation("open");
		}
	}

}

function gotoEnterPin() {
	$("#max-attempts-dialog").foundation("close");
	window.location = "../html/enter_device_pin.html"
}

function enterPINPage() {
	window.location = "../html/enter_device_pin.html"
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
			console.log("getLoggedInUserDetails Access Token ", accessTokenValue);
			$.ajax({
				type: "GET",
				url:  (localStorage.getItem(MERCER_ENDPOINT) || baseUrl) + "/v1/customer",
				async: false,
				timeout: 20000,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + accessTokenValue
				},
				success: function (data) {

					$("#user-data-loading-img-container").css("display", "none");
					localStorage.setItem("user_details_retry", false);
					if (data && data.givenNames && data.surname) {

						$("#logged-in-user-details").css("margin-top", "30px");
						if (data.title) {
							$("#logged-in-user-details").html("Hi " + data.title + " " + data.givenNames + " " + data.surname + "</br>Welcome to CareSuper</br>Swipe left to see</br>your balance");
						} else {
							$("#logged-in-user-details").html("Hi " + data.givenNames + " " + data.surname + "</br>Welcome to CareSuper</br>Swipe left to see</br>your balance");
						}

					} else {
						$("#logged-in-user-details").css("margin-top", "30px");
						$("#logged-in-user-details").html(ERROR_MESSGE);
						logException("Messge:: while getting LoggedInUserDetails || FileName:: quick-login.js || Method:: getLoggedInUserDetails()");
					}

				},
				error: function (error) {

					$("#user-data-loading-img-container").css("display", "none");
					$("#logged-in-user-details").css("margin-top", "30px");
					// tokenExpiresError(error,"user_details");
				   logException("Messge:: getLoggedInUserDetails failure callback  "+JSON.stringify(error)+" || FileName:: quick-login.js || Method:: getLoggedInUserDetails()");
                   var errorCode = tokenExpiresError(error, "quick-login");
                   if (errorCode != null && errorCode == "invalid_grant") {
                       getRefreshToken("user_details");
                   } else if (errorCode != null && errorCode == "keymanagement.service.invalid_access_token") {
                       getRefreshToken("user_details");
                   }else {
                        var createAStatusCodeDiv = " <br> <div> <b> Status Code : "+ error.status +"</b></div>";
                        if(config.plainContent == "displayAlerts=yes"){
                            errorCode = errorCode + createAStatusCodeDiv;
                        }
                       $("#logged-in-user-details").html(errorCode);
                   }

					/* if (error.status === 0) {
						$("#logged-in-user-details").html("The server is taking too long to respond");
					} else {
						if (localStorage.getItem("user_details_retry") == "true") {

							localStorage.setItem("user_details_retry", false);
							$("#logged-in-user-details").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");

						} else {
							if (error.responseText) {
								var errorObject = JSON.parse(error.responseText);
								if (errorObject && errorObject.fault && errorObject.fault.faultstring) {
 console.log('quick-login : error Callback faultstring '+error.responseText);
									if ((errorObject.fault.faultstring == "Access Token expired")
										|| (errorObject.fault.faultstring == "Invalid Access Token")) {
										if (isNetworkAvailable()) {
											console.log("getLoggedInUserDetails Access Token get refresh token called");
											//displaying the loading indicator for refresh request
										//	$("#user-data-loading-img-container").css("marginTop", "70px");
										//	$("#user-data-loading-img-container").css("display", "block");
											getRefreshToken("user_details");
										} else {
											$("#logged-in-user-details").html("Please check your internet connection");
										}
									} else {
										$("#logged-in-user-details").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
									}

								} else {
									$("#logged-in-user-details").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
								}
							} else {
								$("#logged-in-user-details").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
							}
						}
					} */

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
			console.log("getUserBalanceDetails Access Token ", accessTokenValue);
			$.ajax({
				type: "GET",
				url: (localStorage.getItem(MERCER_ENDPOINT) || baseUrl) + "/v1/customer/balance",
				async: false,
				timeout: 20000,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': 'Bearer ' + accessTokenValue
				},
				success: function (data) {
				  console.log('quick-login : Success Callback balance '+JSON.stringify(data));
					hideLoadingIndicator();
					showAvailableBalance();
					localStorage.setItem("balance_retry", false);
					if (data) {
						document.getElementById("btn-balance-without-pin").style.display = "none";
						var userBalance;
						if(accounting){
							userBalance = accounting.formatMoney(data.balance,"$");
						}else{
							userBalance = "$ "+data.balance;
						}
						
						//this is the success scenario where the app was able to fetch the data from webservice
						$("#user-balance-para").html("<b class='textbold'>" + userBalance + "</b></br>Account balance at</br>" + formatDate(new Date(data.calculatedAt)));
					} else {
						$("#user-balance-para").html(ERROR_MESSGE);
						logException("Messge:: while getting userBalance  success callback "+JSON.stringify(data)+"|| FileName:: quick-login.js || Method:: getUserBalanceDetails()");
					}
				},
				error: function (error) {
                    console.log('quick-login : error Callback balance '+JSON.stringify(error));
					hideLoadingIndicator();
					showAvailableBalance();
                    //tokenExpiresError(error,"balance_details");
                    logException("Messge:: getUserBalanceDetails failure callback  "+JSON.stringify(error)+" || FileName:: quick-login.js || Method:: getUserBalanceDetails()");
					var errorCode = tokenExpiresError(error);
                    if (errorCode != null && errorCode == "invalid_grant") {
                        getRefreshToken("balance_details");
                    } else if (errorCode != null && errorCode == "keymanagement.service.invalid_access_token") {
                        getRefreshToken("balance_details");
                    }else {
                        var createAStatusCodeDiv = " <br> <div> <b> Status Code : "+ error.status +"</b></div>";
                        if(config.plainContent == "displayAlerts=yes"){
                           errorCode = errorCode + createAStatusCodeDiv;
                        }
                        $("#user-balance-para").html(errorCode);
                    }
			/*		if (error.status === 0) {
						$("#user-balance-para").html("The server is taking</br>too long to respond");
					} else {
						//allowing one retry for getting the refresh token else displaying
						if (localStorage.getItem("balance_retry") == "true") {
							localStorage.setItem("balance_retry", false);
							$("#btn-balance-without-pin").css("display", "none");
							$("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
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
										$("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
									}

								} else {
									$("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
								}
							} else {
								$("#user-balance-para").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
							}

						}
					} */

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

function onClickSetDevicePin(){
    localStorage.setItem('userNavigatefrom', 'hamburgerpage');
    window.location = "../html/enter_4_digit_pin-quick_pin_setup.html";
}