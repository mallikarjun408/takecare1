function onLoad() {
	document.addEventListener("deviceready", onDeviceReady, false);
}

function onDeviceReady() {

	document.addEventListener("resume", onAppResume, false);

	var elem = document.getElementById('notification-outer-container');
	var elem1 = document.getElementById('notification-outer-container1');
	//@Sagar setting both to display none-UI change
	elem.style.display = 'none';
	elem1.style.display = 'none';

	checkBox = document.getElementById('security-switch-ip');
	checkBox.checked = false;

	var ss = new cordova.plugins.SecureStorage(
		function () {
			console.log('Success')
		},
		function (error) {
			console.log('Error ' + error);
			hideDeviceKeyboard();
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
			} else {
				checkBox.checked = false;
				$("#quick-balance-status").text("Quick Balance disabled");
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
		}
	};
}
