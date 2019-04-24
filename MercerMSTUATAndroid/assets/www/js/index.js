/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var inAppBrowserObject;

//used for identifying from which application the requests are originating
// var client_secret_id = "s70Pbmr8JNToDgSOfK5TQSDKxVJMEehz";


var codeVerifier;
var codeChallengeValue;
var isLoadingActive = false;

var app = {
	// Application Constructor
	initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		document.addEventListener("backbutton", backButtonHandler, false);
	},



	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function() {
		// @Sagar displaying the splash screen based on platform only
		//Since in iOS the splash screen are displayed in the launchscreen file
		//var devicePlatform = device.platform;
		//if (devicePlatform == "Android")

		// Check if secure storge is availble


		/*getConfigValues().then(function(data){
            Config = data;
            localStorage.setItem("configValue",JSON.stringify(Config));
		},function(error){
		    console.log("error response "+JSON.stringify(error));
            var mm = {"encodedContent":"ZGlzcGxheUFsZXJ0cz15ZXM=","plainContent":"displayAlerts=no"};
            localStorage.setItem("configValue",JSON.stringify(mm));
		}) */

        getConfigValuesFromAEM();
		this.receivedEvent('deviceready');
	},

	// Update DOM on a Received Event
	receivedEvent: function(id) {
		// console.log('Received Event: ' + id);
	}
};

app.initialize();

function getConfigValuesFromAEM() {
    var ss = new cordova.plugins.SecureStorage(
        function() {
            localStorage.setItem('isDeviceSecure', 'true');
        },
        function(error) {
            console.log('Error : ' + error);
            localStorage.setItem('isDeviceSecure', 'false');
        },
        'my_app'
    );
    if (isNetworkAvailable()) {
        navigator.splashscreen.show();
        loadConfigValuesFromServer().then(function success(data) {
            getConfigValues().then(configUrlSuccess(data, ss), fnFailure(ss));
        }, function error(error) {
            getConfigValues().then(configUrlSuccess(null, ss), fnFailure(ss))
        });
    } else {
        navigator.splashscreen.hide();
        $("#message-to-display").html("Please check your internet connection");
        $("#alert-dialog").foundation("open");
        $(".index-mercer-logo").css("display", "block");
        $(".main").css("display", "table"); //must be set as table for center alignment
        $("#network-loading-failed-message").css("display", "block");
        $("#inapp-closed-msg").css("display", "none");
        $("#loading-indicator").css("display", "none");
        $(".index-network-error-title").html("Please check your internet conenction");
    }
}

function configUrlSuccess(urlConfigValues, ss) {
	//setTimeout("navigator.splashscreen.hide()", 2000);
    navigator.splashscreen.hide();

   /* var jsonStr = localStorage.getItem("configUrlValue");
    	var jsonObject = null;
    	if (jsonStr != undefined)
    		jsonObject = JSON.parse(jsonStr);

    if(localStorage.getItem('UseNewEndpointsAndroid') != jsonObject.UseNewEndpointsAndroid) {
        clearRequiredData();
        localStorage.setItem("configUrlValue",urlConfigValues);
        navigateToWebAppLogin();
    } else { */
        //check if quickLoginType is set, If yes then show quickLogin screen else show login screen
        ss.get(
            function(value) {
                cordova.getAppVersion.getVersionCode(function(versioncode) {
                    var appVersionCode = parseInt(versioncode);
                    var isServiceFirstRun = localStorage.getItem("isServiceFirstRun");
                    //beyond the app version code 10012 service integration was performed
                    //hence below that we are navigating the user to the web app login page
                    if (appVersionCode == 10013 && isServiceFirstRun && (isServiceFirstRun == "false")) {
                        clearRequiredData();
                        navigateToWebAppLogin();
                    } else if (appVersionCode == 10013 && !isServiceFirstRun) {
                        clearRequiredData();
                        navigateToWebAppLogin();
                    } else {
                        var lastLoginVal = localStorage.getItem("lastLoginDate");
                        if (lastLoginVal) {

                            var lastLoginDate = new Date(lastLoginVal);
                            var dateDifference = getDateDifference(lastLoginDate, new Date());
                            if (dateDifference >= 90) {
                                clearRequiredData();
                                navigateToWebAppLogin();
                            } else {
                                window.location = "html/quick-login.html";
                            }

                        } else {
                            clearRequiredData();
                            navigateToWebAppLogin();
                        }

                    }
                });

            },
            function(error) {
                console.log('Error : ' + error);
                //hiding the splash screen after 3 secs
                //if (devicePlatform == "Android")
                    //setTimeout("navigator.splashscreen.hide()", 2000);
                    navigator.splashscreen.hide();
                //Instead of navigating to the login page the user is navigated directly to the
                //web app login page
                navigateToWebAppLogin();
            },
            'quickLoginType'
        );
	//}
}

