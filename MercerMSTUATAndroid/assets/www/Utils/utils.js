var config = {"plainContent":"displayAlerts=no"}; //JSON.parse(localStorage.getItem('configValue'));
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

   /* return $.ajax({
            type: "GET",
            url: "https://stg.youraccountonline.com/bin/mercer-services/osgiservice/getNodeContentByProperty?nodePath=/content/mercer-online-forms/form/aus/MST/phonegap-config/jcr:content/par/destinationcontent&nodeProperty=text",
            timeout: 20000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
    }); */

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
                //getTokenFailure(error);
               // $("#message-to-display").html(ERROR_MESSGE);
               // $("#alert-dialog").foundation("open");
            }
        });
    });
}


function loadConfigValuesFromServer() {
    return new Promise(function(resolve,reject) {
        $.ajax({
                type: "GET",
                url: AEMConfigURls,
                timeout: 20000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                success: function (data) {
                    console.log("success response "+JSON.stringify(data));
                    localStorage.setItem("configUrlValue",""+JSON.stringify(data));
                   // alert( localStorage.getItem("configUrlValue"));
                    resolve(JSON.stringify(data));
                },
                error: function (error) {
                    console.log("error response "+JSON.stringify(error));
                   /* var mm = {
                      	"UseNewEndpointsIOS": "false",
                      	"UseNewEndpointsAndroid": "false",
                      	"CurrentEndpoints": "https://services.mercerfinancialservices.com",
                      	"NewEndpoints": "https://mst.login.identity.mercerfinancialservices.com",
                      	"responseCode": "200",
                      	"responseMessage": "Success"
                    }*/
                   // localStorage.setItem("configUrlValue",JSON.stringify(mm));
                    reject(error);
                }
            });
    });

}



