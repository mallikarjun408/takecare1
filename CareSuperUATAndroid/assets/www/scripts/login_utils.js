var empNo, planNo, password;

var client_secret_id = "s70Pbmr8JNToDgSOfK5TQSDKxVJMEehz";

// $(document).ready(function () {
//     document.addEventListener("deviceready", loginUtilDeviceReady, false);
// });

function loginUtilDeviceReady() {

    //getting the values of employee number, plan number and password from secure storage
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
        function (value) {
            window.empNo = value;
        },
        function (error) {
            console.log('Error ' + error);
        },
        'Employee Number'
    );
    ss.get(
        function (value) {
            window.planNo = value;
        },
        function (error) {
            console.log('Error ' + error);
        },
        'Plan Number'
    );

    ss.get(
        function (value) {
            window.password = value;
        },
        function (error) {
            console.log('Error ' + error);
        },
        'Password'
    );

}

function doLogin() {

    //Making ajax call to get encrypted data for login fields
    // var getEncryptedValuesurl = 'http://mercerqa.www.marshinc.net/bin/mercer/aus/getEncryptedLoginDetails?txtCompanyName='+window.empNo+'&txtUserName='+window.planNo+'&txtPassword='+window.password
    var getEncryptedValuesurl = 'http://mercerprod.www.marshinc.net/bin/mercer/aus/getEncryptedLoginDetails?txtCompanyName=' + window.empNo + '&txtUserName=' + window.planNo + '&txtPassword=' + window.password

    $.ajax({
        type: 'GET',
        url: getEncryptedValuesurl,
        success: function (data) {
       console.log('loginUtils : error success doLogin '+JSON.stringify(error));
            //Making post request for the login process
            var jsonofResponseData = JSON.parse(data);
            makeLoginCall(jsonofResponseData.txtCompanyName, jsonofResponseData.txtUserName, jsonofResponseData.txtPassword);
        },
        error: function () {
        console.log('loginUtils : error Callback  doLogin'+JSON.stringify(error));
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(ERROR_MESSGE);
            $("#alert-dialog").foundation("open")
            logException("Messge:: while doLogin "+JSON.stringify(error)+" || FileName:: quick-login.js || Method:: doLogin()");
        }

    });
}

function makeLoginCall(empNo, planNo, password) {

    document.getElementById("overlay-div").style.display = "block";
    //post('https://secure.uat.superfacts.com/web/mst/loginbridge.tpz', {'txtCompanyName': empNo, 'txtUserName':planNo, 'txtPassword':password});
    post('https://secure.superfacts.com/web/mst/loginbridge.tpz', { 'txtCompanyName': empNo, 'txtUserName': planNo, 'txtPassword': password });

}

//making the post request
function post(path, params, method) {

    var form = document.createElement("form");
    form.setAttribute("action", path);
    for (var key in params) {
        if (params.hasOwnProperty(key)) {

            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);

        }
    }

    document.body.appendChild(form);
    form.submit();

}

