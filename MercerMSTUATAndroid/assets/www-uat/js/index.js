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
var client_secret_id = "s70Pbmr8JNToDgSOfK5TQSDKxVJMEehz";
var code_challenge_method = "S256";
//the redirect url for the web application and must not be modified unless informed by server side
//this URL is configured on the server side
var app_redirect_url = "mercersuperapp://callback.html";

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

                cordova.getAppVersion.getVersionCode(function (versioncode) {
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
        // console.log('Received Event: ' + id);
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


        var requestURL = "https://uat.services.mercerfinancialservices.com/v1/auth/authorize?client_id=" + client_secret_id + "&code_challenge=" + codeChallengeValue + "&code_challenge_method=" + code_challenge_method + "&redirect_uri=" + app_redirect_url;

      /*    var requestURL = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?"+

                           "client_id=mercersuperapp&redirect_uri=mercersuperapp://callback.html"+

                           "&pwd_reset_redirect_uri=https://stg.youraccountonline.com/secure?login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com"+

                           "&login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com"+

                           "&code_challenge="+codeChallengeValue+"&code_challenge_method=S256&response_type=code"; */

            var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close,clearsessioncache=yes";
            console.log("requestURL  "+ requestURL);
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

    console.log("Failed to load page in InAppBrowser->Reason: " + params.message);
    if (params.message != "net::ERR_UNKNOWN_URL_SCHEME") {
        //now since in app browser is closed onInAppBrowserClosed would be invoked
        //hence that message would be displayed
        inAppBrowserObject.close();
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
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

    console.log('urlStringValue   '+urlStringValue);

    //In android the url value is obtained by appending of http while in iOS it is obtained directly
    //under the function handleOpenURL without the http prefix
    //In android for some reason handleOpenURL is not invoked hence the browserload hack

    if (urlStringValue.indexOf("http://mercersuperapp://") >= 0) {

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

       var appCode = null;
               try {
                   var mm = getParams(urlStringValue);
                   console.log('getParams = '+ JSON.stringify(mm));
                   appCode = mm.code;
                   console.log(' appCode code ====  '+appCode);
                   if (appCode === null) {
                    var urlParams = new URL(urlStringValue).searchParams;
                    console.log(' code ====  '+urlParams.get('code'));
                    appCode = urlParams.get('code');
                   }
               }catch(error){
               console.log(' error at appcode '+error);
                   appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code")+5, urlStringValue.length);
               }



       // var appCode = urlStringValue.substring(urlStringValue.lastIndexOf("code") + 5, urlStringValue.lastIndexOf("scope") - 1)

        var requestData = {
            code: appCode,
            client_id: client_secret_id,
            code_verifier: codeVerifierValue,
            redirect_uri: app_redirect_url,
            grant_type: "authorization_code"
        };
        console.log(" requestData  ===   "+JSON.stringify(requestData));
        $.ajax({
            type: "POST",
            url: "https://uat.services.mercerfinancialservices.com/v1/auth/token",
            async: false,
            timeout: 20000,
            data: requestData,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (data) {
            console.log("success response "+data);
                getTokenSuccess(data);
            },
            error: function (error) {
             console.log("error response "+error);
                getTokenFailure(error);
            }
        });

    } else {
        console.log(urlStringValue.indexOf('register'));
        if( (urlStringValue.indexOf('register') !== -1)  || (urlStringValue.indexOf('simplified-login-faq') !== -1)){
             browserTarget = '_system';
             var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close";
             cordova.InAppBrowser.open(urlStringValue, browserTarget, option);
             navigateToWebAppLogin();
        } else {
            navigator.notification.activityStart("Please wait", "Loading....");
        }
    }

}

/**
 * This method would be invoked when the in app browser stops loading a web-page
 * @param event 
 */
function onBrowserLoadStop(event) {
 var urlStringValue = String(event.url);

    console.log('urlStringValue  onBrowserLoadStop '+urlStringValue);
    //since this function is written only in android platform check is not done here

  /*  if( (urlStringValue.indexOf('register') !== -1)  || (urlStringValue.indexOf('simplified-login-faq') !== -1)){

                 navigator.app.backHistory();
                 window.history.back();
                // cordova.InAppBrowser.open(urlStringValue, browserTarget, option);

            } */
    navigator.notification.activityStop();
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
        window.location = "html/login_success.html";

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
    } else {
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
    }
    console.log(JSON.stringify(error)); //error.fault.faultstring);
alert();
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
function moveToLoginPage(){
   window.location = "../www/index.html";
}