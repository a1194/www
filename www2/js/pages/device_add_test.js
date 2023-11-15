var table;
var is_first = true;
var upate_flag = false;

function updateDevList() {
    table.reload('device-table', {
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
            node.name = getSortName(node.sort_id);
            node.protocol = obj.payload.protocol;
            node.rssi = obj.payload.rssi;
            addDiscoveryList(node);
            updateDevList();
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                openDiscovery();
            }
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
                title: '提示'
                , layEvent: 'LAYTABLE_TIPS'
                , icon: 'layui-icon-tips'
            }]
            , limit: Number.MAX_VALUE
            , title: '设备'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'sn', title: 'SN', width: 260, fixed: 'left', unresize: true, sort: true}
                , {
                    field: 'sort_id', title: $.i18n.prop("sort.id"), width: 260, templet: function (d) {
                        return getSortName(d.sort_id);
                    }
                }
                , {field: 'protocol', title: $.i18n.prop("device.agreement"), width: 260}
                , {field: 'rssi', title: $.i18n.prop("device.signal"), width: 260}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#device-shortcut', width: 150}
            ]]
            , data: []
        });

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
                        layer.msg('请选择设备！');
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
            }
            ;
        });

        //监听行工具事件
        table.on('tool(device-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'prov') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    window.location = "device_smartconfig.html?sn=" + data.sn + "&sort_id=" + data.sort_id;
                    layer.close(index);
                });
            }
        });
    });

    getSorts();
    //test();
});
