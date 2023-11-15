var table;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function reLoad() {
    getKeyConfigs();
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    console.log(obj);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getKeyConfigsCb") {
            if (obj.payload.index == 1) {
                setKeyConfigList([]);
            }
            setKeyConfigList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('keyconfig-table', {
                    data: getKeyConfigList()
                });
            }
        } else if (obj.method == "delKeyConfigCb" || obj.method == "delKeyConfigsCb") {
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
                getKeyConfigs();
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

function delKeyConfig(dev_id) {
    openLoading(3000);
    doDelKeyConfig(dev_id);
}

function delKeyConfigs(ids) {
    openLoading(3000);
    doDelKeyConfigs(ids);
}

function getKeyConfigs() {
    doGetKeyConfigs();
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;

        var obj = {
            elem: '#keyconfig-table'
            //,url:'data.json'
           // , toolbar: '#keyconfig-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
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
                , {fixed: 'right', title: $.i18n.prop("common.operate"), width: 300, templet: function() {
                    const tem = 
                    `
                        <a class="layui-btn layui-btn-xs edit" lay-event="goEdit">${$.i18n.prop("common.edit")}</a>
                    `
                    return tem
                }}
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
        table.on('toolbar(keyconfig-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'goAdd':
                    openWin("添加按键", "keyconfig_add.html");
                    break;
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.dev_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delKeyConfigs(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'refresh':
                    getKeyConfigs();
                    break;
            }
            ;
        });

        //监听行工具事件
        

        table.on('tool(keyconfig-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'goEdit') {
                openWin($.i18n.prop("center.key_config.edit.tips"), "keyconfig_edit.html?dev_id=" + data.dev_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("center.key_config.delete.tips"), function (index) {
                    delKeyConfig(data.dev_id);
                    layer.close(index);
                });
            }
        });
    });

    getDevices();
});
