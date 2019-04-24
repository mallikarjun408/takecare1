var inAppBrowserObject;

//used for identifying from which application the requests are originating
var client_secret_id = "s70Pbmr8JNToDgSOfK5TQSDKxVJMEehz";
var code_challenge_method = "S256";
//the redirect url for the web application and must not be modified unless informed by server side
//this URL is configured on the server side
var app_redirect_url = "mercersuperapp://callback.html";

/**
 * check if login fields are valid if yes then go to quick login set up
 */
function loginButtoClicked() {
//https://pf-mst.001.staging.ping-nonprod.mercerenc.com/idp/startSLO.ping?TargetResource=https%3A%2F%2Fwww.mercerfinancialservices.com%2F/
	//@Sagar currently commenting for the purpose of testing the webservices
	//  if (areLoginFieldsValid()) {
	//  	storeLoginFields();

	//  	localStorage.setItem("tncAccepted", "true");

	//  	var empNotextBox = document.getElementById('EmployeeNumberTextBox').value;
	//  	var planNotextBox = document.getElementById('MembernumberTextBox').value;

	//  	localStorage.setItem("EmployeeNumber", empNotextBox);
	//  	localStorage.setItem("Membernumber", planNotextBox);
	//  	window.location = "../html/login_success.html";

	//  }
	var checkBox = document.getElementById("tnc-chkbox");
	if (checkBox.checked == true) {

		localStorage.setItem("tncAccepted", "true");//the initial T&C of application
		if (isNetworkAvailable()) {
			//checking if the instance of in app browser is active
			if (cordova.InAppBrowser) {

				//code challenge and code verifier values are generated in pairs
				//hence the code verifier value generated for the code challenge must be saved
				//for further authentication requests
				var codeChallengeValue = getCodeChallenge(true);
				//used for the indentification of which code verifier value to send
				localStorage.setItem("isNewLogin", true);

			//	var requestURL = "https://uat.services.mercerfinancialservices.com/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;
			var requestURL = authorizationUrl+ "client_id=mercersuperapp&redirect_uri="+app_redirect_url+

                                            "&pwd_reset_redirect_uri="+pwd_reset_redirect_uri+"?login_uri="+loginUrl+

                                            "&login_uri="+loginUrl+

                                            "&code_challenge="+codeChallengeValue+"&code_challenge_method="+code_challenge_method+"&response_type=code";
				var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close";

				console.log("Request URL : " + requestURL);

				inAppBrowserObject = cordova.InAppBrowser.open(requestURL, '_blank', option);
				inAppBrowserObject.addEventListener('loadstart', onBrowserLoadStart);

			} else {
				$("#message-to-display").html("Failed to initialize, please force quit application and retry");
				$("#alert-dialog").foundation("open");
			}
		} else {
			$("#message-to-display").html("Please check your internet connection");
			$("#alert-dialog").foundation("open");
		}

	} else {
		$("#message-to-display-TnC").html("Please accept Terms and Conditions to Login");
		$("#alert-dialog-TnC").foundation("open");
	}

}

/**
 * This method would be invoked when the in app browser starts loading of any of the requests
 * @param event Event object when the loading starts
 */
