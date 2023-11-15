var Area = {
    area_id: 0,
    name: ""
};

var area_list = [];

function setAreaList(data) {
    if (data.length == 0)
        area_list = [];
    else
        area_list = area_list.concat(data);
}

function getAreaList() {
    return area_list;
}

function doGetAreas() {
    sendMsgToHost("getAreas", {});
}

function doAddArea(msg_obj) {
    sendMsgToHost("addArea", msg_obj);
}

function doEditArea(msg_obj) {
    sendMsgToHost("editArea", msg_obj);
}

function doDelArea(area_id) {
    sendMsgToHost("delArea", {
        "area_id": parseInt(area_id)
    });
}

function doDelAreas(ids) {
    sendMsgToHost("delAreas", {
        "ids": ids
    });
}
