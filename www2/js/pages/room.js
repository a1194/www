var table;

function reLoad() {
    getRooms();
}

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getRoomsCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                table.reload('room-table', {
                    data: getRoomList()
                });
            }
        } else if (obj.method == "delRoomCb" || obj.method == "delRoomsCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }

    
}

function delRoom(room_id) {
    openLoading(3000);
    doDelRoom(parseInt(room_id));
}

function delRooms(ids) {
    openLoading(3000);
    doDelRooms(ids);
}

function getRooms() {
    doGetRooms();
}

//JS
$(function () {

    getRooms();

    layui.use('table', function () {
        layui.jquery(".ctRoom").text($.i18n.prop('common.add_new'))
        layui.jquery(".bulkDelete").text($.i18n.prop('room.bulk_delete'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        table = layui.table;
        var obj = {
            elem: '#room-table'
            //,url:'data.json'
            , toolbar: '#room-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: [{
                title: $.i18n.prop("common.filter_column")
                , layEvent: "LAYTABLE_COLS"
                , icon: 'layui-icon-cols'
            }, {
                title: $.i18n.prop("common.export")
                , layEvent: 'exportFile'
                , icon: 'layui-icon-export'
            }, {
                title: $.i18n.prop("common.print")
                , layEvent: 'LAYTABLE_PRINT'
                , icon: 'layui-icon-print'
            }, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'room_id', title: "id", width: 120, fixed: 'left', unresize: true, room: true}
                , {field: 'name', title: $.i18n.prop("room.name"), width: 200}
                , {field: 'area_id', title: $.i18n.prop("area.id"), width: 200}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#room-shortcut', width: 300}
            ]]
            , page: {
                prev: $.i18n.prop("common.prev"),
                next: $.i18n.prop("common.next"),
                layout: ['prev','page','next'],
            }
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                table.on('toolbar(room-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop("room.add_room"), "room_add.html");
                            break;
                        case 'dels':
                            //var checkStatus = table.checkStatus(obj.config.id);
                            var ids = [];
                            if (checkStatus.data.length > 0) {
                                $.each(checkStatus.data, function (index, item) {
                                    ids.push(item.room_id)
                                });
                                layer.confirm($.i18n.prop("room.delete.tips"), {
                                    title: $.i18n.prop("common.delete"),
                                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                                }, function (index) {
                                    delRooms(ids);
                                    layer.close(index);
                                });
                            } else {
                                layer.msg($.i18n.prop("common.select.tips"));
                            }
                            break;
                        case 'refresh':
                            getDevices();
                        break;
                        case 'exportFile':
                            table.exportFile("room-table", listData, 'xls')
                        break;
                    }
                    ;
                });
            }
        }
        table.render(obj);
        
        

        table.on('tool(room-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                openWin($.i18n.prop("room.edit"), "room_edit.html?room_id=" + data.room_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("room.dele.tips"), {
                    title: $.i18n.prop("common.edit"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delRoom(data.room_id);
                    layer.close(index);
                });
            }
        });


    });
});
