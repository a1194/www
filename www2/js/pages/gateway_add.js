var table;


function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "searchGatewayCb") {
            var node = new Object();
            node.gatew_id = obj.payload.gatew_id;
            node.mac = obj.payload.mac;
            node.ip = obj.payload.ip;
            node.state = obj.payload.state;
            var result = addGatewayList(node);
            if (result == 0) {
                table.reload('gateway-table', {
                    data: getGatewayList()
                });
            }
        }
    }
}

function back() {
    window.location = "gateway.html";
}


function searchGateway() {
    openLoading2(60 * 1000, function () {
        //doCloseSearch();
        closeLoading();
        //back();
    });
    doSearchGateway();
}

//JS
$(function () {
    layui.use('table', function () {
        layui.jquery(".back").text($.i18n.prop('gateway.back'))
        layui.jquery(".networking").text($.i18n.prop('gateway.networking'))
        table = layui.table;

        table.render({
            elem: '#gateway-table'
            //,url:'data.json'
            , toolbar: '#gateway-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            , title: '网关'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'mac', title: 'MAC', width: 260, fixed: 'left', unresize: true, sort: true}
                , {field: 'ip', title: 'IP', width: 260}
            ]]
            , data: []
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                //头工具栏事件
                table.on('toolbar(gateway-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'back':
                            back();
                            break;
                        case 'networking':
                            var data = checkStatus.data;
                            console.log("length: " + data.length);
                            if (data.length == 0) {
                                layer.msg($.i18n.prop("gateway.select_gateway_tips"));
                            } else{
                                layer.confirm($.i18n.prop("gateway.select_gateways_tips"), {
                                    title: $.i18n.prop("common.message"),
                                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                                }, function (index) {
                                    //console.log("data.sn: " + data.sn);
                                    //console.log("data.sort_id: " + data.sort_id);
                                    //goSmartconfig(data.sn, data.sort_id);
                                    layer.close(index);
                                });
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
                            table.exportFile("gateway-table", listData, 'xls')
                        break;
                    }
                });
                searchGateway();
            }
        });

        

        
    });

    

        
   
});
