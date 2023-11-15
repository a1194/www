var table;
var keep_dev_id = 0;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function msgCallback(data) {

    var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "getSortsCb") {
                    if (obj.payload.index == 1) {
                        setSortList([]);
                    }
                    setSortList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        getDevices();
                    }
                } else if (obj.method == "getDevicesCb") {
                    if (obj.payload.index == 1) {
                        setDevList([]);
                    }
                    setDevList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        table.reload('device-table', {
                            data: getDevList()
                        });
                    }
                } else if (obj.method == "saveDeviceCb" || obj.method == "editDeviceCb" || obj.method == "restoringFactoryCb" || obj.method == "addKnxDeviceCb" || obj.method == "delDeviceCb" || obj.method == "smartConfigResetCb") {
                    closeLoading();
                    if (obj.payload.result == 0) {
                        showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
                    } else {
                        showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
                    }
                } 

            }

            if (window.frames["sub-iframe"].window.msgCallback && typeof (window.frames["sub-iframe"].window.msgCallback) == "function") {
                window.frames["sub-iframe"].window.msgCallback(data);
            }


}

function delDevice(dev_id) {
    openLoading(3000);
    doDelDevice(dev_id);
}

function delDevices(ids) {
    openLoading(3000);
    doDelDevices(ids);
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}