function navigateToDashboard() {

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
        function (value) {
            accessTokenValue = value;
            $.ajax({
                type: "POST",
                url: websiteUrl,
                async: false,
                timeout: 120000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer '+accessTokenValue
                },
                success: function (data) {
                console.log('loginUtils : Success Callback '+JSON.stringify(data));
                    localStorage.setItem("navigate_dashboard_retry", false);
                    document.open();
                    document.write(data);
                    document.close();
                },
                error: function (error) {
                    console.log('loginUtils : error Callback '+websiteUrl+" <br> "+JSON.stringify(error));
                     $("#overlay-div").css("display", "none");
                   /* var returnValue = websiteErrorCallback(error);
                    if (returnValue != null && typeof returnValue === 'object') {
                        if(returnValue.faultstring == "Invalid Access Token" || returnValue.detail.errorcode == "keymanagement.service.invalid_access_token"){
                            getRefreshToken("balance_details");
                        }
                    } else {
                        $("#user-balance-para").html(ERROR_MESSGE);
                    } */
                   logException("Messge:: navigateToDashboard  failure callback "+JSON.stringify(data)+" || FileName:: quick-login.js || Method:: navigateToDashboard()");
                   var errorCode = tokenExpiresError(error);
                   if (errorCode != null && errorCode == "invalid_grant") {
                        getRefreshToken("navigate_dashboard");
                   } else if (errorCode != null && errorCode == "keymanagement.service.invalid_access_token") {
                       getRefreshToken("navigate_dashboard");
                   } else {
                       var createAStatusCodeDiv = " <br> <div> <b> Status Code : "+ error.status +"</b></div>";
                       if(config.plainContent == "displayAlerts=yes"){
                            errorCode = errorCode + createAStatusCodeDiv;
                       }
                       $("#message-to-display").html(errorCode);
                       $("#alert-dialog").foundation("open");
                   }


                   /* if (error.status === 0) {
                        //these overlays and the alert dialog are there in the respective HTML
                        $("#overlay-div").css("display", "none");
                        $("#message-to-display").html("The server is taking too long to respond");
                        $("#alert-dialog").foundation("open");
                    } else {
                        if (localStorage.getItem("navigate_dashboard_retry") == "true") {

                            //these overlays and the alert dialog are there in the respective HTML
                            $("#overlay-div").css("display", "none");
                            localStorage.setItem("navigate_dashboard_retry", false);

                            $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
                            $("#alert-dialog").foundation("open");

                        } else {

                            if (error.responseText) {
                                var errorObject = JSON.parse(error.responseText);
                                if (errorObject && errorObject.fault && errorObject.fault.faultstring) {
                                    if ((errorObject.fault.faultstring == "Access Token expired") ||
                                        (errorObject.fault.faultstring == "Invalid Access Token"))
                                        getRefreshToken("navigate_dashboard");
                                    else {
                                        //these overlays and the alert dialog are there in the respective HTML
                                        $("#overlay-div").css("display", "none");
                                       
                                        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
                                        $("#alert-dialog").foundation("open");

                                    }

                                } else {
                                    //these overlays and the alert dialog are there in the respective HTML
                                    $("#overlay-div").css("display", "none");

                                    $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
                                    $("#alert-dialog").foundation("open");

                                }
                            } else {
                                //these overlays and the alert dialog are there in the respective HTML
                                $("#overlay-div").css("display", "none");

                                $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br>1800 652525");
                                $("#alert-dialog").foundation("open");

                            }
                        }
                    } */

                }
            });
        },
        function (error) {
            console.log('Error ' + error);
        },
        'AccessToken'
    );

}

/**
 * This method is used to request the refresh token
 * @param whichRequest This variable is used to identify which request to retry
 */
