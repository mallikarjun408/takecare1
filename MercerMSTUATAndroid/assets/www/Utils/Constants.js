var code_challenge_method = "S256";
var app_redirect_url = "mercersuperapp://callback.html";

// old
// var oldEndPoint = "https://uat.services.mercerfinancialservices.com"; // - UAT
   var oldEndPoint = "https://services.mercerfinancialservices.com";  // -Prod
// var client_secret_id = "s70Pbmr8JNToDgSOfK5TQSDKxVJMEehz"; // - UAT
   var client_secret_id = "7De10Sd1l0MytEnk8AVzu676gGMKgnSI"; // - Prod


// new
var authorizationUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com";
var loginUrl = "https://pf-mst.001.staging.ping-nonprod.mercerenc.com";
var pwd_reset_redirect_uri = "https://stg.youraccountonline.com/secure";
// access Token URL
var authTokenUrl = authorizationUrl+"/as/token.oauth2";

// var AEMPageRequsetUrl = "https://www.youraccountonline.com/secure";
// var loginBridgeUrl = "https://secure.superfacts.com/web/mst/loginbridge.tpz";

// Login_Utils

// var baseUrl = "https://uat.services.mercerfinancialservices.com";  // - UAT
var baseUrl = "https://services.mercerfinancialservices.com"; // - Prod
var websiteUrl =  baseUrl+"/v1/website";
var customerUrl = baseUrl+"/v1/customer";
var customerBalanceUrl = baseUrl+"/v1/customer/balance";

// App Setting Urls

var appSecurityUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/securityrte&nodeProperty=rtebody";
var appSupportUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/supportrte&nodeProperty=rtebody";
var appContactusUrl = "http://mercerprod.www.marshinc.net/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/contactusrte&nodeProperty=rtebody";


https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?client_id=mercersuperapp&redirect_uri=mercersuperapp://callback.html&pwd_reset_redirect_uri=https%3A%2F%2Fstg.youraccountonline.com%2Fsecure?login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com&login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com&code_challenge=AWtkywSTbPLTCLBO2d3Fq7nT_fLFBfX5zYsXaMZc4eI&code_challenge_method=S256&response_type=code


// config URL

var ErrorCodeConfigUrl = "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text";
var AEMConfigURls = "https://stg.youraccountonline.com/bin/mercer-services/mercerauservices/getAppAuthConfigurations?clientName=mst";

var TIMEOUT_MESSAGE = "The server is taking too long to respond";
var ERROR_MESSGE = "There was an error loading the details.<br>Please close app and try again.<br>If the problem persists call us on<br><a href='tel:1800 652 525'>1800 652 525</a>";
var TndC_ERROR_MESSAGE = "Please accept Terms and Conditions to Login";
var ENTER_PIN_TEXT= "Please enter PIN/Password";
var SESSION_EXPIRE_MSG = "Your session has expired</br>Please login again";
var Config = "";


