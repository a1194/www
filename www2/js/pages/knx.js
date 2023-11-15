var table;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function reLoad() {
    getKnxs();
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getKnxsCb") {
            if (obj.payload.index == 1) {
                setKnxList([]);
            }
            setKnxList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                table.reload('knx-table', {
                    data: getKnxList()
                });
            }
        } else if (obj.method == "delKnxCb" || obj.method == "delKnxsCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            setDevList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                getKnxs();
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }
}

function delKnx(dev_id) {
    openLoading(3000);
    doDelKnx(parseInt(dev_id));
}

function delKnxs(ids) {
    openLoading(3000);
    doDelKnxs(ids);
}

function getKnxs() {
    // var jsonstr = '{}';
    // console.log('jsonstr: ' + jsonstr);
    // $.ajax({
    //     url: getCGIPath() + "knx.cgi/getAll",
    //     contentType: "application/json",
    //     data: jsonstr,
    //     type: "POST",
    //     success: function (data) {
    //         console.log("data: " + data);
    //         table.reload('knx-table', {
    //             data: $.parseJSON(data)
    //         });
    //     },
    //     error: function () {
    //         showMessager("操作失败", "-1");
    //     }
    // });
    doGetKnxs();
}

function getDevices() {
    doGetDevices();
}

//JS
$(function () {
    layui.use('table', function () {
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        table = layui.table;

        var obj = {
            elem: '#knx-table'
            //,url:'data.json'
            //, toolbar: '#knx-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '刷新'
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: 'KNX数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 200, templet: function (d) {
                        return getDevNameById(d.dev_id);
                    }}
                , {field: 'sort_id', title: $.i18n.prop("sort.id"), width: 200, templet: function (d) {
                        return getDevSort(d.dev_id);
                    }}
                , {field: 'maddr', title: $.i18n.prop('center.knx.mac'), width: 200, templet: function (d) {
                        return intAddrToKnxAddr(d.maddr);
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#knx-shortcut', width: 300}
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
        }
        table.render(obj);

   
        //监听行工具事件
        table.on('tool(knx-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'goEdit') {
                openWin($.i18n.prop("center.knx.edit"), "knx_edit.html?dev_id=" + data.dev_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("center.knx.edit.tips"), {
                    title: $.i18n.prop("common.deltet"),
                    btn: [$.i18n.prop("common.canfirm"), $.i18n.prop("common.cancel")]
                },function (index) {
                    delKnx(data.dev_id);
                    layer.close(index);
                });
            }
        });

        table.on('toolbar(knx-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'goAdd':
                    openWin($.i18n.prop("center.knx.edit"), 'knx_add.html');
                    break;
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.dev_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delKnxs(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'refresh':
                    getKnxs();
                    break;
            }
            ;
        });

    });

    getDevices();
});
