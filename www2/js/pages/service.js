var table;

function reLoad() {
    getServices();
}

function getServices() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //$("#form-sysinfo").setform($.parseJSON(data));
            //formatDateTime();
            table.reload('service-table', {
                data: $.parseJSON(data)
            });

        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function delService(service_id) {
    //表单提交
    var jsonstr = '{"service_id":' + service_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/del",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            showMessager(obj.msg, obj.result);
            getServices();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

//JS
$(function () {
    getServices();

    layui.use('table', function () {
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        table = layui.table;
        var obj = {
            elem: '#service-table'
            //,url:'data.json'
            , toolbar: '#service-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            , title: '服务'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'service_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("service.name"), width: 200}
                , {field: 'attrs', title: $.i18n.prop("service.attribute"), templet: function (d) {
                        return JSON.stringify(d.attrs);
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#service-shortcut', width: 450}
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
                table.on("toolbar(service-table)", function(obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin("添加服务 ", 'service_add.html');
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        case 'refresh':
                            getServices();
                            break;
                        case 'exportFile':
                            table.exportFile("service-table", listData, 'xls')
                            break;
                    }
                })
            }
        }
        table.render(obj);

        //监听行工具事件
        table.on('tool(service-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') {
                openWin($.i18n.prop("sort.edit_sort"), "service_edit.html?service_id=" + data.service_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delService(data.service_id);
                    layer.close(index);
                });
            }
        });
    });
});