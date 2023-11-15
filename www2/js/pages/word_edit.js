
function msgCallback(data) {

    
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editWordCb") {
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

function getWord(word_id) {

    
    //表单提交
    var jsonstr = '{"word_id":' + word_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "word.cgi/getWord",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-word-edit").setform(jsonobj);
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });

    
}

function editWord() {
    
    //表单验证
    var objValue = $("input[name='value']");
    var value = objValue.val();
    if ("" == value) {
        $("#value").tips({
            side: 3,
            msg: $.i18n.prop("center.combine_scene.entry_enter"),
            bg: '#AE81FF',
            time: 3
        });
        objValue.focus();
        return;
    }

    //表单提交
    var msgStr = form2JsonString("form-word-edit");
    doEditWord($.parseJSON(msgStr));
    
}

function back() {
    window.location = "word.html";
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

    getWord(getUrlParam("word_id"));
});