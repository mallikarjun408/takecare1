package org.apache.cordova;

class URLConstants {

    public static String SECURE_SUPERFACTS_HOME_TPZ = "https://secure.superfacts.com/web/caresuper/home.tpz";
    public static String SECURE_SUPERFACTS_LOGOUT_TPZ =  "https://secure.superfacts.com/web/caresuper/Logout.tpz";
    public static String SECURE_UAT_SUPERFACTS_HOME_TPZ =  "https://secure.uat.superfacts.com/web/caresuper/home.tpz";
    public static String SECURE_UAT_SUPERFACTS_LOGOUT_TPZ =  "https://secure.uat.superfacts.com/web/caresuper/Logout.tpz";

    public static String LOGOUT_TPZ =  "logout.tpz";
    public static String HOME_TPZ =   "home.tpz";
    public static String MERCER_FINANCIAL_SERVICES =  "www.mercerfinancialservices.com";
    public static String SESSION_EXPIRE_DASHBOARDURL = "redirect_uri=https%3A%2F%2Fstg.youraccountonline.com%2Fsecure&pwd_reset_redirect_uri=https%3A%2F%2Fstg.youraccountonline.com%2Fsecure%3Flogin_uri%3Dhttps%3A%2F%2Fpf-caresuper.001.staging.ping-nonprod.mercerenc.com";
    public static String SESSION_EXPIRE_DASHBOARDPROD = "redirect_uri=https%3A%2F%2Fstg.youraccountonline.com%2Fsecure&pwd_reset_redirect_uri=https%3A%2F%2Fstg.youraccountonline.com%2Fsecure%3Flogin_uri%3Dhttps%3A%2F%2Flogin.identity.caresuper.com.au";


    public static String SURVEY_URL =  "survey.confirmit.com.au";

    public static String REDIRECT_TO_QUICKLOGIN =  "file:///android_asset/www/html/quick-login.html";

    public static String STAGING_LOGOUT_URL = "https://pf-caresuper.001.staging.ping-nonprod.mercerenc.com/idp/startSLO.ping?TargetResource=https%3A%2F%2Fwww.caresuper.com.au%2F/";
    public static String PROD_LOGOUT_URL = "https://login.identity.caresuper.com.au/idp/startSLO.ping?TargetResource=https://www.caresuper.com.au/";
    public static String PROD_LOGOUT_URL1 = "https://login.identity.caresuper.com.au/idp/startSLO.ping?TargetResource=https%3A%2F%2Fwww.caresuper.com.au%2F/";

    public static String STAGING_CONTACTUS_URL = "https://stg.youraccountonline.com/form/aus/CARESUPER/config/contact-us.html";
    public static String PROD_CONTACTUS_URL = "https://login.identity.caresuper.com.au/form/aus/CARESUPER/config/contact-us.html";

   // https://www.youraccountonline.com/secure?login_uri=https://login.identity.caresuper.com.au&passwordChange=true

    public static String[] LOGIN_LOGOUT_URLS = {
            SECURE_SUPERFACTS_HOME_TPZ,
            SECURE_SUPERFACTS_LOGOUT_TPZ,
            SECURE_UAT_SUPERFACTS_HOME_TPZ,
            SECURE_UAT_SUPERFACTS_LOGOUT_TPZ,
            STAGING_LOGOUT_URL,
            PROD_LOGOUT_URL,
            PROD_LOGOUT_URL1
    };

    public static String[] CONTAINS_ARRAY = {
            LOGOUT_TPZ,
            HOME_TPZ,
            MERCER_FINANCIAL_SERVICES,
            SESSION_EXPIRE_DASHBOARDURL,
            SESSION_EXPIRE_DASHBOARDPROD
    };


}