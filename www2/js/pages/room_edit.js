
function msgCallback(data) {


    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getAreasCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                var areas = getRoomList();
                for (var index in areas) {
                    var areaobj = areas[index];
                    $('#area-select').append(new Option(areaobj.name, areaobj.area_id));
                }
                layui.form.render('select');
                getRoom(getUrlParam("room_id"));
            }

        } else if (obj.method == "editRoomCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
            }
        }
    }

    
}

function getRoom(room_id) {
    
    //表单提交
    var jsonstr = '{"room_id":' + room_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "room.cgi/getRoom",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-room-edit").setform(jsonobj);
            $('#area-select').val("" + jsonobj.area_id);
            layui.form.render('select');
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
    
}

function editRoom() {

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

    //表单提交
    var msgStr = form2JsonString("form-room-edit");
    doEditRoom($.parseJSON(msgStr));

    
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
    });

    getAreas();
});