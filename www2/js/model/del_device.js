// var DelDevice = {
//     name: "",
//     sort_id: 0,
//     sn: "",
//     result: -1
// };

var DelDevice = function (){
    this.name = "";
    this.sort_id = 0;
    this.sn = "";
    this.result = -1;
}

var del_dev_list = [];


function setDelDevList(data) {
    if (data.length == 0)
        del_dev_list = [];
    else
        del_dev_list = del_dev_list.concat(data);
}

function getDelDevList() {
    return del_dev_list;
}

function addDelDevList(node) {
    for (let index in del_dev_list) {
        if (del_dev_list[index].sn == node.sn) {
            return -1;
        }
    }

    del_dev_list.push(node);
    return 0;
}

