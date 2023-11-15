var Local = {
    dev_id: 1,
    sn: ""
};

function doEditLocal(msg_obj) {
    sendMsgToHost("editLocal", msg_obj);
}
