var Room = {
    room_id: 0,
    area_id: 0,
    name: ""
};

var room_list = [];

function setRoomList(data) {
    if (data.length == 0)
        room_list = [];
    else
        room_list = room_list.concat(data);
}

function getRoomList() {
    return room_list;
}

function getRoomName(id) {
    id = parseInt(id);
    for (index in room_list) {
        var room = room_list[index];
        if (room.room_id == id) {
            return room.name;
        }
    }
    return "";
}

function doGetRooms() {
    sendMsgToHost("getRooms", {});
}

function doDelRoom(room_id) {
    sendMsgToHost("delRoom", {
        "room_id": parseInt(room_id)
    });
}

function doDelRooms(ids) {
    sendMsgToHost("delRooms", {
        "ids": ids
    });
}

function doAddRoom(msg_obj) {
    sendMsgToHost("addRoom", msg_obj);

}

function doEditRoom(msg_obj) {
    sendMsgToHost("editRoom", msg_obj);
}
