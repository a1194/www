var sn;
var sort_id;

function saveDevice() {
    var room_id = $('#room-select').val();
    var name = $('#name').val();

    console.log("sn: " + sn);
    console.log("sort_id: " + sort_id);
    console.log("room_id: " + room_id);
    console.log("name: " + name);

    var json_obj = {
        "client_id": parent.parent.getUUID(),
        "method": "saveDevice",
        "payload": {
            "sn": sn,
            "room_id": parseInt(room_id),
            "name": name
        }
    };
    parent.parent.mqttPublish(HOST_TOPIC, JSON.stringify(json_obj));
}

function getRooms() {
    var jsonstr = "{}";
    $.ajax({
        url: getCGIPath() + "room.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            var objs = $.parseJSON(data);
            for (var index in objs) {
                var roomobj = objs[index];
                $('#room-select').append(new Option(roomobj.name, roomobj.room_id));
            }
            layui.form.render('select');
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

$(function () {
    $('#name').val(getUrlParamAndDecode('name'));
    sn = getUrlParamAndDecode('sn');
    sort_id = getUrlParamAndDecode('sort_id');

    //$('#sort_id').html(getUrlParam('sort_id'));
    //$('#name').html(getUrlParam('name'));

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
