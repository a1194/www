function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setRelayConfigCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.setting.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.setting_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getRelayConfigCb") {
            $("#form-relayconfig-edit").setform(obj.payload);
            $('#name').val(getDevNameById(obj.payload.dev_id));

            //$('#button-dev-select').val(obj.payload.dev_id);
        // layui.form.render('select');
            var relays = obj.payload.relays;
            for (var index in relays) {
                var relay = relays[index];
                createRelay(relay.no, relay.type, relay.name, relay.delay);
            }
        }
    }
    
}

function getRelayConfig(dev_id) {
    doGetRelayConfig(parseInt(dev_id));
}

function back() {
    window.location = "relayconfig.html";
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
            console.log("data: " + data);
            var list = $.parseJSON(data);
            setDevList([]);
            setDevList(list);
            createButtonDevices();
            getRelayConfig(getUrlParam("dev_id"));
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function setRelayConfig() {

    var dev_id = $('#dev_id').val();

    var relays_str = "[";
    $(".relay-item").each(function (i) {
        var value1 = $(this).find("select[name = 'no']").val();
        var value2 = $(this).find("input[name = 'name']").val();
        var value3 = $(this).find("select[name = 'type']").val();
        var value4 = $(this).find("select[name = 'delay']").val();
        if (value1 == "" || value2 == "" || value3 == "" || value4 == "") {
            $(this).tips({
                side: 1,
                msg: $.i18n.prop("common.content_empty"),
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
    relays_str += "]";

    openLoading(3000);
    doSetRelayConfig(dev_id, $.parseJSON(relays_str));

    
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        // form.on('select(button-dev-select)', function (data) {
        //     console.log('data.value: ' + data.value);
        //     var sort_id = getDevSort(data.value);
        //     console.log('sort_id: ' + sort_id);
        //     createRelays(getRelayTotal(sort_id));
        //
        // });
    });

    getButtonDevices();
});