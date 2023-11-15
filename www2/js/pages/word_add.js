
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "addWordCb") {
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

function addWord() {

    var objValue = $("input[name='value']");
    var value = objValue.val();
    if ("" == value) {
        $("#value").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_entry.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objValue.focus();
        return;
    }

    var msgStr = form2JsonString("form-word-add");

    doAddWord($.parseJSON(msgStr));

    
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
});