//This function returns the base64 URL encoded string
function base64URLEncode(str) {
    return str.toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function getBase64CodeVerifier(isFirstTime) {
    var codeVerifier = generateRandomValue();
    if (isFirstTime) {
        localStorage.setItem('codeVerifier', codeVerifier);
    }
    return base64URLEncode(codeVerifier);
}

function generateRandomValue() {
    var randomText = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    //generating a text of length up-to 50 chars
    for (var i = 0; i < 50; i++)
        randomText += possible.charAt(Math.floor(Math.random() * possible.length));

    return randomText;
}

//this function returns random Code Verifier value using window.crypto
//Update@18 Apr This method causes some exception when only code verifier is required for base64 encode
//hence currently using generateRandomValue() method
function getCodeVerifier() {

    //continue only if the browser supports crypto
    if (window.crypto) {
        var randomValueArray = new Uint32Array(1);
        window.crypto.getRandomValues(randomValueArray);
        return randomValueArray[0];
    } else {
        alert("The application is not supported in this browser");
    }

}

//this function returns the code verifier required for authentication
function getCodeChallenge(isFirstTime) {

    var codeChallenge = getBase64CodeVerifier(isFirstTime);
    if (codeChallenge) {
        //checking whether the mandatory library has been loaded or not
        if (typeof forge_sha256 != 'undefined') {
            return base64URLEncode(forge_sha256(codeChallenge));
        } else {
            return "Failed to load dependant library";
        }
    } else {
        return "Failed to generate code challenge";
    }

}