var table;
var is_test_start = false;
var test_total = 0;
var success_total = 0;
var fail_total = 0;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setKeyConfigCb") {
            if (!is_test_start)
                return;
            if (obj.payload.result == 0) {
                success_total++;
                $("#success-total").html(success_total);
                showMessager("设置成功", obj.payload.result);
                getKeyConfigs();
                closeDialog();
                openDialog('5秒后进入下一轮测试...', '马上进入下一轮', 5000, function () {
                    startTest();
                });
            } else {
                fail_total++;
                $("#fail-total").html(fail_total);
                showMessager("设置失败", obj.payload.result);
            }
        } else if (obj.method == "getKeyConfigsCb") {
            if (obj.payload.index == 1) {
                setKeyConfigList([]);
            }
            setKeyConfigList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('keyconfig-table', {
                    data: getKeyConfigList()
                });
            }
        } else if (obj.method == "delKeyConfigCb") {
            if (!is_test_start)
                return;
            if (obj.payload.result == 0) {
                success_total++;
                $("#success-total").html(success_total);
                showMessager("删除成功", obj.payload.result);
                getKeyConfigs();
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
                getKeyConfigs();
            }
        }
    }
}

function getDevices() {
    doGetDevices();
}

function delKeyConfig(dev_id) {
    openLoading(3000);
    doDelKeyConfig(dev_id);
}

function delKeyConfigs(ids) {
    openLoading(3000);
    doDelKeyConfigs(ids);
}

function getKeyConfigs() {
    doGetKeyConfigs();
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

function doSetKeyConfig(dev_id, keys_obj) {
    sendMsgToHost("setKeyConfig", {
        "dev_id": parseInt(dev_id),
        "keys": keys_obj
    });
}

function doDelKeyConfig(dev_id) {
    sendMsgToHost("delKeyConfig", {
        "dev_id": parseInt(dev_id)
    });
}

var step = 0;

function startTest() {
    var dev_id = $('#button-dev-select').val();
    var msg = "";
    step++;
    if (step == 1) {
        var sort_id = getDevSort(dev_id);
        var key_total = getKeyTotal(sort_id);
        var keys_str = "[";
        console.log("key_total: " + key_total);
        for (var i = 1; i <= parseInt(key_total) && i <= 8; i++) {
            var value1 = i;
            var value2 = "按键" + i;
            var value3 = 0;
            var value4 = 0;

            if (i != 1) {
                keys_str += ',';
            }

            keys_str += ('{"no":' + value1 + ',"name":"' + value2 + '","type":' + value3 + ',"value":' + value4 + '}');
        }
        keys_str += "]";
        doSetKeyConfig(dev_id, $.parseJSON(keys_str));
        msg = "配置为本地开关...";
    } else if (step == 2) {
        var sort_id = getDevSort(dev_id);
        var key_total = getKeyTotal(sort_id);
        var keys_str = "[";
        console.log("key_total: " + key_total);
        for (var i = 1; i <= parseInt(key_total) && i <= 8; i++) {
            var value1 = i;
            var value2 = "按键" + i;
            var value3 = 1;
            var value4 = i;

            if (i != 1) {
                keys_str += ',';
            }

            keys_str += ('{"no":' + value1 + ',"name":"' + value2 + '","type":' + value3 + ',"value":' + value4 + '}');
        }
        keys_str += "]";
        doSetKeyConfig(dev_id, $.parseJSON(keys_str));
        msg = "配置为场景执行...";
    } else if (step == 3) {
        step = 0;
        doDelKeyConfig(dev_id);
        msg = "删除配置...";
    }

    test_total++;
    $("#test-total").html(test_total);
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

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;
        var form = layui.form;

        table.render({
            elem: '#keyconfig-table'
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

        //监听行工具事件
        table.on('tool(keyconfig-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                window.location = "keyconfig_edit.html?dev_id=" + data.dev_id;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delKeyConfig(data.dev_id);
                    layer.close(index);
                });
            }
        });

        //var test_timer = null;

        form.on('switch(test-switch)', function (data) {
            //parent.log_switch = this.checked;
            if (this.checked) {
                var dev_id = $('#button-dev-select').val();
                console.log("dev_id: " + dev_id);
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