//JS
$(function () {
    getSorts();

    layui.use('table', function () {
    layui.jquery(".addDevice").text($.i18n.prop('device.add_ble_device'))
    layui.jquery(".addKnxDevice").text($.i18n.prop('device.add_knx_device'))
    layui.jquery(".addEideDevice").text($.i18n.prop('device.add_eide_device'))
    //layui.jquery(".bulkAddKnxDevice").text($.i18n.prop('device.bulk_add_knx_device'))
    layui.jquery(".deviceDubbug").text($.i18n.prop('device.dubbug_device'))
    layui.jquery(".bulkDelete").text($.i18n.prop('device.bulk.delete'))

    layui.jquery(".check").text($.i18n.prop('device.check'))
    layui.jquery(".edit").text($.i18n.prop('common.edit'))
    layui.jquery(".del").text($.i18n.prop('common.delete'))
    layui.jquery(".open").text($.i18n.prop('device.open'))
    layui.jquery(".close").text($.i18n.prop('common.close'))
    layui.jquery(".networkingReset").text($.i18n.prop('device.networking_reset'))

        table = layui.table;
        var obj = {
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
            }, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , cellMinWidth: 80
            , limits: [100, 200]
            , limit: 100
            , title: '设备'
            , cols: [[
                { type: 'checkbox', fixed: 'left' }
                , { field: 'dev_id', title: "id", width: 100, fixed: 'left', sort: true }
                , { field: 'name', title: $.i18n.prop("device.name"), width: 180 }
                , { field: 'sort_id', title: $.i18n.prop("sort.id"), width: 100 }
                , { field: 'sn', title: 'SN', width: 200  }
                , {
                    field: 'protocol', title: $.i18n.prop("sort.protocol_type"), width: 150, templet: function (d) {
                        return getProtocolText(d.protocol);
                    }
                }
                , { field: 'room_id', title: $.i18n.prop("room.id"), width: 100 }
                , { field: 'addr', title: $.i18n.prop("device.addr"), width: 100 }
                , {
                    fixed: 'right', title: $.i18n.prop("common.operate"), width: 450, templet: function (d) {
                        var tem = 
                        `
                            <a class="layui-btn layui-btn-xs layui-btn-normal check" lay-event="view">${$.i18n.prop("device.check")}</a>
                            <a class="layui-btn layui-btn-xs " lay-event="edit">${$.i18n.prop("common.edit")}</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del">${$.i18n.prop("common.delete")}</a>
                        `
                        if (hasSwitchService(d.sort_id)) {
                            tem += `
                            <a class="layui-btn layui-btn-xs layui-btn-primary layui-border-black" lay-event="on">${$.i18n.prop("device.open")}</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs" lay-event="off" style="background-color: #2f363c;">${$.i18n.prop("common.close")}</a>
                        `
                        } else if (isGw(d.sort_id)) {
                            tem += `
                            <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="smartConfigReset">${$.i18n.prop("device.networking_reset")}</a>
                        `
                        }
                        var type = getSortDevType(d.sort_id)
                        if (type == 1) {
                            tem += `
                            <a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="reset">${$.i18n.prop("device.remote_restart")}</a>
                        `
                        }
                        return tem
                    }
                }
            ]]
            , page: {
                prev: $.i18n.prop("common.prev"),
                next: $.i18n.prop("common.next"),
                layout: ['prev','page','next'],
            }
            , data: []
            , done: function (res, curr, count) {      //禁止选中
                layui.each(res.data, function (i, item) {
                    if (item.sort_id == SORT_ID.AI_GATEWAY || item.sort_id == SORT_ID.CONTROL_PANEL) {
                        $(".layui-table tr[data-index=" + i + "] input[type='checkbox']").prop('disabled', true);
                    }
                });
                var listData = res.data
                // console.log(res);
                table.on('toolbar(device-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            window.location = 'device_add.html';
                            break;
                        case 'goKnxAdd':
                            openWin($.i18n.prop("device.add_knx_device"), "knx_add.html");
                            break;
                        case 'goEideAdd':
                            openWin($.i18n.prop("device.add_eide_device"), "eide_mult_add.html");
                            break;
                        case 'goKnxMultAdd':
                            openWin($.i18n.prop("device.bulk_add_knx_device"), "knx_mult_add.html");
                            break;
                        case 'goDebug':
                            window.location = 'device_debug.html';
                            break;
                        case 'goMultDel':
                            layer.confirm($.i18n.prop("center.combine_scene.delete.tips"), {
                                title: $.i18n.prop("common.delete"),
                                btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                            },function (index) {
                                var data = checkStatus.data;
                                var new_data = [];
                                for (var index in data) {
                                    if (data[index].sort_id != SORT_ID.AI_GATEWAY && data[index].sort_id != SORT_ID.CONTROL_PANEL)
                                        new_data.push(data[index]);
                                }
                                console.log("length: " + new_data.length);
                                if (new_data.length == 0) {
                                    layer.msg($.i18n.prop("device.select_device_tips"));
                                } else {
                                    // var ids = [];
                                    // for (var index in data) {
                                    //     ids.push(data[index].dev_id);
                                    // }
                                    //window.location = 'device_mult_del.html?ids=' + JSON.stringify(ids);
                                    parent.setGlobalList(new_data);
                                    window.location = 'device_mult_del.html';
                                }
                                layer.close(index);
                            });
                            
                            break;
                        case 'refresh':
                            getDevices();
                            break;
                        case 'exportFile':
                            table.exportFile("device-table", listData, 'xls')
                            break;
                    }
                });
            }
            , text: {
                none: $.i18n.prop("common.no_data")
            }
        }
        table.render(obj);

        //监听行工具事件
        table.on('tool(device-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'on') {
                doDeviceControlBySn(data.sn, data.sort_id, "switch", { "on": 1 });
            } else if (obj.event === 'off') {
                doDeviceControlBySn(data.sn, data.sort_id, "switch", { "off": 0 });
            } else if (obj.event === 'smartConfigReset') {
                layer.confirm($.i18n.prop("device.reset.tips"), {
                    title: $.i18n.prop("device.reset"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    doSmartConfigReset();
                    layer.close(index);
                });
            } else if (obj.event === 'view') {
                openWin($.i18n.prop("device.check_device"), "device_view.html?dev_id=" + data.dev_id + "&name=" + data.name + "&sn=" + data.sn);
            } else if (obj.event === 'edit') {
                openWin($.i18n.prop("device.modify"), "device_edit.html?dev_id=" + data.dev_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("device.delete_device.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delDevice(data.dev_id);
                    layer.close(index);
                });
            } else if(obj.event === 'reset') {
                layer.confirm($.i18n.prop("common.save.tip"), {
                    title: $.i18n.prop("common.change"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function(index) {
                    doShell("reboot")
                    layer.close(index);
                })
            }
        });


    });


});