function onBrowserLoadStart(event) {

	//typecasting the URL into String type
	var urlStringValue = String(event.url);

	//In android the url value is obtained by appending of http while in iOS it is obtained directly
	//under the function handleOpenURL without the http prefix
	//In android for some reason handleOpenURL is not invoked hence the browserload hack

	if (urlStringValue.indexOf("http://mercersuperapp://") >= 0) {

		console.log("Load Started " + urlStringValue);
		inAppBrowserObject.close();//closing the instance of inappbrowser

		$("#overlay-div").css("display", "block");
		var codeVerifierValue;
		if (localStorage.getItem("isNewLogin") == "true") {
			codeVerifierValue = localStorage.getItem("codeVerifier");

			localStorage.removeItem("isNewLogin");
			localStorage.removeItem("codeVerifier");
		} else {
			//this case should ideally not happen as it would lead to unauth access if the code challenge is already generated
			codeVerifierValue = getBase64CodeVerifier();
		}
        var urlParams = new URL(urlStringValue).searchParams;
        console.log(' code ====  '+urlParams.get('code'));

        var appCode = urlParams.get('code')
	//	var appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code") + 5, urlStringValue.lastIndexOf("scope") - 1)

		var requestData = {
			code: appCode,
			client_id: client_secret_id,
			code_verifier: codeVerifierValue,
			redirect_uri: app_redirect_url,
			grant_type: "authorization_code"
		};
		$.ajax({
			type: "POST",
			url: "https://services.mercerfinancialservices.com/v1/auth/token",
			async: false,
			timeout: 20000,
			data: requestData,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			success: function (data) {
				getTokenSuccess(data);
			},
			error: function (error) {
				getTokenFailure(error);
			}
		});

	}

}

/**
 * This method is invoked when the token request is successful
 * * @param data Data obtained on successful request
 */
function getTokenSuccess(data) {

	$("#overlay-div").css("display", "none");

	if (data.access_token && data.refresh_token) {

		var ss = new cordova.plugins.SecureStorage(
			function () {
				console.log('Success')
			},
			function (error) {
				console.log('Error ' + error);
				//@Sagar first set the message to display later on display the alert
				$("#message-to-display").html(error);
				$("#alert-dialog").foundation("open");
			},
			'my_app'
		);

		//setting the access token in secure storage
		ss.set(
			function (key) {
				//success block
			},
			function (error) {
				console.log('Failed to save access token ' + error);
			},
			'AccessToken', data.access_token
		);
		//setting the refresh token in secure storage
		ss.set(
			function (key) {
				//success block
			},
			function (error) {
				console.log('Failed to save refresh token ' + error);
			},
			'RefreshToken', data.refresh_token
		);
        ss.set(
            function (key) {
                //success block
            },
            function (error) {
                console.log('Failed to save access token ' + error);
            },
            'lastLoginDate',  ""+new Date()
        );
		//navigating the user to login success page
		window.location = "../html/login_success.html";

	} else {
		$("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
		$("#alert-dialog").foundation("open");
	}

}

/**
 * This method is invoked when the token request is failed
 * @param error Data obtained about the failed request
 */
function getTokenFailure(error) {

	$("#overlay-div").css("display", "none");
	if (error.status === 0) {
		$("#message-to-display").html("The server is taking too long to respond");
	}else{
		$("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
	} 
	
	$("#alert-dialog").foundation("open");
}

/**
 * login fields validations
 */
function areLoginFieldsValid() {
	var empNotextBox = document.getElementById('EmployeeNumberTextBox');
	var planNotextBox = document.getElementById('MembernumberTextBox');
	var passwordtextBox = document.getElementById('PasswordTextBox');
	var checkBox = document.getElementById("tnc-chkbox");

	if (empNotextBox.value == '') {

		$("#message-to-display").html("Please enter Employer/Plan number");
		$("#alert-dialog").foundation("open");

		return false;
	} else if (planNotextBox.value == '') {

		$("#message-to-display").html("Please enter Member number");
		$("#alert-dialog").foundation("open");
		return false;
	} else if (passwordtextBox.value == '') {

		$("#message-to-display").html("Please enter PIN/Password");
		$("#alert-dialog").foundation("open");
		return false;
	} else if (checkBox.checked == false) {
		$("#message-to-display-TnC").html("Please accept Terms and Conditions to Login");
		$("#alert-dialog-TnC").foundation("open");
		return false;
	} else if (empNotextBox.value == '100001' || empNotextBox.value == '502243') {
		//check for demo user
		return true;
	}
	else {
		$("#not-authorized").foundation('open');
		return false;
	}

}

function storeLoginFields() {
	//storing login details in keychain / keystore
	var empNotextBox = document.getElementById('EmployeeNumberTextBox').value;
	var planNotextBox = document.getElementById('MembernumberTextBox').value;
	var passwordtextBox = document.getElementById('PasswordTextBox').value;
	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			//@Sagar first set the message to display later on display the alert
			$("#message-to-display").html(error);
			$("#alert-dialog").foundation("open");
		},
		'my_app'
	);

	ss.set(
		function (key) {
			//success block
		},
		function (error) {
			console.log('Error ' + error);
		},
		'Employee Number', empNotextBox
	);

	ss.set(
		function (key) {
			//success block
		},
		function (error) {
			console.log('Error ' + error);
		},
		'Plan Number', planNotextBox
	);

	ss.set(
		function (key) {
			//success block
		},
		function (error) {
			console.log('Error ' + error);
		},
		'Password', passwordtextBox
	);
}