function navigateToWebAppLogin() {
/*
	var mm = {
		"encodedContent": "ZGlzcGxheUFsZXJ0cz15ZXM=",
		"plainContent": "displayAlerts=no"
	};
	localStorage.setItem("configValue", JSON.stringify(mm));

*/


	var jsonStr = localStorage.getItem("configUrlValue");
	console.log(' configUrlValue '+jsonStr);
	var jsonObject = null;
	if (jsonStr != undefined)
		jsonObject = JSON.parse(jsonStr);


	$(".index-mercer-logo").css("display", "none");
	$(".main").css("display", "none");

	if (isNetworkAvailable()) {
		//checking if the instance of in app browser is active
		if (cordova.InAppBrowser) {

			localStorage.setItem("isServiceFirstRun", true);
			localStorage.setItem("isNewLogin", true);

			var requestURL = null;

			if (jsonObject != null) {
                // localStorage.setItem('UseNewEndpointsAndroid',jsonObject.UseNewEndpointsAndroid);
				if (jsonObject.UseNewEndpointsIOS) {}
				//alert(typeof(jsonObject.UseNewEndpointsAndroid) + "   "+(jsonObject.UseNewEndpointsAndroid == true) )
				if (jsonObject.UseNewEndpointsAndroid == true) {
				    //code challenge and code verifier values are generated in pairs
                    codeVerifier = generateRandomValue();
                    codeChallengeValue = getCodeChallenge(codeVerifier);
                    var mUrl = null;
                    if(jsonObject["NewEndpoints "] != undefined) {
                        mUrl = jsonObject["NewEndpoints "];
                    } else if(jsonObject["NewEndpoints"] != undefined){
                        mUrl = jsonObject["NewEndpoints"];
                    }

					localStorage.setItem("endpoints", "new");
                    localStorage.setItem("authTokenUrl", mUrl + "/as/token.oauth2");

                    requestURL = mUrl + "/as/authorization.oauth2?client_id=mercersuperapp&redirect_uri=" + app_redirect_url +

                        "&pwd_reset_redirect_uri=" + encodeURIComponent(pwd_reset_redirect_uri) + "?login_uri=" + loginUrl +

                        "&login_uri=" + loginUrl +

                        "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&response_type=code";


				} else {
				    codeVerifierValue = getBase64CodeVerifier(); //localStorage.getItem("codeVerifier");
				    codeChallengeValue = getOldCodeChallenge(codeVerifierValue);
					localStorage.setItem("endpoints", "current");
					localStorage.setItem("authTokenUrl", jsonObject.CurrentEndpoints + "/v1/auth/token");
					if (jsonObject.CurrentEndpoints) {
						requestURL = jsonObject.CurrentEndpoints + "/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;
					}

				}
			} else {
			    codeVerifierValue = getBase64CodeVerifier(); //localStorage.getItem("codeVerifier");
                codeChallengeValue = getOldCodeChallenge (codeVerifierValue);
				localStorage.setItem("endpoints", "current");
				requestURL = oldEndPoint + "/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;
				localStorage.setItem("authTokenUrl", oldEndPoint + "/v1/auth/token");
			}

console.log("requestURL   "+requestURL);
            if(requestURL != null){
                var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close,clearsessioncache=yes";
                console.log("requestURL  " + requestURL);
                inAppBrowserObject = cordova.InAppBrowser.open(requestURL, '_blank', option);
                inAppBrowserObject.addEventListener('loadstart', onBrowserLoadStart);
                inAppBrowserObject.addEventListener('loadstop', onBrowserLoadStop);
                inAppBrowserObject.addEventListener('loaderror', onBrowserErrorOccured);
                inAppBrowserObject.addEventListener('exit', onInAppBrowserClosed);
			} else {
			    $("#message-to-display").html("Failed to initialize components, please force quit application and retry");
            	$("#alert-dialog").foundation("open");
			}

		} else {
			$("#message-to-display").html(ERROR_MESSGE);
            $("#alert-dialog").foundation("open");
		}
	} else {
		$("#message-to-display").html("Please check your internet connection");
		$("#alert-dialog").foundation("open");
		$(".index-mercer-logo").css("display", "block");
		$(".main").css("display", "table"); //must be set as table for center alignment
		$("#network-loading-failed-message").css("display", "block");
		$("#inapp-closed-msg").css("display", "none");
		$("#loading-indicator").css("display", "none");
		$(".index-network-error-title").html("Please check your internet conenction");
	}


}

