var table;

function setSmartConfigList(list) {
    parent.setSmartConfigList(list);
}

function getSmartConfigList() {
    return parent.smart_config_list
}

function msgCallback(data) {
    var obj = $.parseJSON(data)
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
                    data: getSubDevList()
                });
            }
        } else if (obj.method == "delDeviceCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        }
    }
}

function delDevice(dev_id) {
    openLoading(3000);
    doDelDevice(dev_id);
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;

        table.render({
            elem: '#device-table'
            //,url:'data.json'
            , toolbar: '#device-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '刷新'
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            ,cellMinWidth: 80
            , limits: [100,200]
            , limit: 100
            , title: '设备'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: $.i18n.prop("device.id"), width: 80, fixed: 'left', sort: true}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 260}
                , {field: 'sort_id', title: $.i18n.prop("sort.id"), width: 80}
                /*
                , {
                    field: 'protocol', title: '协议', width: 120, templet: function (d) {
                        return getProtocolText(d.protocol);
                    }
                }
                */
                , {field: 'room_id', title: $.i18n.prop("room.id"), width: 80}
                , {field: 'sn', title: 'SN', width: 180}
                , {field: 'addr', title: $.i18n.prop("device.addr"), width: 180}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#device-shortcut', width: 320}
            ]]
            , page: true
            , data: []
        });

        //头工具栏事件
        table.on('toolbar(device-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'goMultDel':
                    var data = checkStatus.data;
                    console.log("length: " + data.length);
                    if (data.length == 0) {
                        layer.msg($.i18n.prop("device.select_device_tips"));
                    } else {
                        parent.setSmartConfigList(data);
                        window.location = 'device_mult_del.html';
                    }
                    break;
                case 'refresh':
                    getDevices();
                    break;
            }
        });

        //监听行工具事件
        table.on('tool(device-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delDevice(data.dev_id);
                    layer.close(index);
                });
            }
        });
    });

    getSorts();
});
