
function addUser() {

    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: $.i18n.prop("user.enter_nickname.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var objAccount = $("input[name='account']");
    var account = objAccount.val();
    if (account.length < 4) {
        $("#account").tips({
            side: 3,
            msg: $.i18n.prop("user.username.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objAccount.focus();
        return;
    }

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

    //表单提交
    //var jsonstr = form2JsonString("form-user-add");
    var jsonstr = '{"account":"' + account + '","name":"' + name + '","password":"' + base64_pwd + '"}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "user.cgi/add",
        contentType: "application/json",
        //data:JSON.stringify({"id":"1"}),  //如果不添加  contentType:"application/json" 则data必须是json对象，应该是{"id"："1"}
        data: jsonstr,
        //data: jsonstr,
        //data: $.parseJSON(jsonstr),
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.add.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.result);
            }
            
            parent.reLoad();
        },
        error: function () {
            showMessager($.i18n.prop("common.create_failure.tips"), "-1");
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
});