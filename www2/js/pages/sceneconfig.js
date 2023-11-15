var table;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
            }
            setSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('sceneconfig-table', {
                    data: getSceneList()
                });
            }
        } else if (obj.method == "delSceneConfigCb") {
            if (obj.payload.result == 0)
                closeLoading();
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

function delSceneConfig(scene_id) {
    openLoading(3000);
    doDelSceneConfig(scene_id);
}

function delSceneConfigs(ids) {
    openLoading(3000);
    doDelSceneConfigs(ids);
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getRooms() {
    doGetRooms();
}

function scene(scene_id) {
    doScene(scene_id);
}

//JS
$(function () {
    getRooms();
    getSceneConfigs();

    layui.use('table', function () {
        layui.jquery(".addSceneDevice").text($.i18n.prop('center.sceneconfig.add_scene_device'))
        layui.jquery(".addKnxSceneDevice").text($.i18n.prop('center.sceneconfig.add_knx_scene_device'))

        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        layui.jquery(".exec").text($.i18n.prop('center.exec'))
        table = layui.table;

        var obj = {
            elem: '#sceneconfig-table'
            //,url:'data.json'
            , toolbar: '#sceneconfig-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
                , {field: 'scene_id', title: "id", width: 120, fixed: 'left', unresize: true, sceneconfig: true}
                , {field: 'name', title: $.i18n.prop('center.scene.name'), width: 200}
                // , {field: 'scenes', title: '场景', width: 360, templet: function (d) {
                //         return JSON.stringify(d.scenes);
                //     }}
                , {field: 'room_id', title: $.i18n.prop('room.id'), width: 200, templet: function (d) {
                        return getRoomName(d.room_id);
                    }}
                , {field: 'room_id', title: $.i18n.prop('common.state'), width: 200, templet: function (d) {
                        return getProtocolText(d.protocol);
                    }}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 120}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#sceneconfig-shortcut', width: 300}
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
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(sceneconfig-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goSceneAdd':
                            window.location = 'sceneconfig_add.html?protocol=' + PROTOCOL_TYPE.BLE_MESH;
                            break;
                        case 'goKnxSceneAdd':
                            window.location = 'knx_scene_add.html';
                            break;
                        case 'dels':
                            //var checkStatus = table.checkStatus(obj.config.id);
                            var ids = [];
                            if (checkStatus.data.length > 0) {
                                $.each(checkStatus.data, function (index, item) {
                                    ids.push(item.dev_id)
                                });
                                layer.confirm($.i18n.prop("center.combine_scene.delete.tips"), function (index) {
                                    delSceneConfigs(ids);
                                    layer.close(index);
                                });
                            } else {
                                layer.msg($.i18n.prop("common.select.tips"));
                            }
                            break;
                        case 'refresh':
                            getSceneConfigs();
                            break;
                        case 'exportFile':
                            table.exportFile("sceneconfig-table", listData, 'xls');
                        break;
                    }
                });
            }
        }
        table.render(obj);
        

        

        //监听行工具事件
        table.on('tool(sceneconfig-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                window.location = "sceneconfig_edit.html?scene_id=" + data.scene_id + "&protocol=" + data.protocol;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("center.sceneconfig.delete_scene.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delSceneConfig(data.scene_id);
                    layer.close(index);
                });
            } else if (obj.event === 'scene') {
                scene(data.scene_id);
            }
        });
    });
});
