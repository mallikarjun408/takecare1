var config = JSON.parse(localStorage.getItem('configValue'));
//{"plainContent":"displayAlerts=no"};
var formADiv = "default";
function tokenExpiresError(errorResponse){

    var errorStatus;
    var errorDesc;
    var errorCode;
    var errorText;

    var finalText = "";
    var formADiv = "";

    if(errorResponse.status === 0){
       finalText = TIMEOUT_MESSAGE;
      // formADiv = " <br><br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
       if(config.plainContent == "displayAlerts=yes"){
           finalText = finalText + formADiv;
       }
       return finalText;
    } else if(errorResponse.status === 500){
       finalText = ERROR_MESSGE;
      // formADiv = " <br><br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
       try{
            if(config.plainContent == "displayAlerts=yes"){
                finalText = finalText + formADiv;
            }
       }catch(exception) {
        console.log(exception)
       }

       return finalText;
    } else if(errorResponse.status === 400){
        formADiv = " <br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
        if (errorResponse.responseJSON){
            var responseJSON = errorResponse.responseJSON;
            if(responseJSON.error_description){
                errorDesc = responseJSON.error_description;
            }
            if(responseJSON.error){
                errorCode = responseJSON.error;
            }
        }
        return errorCode;
    } else if(errorResponse.status === 401){
        formADiv = " <br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
        if (errorResponse.responseText){
            var responseJSON = (errorResponse.responseText);

            responseJSON = JSON.parse(responseJSON).fault;

            if(responseJSON.faultstring){
                errorDesc = responseJSON.faultstring;
            }
            if(responseJSON.detail){
                errorCode = responseJSON.detail.errorcode;
            }
        }
        return errorCode;
    } else if(errorResponse.status === 404)  {
       finalText = ERROR_MESSGE;
       formADiv = " <br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
       if(config.plainContent == "displayAlerts=yes"){
           finalText = finalText + formADiv;
       }
       return finalText;
    } else {
       finalText = ERROR_MESSGE;
       formADiv = " <br> <div> <b> Status Code : "+ errorResponse.status +"</b></div>";
       if(config.plainContent == "displayAlerts=yes"){
           finalText = finalText + formADiv;
       }
       return finalText;
    }

   /* $("#message-to-display").html(finalText);
    $("#alert-dialog").foundation("open");*/
}

function getConfigValues(){

   return new Promise(function(resolve,reject) {
            $.ajax({
            type: "GET",
            url: ErrorCodeConfigUrl, //"https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text",
            timeout: 20000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (data) {
                if(data.responseCode == 200) {
                    console.log("success response "+JSON.stringify(data));
                    Config = data;
                    localStorage.setItem("configValue",JSON.stringify(data));
                    resolve(data);
                }
            },
            error: function (error) {
                console.log("error response "+JSON.stringify(error));
                var mm = {"encodedContent":"ZGlzcGxheUFsZXJ0cz15ZXM=","plainContent":"displayAlerts=no"};
                localStorage.setItem("configValue",JSON.stringify(mm));
                reject(JSON.stringify(error));
            }
        });
    });
}

function navigateToLoginPage() {
	hideDeviceKeyboard();
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
	window.location = '../index.html';
}


/* firebase crashlytics implementation and supporting functions */

var _crashlytics;

function initCrashlytics() {
    if(localStorage.getItem(ENABLE_CRASHLYTICS) == "true"){
        _crashlytics = FirebaseCrashlytics.initialise();
        alert(_crashlytics);
         _crashlytics.logException("Test");
    }
}

function logException (exceptionMsg) {
    if(localStorage.getItem(ENABLE_CRASHLYTICS) == "true"){
        _crashlytics.logException(exceptionMsg);
    }
}

function doCrash () {
    if(localStorage.getItem(ENABLE_CRASHLYTICS) == "true"){
        _crashlytics.crash();
    }
}



function loadConfigValuesFromServer() {

    return new Promise(function(resolve,reject) {
        $.ajax({
                type: "GET",
                url: AEMConfigURL,
                timeout: 20000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (data) {
                    console.log("success response @AEM config"+JSON.stringify(data));
                    if (data != null) {
                        if (data.responseCode == 200) {
                            localStorage.setItem(AUTH_ENDPOINT,data.AuthEndpoint);
                            localStorage.setItem(TOKEN_ENDPOINT,data.TokenEndpoint);
                            localStorage.setItem(MERCER_ENDPOINT,data.MercerAPIEndpoint);
                            localStorage.setItem(CLIENT_ID,data.clientid);
                            localStorage.setItem(CALLBACK_URL,data.callbackurl);
                            localStorage.setItem(ENABLE_CRASHLYTICS,data.EnableCrashlytics);
                            localStorage.setItem(LOGIN_URL,data.login_uri);
                            localStorage.setItem(PWD_RESET_REDIRECT_URI,data.pwd_reset_redirect_uri);
                        }
                        resolve(JSON.stringify(data));
                    }else {
                        reject("");
                    }
                },
                error: function (error) {
                    console.log("error response "+JSON.stringify(error));
                    reject(error);
                }
            });
    });

}
