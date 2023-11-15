var table;
var is_test_start = false;
var test_total = 0;
var success_total = 0;
var fail_total = 0;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getRelayConfigsCb") {
            if (obj.payload.index == 1) {
                setRelayConfigList([]);
            }
            setRelayConfigList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('relayconfig-table', {
                    data: getRelayConfigList()
                });
            }
        } else if (obj.method == "setRelayConfigCb") {
            if (!is_test_start)
                return;
            if (obj.payload.result == 0) {
                success_total++;
                $("#success-total").html(success_total);
                showMessager("设置成功", obj.payload.result);
                getRelayConfigs();
                closeDialog();
                openDialog('5秒后进入下一轮测试...', '马上进入下一轮', 5000, function () {
                    startTest();
                });
            } else {
                fail_total++;
                $("#fail-total").html(fail_total);
                showMessager("设置失败", obj.payload.result);
            }
        } else if (obj.method == "delRelayConfigCb") {
            if (!is_test_start)
                return;
            if (obj.payload.result == 0) {
                success_total++;
                $("#success-total").html(success_total);
                showMessager("删除成功", obj.payload.result);
                getRelayConfigs();
                closeDialog();
                openDialog('5秒后进入下一轮测试...', '马上进入下一轮', 5000, function () {
                    startTest();
                });
            } else {
                fail_total++;
                $("#fail-total").html(fail_total);
                showMessager("删除失败", obj.payload.result);
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            setDevList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                getRelayConfigs();
            }
        }
    }
}

function getDevices() {
    doGetDevices();
}

function delRelayConfig(dev_id) {
    openLoading(3000);
    doDelRelayConfig(dev_id);
}

function delRelayConfigs(ids) {
    openLoading(3000);
    doDelRelayConfigs(ids);
}

function getRelayConfigs() {
    doGetRelayConfigs();
}

var add_flag = false;

function startTest() {
    var dev_id = $('#button-dev-select').val();
    var msg = "";
    if (!add_flag) {
        var sort_id = getDevSort(dev_id);
        var relay_total = getRelayTotal(sort_id);
        var relays_str = "[";
        console.log("relay_total: " + relay_total);
        for (var i = 1; i <= parseInt(relay_total) && i <= 4; i++) {
            var value1 = i;
            var value2 = "灯光" + i;
            var value3 = 0;
            var value4 = 0;

            if (i != 1) {
                relays_str += ',';
            }

            relays_str += ('{"no":' + value1 + ',"name":"' + value2 + '","type":' + value3 + ',"delay":' + value4 + '}');
        }
        relays_str += "]";
        doSetRelayConfig(dev_id, $.parseJSON(relays_str));
        msg = "添加配置中...";
    } else {
        doDelRelayConfig(dev_id);
        msg = "删除配置中...";
    }

    test_total++;
    $("#test-total").html(test_total);

    add_flag = !add_flag;
    parent.showMessager(msg);
    openLoading2(3000, function () {
        console.log("设置超时！");
        fail_total++;
        $("#fail-total").html(fail_total);
        startTest();
    });
}

function stopTest() {
    closeLoading();
}

function getButtonDevices() {
    //表单提交
    var json_obj = "{}";
    $.ajax({
        url: getCGIPath() + "device.cgi/getBtnDevs",
        contentType: "application/json",
        data: json_obj,
        type: "POST",
        success: function (data) {
            var list = $.parseJSON(data);
            console.log("data： " + data);
            setDevList([]);
            setDevList(list);
            createButtonDevices();
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;
        var form = layui.form;

        table.render({
            elem: '#relayconfig-table'
            , limits: [100, 200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: '设备ID', width: 120, fixed: 'left', unresize: true, sort: true}
                , {
                    field: 'name', title: '设备名', width: 360, templet: function (d) {
                        return getDevNameById(d.dev_id);
                    }
                }
                , {field: 'state', title: '状态', width: 120}
            ]]
            , page: true
            , data: []
        });

        //头工具栏事件
        table.on('toolbar(relayconfig-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.dev_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delRelayConfigs(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'goAdd':
                    window.location = 'relayconfig_add.html';
                    break;
                case 'refresh':
                    getRelayConfigs();
                    break;
            }
            ;
        });

        //监听行工具事件
        table.on('tool(relayconfig-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'edit') {
                window.location = "relayconfig_edit.html?dev_id=" + data.dev_id;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delRelayConfig(data.dev_id);
                    layer.close(index);
                });
            }
        });

        form.on('switch(test-switch)', function (data) {
            //parent.log_switch = this.checked;
            if (this.checked) {
                var dev_id = $('#button-dev-select').val();
                if (parseInt(dev_id) == 0) {
                    layer.msg("请选择设备！", {
                        time: 2000
                    });
                    if (this.checked)
                        $('#test-switch').removeAttr("checked");
                    else
                        $('#test-switch').attr( "checked", 'true');
                    form.render();
                    return;
                }
                test_total = 0;
                $("#test-total").html(test_total);
                is_test_start = true;
                startTest();
            } else {
                is_test_start = false;
                stopTest();
            }
        });
    });

    getButtonDevices();
    getDevices();
});
