var table;
var del_list = [];
var del_total = 0;
var keep_dev_id = 0;
var success_total = 0;
var fail_total = 0;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "delDeviceCb") {
            if (obj.payload.result == 0) {
                if (obj.payload.dev_id > 0) {
                    if (del_list.length > 0) {
                        var del = del_list[0];
                        if (del.dev_id == obj.payload.dev_id) {
                            var node = new DelDevice();
                            node.sn = del.sn;
                            node.sort_id = del.sort_id;
                            node.name = del.name;
                            node.result = obj.payload.result;
                            addDelDevList(node);
                            del_total--;
                            $("#del-total").html(del_total);
                            success_total++;

                            $("#success-total").html(success_total);
                            table.reload('device-table', {
                                data: getDelDevList()
                            });

                            del_list.shift();
                            if (del_list.length > 0) {
                                del = del_list[0];
                                closeLoading();
                                delDevice(del.dev_id);
                            } else {
                                closeDiscovery();
                            }
                        }
                    }
                }
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        }
        /*
        if (obj.method == "delDeviceCb") {
            if (obj.payload.result == 0) {
                keep_dev_id = obj.payload.dev_id;
            }
        } else if (obj.method == "factoryResetCb") {
            console.log("result: " + obj.payload.result);
            if (obj.payload.result == 1 && keep_dev_id > 0) {
                if (del_list.length > 0) {
                    var del = del_list[0];
                    console.log("keep_dev_id: " + keep_dev_id);
                    if (del.dev_id == keep_dev_id) {
                        keep_dev_id = 0;
                        var node = new DelDevice();
                        node.sn = del.sn;
                        node.sort_id = del.sort_id;
                        node.name = del.name;
                        node.result = obj.payload.result;
                        addDelDevList(node);
                        del_total--;
                        $("#del-total").html(del_total);
                        success_total++;

                        $("#success-total").html(success_total);
                        table.reload('device-table', {
                            data: getDelDevList()
                        });

                        del_list.shift();
                        if (del_list.length > 0) {
                            del = del_list[0];
                            closeLoading();
                            delDevice(del.dev_id);
                        } else {
                            closeDiscovery();
                        }
                    }
                }
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        }
        */
    }
}

function getSorts() {
    doGetSorts();
}

function back() {
    closeDiscovery();
    //window.location = "device.html";
    javascript:history.back(-1);
}

function closeDiscovery() {
    closeLoading();
    doCloseDiscovery();
}

function delDevice(dev_id) {
    //openLoading(3000);
    openLoading2(5000, function () {
        console.log("删除超时！");
        var del = del_list[0];
        var node = new DelDevice();
        node.sn = del.sn;
        node.sort_id = del.sort_id;
        node.name = getSortName(del.sort_id);
        node.result = -1;
        addDelDevList(node);
        del_total--;
        $("#del_total").html(del_total);
        fail_total++;
        $("#fail-total").html(fail_total);
        table.reload('device-table', {
            data: getDelDevList()
        });

        del_list.shift();
        if (del_list.length > 0) {
            del = del_list[0];
            closeLoading();
            delDevice(del.dev_id);
        } else {
            closeDiscovery();
        }
    });
    doDelDevice(dev_id);
}


$(function () {
    layui.use('table', function () {
        table = layui.table;
        table.render({
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
            , title: '用户数据表'
            , limit: Number.MAX_VALUE
            , cols: [[
                {field: 'sn', title: 'SN', width: 260, sort: false}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 260}
                , {field: 'result', title: $.i18n.prop("device.result"), width: 300, templet: function(d) {
                    if(d.result === -1) {
                        return `<span style="color: red;" > ${$.i18n.prop("device.failure")} </span>`
                    } else {
                        return `<span style="color: blue;" > ${$.i18n.prop("device.success")} </span>`
                    }
                }}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(device-table)', function (obj) {
                    switch (obj.event) {
                        case 'exportFile':
                            table.exportFile("device-table", listData, 'xls')
                        break;
                    }
                });
            }
        });
        
    });

    getSorts();

    // var ids_str = getUrlParamAndDecode('ids');
    // console.log("ids: " + ids_str);
    // del_dev_id_list = $.parseJSON(ids_str);
    // del_total = del_dev_id_list.length;
    // $("#del_total").html(del_total);
    // if (del_dev_id_list.length > 0) {
    //     console.log("dev_id: " + del_dev_id_list[0]);
    //     delDevice(del_dev_id_list[0]);
    // }

    del_list = parent.getGlobalList();
    del_total = del_list.length;
    $("#del_total").html(del_total);
    if (del_total > 0) {
        var del = del_list[0];
        console.log("dev_id: " + del.dev_id);
        delDevice(del.dev_id);
    }
});
