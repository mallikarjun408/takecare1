var authorizationUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?";

// index.js
var code_challenge_method = "S256";
var app_redirect_url = "mercersuperapp://callback.html";
var loginUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com";
var pwd_reset_redirect_uri = "https://stg.youraccountonline.com/secure";
// access Token URL
var authTokenUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/token.oauth2";

var AEMPageRequsetUrl = "https://www.youraccountonline.com/secure";
var loginBridgeUrl = "https://secure.superfacts.com/web/mst/loginbridge.tpz";

// Login_Utils
var baseUrl = "https://uat.services.mercerfinancialservices.com";
var websiteUrl =  baseUrl+"/v1/website";
var customerUrl = baseUrl+"/v1/customer";
var customerBalanceUrl = baseUrl+"/v1/customer/balance";

// App Setting Urls

var appSecurityUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody";
var appSupportUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/supportrte&nodeProperty=rtebody";
var appContactusUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody";

var TIMEOUT_MESSAGE = "The server is taking too long to respond";
var ERROR_MESSGE = "There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800 652 525'>1800 652 525</a>";
var TndC_ERROR_MESSAGE = "Please accept Terms and Conditions to Login";
var ENTER_PIN_TEXT= "Please enter PIN/Password";



