var Setting = {
    is_dhcp: 0
};


function doEditNetwork(msg_obj) {
    sendMsgToHost("editNetwork", msg_obj);
}

function doEditLanguage(msg_obj) {
    sendMsgToHost("editLanguage", msg_obj);
}
