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

    public static String SURVEY_URL =  "survey.confirmit.com.au";

    public static String REDIRECT_TO_QUICKLOGIN =  "file:///android_asset/www/html/quick-login.html";


    public static String[] LOGIN_LOGOUT_URLS = {
            SECURE_SUPERFACTS_HOME_TPZ,
            SECURE_SUPERFACTS_LOGOUT_TPZ,
            SECURE_UAT_SUPERFACTS_HOME_TPZ,
            SECURE_UAT_SUPERFACTS_LOGOUT_TPZ
    };

    public static String[] CONTAINS_ARRAY = {
            LOGOUT_TPZ,
            HOME_TPZ,
            MERCER_FINANCIAL_SERVICES,
            SESSION_EXPIRE_DASHBOARDURL
    };

}