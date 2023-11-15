var Gateway = {
    gateway_id: 0,
    mac: "",
    ip: "",
    type: 0,
    state: 0
};

var gateway_list = [];

function doSearchGateway() {
    sendMsgToHost("searchGateway", {});
}

function getGatewayList() {
    return gateway_list;
}

function addGatewayList(node) {
    for (let index in gateway_list) {
        if (gateway_list[index].ip == node.ip) {
            return -1;
        }
    }

    gateway_list.push(node);
    return 0;
}
