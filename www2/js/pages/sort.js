var table;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('sort-table', {
                    data: getSortList()
                });
            }
        } else if (obj.method == "delSortCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }
}

function reLoad() {
    getSorts();
}
function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function delSort(sort_id) {
    openLoading(3000);
    doDelSort(sort_id);
    //var jsonstr = '{"sort_id":' + sort_id + '}';
    //console.log('jsonstr: ' + jsonstr);
    // $.ajax({
    //     url: getCGIPath() + "sort.cgi/del",
    //     contentType: "application/json",
    //     data: jsonstr,
    //     type: "POST",
    //     success: function (data) {
    //         console.log("data: " + data);
    //         var obj = $.parseJSON(data);
    //         showMessager(obj.msg, obj.result);
    //         getSorts();
    //     },
    //     error: function () {
    //         showMessager("操作失败", "-1");
    //     }
    // });
}

function getSorts() {
    var jsonstr = "{}";
    // $.ajax({
    //     url: getCGIPath() + "sort.cgi/getAll",
    //     contentType: "application/json",
    //     data: jsonstr,
    //     type: "POST",
    //     success: function (data) {
    //         console.log("data: " + data);
    //         table.reload('sort-table', {
    //             data: $.parseJSON(data)
    //         });
    //     },
    //     error: function () {
    //         showMessager("操作失败", "-1");
    //     }
    // });
    doGetSorts();
}

//JS
$(function () {
    getSorts();

    layui.use('table', function () {
        layui.jquery(".ctCategory").text($.i18n.prop('common.add_new'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        table = layui.table;

        var obj = {
            elem: '#sort-table'
            //,url:'data.json'
            , toolbar: '#sort-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
                , {field: 'sort_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("sort.name"), width: 200}
                , {
                    field: 'protocol', title: $.i18n.prop("sort.protocol_type"), width: 200, templet: function (d) {
                        return getProtocolText(d.protocol);
                    }
                }
                , {
                    field: 'dev_type', title: $.i18n.prop("sort.device_type"), width: 200, templet: function (d) {
                        return getDevTypeText(d.dev_type);
                    }
                }
                , {
                    field: 'services', title: $.i18n.prop("sort.service"), templet: function (d) {
                        return JSON.stringify(d.services);
                    }
                }
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#sort-shortcut', width: 450}
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
                table.on("toolbar(sort-table)", function(obj) {
                    if(obj.event == 'exportFile') {
                        table.exportFile("sort-table", listData, 'xls')
                    }
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop("sort.add_sort"), 'sort_add.html');
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        case 'refresh':
                            getSorts();
                            break;

                    }
                })
            }
        }
        table.render(obj);

        //监听行工具事件
        table.on('tool(sort-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                openWin($.i18n.prop("sort.edit_sort"), "sort_edit.html?sort_id=" + data.sort_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delSort(data.sort_id);
                    layer.close(index);
             }); 
            } 
            else if(obj.event === 'open') {
                console.log(data.sort_id);
                window.open(getRootPath() + `/user/www/index.html?sort_id=${data.sort_id}`, "_blank");
                // window.open("http://localhost:5173/", "_blank");
                // var newTab = window.open('about:blank');
                // newTab.location.href = `http://localhost:5173?id=${data.sort_id}`;
            }
        });

        
    });
});
