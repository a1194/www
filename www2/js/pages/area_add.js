
function msgCallback(data) {
        
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "addAreaCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
            }
        }
    }
    
}

function addArea() {
    openLoading(3000);

    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: '请输入名称',
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var msgStr = form2JsonString("form-area-add");
    doAddArea($.parseJSON(msgStr));
}

function back() {
    window.location = "area.html";
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });
    });
});
