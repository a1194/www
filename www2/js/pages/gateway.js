var table;

function getGateways() {
    //表单提交
    var jsonstr = "{}";
    $.ajax({
        url: getCGIPath() + "gateway.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //$("#form-sysinfo").setform($.parseJSON(data));
            //formatDateTime();
            table.reload('gateway-table', {
                data: $.parseJSON(data)
            });
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}


//JS
$(function () {
    getGateways();

    layui.use('table', function () {
        layui.jquery(".addGateway").text($.i18n.prop('common.add_new'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        table = layui.table;
        
        
        var obj = {
            elem: '#gateway-table'
            //,url:'gateway.json'
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
            }, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '网关数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'gateway_id', title: "id", width: 120, fixed: 'left', unresize: true, gateway: true}
                , {field: 'mac', title: 'mac', width: 200}
                , {field: 'ip', title: 'ip', width: 200}
                , {field: 'type', title: $.i18n.prop("common.type"), width: 200}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 200}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#gateway-shortcut', width: 300}
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
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(gateway-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            window.location = 'gateway_add.html';
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        case 'refresh':
                            getGateways();
                            break;
                        case 'exportFile':
                            table.exportFile("gateway-table", listData, 'xls')
                            break;
                    }
                });
            }
        }
        table.render(obj);
    });
});