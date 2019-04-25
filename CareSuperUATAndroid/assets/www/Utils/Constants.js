/*
 MST URLS



var authorizationUrl =  "https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?";
var authTokenUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/token.oauth2";
var app_redirect_url = "mercersuperapp://callback.html";
var loginUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com";

*/
/*
 CareSuper URLS
*/


var authorizationUrl =  "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?";
var authTokenUrl = "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/as/token.oauth2";
var app_redirect_url = "caresuperapp://callback.html";
var loginUrl =  "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com";


// index.js
var code_challenge_method = "S256";

var pwd_reset_redirect_uri = "https://stg.youraccountonline.com/secure";
// access Token URL

var AEMPageRequsetUrl = "https://www.youraccountonline.com/secure";
var loginBridgeUrl = "https://secure.superfacts.com/web/mst/loginbridge.tpz";

// Login_Utils
var baseUrl = "https://uat.services.mercerfinancialservices.com";
var websiteUrl =  baseUrl+"/v1/website";
var customerUrl = baseUrl+"/v1/customer";
var customerBalanceUrl = baseUrl+"/v1/customer/balance";

// App Setting Urls

var appSecurityUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody ";
// <prod> https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody
var appSupportUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/supportrte&nodeProperty=rtebody";
var appContactusUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody";
// <prod> https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody


var aboutTheAppUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/aboutapprte&nodeProperty=rtebody"
//<prod> https://www.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/CARESUPER/phonegap-config/jcr:content/par/aboutapprte&nodeProperty=rtebody
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

var isDebug = true;