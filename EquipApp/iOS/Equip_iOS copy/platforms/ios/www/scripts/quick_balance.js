function onLoad() {
    onDeviceReady()
    //document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	//document.addEventListener("resume", onAppResume, false);
//    var elem = document.getElementById('notification-outer-container');
//    var elem1 = document.getElementById('notification-outer-container1');
    checkBox = document.getElementById('security-switch-ip');
    checkBox.checked = false;

//    elem.style.display = 'none';
//    elem1.style.display = 'none';

    //var elem2 = document.getElementById('abc');
    //var elem3 = document.getElementById('def');

    // elem2.style.display = 'none';
    //elem3.style.display = 'block';

    var ss = new cordova.plugins.SecureStorage(
        function () {
            console.log('Success')
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open");
        },
        'my_app'
    );
    ss.get(
        function (value) {
            if (value == 'true') {
                checkBox.checked = true;
                $("#quick-balance-status").text("Quick Balance enabled");
                //elem2.style.display = 'block';
                //elem3.style.display = 'none';
            } else {
                checkBox.checked = false;
                $("#quick-balance-status").text("Quick Balance disabled");
                //elem2.style.display = 'none';
                //elem3.style.display = 'block';
            }
        },
        function (error) {
            console.log('Error ' + error);
            checkBox.checked = false;
        },
        'isBalanceWithoutEnabled'
    );
    checkBox.onchange = function (event) {
        if (checkBox.checked) {
            $("#quick-balance-status").text("Quick Balance enabled");
            ss.set(
                function (key) {

                },
                function (error) {
                    console.log('Error ' + error);
                },
                'isBalanceWithoutEnabled', 'true'
            );
            getUserBalanceDetailsFor3DTouch();
        } else {
            $("#quick-balance-status").text("Quick Balance disabled");
            ss.set(
                function (key) {

                },
                function (error) {
                    console.log('Error ' + error);
                },
                'isBalanceWithoutEnabled', 'false'
            );
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
        }
    };
}

function showLoadingIndicator() {
    document.getElementById("overlay-div").style.display = "block";
}

function hideLoadingIndicator() {
    document.getElementById("overlay-div").style.display = "none";
}

function getUserBalanceDetailsFor3DTouch() {

    showLoadingIndicator();
    var accessTokenValue;
    var ss = new cordova.plugins.SecureStorage(
        function () {
        },
        function (error) {
            console.log('Error ' + error);
            //@Sagar first set the message to display and then display the alert
            $("#message-to-display").html(error);
            $("#alert-dialog").foundation("open")
        },
        'my_app'
    );

    ss.get(
        //successfully got required value from secure storage
        function (value) {
            accessTokenValue = value;
            $.ajax({
                   url: "https://uat.services.mercerfinancialservices.com/v1/customer/balance",
                type: "GET",
  //              url: "https://services.mercerfinancialservices.com/v1/customer/balance",
                async: false,
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + accessTokenValue
                },
                success: function (data) {
                    hideLoadingIndicator();

                    if (data && data.balance) {


                        //this is the success scenario where the app was able to fetch the data from webservice
                        var userBalance;

                        if(accounting){
                            userBalance = accounting.formatMoney(data.balance,"$");
                        }else{
                            userBalance = "$ "+data.balance;
                        }
                        var balanceOnDate = data.calculatedAt;
                        ThreeDeeTouch.isAvailable(function (avail) {

                            if (avail) {
                                ThreeDeeTouch.configureQuickActions([
                                    {
                                        type: 'checkin',
                                        title: userBalance,
                                        subtitle: 'as on ' + formatDate(new Date(balanceOnDate)),
                                        iconTemplate: 'balanceIcon' // optional
                                    },
                                    {
                                        type: 'share',
                                        title: 'Update Quick Balance',
                                        subtitle: '',
                                    }
                                ]);



                            }

                        });

                    } else {
                        ThreeDeeTouch.isAvailable(function (avail) {

                            if (avail) {
                                ThreeDeeTouch.configureQuickActions([
                                    {
                                        type: 'checkin',
                                        title: 'Error while fetching user balance',
                                        subtitle: '',
                                        iconTemplate: 'balanceIcon' // optional
                                    },
                                    {
                                        type: '',
                                        title: '',
                                        subtitle: '',
                                    }
                                ]);



                            }

                        });


                    }
                },
                error: function (error) {
                   hideLoadingIndicator();

                    ThreeDeeTouch.isAvailable(function (avail) {

                        if (avail) {
                            ThreeDeeTouch.configureQuickActions([
                                {
                                    type: 'checkin',
                                    title: 'Error while fetching user balance',
                                    subtitle: '',
                                    iconTemplate: 'balanceIcon' // optional
                                },
                                {
                                    type: '',
                                    title: '',
                                    subtitle: '',
                                }
                            ]);
                        }

                    });
                }
            });

        },
        //failed to get required value from secure storage
        function (error) {
            console.log('Error ' + error);
        },
        'AccessToken'
    );

}
