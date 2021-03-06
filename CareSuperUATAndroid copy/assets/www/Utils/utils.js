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
       if(config.plainContent == "displayAlerts=yes"){
          finalText = finalText + formADiv;
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
    $.ajax({
            type: "GET",
            url: "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text",
            timeout: 20000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            },
            success: function (data) {
                console.log("success response "+JSON.stringify(data));
                Config = data;
                localStorage.setItem("configValue",JSON.stringify(Config));

                //getTokenSuccess(data);
            },
            error: function (error) {
                console.log("error response "+JSON.stringify(error));
                var mm = {"encodedContent":"ZGlzcGxheUFsZXJ0cz15ZXM=","plainContent":"displayAlerts=no"};
                localStorage.setItem("configValue",JSON.stringify(mm));
                //getTokenFailure(error);
               // $("#message-to-display").html(ERROR_MESSGE);
               // $("#alert-dialog").foundation("open");
            }
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
    if(isDebug){
        _crashlytics = FirebaseCrashlytics.initialise();
    }
}

function logException (exceptionMsg) {
    if(isDebug) {
        _crashlytics.logException(exceptionMsg);
    }
}

function doCrash () {
    if(isDebug){
        _crashlytics.crash();
    }
}

