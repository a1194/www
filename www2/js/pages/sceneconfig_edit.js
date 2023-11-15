var table;
var protocol;
var room_id = 0;
var all_dev_list = [];

setActionType(2)

function setAllDevList(data) {
    if (data.length == 0)
        all_dev_list = [];
    else
        all_dev_list = all_dev_list.concat(data);
}

function getAllDevName(sn) {
    sn = sn + "";
    for (var index in all_dev_list) {
        var dev = all_dev_list[index];
        if (dev.sn == sn) {
            return dev.name;
        }
    }
    return "";
}

function msgCallback(data) {

    var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "editSceneConfigCb") {
                    if (obj.payload.result == 0) {
                        showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                        closeLoading();
                        back();
                    }
                } else if (obj.method == "getSortsCb") {
                    if (obj.payload.index == 1) {
                        setSortList([]);
                    }
                    setSortList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {

                    }
                } else if (obj.method == "getDevicesCb") {
                    if (obj.payload.index == 1) {
                        setDevList([]);
                        setAllDevList([]);
                    }
                    var list = obj.payload.data;
                    setAllDevList(list);
                    var new_list = [];
                    for (var index in list) {
                        if (list[index].protocol == protocol && list[index].room_id == room_id)
                            new_list.push(list[index]);
                    }
                    setDevList(new_list);

                    if (obj.payload.index == obj.payload.total) {
                        createDevices(true);
                    }
                } else if (obj.method == "getSceneConfigCb") {
                    $("#form-sceneconfig-edit").setform(obj.payload);
                    //$('#room-select').val("" + obj.payload.room_id);
                    layui.form.render('select');
                    setActionList(obj.payload.actions);
                    table.reload('action-table', {
                        data: $.extend(true, [], getActionList())
                    });
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
                        if (rooms.length > 0) {
                            room_id = rooms[0].room_id;
                            //$("#room-select").val(room_id);
                        }
                        layui.form.render('select');
                        getDevices();
                        getSceneConfig(getUrlParam("scene_id"));
                    }
                }
            }

    
}

function back() {
    //window.location = "sceneconfig.html";
    javascript:history.back(-1);
}

function getSceneConfig(scene_id) {
    doGetSceneConfig(scene_id);
}
function toggle(sn) {
    let currentHtnl = event.currentTarget.innerHTML
    event.currentTarget.innerHTML = currentHtnl == "▲" ? "▼" : "▲"
    var id = "#" + sn;
    $(id).toggle();
}
function editSceneConfig() {
    var objName = $("input[name='name']");
            var name = objName.val();
            if ("" == name) {
                objName.tips({
                    side: 3,
                    msg: $.i18n.prop("common.scene_name.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objName.focus();
                return;
            }

            var objId = $("input[name='scene_id']");
            var scene_id = objId.val();
            if ("" == scene_id) {
                objId.tips({
                    side: 3,
                    msg: $.i18n.prop("common.scene_id.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objId.focus();
                return;
            }

            // var objProtocol = $("input[name='protocol']");
            // var protocol = objProtocol.val();
            // if ("" == protocol) {
            //     objProtocol.tips({
            //         side: 3,
            //         msg: '协议类型不能为空',
            //         bg: '#AE81FF',
            //         time: 3
            //     });
            //     objProtocol.focus();
            //     return;
            // }

            var objRoomId = $("select[name='room_id']");
            var room_id = objRoomId.val();
            if ("" == room_id) {
                objRoomId.tips({
                    side: 3,
                    msg: $.i18n.prop("common.select_house.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objRoomId.focus();
                return;
            }

            var total = getActionListTotal();
            var timeout = 3000 + (total * 1000);
            openLoading(timeout);
            var actions = getActionList();
            for (index in actions) {
                actions[index].state = 0;
            }
            doEditSceneConfig(scene_id, name, room_id, getActionList());
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}


function getRooms() {
    doGetRooms();
}

$(function () {
    layui.use('table', function () {
        layui.jquery(".action").text($.i18n.prop('center.sceneconfig.action'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        var form = layui.form;
        table = layui.table;

        var obj = {
            elem: '#action-table'
            //,url:'data.json'
            , toolbar: '#action-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            }]
            , title: '用户数据表'
            , cellMinWidth: 80
            , limit: Number.MAX_VALUE
            , cols: [[
                {field: 'name', title: $.i18n.prop("center.device"), width: 260, sort: false, templet: function (d) {
                        return getDevName(d.sn);
                    }}
                , {field: 'service', title: $.i18n.prop("center.knx.service"), width: 120}
                , {field: 'msg', title: $.i18n.prop("center.key_config.button.value"), width: 250, templet: function (d) {
                        return JSON.stringify(d.msg);
                    }}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 60}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#action-shortcut', width: 100}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(action-table)', function (obj) {
                    switch (obj.event) {
                        case 'exportFile':
                            table.exportFile("action-table", listData, 'xls')
                        break;
                    }

                });
            }
        }
        table.render(obj);
        

        //监听行工具事件
        table.on('tool(action-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'del') {
                removeAction(data.sn, data.service);
            }
        });

        form.on('checkbox(all_on)', function(obj){
            if (obj.elem.checked == true) {
                //选中事件
                $('input:checkbox[name=all_off]').attr("checked", false);
                clearDevAction();
                var devices = getDevList();
                for (var index in devices) {
                    var device = devices[index];
                    var payload_obj = {
                        "sn": device.sn,
                        "sort_id": parseInt(device.sort_id),
                        "service": "switch",
                        "msg": {"on":1}
                    };
                    addDevAction(payload_obj);
                }
                form.render();

            }else{
                //未选中事件
                clearDevAction();
            }
        });

        form.on('checkbox(all_off)', function(obj){
            if (obj.elem.checked == true) {
                //选中事件
                $('input:checkbox[name=all_on]').attr("checked", false);
                clearDevAction();
                var devices = getDevList();
                for (var index in devices) {
                    var device = devices[index];
                    var payload_obj = {
                        "sn": device.sn,
                        "sort_id": parseInt(device.sort_id),
                        "service": "switch",
                        "msg": {"off":0}
                    };
                    addDevAction(payload_obj);
                }
                form.render();
            }else{
                //未选中事件
                clearDevAction();
            }
        });

        form.on('select(room-select)', function (data) {
            console.log('data.value: ' + data.value);
            room_id = data.value;
            //layui.form.render('select');
            getDevices();
        });



    });

    getRooms();
    getSorts();

    protocol = getUrlParam("protocol");
});