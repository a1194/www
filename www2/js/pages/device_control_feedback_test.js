var table;

function msgCallback(data) {
    var obj = $.parseJSON(data)
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "saveDeviceCb") {
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
            }
            setSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                createScenes();
            }
        } else if (obj.method == "getCombineScenesCb") {
            if (obj.payload.index == 1) {
                setCombineSceneList([]);
            }
            setCombineSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                createCombineScenes();
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                getDevices();
                getKnxScenes();
                getSceneConfigs();
                getCombineScenes();
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            setDevList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                createDevices(false);
                readStates();
            }
        } else if (obj.method == "deviceStateCb") {
            if (obj.payload.hasOwnProperty("sn") && obj.payload.hasOwnProperty("sort_id") && obj.payload.hasOwnProperty("service") &&
                obj.payload.hasOwnProperty("msg")) {
                // console.log("sn: " + obj.payload.sn);
                // console.log("sort_id: " + obj.payload.sort_id);
                // console.log("service: " + obj.payload.service);
                updateDevice(obj.payload.sn, obj.payload.service, obj.payload.msg);
                if (isKeyPanel(obj.payload.sort_id))
                    updateSwitch(obj.payload.sn);
                //if (isDim(obj.payload.sort_id))
                //    updateDimSwitch(obj.payload.sn);
                if (obj.payload.service == "button1") {
                    doCombineScene(1);
                } else if (obj.payload.service == "button2") {
                    doCombineScene(2);
                }
            }
        } else if (obj.method == "getKnxScenesCb") {
            if (obj.payload.index == 1) {
                setKnxSceneList([]);
            }
            setKnxSceneList(obj.payload.data);
        }
    }
}

function back() {
    window.location = "device.html";
}

function goAdd() {
    window.location = '../../device_add_test.html';
}

function getCombineScenes() {
    doGetCombineScenes();
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}

function toggle(sn) {
    var id = "#" + sn;
    $(id).toggle();
}

function readStates() {
    doReadStates();
}

function getKnxScenes() {
    doGetKnxScenes();
}

//JS
$(function () {
    getSorts();
});
