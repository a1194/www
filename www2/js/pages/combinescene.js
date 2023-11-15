var table;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getCombineScenesCb") {
            if (obj.payload.index == 1) {
                setCombineSceneList([]);
            }
            setCombineSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('combinescene-table', {
                    data: getCombineSceneList()
                });
            }
        } else if (obj.method == "delCombineSceneCb") {
                closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
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
        }  else if(obj.method == "delCombineScenesCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "setCombineSceneStateCb") {
            if(obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);

            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        }
    }
}

function delCombineScene(scene_id) {
    openLoading(3000);
    doDelCombineScene(scene_id);
}

function delCombineScenes(ids) {
    openLoading(3000);
    doDelCombineScenes(ids);
}

function getCombineScenes() {
    doGetCombineScenes();
}

function getRooms() {
    doGetRooms();
}

function combineScene(scene_id) {
    doCombineScene(scene_id);
}

function setCombineSceneState(scene_id, state) {
    doSetCombineSceneState(scene_id, state)
}
    
//JS
$(function () {
    getRooms();
    getCombineScenes();

    layui.use('table', function () {
        table = layui.table;
        var form = layui.form;
        var obj = {
            elem: '#combinescene-table'
            //,url:'data.json'
            , toolbar: '#combinescene-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            , limits: [1000]
            , limit: 1000
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'scene_id', title: "id", width: 120, fixed: 'left', unresize: true}
                , {field: 'name', title: $.i18n.prop("center.scene.name"), width: 200}
                , {field: 'room_id', title: $.i18n.prop("room.id"), width: 200, templet: function (d) {
                        return getRoomName(d.room_id);
                    }}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 120, templet: function(d) {
                    let tem = ''
                    if(d.state == "1") {
                        tem += 
                            `
                                <input type="checkbox" name="AAA" title="启用|禁用" lay-skin="switch" checked lay-filter="checkbox-filter"  data-scene_id="${d.scene_id}"> 
                            `
                    } else {
                        tem += 
                            `
                                <input type="checkbox" name="BBB" title="启用|禁用" lay-skin="switch" lay-filter="checkbox-filter"  data-scene_id="${d.scene_id}"> 
                            `
                    }
                    
                    return tem
                }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#combinescene-shortcut', width: 300}
            ]]
            , page: false
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(combinescene-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            window.location = 'combinescene_add.html';
                            break;
                        case 'dels':
                            //var checkStatus = table.checkStatus(obj.config.id);
                            var ids = [];
                            if (checkStatus.data.length > 0) {
                                $.each(checkStatus.data, function (index, item) {
                                    ids.push(item.scene_id)
                                });
                                layer.confirm($.i18n.prop("center.combine_scene.delete.tips"), {
                                    title: $.i18n.prop("common.delete"),
                                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                                },function (index) {
                                    delCombineScenes(ids);
                                    layer.close(index);
                                });
                            } else {
                                layer.msg($.i18n.prop("center.combine_scene.select_device.tips"));
                            }
                            break;
                        case 'refresh':
                            getCombineScenes();
                            break;
                        case 'exportFile':
                            table.exportFile("combinescene-table", listData, 'xls')
                            break;
                    }
                    ;
                });
            }
        }
        table.render(obj);

        layui.use('jquery',function(){
            layui.jquery(".ctScene").text($.i18n.prop('common.add_new'))
            layui.jquery(".bulkDelete").text($.i18n.prop('center.combine_scene.bulk_delete'))
            layui.jquery(".edit").text($.i18n.prop('common.edit'))
            layui.jquery(".del").text($.i18n.prop('common.delete'))
            layui.jquery(".exec").text($.i18n.prop('center.combine_scene.exec'))

        })

        //监听行工具事件
        table.on('tool(combinescene-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                window.location = "combinescene_edit.html?scene_id=" + data.scene_id;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.save.tip"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delCombineScene(data.scene_id);
                    layer.close(index);
                });
            } else if (obj.event === 'combineScene') {
                combineScene(data.scene_id);
            }
        });

        form.on('switch(checkbox-filter)', function(data) {
            console.log(data);
            const elem = data.elem
            const state = elem.checked ? 1 : 0
            setCombineSceneState(Number($(elem).attr("data-scene_id")), state)
        });
    });
});
