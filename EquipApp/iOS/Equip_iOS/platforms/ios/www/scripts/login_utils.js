var empNo, planNo, password;

//var client_secret_id = "NIgrdtsgnKb0yZ0DATZNtkjJaz99FP02"; //"7De10Sd1l0MytEnk8AVzu676gGMKgnSI";
var client_secret_id = "hFhaSfbgxXS6eGYipbQXv5XgpVuyRHXr"; //"7De10Sd1l0MytEnk8AVzu676gGMKgnSI";

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
            //Making post request for the login process
            var jsonofResponseData = JSON.parse(data);
            makeLoginCall(jsonofResponseData.txtCompanyName, jsonofResponseData.txtUserName, jsonofResponseData.txtPassword);
        },
        error: function () {
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
            $("#alert-dialog").foundation("open")
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
//                   url: "https://uat.services.mercerfinancialservices.com/v1/website",
                type: "POST",
                url: "https://services.mercerfinancialservices.com/v1/website",
                async: true,
                   cache: false,
                timeout: 120000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessTokenValue
                },
                success: function (data) {
                    localStorage.setItem("navigate_dashboard_retry", false);
                    document.open();
                    document.write(data);
                    document.close();
                },
                error: function (error) {

                    if (error.status === 0) {
                        //these overlays and the alert dialog are there in the respective HTML
                        $("#overlay-div").css("display", "none");
                        $("#message-to-display").html("The server is taking too long to respond");
                        $("#alert-dialog").foundation("open");
                    } else {
                        if (localStorage.getItem("navigate_dashboard_retry") == "true") {

                            //these overlays and the alert dialog are there in the respective HTML
                            $("#overlay-div").css("display", "none");
                            localStorage.setItem("navigate_dashboard_retry", false);

                            $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
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
                                       
                                        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                        $("#alert-dialog").foundation("open");

                                    }

                                } else {
                                    //these overlays and the alert dialog are there in the respective HTML
                                    $("#overlay-div").css("display", "none");

                                    $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                    $("#alert-dialog").foundation("open");

                                }
                            } else {
                                //these overlays and the alert dialog are there in the respective HTML
                                $("#overlay-div").css("display", "none");

                                $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
                                $("#alert-dialog").foundation("open");

                            }
                        }
                    }

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

            var refreshRequestData = {
                refresh_token: refreshTokenValue,
                client_id: client_secret_id,
                grant_type: "refresh_token"
            };

            $.ajax({
//                   url: "https://uat.services.mercerfinancialservices.com/v1/auth/token",
                type: "POST",
                url: "https://services.mercerfinancialservices.com/v1/auth/token",
                async: false,
                timeout: 90000,
                data: refreshRequestData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (data) {
                    getRefreshTokenSuccess(data, whichRequest);
                },
                error: function (error) {

                    if (error.status === 0) {
                        $("#message-to-display").html("The server is taking too long to respond");
                        $("#alert-dialog").foundation("open");
                    } else {
                        var errorObject = JSON.parse(error);
                        if (errorObject && errorObject.Error) {
                            if (errorObject.Error == "Refresh Token Expired") {
                                $("#session-expired-dialog").foundation("open")
                            }
                            else {
                                    $("#session-expired-dialog").foundation("open");
                                }
                        } else {
                            $("#session-expired-dialog").foundation("open");
                        }
                    }

                }
            });
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

        //setting the access token in secure storage
        ss.set(
            function (key) {
                if (whichRequest == "balance_details") {
                    localStorage.setItem("balance_retry", true);
                    getUserBalanceDetails();
                } else if (whichRequest == "user_details") {
                    localStorage.setItem("user_details_retry", true);
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
        $("#message-to-display").html("There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800652525'>1800 652 525</a>");
        $("#alert-dialog").foundation("open");
    }
}
