
function sendMsgToHost(method, payload_obj) {
    var json_obj = {
        "client_id": parent.getUUID(),
        "method": method,
        "payload": payload_obj
    };
    var json_str = JSON.stringify(json_obj);

    // if (window.top===window.parent)
    //     parent.mqttPublish(HOST_TOPIC, json_str);
    // else
    //     parent.parent.mqttPublish(HOST_TOPIC, json_str);
    parent.mqttPublish(HOST_TOPIC, json_str);
}

function sendMsgToClients(method, payload_obj) {
    var json_obj = {
        "method": method,
        "payload": payload_obj
    };
    var json_str = JSON.stringify(json_obj);
    parent.mqttPublish(CLIENT_TOPIC, json_str);
}

function doShell(cmd) {
    sendMsgToHost("shell", {
        "cmd": cmd
    });
}

function isGw(sort_id) {
    if (getSortDevType(sort_id))
        return true;
    else
        return false;
}

function doRestoringFactory() {
    sendMsgToHost("restoringFactory", {});
}

function doSmartConfigReset() {
    sendMsgToHost("smartConfigReset", {});
}

function doCloseDiscovery() {
    sendMsgToHost("discovery", {
        "enable": 0
    });
}

function doOpenDiscovery() {
    sendMsgToHost("discovery", {
        "enable": 1
    });
}