function getRefreshToken(whichRequest) {
    $("#user-data-loading-img-container").css("marginTop", "70px");
	$("#user-data-loading-img-container").css("display", "block");
    var refreshTokenValue;
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
            refreshTokenValue = value;
            ss.get(function(accessToken){
                var refreshRequestData = {
                    refresh_token: refreshTokenValue,
                    grant_type: "refresh_token"
                };
                console.log("refreshRequestData   "+JSON.stringify(refreshRequestData));
                $.ajax({
                    type: "POST",
                    url: authTokenUrl,
                    async: false,
                    timeout: 20000,
                    data: refreshRequestData,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Accept': 'application/json',
                        'Authorization': 'Bearer ' + accessToken
                    },
                    success: function (data) {
                        $("#user-data-loading-img-container").css("display", "none");
                        $("#logged-in-user-details").css("margin-top", "30px");
                        console.log('loginUtils : Success Callback token '+JSON.stringify(data));
                        getRefreshTokenSuccess(data, whichRequest);
                    },
                    error: function (error) {
                        $("#user-data-loading-img-container").css("display", "none");
                        $("#logged-in-user-details").css("margin-top", "30px");
                        console.log('loginUtils : error Callback  token'+JSON.stringify(error));
                       logException("Messge:: getRefreshToken  failure callback from:: "+whichRequest+"  error response :: "JSON.stringify(data)+" || FileName:: quick-login.js || Method:: getRefreshToken()");
                       var errorCode = tokenExpiresError(error);
                       var createAStatusCodeDiv ="";
                       if(config.plainContent == "displayAlerts=yes"){
                           createAStatusCodeDiv = " <br> <div> <b> Status Code : "+ error.status +"</b></div>";
                       }

                       if (errorCode != null && errorCode == "invalid_grant") {
                            if(config.plainContent == "displayAlerts=yes"){
                              $("#session-expired-message").html(SESSION_EXPIRE_MSG+"</br>"+createAStatusCodeDiv);
                            }
                            $("#session-expired-dialog").foundation("open");
                       } else if (errorCode != null && errorCode == "keymanagement.service.invalid_access_token") {
                            if(config.plainContent == "displayAlerts=yes"){
                            //alert(SESSION_EXPIRE_MSG+""+formADiv)
                                $("#session-expired-message").html(SESSION_EXPIRE_MSG+"</br>"+createAStatusCodeDiv);
                            }
                            $("#session-expired-dialog").foundation("open");
                       }else {
                            var errorMsg = ERROR_MESSGE;
                            if(config.plainContent == "displayAlerts=yes"){
                               errorCode = errorCode + createAStatusCodeDiv;
                               errorMsg = ERROR_MESSGE+""+createAStatusCodeDiv;
                            }
                            if (error.status === 0) {
                               $("#message-to-display").html(errorCode);
                               $("#alert-dialog").foundation("open");
                            } else {
                                $("#user-balance-para").html(errorMsg);
                            }
                       }
                       /* var returnValue = tokenExpiresError(error);
                        if (returnValue != null && typeof returnValue === 'object') {
                            if(returnValue.error == "invalid_grant"){
                                 $("#session-expired-dialog").foundation("open");
                            }
                        } else {
                            $("#user-balance-para").html(ERROR_MESSGE);
                        } */
                     /*   if (error.status === 0) {
                            $("#message-to-display").html("The server is taking too long to respond");
                            $("#alert-dialog").foundation("open");
                        } else {
                            $("#session-expired-dialog").foundation("open");
                           /* var errorObject = JSON.parse(error);
                            if (errorObject && errorObject.Error) {
                                if (errorObject.Error == "Refresh Token Expired") {
                                    $("#session-expired-dialog").foundation("open")
                                }
                            } else {
                                $("#session-expired-dialog").foundation("open");
                            }
                        } */

                    }
                });
            },function(error){
                $("#message-to-display").html(error);
                $("#alert-dialog").foundation("open");
            },"AccessToken");
        },
        //failed to get required value from secure storage
        function (error) {
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open");
        },
        'RefreshToken'
    );

}

function getRefreshTokenSuccess(data, whichRequest) {
    if (data.access_token && data.refresh_token) {
        var ss = new cordova.plugins.SecureStorage(
            function () {
                //success block
            },
            function (error) {
                console.log('Error ' + error);
                //@Sagar first set the message to display later on display the alert
                $("#message-to-display").html(error);
                $("#alert-dialog").foundation("open");
            },
            'my_app'
        );

        console.log("Access after refresh ", data.access_token);
        console.log("Refresh after refresh ", data.refresh_token);

        //setting the access token in secure storage
        ss.set(
            function (key) {
                if (whichRequest == "balance_details") {
                    localStorage.setItem("balance_retry", true);
                    console.log("getUserBalanceDetails Retry after refresh");
                    getUserBalanceDetails();
                } else if (whichRequest == "user_details") {
                    localStorage.setItem("user_details_retry", true);
                    console.log("getLoggedInUserDetails Retry after refresh");
                    getLoggedInUserDetails();
                } else if (whichRequest == "navigate_dashboard") {
                    localStorage.setItem("navigate_dashboard_retry", true);
                    $("#overlay-div").css("display", "block");
                    navigateToDashboard();
                }
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

    } else {
        $("#message-to-display").html(ERROR_MESSGE);
        $("#alert-dialog").foundation("open");
        logException("Messge:: once new token recives  || FileName:: quick-login.js || Method:: getRefreshTokenSuccess()");
    }
}