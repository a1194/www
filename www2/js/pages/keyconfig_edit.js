let keyValues
function msgCallback(data) {
    var obj = $.parseJSON(data);
    console.log(obj);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setKeyConfigCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.setting.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.setting_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
            }
            setSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                getButtonDevices();
            }
        } else if(obj.method == "getDevicesCb") {
            console.log(obj.payload);
            keyValues = obj.payload.data
        } else if (obj.method == "getKeyConfigCb") {
            $("#dev_id").val(obj.payload.dev_id)
            if(keyValues) {
                $('#name').val(keyValues.find(item => item.dev_id == obj.payload.dev_id).name);
            }
            var keys = obj.payload.keys;
            console.log(keys);
            allKeyLength = keys.length
            for (var index in keys) {
                var key = keys[index];
                createKey(key.no, key.type, key.name, key.value, keys.length);
            }
        } 
    }
    
}

function addBtn() {
    allKeyLength += 1
    createKey(allKeyLength,0 ,`按键${allKeyLength}`, allKeyLength, allKeyLength)
}

function getKeyConfig(dev_id) {
    doGetKeyConfig(parseInt(dev_id));
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getDevices() {
    doGetDevices();
}

function back() {
    window.location = "keyconfig.html";
   // javascript:history.back(-1);
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
            getKeyConfig(getUrlParam("dev_id"));
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function setKeyConfig() {
    var dev_id = $('#dev_id').val();

    var keys_str = "[";
    $(".key-item").each(function (i) {
        var value1 = $(this).find("select[name = 'no']").val();
        var value2 = $(this).find("input[name = 'name']").val();
        var value3 = $(this).find("select[name = 'type']").val();
        var value4 = $(this).find("select[name = 'value']").val();
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
            keys_str += ',';
        }

        keys_str += ('{"no":' + value1 + ',"name":"' + value2 + '","type":' + value3 + ',"value":' + value4 + '}');
    });
    keys_str += "]";

    console.log(keys_str);
    openLoading(3000);
    doSetKeyConfig(dev_id, $.parseJSON(keys_str));
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
        //     createKeys(getKeyTotal(sort_id));
        //
        // });

        form.on('select(key-type)', function (data) {
            console.log('data.value: ' + data.value);
            var id = data.elem.getAttribute("id").replace("type", "value");
            console.log('id: ' + id);
            $("#" + id).empty();
            var list = getSceneList();
            for (index in list) {
                var scene = list[index];
                var $op = '<option value="' + scene.scene_id + '">' + scene.name + '</option>';
                $("#" + id).append($op);
            }
           
        });
        form.render();
    });

    getSceneConfigs();
    getDevices()
});