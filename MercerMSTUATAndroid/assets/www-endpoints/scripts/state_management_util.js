function onLoad() {
    document.addEventListener("deviceready", onStateDeviceReady, false);
}

function onStateDeviceReady() {
    document.addEventListener("resume", onAppResume, false);
}

