var table;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function reLoad() {
    getAreas();
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getAreasCb") {
            if (obj.payload.index == 1) {
                setAreaList([]);
            }
            setAreaList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                table.reload('area-table', {
                    data: getAreaList()
                });
            }
        } else if (obj.method == "delAreaCb" || obj.method == "delAreasCb") {
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

function delArea(area_id) {
    openLoading(3000);
    doDelArea(area_id);
}
function delAreas(ids) {
    openLoading(3000);
    doDelAreas(ids);
}

function getAreas() {
    doGetAreas();
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;

        var obj = {
            elem: '#area-table'
            //,url:'data.json'
            , toolbar: '#area-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
                , {field: 'area_id', title: "id", width: 120, fixed: 'left', unresize: true, area: true}
                , {field: 'name', title: $.i18n.prop("area.name"), width: 240}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#area-shortcut', width: 500}
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
                table.on('toolbar(area-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop('area.add_area'), 'area_add.html');
                            break;
                        case 'dels':
                            //var checkStatus = table.checkStatus(obj.config.id);
                            var ids = [];
                            if (checkStatus.data.length > 0) {
                                $.each(checkStatus.data, function (index, item) {
                                    ids.push(item.area_id)
                                });
                                layer.confirm($.i18n.prop("area.delete.tips"), {
                                    title: $.i18n.prop("common.delete"),
                                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                                },function (index) {
                                    delAreas(ids);
                                    layer.close(index);
                                });
                            } else {
                                layer.msg($.i18n.prop("common.select.tips"));
                            }
                            break;
                        case 'refresh':
                            // var page = $(".layui-laypage-skip .layui-input").val();
                            // var limit = $(".layui-laypage-limits").find("option:selected").val();
                            getAreas();
                            break;
                        case 'exportFile':
                            table.exportFile("area-table", listData, 'xls')
                        break;
                    }
                    ;
                });
            }
        }
        table.render(obj);
        
        
        

        getAreas();


        layui.use('jquery',function(){
            // console.log(layui.jquery(".ctUser").text())
            layui.jquery(".ctArea").text($.i18n.prop('common.add_new'))
            layui.jquery(".bulkDelete").text($.i18n.prop('area.bulk_delete'))
            layui.jquery(".edit").text($.i18n.prop('common.edit'))
            layui.jquery(".del").text($.i18n.prop('common.delete'))
        })

        table.on('tool(area-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                openWin($.i18n.prop("area.edit"), "area_edit.html?area_id=" + data.area_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("word.dele.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delArea(data.area_id);
                    layer.close(index);
                });
            }
        });
    });
});
