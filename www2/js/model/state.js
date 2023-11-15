var State = {
    key: "",
    value_len: 0,
    values: ""
};

var state_list = [];

function setStateList(data) {
    if (data.length == 0)
        state_list = [];
    else
        state_list = state_list.concat(data);
}

function getStateList() {
    return state_list;
}

function doReadStates() {
    sendMsgToHost("readStates", {});
}

function doGetStates() {
    sendMsgToHost("getStates", {});
}







