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
//var client_secret_id = "NIgrdtsgnKb0yZ0DATZNtkjJaz99FP02";
var client_secret_id = "hFhaSfbgxXS6eGYipbQXv5XgpVuyRHXr";
var code_challenge_method = "S256";
//the redirect url for the web application and must not be modified unless informed by server side
//this URL is configured on the server side
var app_redirect_url = "equipapp://callback.html";

var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener("backbutton", backButtonHandler, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        // Check if secure storge is availble

        //@Sagar displaying the splash screen based on platform only
        //Since in iOS the splash screen are displayed in the launchscreen file
        var devicePlatform = device.platform;
        if (devicePlatform == "Android")
            navigator.splashscreen.show();

        var ss = new cordova.plugins.SecureStorage(
            function () {
                localStorage.setItem('isDeviceSecure', 'true');
            },
            function (error) {
                console.log('Error : ' + error);
                localStorage.setItem('isDeviceSecure', 'false');
            },
            'my_app'
        );

        //check if quickLoginType is set, If yes then show quickLogin screen else show login screen
        ss.get(
            function (value) {
                //hiding the splash screen after 3 secs
                if (devicePlatform == "Android")
                    setTimeout("navigator.splashscreen.hide()", 2000);

                cordova.getAppVersion.getVersionNumber(function (version) {
                    var versionValue = version.split(".");
                    var isServiceFirstRun = localStorage.getItem("isServiceFirstRun");
                    var versionLastDigit = parseInt(versionValue[2]);
                    if (versionLastDigit == 13 && isServiceFirstRun && (isServiceFirstRun == "false")) {
                        clearRequiredData();
                        navigateToWebAppLogin();
                    } else if (versionLastDigit == 13 && !isServiceFirstRun) {
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
            function (error) {
                console.log('Error : ' + error);
                //hiding the splash screen after 3 secs
                if (devicePlatform == "Android")
                    setTimeout("navigator.splashscreen.hide()", 2000);
                //Instead of navigating to the login page the user is navigated directly to the
                //web app login page
                navigateToWebAppLogin();
            },
            'quickLoginType'
        );

        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        //console.log('Received Event: ' + id);
    }
};

app.initialize();

function navigateToWebAppLogin() {

    $(".index-mercer-logo").css("display", "none");
    $(".main").css("display", "none");

    if (isNetworkAvailable()) {
        //checking if the instance of in app browser is active
        if (cordova.InAppBrowser) {

            localStorage.setItem("isServiceFirstRun", true);

            //code challenge and code verifier values are generated in pairs
            var codeChallengeValue = getCodeChallenge(true);
            //used for the indentification of which code verifier value to send
            localStorage.setItem("isNewLogin", true);

//            var requestURL = "https://services.mercerfinancialservices.com/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;
//            var requestURL = "https://uat.services.mercerfinancialservices.com/v1/auth/authorize?client_id=" +
            var requestURL = "https://services.mercerfinancialservices.com/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;
            
            //var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close";
            var option = "location=no,toolbar=no";

            inAppBrowserObject = cordova.InAppBrowser.open(requestURL, '_blank', option);
//            inAppBrowserObject.addEventListener('loadstart', onBrowserLoadStart);
            //@Sagar 15th May 2018 -> T&C link is causing the browser error listener to be called
            //commenting the listener for now will uncomment when root cause is identified in iOS, in android it is working fine
            //@Sagar update@17th May 2017 -> Applying workaround for T&C only confirmed by Pallavi
            inAppBrowserObject.addEventListener('loaderror', onBrowserErrorOccured);
            inAppBrowserObject.addEventListener('exit', onInAppBrowserClosed);

        } else {
            $("#message-to-display").html("Failed to initialize components, please force quit application and retry");
            $("#alert-dialog").foundation("open");
        }
    } else {
        $("#message-to-display").html("Please check your internet connection");
        $("#alert-dialog").foundation("open");
        $(".index-mercer-logo").css("display", "block");
        $(".main").css("display", "table");//must be set as table for center alignment
        $("#network-loading-failed-message").css("display", "block");
        $("#inapp-closed-msg").css("display", "none");
        $("#loading-indicator").css("display", "none");
        $(".index-network-error-title").html("Please check your internet conenction");
    }


}

function onBrowserErrorOccured(params) {

    //console.log("Failed to load page in InAppBrowser->Reason: " + params.message);
    if (params.message != "net::ERR_UNKNOWN_URL_SCHEME" && params.message != "Frame load interrupted" && !((params.url).lastIndexOf("terms")>0)) {
        //now since in app browser is closed onInAppBrowserClosed would be invoked
        //hence that message would be displayed
        //        inAppBrowserObject.close();
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
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
        $(".main").css("display", "table");//must be set as table for center alignment
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

    //In android the url value is obtained by appending of http while in iOS it is obtained directly
    //under the function handleOpenURL without the http prefix
    //In android for some reason handleOpenURL is not invoked hence the browserload hack

    if (urlStringValue.indexOf("http://equipapp://") >= 0) {

        localStorage.setItem("isManualClose", true);
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

        var appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code") + 5, urlStringValue.lastIndexOf("scope") - 1)

        var requestData = {
            code: appCode,
            client_id: client_secret_id,
            code_verifier: codeVerifierValue,
            redirect_uri: app_redirect_url,
            grant_type: "authorization_code"
        };
        console.log(JSON.stringify(requestData));
        $.ajax({
               //               url: "https://uat.services.mercerfinancialservices.com/v1/auth/token",
            type: "POST",
            url: "https://services.mercerfinancialservices.com/v1/auth/token",
            async: false,
            timeout: 40000,
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

        //setting this value when the getting the token is successful
        localStorage.setItem("lastLoginDate", new Date());
        var date = new Date();
        
        var format = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
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
               console.log('Failed to save lastLoginDate token ' + error);
               },
               'LastLoginDate', format
               );
        //navigating the user to login success page
        inAppBrowserObject.close();
        window.location = "html/login_success.html";

    } else {
        inAppBrowserObject.close();
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
        $("#alert-dialog").foundation("open");
    }

}

/**
 * This method is invoked when the token request is failed
 * @param error Data obtained about the failed request
 */
function getTokenFailure(error) {
    inAppBrowserObject.close();
    $("#overlay-div").css("display", "none");
    if (error.status === 0) {
        $("#message-to-display").html("The server is taking too long to respond");
    } else {
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
    }

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

function handleOpenURL(url) {
    if (inAppBrowserObject) {
        setTimeout(displayAlert.bind(null, url), 500);

    }
}
function displayAlert(url) {

    var stringURL = String(url);

    if (stringURL.indexOf("equipapp://") >= 0) {


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

        var appCode = stringURL.substring(stringURL.lastIndexOf("code") + 5, stringURL.lastIndexOf("scope") - 1)

        var requestData = {
            code: appCode,
            client_id: client_secret_id,
            code_verifier: codeVerifierValue,
            redirect_uri: app_redirect_url,
            grant_type: "authorization_code"
        };
        $.ajax({
//               url: "https://uat.services.mercerfinancialservices.com/v1/auth/token",
            type: "POST",
            url: "https://services.mercerfinancialservices.com/v1/auth/token",
            async: false,
            timeout: 40000,
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


function clearAllData() {
    var ss = new cordova.plugins.SecureStorage(
        function () {
            //successfully initialized secure storage
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display later on display the alert
            //Below message can be updated for better user information
            $("#message-to-display").html("Error");
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.remove(
        function (key) {
            console.log('Removed ' + key);
        },
        function (error) {
            console.log('Error, ' + error);
        },
        'devicepin'
    );
    ss.remove(
        function (key) {
            console.log('Removed ' + key);
        },
        function (error) {
            console.log('Error, ' + error);
        },
        'quickLoginType'
    );

    ss.set(
        function (key) {

        },
        function (error) {
            console.log('Error ' + error);
        },
        'isBalanceWithoutEnabled', 'false'
    );


    localStorage.clear();

}
