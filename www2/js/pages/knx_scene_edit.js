
function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
            }
            setSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        } else if (obj.method == "setKnxSceneCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            setDevList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                getKnxScene(getUrlParam("scene_id"));
            }
        }
    }

   
}

function setKnxScene() {
    var objSceneId = $("input[name='scene_id']");
    var scene_id = objSceneId.val();
    if ("" == scene_id) {
        objSceneId.tips({
            side: 3,
            msg: $.i18n.prop("common.scene_id.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objSceneId.focus();
        return;
    }

    var objGaddr = $('#gaddr');
    var gaddr = objGaddr.val();
    if (!isKnxAddr(gaddr)) {
        objGaddr.tips({
            side: 3,
            msg: $.i18n.prop("common.group_address.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objGaddr.focus();
        return;
    }

    var objValue = $('#value');
    var value = objValue.val();
    if (value == "") {
        objValue.tips({
            side: 3,
            msg: $.i18n.prop("common.enter_value.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objValue.focus();
        return;
    }

    var gaddr = knxAddrToIntAddr(gaddr);
    console.log("gaddr: " + gaddr);

    doSetKnxScene(scene_id, gaddr, value);
    
}

function getDevices() {
    doGetDevices();
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getKnxScene(scene_id) {
    //表单提交
    var jsonstr = '{"scene_id":' + scene_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "knx_scene.cgi/getKnxScene",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-knx-edit").setform(jsonobj);
            $("#name").val(getSceneNameById(jsonobj.scene_id));
            $("#gaddr").val(intAddrToKnxAddr(jsonobj.gaddr));
            layui.form.render('select');
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}


function back() {
    window.location = "knx_scene.html";
}


$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

    });
    getDevices();
    getSceneConfigs();
    layui.form.render()
});