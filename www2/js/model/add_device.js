// var AddDevice = {
//     name: "",
//     sort_id: 0,
//     sn: "",
//     room_id: 0,
//     result: -1
// };

var AddDevice = function () {
    this.name = "";
    this.sort_id = 0;
    this.sn = "";
    this.room_id = 0;
    this.result = -1;
}

var add_dev_list = [];


function setAddDevList(data) {
    if (data.length == 0)
        add_dev_list = [];
    else
        add_dev_list = add_dev_list.concat(data);
}

function getAddDevList() {
    return add_dev_list;
}

function addAddDevList(node) {
    for (let index in add_dev_list) {
        if (add_dev_list[index].sn == node.sn) {
            return -1;
        }
    }

    add_dev_list.push(node);
    return 0;
}

