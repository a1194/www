
var table;
var protocol;
var room_id = 0;

function msgCallback(data) {
    var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "addKnxSceneConfigCb") {
                    if (obj.payload.result == 0) {
                        showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
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
                    }
                    var list = obj.payload.data;
                    var new_list = [];
                    for (var index in list) {
                        if (list[index].protocol == protocol && list[index].room_id == room_id)
                            new_list.push(list[index]);
                    }
                    setDevList(new_list);

                    if (obj.payload.index == obj.payload.total) {
                        createDevices(true);
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
                        if (rooms.length > 0) {
                            room_id = rooms[0].room_id;
                            $("#room-select").val(room_id);
                        }
                        layui.form.render('select');
                        getDevices();
                    }
                }
            }
    
}

function getRooms() {
    doGetRooms();
}

function back() {
    //window.location = "sceneconfig.html";
    javascript:history.back(-1);
}

function addKnxSceneConfig() {
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

            var objProtocol = $("input[name='protocol']");
            var protocol = objProtocol.val();
            if ("" == protocol) {
                objProtocol.tips({
                    side: 3,
                    msg: $.i18n.prop("common.protocol_type.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objProtocol.focus();
                return;
            }

            var objGaddr = $('#gaddr');
            var gaddr = objGaddr.val();
            if (!isKnxAddr(gaddr)) {
                objGaddr.tips({
                    side: 3,
                    msg: $.i18n.prop("common.group_address.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objGaddr.focus();
                return;
            }

            var objValue = $('#value');
            var value = objValue.val();
            if (value == "") {
                objValue.tips({
                    side: 3,
                    msg: $.i18n.prop("common.enter_value.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objValue.focus();
                return;
            }

            var gaddr = knxAddrToIntAddr(gaddr);
            console.log("gaddr: " + gaddr);

            var total = getActionListTotal();
            var timeout = 3000 + (total * 1000);
            openLoading(timeout);
            doAddKnxSceneConfig(name, gaddr, value, room_id, getActionList());
    
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}

function toggle(sn) {
    let currentHtnl = event.currentTarget.innerHTML
    event.currentTarget.innerHTML = currentHtnl == "▲" ? "▼" : "▲"
    var id = "#" + sn;
    $(id).toggle();
}

$(function () {
    setActionType(2);
    layui.use('table', function () {
        layui.jquery(".action").text($.i18n.prop('center.sceneconfig.action'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        layui.jquery(".action").text($.i18n.prop('center.sceneconfig.action'))
        var form = layui.form;
        table = layui.table;

        var obj = {
            elem: '#action-table'
            , limit: Number.MAX_VALUE
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
            , cols: [[
                {
                    field: 'name', title: $.i18n.prop("device.name"), width: 260, sort: false, templet: function (d) {
                        return getDevName(d.sn);
                    }
                }
                , {field: 'service', title: $.i18n.prop("center.knx.service"), width: 120}
                , {
                    field: 'msg', title: $.i18n.prop("service.value"), width: 250, templet: function (d) {
                        return JSON.stringify(d.msg);
                    }
                }
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

        form.render()
    });

    // $("#all_on").change(function() {
    //     alert("all_on: " + this.checked);
    // });

    // $("#all_off").change(function() {
    //     alert("all_off: " + this.checked);
    // });

    getRooms();
    getSorts();

    protocol = PROTOCOL_TYPE.KNX;
    $("#protocol").val(protocol);
});
