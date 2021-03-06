
function generateRandomValue() {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //generating a text of length up-to 43 chars
    for (var i = 0; i < 43; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomText;
}

//this function returns random Code Verifier value using window.crypto
//Update@18 Apr This method causes some exception when only code verifier is required for base64 encode
//hence currently using generateRandomValue() method
/*function getCodeVerifier() {

    //continue only if the browser supports crypto
    if (window.crypto) {
        var randomValueArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomValueArray);
        return randomValueArray[0];
    } else {
        alert("The application is not supported in this browser");
    }

}*/

//this function returns the code verifier required for authentication
function getCodeChallenge(codeVerifier) {
    if (typeof forge_sha256 != 'undefined') {
        var mm = forge_sha256(codeVerifier);
       // getBase64EncodedValue(mm);
        console.log('sha256b value '+mm);
        var m2 = getBase64EncodedValue(mm);
        console.log('sha256b value '+m2);

        return m2;
    } else {
        return "Failed to load dependant library";
    }
}

function getBase64EncodedValue(encryptedStr){

    var hexArray = encryptedStr.replace(/\r|\n/g, "")
         .replace(/([\da-fA-F]{2}) ?/g, "0x$1 ")
         .replace(/ +$/, "")
         .split(" ");
     var byteString = String.fromCharCode.apply(null, hexArray);
     var base64string = window.btoa(byteString);
     console.log("base64string    "+base64string.slice(0,-1));
     var finalStr = base64string .replace(/\+/g, '-')
                                        .replace(/\//g, '_')
                                        .replace(/=/g, '');

     console.log("base64string finalStr    "+finalStr);
     return finalStr;
 }


// https://pf-mst.001.staging.ping-nonprod.mercerenc.com/as/authorization.oauth2?client_id=mercersuperapp&redirect_uri=mercersuperapp://callback.html&pwd_reset_redirect_uri=https://stg.youraccountonline.com/secure?login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com&login_uri=https://pf-mst.001.staging.ping-nonprod.mercerenc.com&code_challenge=CF2yOaWXpaqCK5n8T62Iq1lO5Vcym/8emcpEupCG2qA&code_challenge_method=S256&response_type=code
// http://mercersuperapp://callback.html?code=Cl_v3zKSEJiPalRacgMLKiU7Ruw7aUGBoH0iZJ0P"


function generateOldRandomValue() {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //generating a text of length up-to 50 chars
    for (var i = 0; i < 50; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomText;
}

//this function returns the code verifier required for authentication
function getOldCodeChallenge(codeVerifier) {
    //checking whether the mandatory library has been loaded or not
    if (typeof forge_sha256 != 'undefined') {
        return base64URLEncode(forge_sha256(codeVerifier));
    } else {
        return "Failed to load dependant library";
    }
}

//This function returns the base64 URL encoded string
function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function getBase64CodeVerifier() {
    var codeVerifier = generateOldRandomValue();
    localStorage.setItem('codeVerifier', codeVerifier);

    return base64URLEncode(codeVerifier);
}