function onLoad() {

	var checkBox = document.getElementById("tnc-chkbox");

	localStorage.setItem("tncAccepted", "false");
	localStorage.setItem("QLoginTnCAccepted", "false");

	// var empNotextBox = document.getElementById('EmployeeNumberTextBox');
	// var planNotextBox = document.getElementById('MembernumberTextBox');
	// var passwordtextBox = document.getElementById('PasswordTextBox');

	// empNotextBox.value = '';
	// planNotextBox.value = '';
	// passwordtextBox.value = '';

	// $('#EmployeeNumberTextBox').css('border-color', 'black');
	// $('#MembernumberTextBox').css('border-color', 'black');
	// $('#PasswordTextBox').css('border-color', 'black');

	document.addEventListener("backbutton", backButtonHandler, false);
	document.addEventListener("deviceready", onDeviceReady, false);

	// empNotextBox.addEventListener('blur', function (evt) {
	// 	if (empNotextBox.value != '') {
	// 		$('#EmployeeNumberTextBox').css('border-color', 'black');
	// 	}
	// });
	// planNotextBox.addEventListener('blur', function (evt) {
	// 	if (planNotextBox.value != '') {
	// 		$('#MembernumberTextBox').css('border-color', 'black');
	// 	}
	// });
	// passwordtextBox.addEventListener('blur', function (evt) {
	// 	if (passwordtextBox.value != '') {
	// 		$('#PasswordTextBox').css('border-color', 'black');
	// 	}
	// });
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

/**
 * Check if pin is setup or not, if yes then goto change pin setup else show popup set up pin first
 */
function changeYourPINClikde() {

	ss.get(
		function (value) {
			window.location = "../html/quick-login.html"
		},
		function (error) {
			console.log('Error ' + error);
			window.location = "../html/login.html"
		},
		'quickLoginType'
	);
}

function onDeviceReady() {

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

	$(document).on('focus', 'input, textarea', function () {
		$("#footer").css("display", "none");

	});

	$(document).on('blur', 'input, textarea', function () {
		$("#footer").css("display", "block");

	});

}

/**
	This method navigates to the 4 digit pin setup as per new user flow
*/
function navigateToPinSetup() {
	$("#four-digit-pin-basic").foundation('close');
	window.location = "../html/enter_4_digit_pin-quick_pin_setup.html";
}

function updateLoginButton() {

	var empNoTextValue = document.getElementById('EmployeeNumberTextBox').value;
	var memNoTextValue = document.getElementById('MembernumberTextBox').value;
	var passTextValue = document.getElementById('PasswordTextBox').value;

	if (empNoTextValue.length > 0 && memNoTextValue.length > 0 && passTextValue.length > 0) {
		document.getElementById("login-btn").style.opacity = 1;
	} else {
		document.getElementById("login-btn").style.opacity = 0.6;
	}
}

function clearAllFields() {

	document.getElementById('EmployeeNumberTextBox').value = '';
	document.getElementById('MembernumberTextBox').value = '';
	document.getElementById('PasswordTextBox').value = '';

}
