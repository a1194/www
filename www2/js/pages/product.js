function reLoad() {
    getProducts();
}

function getState(state) {
    if (state == "1")
        return $.i18n.prop("common.enabled");
    else
        return $.i18n.prop("common.forbidden");
}

function setState(prod_id, state) {
    var jsonstr = '{"prod_id":' + prod_id + ',"state":' + state + '}';
    $.ajax({
        url: getCGIPath() + "product.cgi/setState",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.setting.tips"), obj.result);
            } else {
                //启动
                showMessager($.i18n.prop("common.setting_failure.tips"), obj.result);
            }
            
            getProducts();
        },
        error: function () {
            showMessager($.i18n.prop("common.setting_failure.tips"), obj.result);
        }
    });
}


var table;

function getProducts() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "product.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //$("#form-sysinfo").setform($.parseJSON(data));
            //formatDateTime();
            table.reload('prod-table', {
                data: $.parseJSON(data)
            });
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

function delProduct(prod_id) {

    //表单提交
    var jsonstr = '{"prod_id":' + prod_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "product.cgi/del",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.result);
            }
            
            getProducts();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });

    
}

//JS
$(function () {
    getProducts();
    var language = sessionStorage.getItem('language')
    
    layui.use('table', function () {
        layui.jquery(".ctProduct").text($.i18n.prop('common.add_new'))
        layui.jquery(".start").text($.i18n.prop('product.start'))
        layui.jquery(".disable").text($.i18n.prop('product.disable'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))


        layui.jquery(".none").text($.i18n.prop('product.none'))
        table = layui.table;

        var obj = {
            elem: '#prod-table'
            //,url:'data.json'
            , toolbar: '#prod-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'prod_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("product.name"), width: 150}
                , {field: 'sort_id', title: $.i18n.prop("sort.id"), width: 150}
                , {field: 'services', title: $.i18n.prop("service.id"), width: 150}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 150, templet: function (d) {
                        return getState(d.state);
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#prod-shortcut', width: 500}
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
                table.on("toolbar(prod-table)", function(obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop("product.add_product"), "product_add.html");
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        case 'refresh':
                            getProducts();
                            break;

                        case 'exportFile':
                            table.exportFile("prod-table", listData, 'xls')
                            break;
                    }
                })
            }
        }
        table.render(obj);
        
        table.on('tool(prod-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'enable') {
                layer.confirm($.i18n.prop('product.start.tips'), {
                    title: $.i18n.prop("product.start"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    setState(data.prod_id, 1);
                    layer.close(index);
                });
            } else if (obj.event === 'disable') {
                layer.confirm($.i18n.prop('product.disable.tips'), {
                    title: $.i18n.prop("product.disable"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    setState(data.prod_id, 0);
                    layer.close(index);
                });
            } else if (obj.event === 'edit') {
                openWin($.i18n.prop("product.change_house"), "product_edit.html?prod_id=" + data.prod_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop('product.delete.tips'), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delProduct(data.prod_id);
                    layer.close(index);
                });
            }
        });
    });
});