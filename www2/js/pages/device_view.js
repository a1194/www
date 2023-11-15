
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getRoomsCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {

            }
        } else if (obj.method == "getDeviceInfoCb") {
            if (obj.payload.sub_version != null) {
                $("#sub_version").val(obj.payload.sub_version);
            } else if (obj.payload.sub_mac != null) {
                $("#sub_mac").val(obj.payload.sub_mac);
            } else {
                $("#form-device-info").setform(obj.payload);
                if (obj.payload.room_id != null) {
                    $("#room").val(getRoomName(obj.payload.room_id));
                }
            }

            // var $op = '<option value="' + obj.payload.room_id + '">' + getRoomName(obj.payload.room_id) + '</option>';
            // $("#room-select").append($op);
            // $('#room-select').val(obj.payload.room_id);
            // layui.form.render('select');
        }
    }
}

function getDeviceInfo() {
    doGetDeviceInfo(getUrlParam("dev_id"));
}

function back() {
    window.location = "device.html";
}

function getRooms() {
    doGetRooms();
}

$(function () {
    $('#name').val(getUrlParamAndDecode("name"));
    $('#sn').val(getUrlParam("sn"));
    getRooms();
    getDeviceInfo();
});