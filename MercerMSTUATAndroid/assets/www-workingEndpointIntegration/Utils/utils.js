
function validateErrorResponse(errorResponse){

    var errorStatus;
    var errorDesc;
    var errorCode;
    var errorText;
    if(errorResponse.status === 0){
       errorText = TIMEOUT_MESSAGE;
    } else if(errorResponse.status === 500){
       errorText = TIMEOUT_MESSAGE;
    } else if(errorResponse.status === 400){

    } else if(errorResponse.status === 401){

    } else if(errorResponse.status === 404){

    } else {

    }
    if (errorResponse.responseJSON){
        var responseJSON = errorResponse.responseJSON;
        if(responseJSON.error_description){
            errorDesc = responseJSON.error_description;
        }
        if(responseJSON.error){
            errorCode = responseJSON.error;
        }
    }
    var formADiv = " <br> <div> <b>"+ errorCode+"</b>  <br> "+errorDesc+" </div>";
    var finalText = errorText;
    if(config.plainContent == "displayAlerts=yes"){
        finalText = errorText + formADiv;
    }
    $("#message-to-display").html(finalText);
    $("#alert-dialog").foundation("open");
}

/*
{
	"readyState": 4,
	"responseText": "{\"error_description\":\"grant_type is required\",\"error\":\"invalid_request\"}\r\n",
	"responseJSON": {
		"error_description": "grant_type is required",
		"error": "invalid_request"
	},
	"status": 400,
	"statusText": "error"
}
*/