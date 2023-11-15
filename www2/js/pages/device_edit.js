
function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editDeviceCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getRoomsCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                var rooms = getRoomList();
                for (var index in rooms) {
                    var roomobj = rooms[index];
                    $('#room-select').append(new Option(roomobj.name, roomobj.room_id));
                }
                layui.form.render('select');
                getDevice(getUrlParam("dev_id"));
            }
        }
    }

    
}

function getDevice(dev_id) {
    //表单提交
    var jsonstr = '{"dev_id":' + dev_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "device.cgi/getDevice",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-device-edit").setform(jsonobj);
            $('#room-select').val("" + jsonobj.room_id);
            layui.form.render('select');
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
    
}

function editDevice() {

    //表单验证
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
    
    var msgStr = form2JsonString("form-device-edit");
    console.log(msgStr);
    doEditDevice($.parseJSON(msgStr));

    
}

function back() {
    window.location = "device.html";
}

function getRooms() {
    doGetRooms();
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });
    });

    getRooms();
});