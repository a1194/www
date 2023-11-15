var SortUi = {
    id: 0,
    sort_id: 0,
    state: 0,
    pages: [],
    name: ""
};

var sortui_list = [];

function setSortUiList(data) {
    if (data.length == 0)
        sortui_list = [];
    else
        sortui_list = sortui_list.concat(data);
}

function getSortUiList() {
    return sortui_list;
}


function doGetSortUis() {
    sendMsgToHost("getSortUis", {});
}

function doGetSortUi(id) {
    sendMsgToHost("getSortUi", {
        "id": parseInt(id)
    });
}

function doDelSortUi(id) {
    sendMsgToHost("delSortUi", {
        "id": parseInt(id)
    });
}

function doDelSortUis(ids) {
    sendMsgToHost("delSortUis", {
        "ids": ids
    });
}

function doAddSortUi(msg_obj) {
    sendMsgToHost("addSortUi", msg_obj);

}

function doEditSortUi(msg_obj) {
    sendMsgToHost("editSortUi", msg_obj);
}


