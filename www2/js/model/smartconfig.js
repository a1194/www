var SmartConfig = {
    sn: "",
    name: "",
    sort_id: 0,
};

var smart_config_list = [];



function setSmartConfigList(list) {
    smart_config_list = list;
}

function getSmartConfigList() {
    return smart_config_list
}

function doSmartConfig(sn, sort_id, protocol) {
    sendMsgToHost("smartConfig", {
        "sn": sn,
        "sort_id": parseInt(sort_id),
        "protocol": parseInt(protocol)
    });
}
