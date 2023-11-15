var table;
var is_first = true;
var upate_flag = false;

function updateDevList() {
    layui.table.reload('device-table', {
        data: getDiscoveryList()
    });
    $("#discovery-total").html(getDiscoveryList().length);
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "discoveryCb") {
            var node = new Discovery();
            node.sn = obj.payload.sn;
            node.sort_id = obj.payload.sort_id;
            node.name = obj.payload.name;
            node.protocol = obj.payload.protocol;
            node.rssi = obj.payload.rssi;
            addDiscoveryList(node);
            updateDevList();
        }
    }
}

function back() {
    doCloseDiscovery();
    //window.location = "device.html";
    javascript:history.back(-1);
}

var update_timer = null;

function openDiscovery() {
    openLoading2(180 * 1000, function () {
        doCloseDiscovery();
        closeLoading();
        // clearInterval(update_timer);
        // update_timer = null;
        //back();
    });
    doOpenDiscovery();
    // if (update_timer != null) {
    //     clearInterval(update_timer);
    //     update_timer
    // }
    // update_timer = setInterval(function (){
    //     updateDevList();
    // },1000);

}


//JS
$(function () {
    layui.use('table', function () {
        layui.jquery(".find").text($.i18n.prop('device.find'))
        layui.jquery(".back").text($.i18n.prop('device.back'))
        layui.jquery(".batchNetwork").text($.i18n.prop('device.batch_network'))
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
            }]
            , limit: Number.MAX_VALUE
            , title: '设备'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'sn', title: 'SN', width: 150, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 150}
                , {field: 'sort_id', title: $.i18n.prop("sort.id"), width: 160}
                , {field: 'protocol', title: $.i18n.prop("sort.protocol_type"), width: 160}
                , {field: 'rssi', title: $.i18n.prop("device.signal"), width: 160}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#device-shortcut', width: 500}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                //头工具栏事件
                //头工具栏事件
                table.on('toolbar(device-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'back':
                            back();
                            break;
                        case 'goMultSmartConfig':
                            var data = checkStatus.data;
                            console.log("length: " + data.length);
                            if (data.length == 0) {
                                layer.msg($.i18n.prop("device.select_device_tips"));
                            } else {
                                parent.setGlobalList(data);
                                window.location = "device_mult_smartconfig.html";
                            }
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        //自定义头工具栏右侧图标 - 提示
                        case 'LAYTABLE_TIPS':
                            layer.alert('这是工具栏右侧自定义的一个图标按钮');
                            break;
                        case 'exportFile':
                            table.exportFile("device-table", listData, 'xls')
                        break;
                    }
                    ;
                });
            }
        }
        table.render(obj);

        //监听行工具事件
        table.on('tool(device-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'prov') {
                layer.confirm($.i18n.prop("common.smartconfig.tip"), function (index) {
                    window.location = "device_smartconfig.html?sn=" + data.sn + "&sort_id=" + data.sort_id + "&protocol=" + data.protocol + "&name=" + data.name;
                    layer.close(index);
                });
            }
        });

        
        
    });

    openDiscovery();
    //test();
});