function onBrowserErrorOccured(params) {

	console.log("Failed to load page in InAppBrowser->Reason: " + params.message);
	if (params.message != "net::ERR_UNKNOWN_URL_SCHEME") {
		//now since in app browser is closed onInAppBrowserClosed would be invoked
		//hence that message would be displayed
		inAppBrowserObject.close();
		$("#message-to-display").html(ERROR_MESSGE);
		$("#alert-dialog").foundation("open");
	}

}

/**
 * This method would be invoked when the inAppBrowser has been closed
 * @param event
 */
function onInAppBrowserClosed(event) {

	if (localStorage.getItem("isManualClose") != "true") {
		$("#inapp-closed-msg").css("display", "block");
		$(".index-mercer-logo").css("display", "block");
		$(".main").css("display", "table"); //must be set as table for center alignment
		$("#network-loading-failed-message").css("display", "none");
		$("#loading-indicator").css("display", "none");
	} else {
		localStorage.removeItem("isManualClose");
		$(".index-mercer-logo").css("display", "block");
		$(".main").css("display", "table");
		$("#network-loading-failed-message").css("display", "none");
		$("#inapp-closed-msg").css("display", "none");
		$("#loading-indicator").css("display", "block");
		$("#loading-indicator").css("text-align", "center");
		$("#alert-dialog").foundation("close");
	}

}

/**
 * This method would be invoked when the in app browser starts loading of any of the requests
 * @param event Event object when the loading starts
 */
function onBrowserLoadStart(event) {

	//typecasting the URL into String type
	var urlStringValue = String(event.url);

	console.log('urlStringValue   ' + urlStringValue);

	//In android the url value is obtained by appending of http while in iOS it is obtained directly
	//under the function handleOpenURL without the http prefix
	//In android for some reason handleOpenURL is not invoked hence the browserload hack

	if (urlStringValue.indexOf("http://mercersuperapp://") >= 0) {

		localStorage.setItem("isManualClose", true);
		inAppBrowserObject.close(); //closing the instance of inappbrowser

		$("#overlay-div").css("display", "block");
		var appCode = null;
		try {
			var mm = getParams(urlStringValue);
			console.log('getParams = ' + JSON.stringify(mm));
			appCode = mm.code;
			console.log(' appCode code ====  ' + appCode);
		} catch (error) {
			console.log(' error at appcode ' + error);
			appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code") + 5, urlStringValue.length);
		}


		if (appCode !== null && appCode != undefined) {
			// var appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code") + 5, urlStringValue.lastIndexOf("scope") - 1)
			var requestData = null;
			if (localStorage.getItem("endpoints") == "new") {
				requestData = {
					code: appCode,
					client_id: "mercersuperapp",
					code_verifier: codeVerifier,
					redirect_uri: app_redirect_url,
					grant_type: "authorization_code"
				};
			} else {
				requestData = {
					code: appCode,
					client_id: client_secret_id,
					code_verifier: codeVerifierValue,
					redirect_uri: app_redirect_url,
					grant_type: "authorization_code"
				};

			}
			console.log(" requestData  ===   " + JSON.stringify(requestData));
			$.ajax({
				type: "POST",
				url: localStorage.getItem("authTokenUrl"),
				timeout: 20000,
				data: requestData,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Accept': 'application/json'
				},
				success: function(data) {
					console.log("success response " + JSON.stringify(data));
					getTokenSuccess(data);
				},
				error: function(error) {
					console.log("error response " + JSON.stringify(error));
					getTokenFailure(error);
				}
			});
		} else if (urlStringValue.indexOf("error=") >= 0) {
			var appErrorCode = null;
			try {
				var mm = getParams(urlStringValue);
				console.log('getParams = ' + JSON.stringify(mm));
				appErrorCode = mm.error;
				console.log(' appCode code ====  ' + appErrorCode);
				setTimeout(function() {
					$("#message-to-display").html(appErrorCode);
					$("#alert-dialog").foundation("open");
					$(".index-mercer-logo").css("display", "block");
					$(".main").css("display", "table"); //must be set as table for center alignment
					$("#inapp-closed-msg").css("display", "block");
					$("#loading-indicator").css("display", "none");
				}, 1000 * 3);

			} catch (error) {
				console.log(' error at appcode ' + error);
			}
		}
	} else {
		console.log(urlStringValue.indexOf('register'));
		if ((urlStringValue.indexOf('register') !== -1) || (urlStringValue.indexOf('simplified-login-faq') !== -1)) {
			browserTarget = '_system';
			var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close";
			cordova.InAppBrowser.open(urlStringValue, browserTarget, option);
			navigateToWebAppLogin();
		} else {
		console.log("urlStringValue startting activity indicator "+urlStringValue );
		if(!isLoadingActive){
		    isLoadingActive = true;
		    navigator.notification.activityStart("Please wait", "Loading....");
		}

			/*setTimeout(function(){
                try{

                 navigator.notification.activityStop();
                 alert('timeout');
                }catch(err){
                 console.log("error at setTimeout   "+  err);
                }
			},20*1000); */
		}
	}

}

