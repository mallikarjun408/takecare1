
// TODO should be in generic spot (index.js) so it will always be triggered, even on warm start from a page deep down in the app


/**
 * This method is responsible for checking whether the input value is number or not
 * @param evt The Keyboard input event
 */
function isNumberKey(evt) {
    var inputValue = event.target.value;
    var digitPattern = /[0-9]/g;
    var result = inputValue.match(digitPattern);
    if (result != null) {
        return true;
    } else {
        return false;
    }
}

/**
 * This method is responsible for clearing the data related to the application
 */
function clearRequiredData() {
    //code to disable 3D touch
    ThreeDeeTouch.isAvailable(function (avail) {

        if (avail) {
            ThreeDeeTouch.configureQuickActions([
                {
                    type: 'checkin',
                    title: '',
                    subtitle: '',
                },
                {
                    type: 'share',
                    title: '',
                    subtitle: '',
                }
            ]);
        }

    });

    var ss = new cordova.plugins.SecureStorage(
        function () {
            //successfully initialized secure storage
        },
        function (error) {
            console.log('Error ' + error);
            hideDeviceKeyboard();
            //@Sagar first set the message to display later on display the alert
            //Below message can be updated for better user information
            $("#message-to-display").html("Error");
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.remove(
        function (key) {
            console.log('Removed ' + key);
        },
        function (error) {
            console.log('Error, ' + error);
        },
        'devicepin'
    );
    ss.remove(
        function (key) {
            console.log('Removed ' + key);
        },
        function (error) {
            console.log('Error, ' + error);
        },
        'quickLoginType'
    );

    ss.set(
        function (key) {

        },
        function (error) {
            console.log('Error ' + error);
        },
        'isBalanceWithoutEnabled', 'false'
    );

    localStorage.clear();

}

document.addEventListener('deviceready', function () {

    // By Ankit 13-04-2018
    //Code to display status bar
    StatusBar.overlaysWebView(false);
    StatusBar.backgroundColorByName("black");
    StatusBar.styleLightContent();
    //code ends
    // By Ankit 12-04-2018
    //Code to change viewport if device=  iphone X

    // Really basic check for the ios platform
    var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    // Get the device pixel ratio
    var ratio = window.devicePixelRatio || 1;

    // Define the users device screen dimensions
    //var heightValue =window.screen * ratio;
    var widthValue = window.innerWidth * ratio;
    var heightValue = window.innerHeight * ratio;
    // iPhone X Detection.

    if (iOS && widthValue == 1125 && heightValue === 2202) {
        var metaTag = document.createElement('meta');
        metaTag.name = "viewport"
        metaTag.content = "initial-scale=1, width=device-width, height=device-height, viewport-fit=cover"
        document.getElementsByTagName('head')[0].appendChild(metaTag);
    } else {
        var metaTag = document.createElement('meta');
        metaTag.name = "viewport"
        metaTag.content = "width=device-width, initial-scale=1"
        document.getElementsByTagName('head')[0].appendChild(metaTag);
    }
    //code ends

    isTnCAccepted = localStorage.getItem("tncAccepted");

    //if (isTnCAccepted == "true") {
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            //< !--@Sagar first set the message and then display the alert-- >
            //$("#message-to-display").html(error);
            // $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.get(
        function (value) {

            ThreeDeeTouch.onHomeIconPressed = function (payload) {

                // console.log("Icon pressed. Type: " + payload.type + ". Title: " + payload.title + ".");
                if (payload.type == 'share' || payload.type == 'checkin') {
                    localStorage.setItem("ThreeDeeNavigation", true);
                    document.location = '../html/quick-login.html';
                } else {
                    // hook up any other icons you may have and do something awesome (e.g. launch the Camera UI, then share the image to Twitter)
                    //console.log(JSON.stringify(payload));
                }
            }


        },
        function (error) {
            console.log('Error getting isBalanceWithoutEnabled' + error);

        },
        'isBalanceWithoutEnabled'
    );


    /*} else {
        console.log("Tnc not accepted");
    }*/
}, false);

/**
 * This method requires Keyboard plugin to be installed
 * If the keyboard is visible then the method would hide the same
 */
function hideDeviceKeyboard() {
    if (Keyboard.isVisible) {
        Keyboard.hide();
    }
}

function openDeviceKeyboard() {
    if (Keyboard.isVisible) {
        Keyboard.show();
    }
}


function pageLevelClick(event) {

    //the origin for the internal app links is file:// and
    //for the href links the origin is url domain
    var hrefOrigin = event.target.origin;
    var hrefValue = event.target.getAttribute("href");
    if ((hrefOrigin != "file://") && (hrefOrigin != "tel://")
        && (hrefOrigin != "mailto://") && (hrefOrigin != "sms://")
        && (hrefOrigin != "geo://") && hrefValue) {

        event.preventDefault();

        var option = "location=no,toolbarposition=bottom,closebuttoncaption=Close";
        var browserTarget;
        var devicePlatform = device.platform;
        //native android does not have support for PDF files hence setting the browser
        //target only in case of android
        if (devicePlatform == "Android") {
            //splitting the href link by '.'
            var fileDetailsArray = (hrefValue.split("."));
            var fileExtensionIndex = fileDetailsArray.length - 1;
            //JS arrays are 0 index based
            var fileExtension = fileDetailsArray[fileExtensionIndex];
            //if the file type is PDF then opening the same in system browser
            if ((fileExtension === "pdf") || (fileExtension === "PDF")) {
                //system browsers are able to handle the pdf extensions better for download
                //since the android webview does not support direct PDF links
                browserTarget = '_system';
            } else {
                //rest other files can be opened in normal webview
                browserTarget = '_blank';
            }
        } else {
            browserTarget = '_blank';
        }
        //the hyperlink would be opened in inAppBrowser
        cordova.InAppBrowser.open(hrefValue, browserTarget, option);

    }

}

function isNetworkAvailable() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    if ((networkState == "none") || (networkState == states[Connection.NONE])) {
        return false;
    } else {
        return true;
    }
}

/**
 * This method is responsible for returning the date in the format XX Month Year
 * @param date Date Object
 */
function formatDate(date) {

    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;

}

function getDateDifference(olderDate, newerDate) {

    var one_day = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
    var olderDate_ms = olderDate.getTime();
    var newerDate_ms = newerDate.getTime();    // Calculate the difference in milliseconds  
    var dateDifference_ms = newerDate_ms - olderDate_ms;        // Convert back to days and return   
    return Math.round(dateDifference_ms / one_day);

}

function onAppResume() {

    console.log("On App Resume called");
    var lastLoginVal = localStorage.getItem("lastLoginDate");
    if (lastLoginVal) {

        var lastLoginDate = new Date(lastLoginVal);
        var dateDifference = getDateDifference(lastLoginDate, new Date());
         //alert("dateDifference : "+dateDifference);
        if (dateDifference >= 90) {
            clearRequiredData();
            navigateToWebAppLogin();
        } else {
            window.location = "html/quick-login.html";
        }
    } else {
        clearRequiredData();
        window.location = "../index.html";
    }


}
