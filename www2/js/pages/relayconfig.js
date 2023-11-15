var table;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function reLoad() {
    getRelayConfigs();
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getRelayConfigsCb") {
            if (obj.payload.index == 1) {
                setRelayConfigList([]);
            }
            setRelayConfigList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('relayconfig-table', {
                    data: getRelayConfigList()
                });
            }
        } else if (obj.method == "delRelayConfigCb" || obj.method == "delRelayConfigsCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            setDevList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                getRelayConfigs();
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }
}

function getDevices() {
    doGetDevices();
}

function delRelayConfig(dev_id) {
    openLoading(3000);
    doDelRelayConfig(dev_id);
}

function delRelayConfigs(ids) {
    openLoading(3000);
    doDelRelayConfigs(ids);
}

function getRelayConfigs() {
    doGetRelayConfigs();
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;


        var obj = {
            elem: '#relayconfig-table'
            //,url:'data.json'
            // , toolbar: '#relayconfig-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '刷新'
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 150, templet: function (d) {
                        return getDevNameById(d.dev_id);
                    }}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 150}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#relayconfig-shortcut', width: 300}
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
        

        //头工具栏事件
        table.on('toolbar(relayconfig-table)', function(obj){
            var checkStatus = table.checkStatus(obj.config.id);
            switch(obj.event){
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.dev_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delRelayConfigs(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'goAdd':
                    openWin($.i18n.prop("center.relay.add_relay"), 'relayconfig_add.html');
                    break;
                case 'refresh':
                    getRelayConfigs();
                    break;
            };
        });

        


        //监听行工具事件
        table.on('tool(relayconfig-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'goEdit') {
                openWin($.i18n.prop("center.relay.edit"), "relayconfig_edit.html?dev_id=" + data.dev_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("center.relay.edit.tips"), function (index) {
                    delRelayConfig(data.dev_id);
                    layer.close(index);
                });
            }
        });
    });

    getDevices();
});
