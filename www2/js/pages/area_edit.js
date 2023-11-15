

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editAreaCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
            }
        }
    }
}

function getArea(area_id) {
    //表单提交
    var jsonstr = '{"area_id":' + area_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "area.cgi/getArea",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-area-edit").setform(jsonobj);
        },
        error: function () {
            showMessager($.i18n.prop("common.edit_failure.tips"), "-1");
        }
    });
}

function editArea() {
    openLoading(3000);

    //表单验证
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

    //var id = $("input[name='id']").val();

    var msgStr = form2JsonString("form-area-edit");
    doEditArea($.parseJSON(msgStr));
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

    getArea(getUrlParam("area_id"));
});
