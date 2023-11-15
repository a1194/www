var table;
var add_list = [];
var add_total = 0;
var success_total = 0;
var fail_total = 0;

function saveDevice(sn, room_id, name) {
    doSaveDevice(sn, room_id, name);
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "smartConfigCb") {
            if (obj.payload.result == 0) {
                if (add_list.length > 0) {
                    var add = add_list[0];
                    if (add.sn == obj.payload.sn) {
                        var room_id = 1;
                        var room_list = getRoomList();
                        if (room_list.length > 0)
                            room_id = room_list[0].room_id;
                        var node = new AddDevice();
                        node.sn = add.sn;
                        node.sort_id = add.sort_id;
                        node.name = add.name;
                        node.room_id = room_id;
                        node.result = obj.payload.result;
                        addAddDevList(node);
                        add_total--;
                        $("#add-total").html(add_total);
                        success_total++;
                        $("#success-total").html(success_total);

                        saveDevice(add.sn, room_id, add.name);
                        table.reload('device-table', {
                            data: getAddDevList()
                        });

                        add_list.shift();
                        if (add_list.length > 0) {
                            add = add_list[0];
                            closeLoading();
                            smartConfig(add.sn, add.sort_id, add.protocol);
                        } else {
                            closeDiscovery();
                        }
                    }
                }
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        } else if (obj.method == "getRoomsCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        }
    }
}

function getSorts() {
    doGetSorts();
}

function getRooms() {
    doGetRooms();
}

function back() {
    closeDiscovery();
    window.location = "device.html";
}

function closeDiscovery() {
    closeLoading();
    doCloseDiscovery();
}

function smartConfig(sn, sort_id, protocol) {
    openLoading2(15000, function () {
        console.log("配网超时！");
        var add = add_list[0];
        var node = new AddDevice();
        node.sn = add.sn;
        node.sort_id = add.sort_id;
        node.name = add.name;
        node.room_id = 1;
        node.result = -1;
        addAddDevList(node);
        add_total--;
        $("#add-total").html(add_total);
        fail_total++;
        $("#fail-total").html(fail_total);
        table.reload('device-table', {
            data: getAddDevList()
        });

        add_list.shift();
        if (add_list.length > 0) {
            add = add_list[0];
            closeLoading();
            smartConfig(add.sn, add.sort_id, add.protocol);
        } else {
            closeDiscovery();
        }
    });
    doSmartConfig(sn, sort_id, protocol);
}

$(function () {
    layui.use('table', function () {
        table = layui.table;
        table.render({
            elem: '#device-table'
            //,url:'data.json'
            , toolbar: '#device-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            , limit: Number.MAX_VALUE
            , cols: [[
                {field: 'sn', title: 'SN', width: 260, sort: false}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 260}
                , {field: 'room_id', title: $.i18n.prop("room.id"), width: 100}
                , {field: 'result', title: $.i18n.prop("device.result"), width: 300, templet: function(d) {
                    if(d.result === -1) {
                        return `<span style="color: red;" > ${$.i18n.prop("device.failure")} </span>`
                    } else {
                        return `<span style="color: blue;" > ${$.i18n.prop("device.success")} </span>`
                    }
                }}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(device-table)', function (obj) {
                    switch (obj.event) {
                        case 'exportFile':
                            table.exportFile("device-table", listData, 'xls')
                        break;
                    }
                });
            }
        });
        
    });

    //getSorts();
    getRooms();

   // var list_str = getUrlParamAndDecode('list');
    //console.log("list_str: " + list_str);
    //add_list = $.parseJSON(list_str);
    add_list = parent.getGlobalList();
    add_total = add_list.length;
    $("#add-total").html(add_total);
    if (add_total > 0) {
        var add = add_list[0];
        console.log("sn: " + add.sn);
        smartConfig(add.sn, add.sort_id, add.protocol);
    }
});
