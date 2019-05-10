

var App_Client_ID = "caresuperapp";
/*
 CareSuper Staging URLS



var authorizationUrl =  "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2";
                        // https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2
var authTokenUrl = "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/token.oauth2";
var app_redirect_url = "caresuperapp://callback.html";
var loginUrl =  "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com";
var appSecurityUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody ";
var appSupportUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/supportrte&nodeProperty=rtebody";
var appContactusUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody";
var aboutTheAppUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/aboutapprte&nodeProperty=rtebody"
var baseUrl = "https://uat.services.mercerfinancialservices.com";
*/
//var AEMConfigURL = "https://stg.youraccountonline.com/bin/mercer-services/mercerauservices/getAppAuthConfigurations?clientName=CARESUPER"; //"http://mercerauqa64.www.marshinc.net/bin/mercer-services/mercerauservices/getAppAuthConfigurations?clientName=CARESUPER";



var ErrorCodeConfigUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text";
/*
 CareSuper PROD URLS



var authorizationUrl=  "https://login.identity.caresuper.com.au/as/authorization.oauth2";
var authTokenUrl    = "https://login.identity.caresuper.com.au/as/token.oauth2";
var app_redirect_url= "caresuperapp://callback.html";
var loginUrl        =  "https://login.identity.caresuper.com.au";
var baseUrl         =  "https://services.mercerfinancialservices.com";

*/
var appSecurityUrl  =  "https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody";
var appSupportUrl   =  "https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/supportrte&nodeProperty=rtebody";
var appContactusUrl =  "https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody";
var aboutTheAppUrl  =  "https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/aboutapprte&nodeProperty=rtebody";

var AEMConfigURL = "https://www.youraccountonline.com/bin/mercer-services/mercerauservices/getAppAuthConfigurations?clientName=CARESUPER";

// index.js
var code_challenge_method = "S256";

var pwd_reset_redirect_uri = "https://stg.youraccountonline.com/secure";
// access Token URL



// Login_Utils
/*
var websiteUrl =  baseUrl+"/v1/website";
var customerUrl = baseUrl+"/v1/customer";
var customerBalanceUrl = baseUrl+"/v1/customer/balance";
*/

// config URL

var configUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text";

var TIMEOUT_MESSAGE = "The server is taking too long to respond";
var ERROR_MESSGE = "There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800 652 525'>1800 652 525</a>";
var TndC_ERROR_MESSAGE = "Please accept Terms and Conditions to Login";
var ENTER_PIN_TEXT= "Please enter PIN/Password";
var SESSION_EXPIRE_MSG = "Your session has expired</br>Please login again";
var Config = "";


// constant Variables
var INTERNET_AVAILABILITY_MSG = "Please check your internet connection";
var INCORRECT_PIN_COUNTER = 3;
var NO_MORE_ATTEMPTS_MSG = "Incorrect PIN entered.</br>You have no more attempts.</br>Please login with your website login credentials";
var INCORRECT_PIN_LEFT_MSG = "Incorrect PIN entered</br>You have " + INCORRECT_PIN_COUNTER + " more attempts left";
var NOT_VALID_PIN = "Not a valid PIN, please re-enter";
var INVALID_MAX_ATTEMPTS = "Invalid authentication/Fingerprint max attempts reached";
var NO_MORE_ATTEMPTS_LOGINSETTINGS = "You have no more attempts left for identity verification.</br>Please login with your website login credentials";
var FINGERPRINT_SUCCESSMSG = "Fingerprint set up successful!!</br>It has been set as the default login style and can be changed any time from the app menu";
var FINGERPRINT_ERROR = "Fingerprint is not setup in device. Please go to device settings and setup fingerprint before proceeding";

/*
    Logging Variables
*/

var isDebug = false;




/*

{
	"AuthEndpoint": "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2",
	"TokenEndpoint": "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/token.oauth2",
	"MercerAPIEndpoint": "https://uat.services.mercerfinancialservices.com",
	"clientid": "caresuperapp",
	"callbackurl": "caresuperapp://callback.html",
	"EnableCrashlytics": "true",
	"CrashlyticsNotificationEmailAdd": "test@mercer.com",
	"login_uri": "https://pf-mst.001.staging.ping-nonprod.mercerenc.com",
	"pwd_reset_redirect_uri": "https://stg.youraccountonline.com/secure?login_uri=https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com",
	"responseCode": "200",
	"responseMessage": "Success"
}
*/


var AUTH_ENDPOINT = "AuthEndpoint";
var TOKEN_ENDPOINT = "TokenEndpoint";
var MERCER_ENDPOINT = "MercerAPIEndpoint";
var CLIENT_ID = "clientid";
var CALLBACK_URL = "callbackurl";
var ENABLE_CRASHLYTICS = "EnableCrashlytics";
var LOGIN_URL = "login_uri";
var PWD_RESET_REDIRECT_URI = "pwd_reset_redirect_uri";


