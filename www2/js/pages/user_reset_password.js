
function getUser(user_id) {
    //表单提交
    var jsonstr = '{"user_id":' + user_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "user.cgi/getUser",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-user-edit").setform(jsonobj);
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function resetPassword() {

    //表单验证
    var objPassword = $("input[name='password']");
    var password = objPassword.val();
    if (password.length < 6) {
        $("#password").tips({
            side: 3,
            msg: $.i18n.prop("user.password.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objPassword.focus();
        return;
    }

    var base = new Base64();
    var base64_pwd = base.encode(password);

    var user_id = $("input[name='user_id']").val();

    //表单提交
    //var jsonstr = form2JsonString("form-user-edit");
    var jsonstr = '{"user_id":' + user_id + ',"password":"' + base64_pwd + '"}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "user.cgi/resetPassword",
        contentType: "application/json",
        //data:JSON.stringify({"id":"1"}),  //如果不添加  contentType:"application/json" 则data必须是json对象，应该是{"id"："1"}
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.reset.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.reset_failure.tips"), obj.result);
            }
            
            parent.reLoad();
        },
        error: function () {
            showMessager($.i18n.prop("common.reset_failure.tips"), "-1");
        }
    });

    
}

function back() {
    window.location = "user.html";
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

    getUser(getUrlParam("user_id"));
});