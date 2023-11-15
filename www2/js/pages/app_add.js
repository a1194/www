
function addApp() {

    //表单验证
    var objAppName = $("input[name='app_name']");
    var app_name = objAppName.val();
    if ("" == app_name) {
        $("#app_name").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_name.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objAppName.focus();
        return;
    }

    layui.use(function () {
        var upload = layui.upload;
        var element = layui.element;
        var $ = layui.$;

        upload.render({
            elem: '#test8'
            ,url: getCGIPath() + "app.cgi"
            ,data : {"name": "KNX转485"}
            ,auto: false
            //,multiple: true
            ,bindAction: '#test9'
            ,done: function(res){
                showMessager("上传成功", 0);
                console.log(res)
            }
        });
    })
}

function back() {
    window.location = "app.html";
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var upload = layui.upload;
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });

        upload.render({
            elem: '#test8'
            ,url: getCGIPath() + "app.cgi"
            ,data : {"name": "Knx转485"}
           // ,data : {"name": "KNX转485"}
            ,auto: false
            ,accept: 'file'
            //,multiple: true
            ,bindAction: '#test9'
            ,done: function(data){
                console.log(JSON.stringify(data));
                closeWin(parent);
                if (data.result == 0) {
                    showMessager($.i18n.prop("common.operate.tips"), data.result);
                    parent.getApps();
                } else {
                    showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
                }
            }
        });

        layui.form.render()
    });

    $("#btnEnable").click(function() {

    });

    $("#btnDisable").click(function() {

    });
});