/**
 * This method would be invoked when the in app browser stops loading a web-page
 * @param event
 */
function onBrowserLoadStop(event) {
	var urlStringValue = String(event.url);

	console.log('urlStringValue  onBrowserLoadStop ' + urlStringValue);
	//since this function is written only in android platform check is not done here

	   navigator.notification.activityStop();
	  isLoadingActive = false;

}

/**
 * This method is invoked when the token request is successful
 * * @param data Data obtained on successful request
 */
function getTokenSuccess(data) {
	console.log("getTokenSuccess   " + JSON.stringify(data));
	$("#overlay-div").css("display", "none");

	if (data.access_token && data.refresh_token) {

		//setting this value when the getting the token is successful
		localStorage.setItem("lastLoginDate", new Date());

		var ss = new cordova.plugins.SecureStorage(
			function() {
				console.log('Success')
			},
			function(error) {
				console.log('Error ' + error);
				//@Sagar first set the message to display later on display the alert
				$("#message-to-display").html(error);
				$("#alert-dialog").foundation("open");
			},
			'my_app'
		);

		//setting the access token in secure storage
		ss.set(
			function(key) {
				//success block
			},
			function(error) {
				console.log('Failed to save access token ' + error);
			},
			'AccessToken', data.access_token
		);
		//setting the refresh token in secure storage
		ss.set(
			function(key) {
				//success block
			},
			function(error) {
				console.log('Failed to save refresh token ' + error);
			},
			'RefreshToken', data.refresh_token
		);
		ss.set(
			function(key) {
				//success block
			},
			function(error) {
				console.log('Failed to save access token ' + error);
			},
			'lastLoginDate', "" + new Date()
		);
		//navigating the user to login success page
		window.location = "html/login_success.html";

	} else {
		$("#message-to-display").html(ERROR_MESSGE);
		$("#alert-dialog").foundation("open");
	}

}

/**
 * This method is invoked when the token request is failed
 * @param error Data obtained about the failed request
 */
function getTokenFailure(error) {

	$("#overlay-div").css("display", "none");

	var errorCode = tokenExpiresError(error);
	if (errorCode != null) {
		var createAStatusCodeDiv = " <br> <div> <b> Status Code : " + error.status + "</b></div>";
		if (config.plainContent == "displayAlerts=yes") {
			errorCode = errorCode + createAStatusCodeDiv;
		}
		$("#message-to-display").html(errorCode);
	}
	// console.log(JSON.stringify(error)); //error.fault.faultstring);
	$("#alert-dialog").foundation("open");
}

function backButtonHandler() {
	$("#log-out-dialog").foundation('open');
}

function dismissDialog() {
	$("#log-out-dialog").foundation('close');
}

function exitApplication() {
	$("#log-out-dialog").foundation('close');
	navigator.app.exitApp();
}

function moveToLoginPage() {
	// window.location = "../www/index.html";
	$("#overlay-div").css("display", "none");
}



function fnFailure(ss) {
    configUrlSuccess(null, ss);
}