
function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "addRoomCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getAreasCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                var areas = getRoomList();
                for (var index in areas) {
                    var areaobj = areas[index];
                    console.log("name: " + areaobj.name);
                    $('#area-select').append(new Option(areaobj.name, areaobj.area_id));
                }
                layui.form.render('select');
            }
        }
    }

    
}

function addRoom() {

    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_name.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var msgStr = form2JsonString("form-room-add");

    doAddRoom($.parseJSON(msgStr));

    
}

function back() {
    window.location = "room.html";
}

function getAreas() {
    doGetAreas();
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });
        form.render()
    });

    getAreas();
});