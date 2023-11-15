
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setRelayConfigCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager("设置成功", obj.payload.result);
                parent.reLoad();
            } else {
                showMessager("设置失败", obj.payload.result);
            }
        }
    }
}

function back() {
    window.location = "relayconfig.html";
    //javascript:history.back(-1);
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

function setRelayConfig() {
    var objDevId = $('#button-dev-select');
    var dev_id = objDevId.val();
    console.log('dev_id: ' + dev_id);
    if ("" == dev_id) {
        objDevId.tips({
            side: 3,
            msg: '请选择设备',
            bg: '#AE81FF',
            time: 3
        });
        objDevId.focus();
        return;
    }

    var relays_str = "[";
    $(".relay-item").each(function (i) {
        var value1 = $(this).find("select[name = 'no']").val();
        var value2 = $(this).find("input[name = 'name']").val();
        var value3 = $(this).find("select[name = 'type']").val();
        var value4 = $(this).find("select[name = 'delay']").val();
        if (value1 == "" || value2 == "" || value3 == "" || value4 == "") {
            $(this).tips({
                side: 1,
                msg: '内容不能为空',
                bg: '#AE81FF',
                time: 3
            });
            return;
        }

        if (i != 0) {
            relays_str += ',';
        }

        relays_str += ('{"no":' + value1 + ',"name":"' + value2 + '","type":' + value3 + ',"delay":' + value4 + '}');
    });
    relays_str += "]"

    //console.log("relays_str: " + relays_str);

    openLoading(3000);
    doSetRelayConfig(dev_id, $.parseJSON(relays_str));
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(button-dev-select)', function (data) {
            var sort_id = getDevSort(data.value);
            createRelays(getRelayTotal(sort_id));
        });
        form.render()
    });
    getButtonDevices();
});
