function onLoadScript() {
    var isNavigate = localStorage.getItem("userNavigatefrom");
    
    if(isNavigate == "hamburgerpage"){
        console.log("onLoadScript if");
        document.getElementById("pinLabel").innerHTML = "Enter current Pin";
        var tag = document.createElement("script");
        tag.src = "../scripts/change_pin-enter_current_pin.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        setTimeout(function(){
                   onLoadPage();
                   },500)
    }
    else if( isNavigate == "loginSuccesspage"){
        console.log("onLoadScript else");
        document.getElementById("pinLabel").innerHTML = "Enter a 4-digit device PIN";
        var tag = document.createElement("script");
        tag.src = "../scripts/enter_4_digit_pin-quick_pin_setup.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        setTimeout(function(){
                   onLoadPage();
                   },500)
    }
    else if( isNavigate == "newPinSetup"){
        console.log("onLoadScript if newPinSetup");
        document.getElementById("pinLabel").innerHTML = "Enter new Pin";
        var tag = document.createElement("script");
        tag.src = "../scripts/change_pin-enter_new_pin.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        setTimeout(function(){
                       onLoadPage();
                   },500)
    }
    else if( isNavigate == "confirmPinSetup"){
        console.log("onLoadScript if confirmPinSetup");
        document.getElementById("pinLabel").innerHTML = "Confirm new PIN";
        var tag = document.createElement("script");
        tag.src = "../scripts/change_pin-confirm_new_pin.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        setTimeout(function(){
                   onLoadPage();
                   },500)
    }
    else if( isNavigate == "reenterPinSetup"){
        console.log("onLoadScript if reenterPinSetup");
        document.getElementById("pinLabel").innerHTML = "Please re-enter your PIN";
        var tag = document.createElement("script");
        tag.src = "../scripts/re_enter_pin-quick_pin_setup.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        setTimeout(function(){
                   onLoadPage();
                   },500)
    }
}
