var Discovery = function () {
    this.dev_id = 0;
    this.name = "";
    this.sort_id = 0;
    this.protocol = 0;
    this.rssi = "";
}

var discovery_list = [];

function getDiscoveryList() {
    return discovery_list;
}

function addDiscoveryList(node) {
    for (let index in discovery_list) {
        if (discovery_list[index].sn == node.sn) {
            if (discovery_list[index].rssi != node.rssi) {
                discovery_list[index].rssi = node.rssi;
                return 0;
            } else
                return -1;
        }
    }

    discovery_list.push(node);
    return 0;
}

