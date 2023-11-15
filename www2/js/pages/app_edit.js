var fr = new FileReader();
let theFileContent
fr.onload = function () {
    theFileContent = fr.result;
    console.log(theFileContent);
    $(".appData").val(theFileContent)
}


function getApp(app_id) {
    //表单提交
    var jsonstr = '{"app_id":' + app_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "app.cgi/getApp",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-app-edit").setform(jsonobj);

            getAppData(`${getRootPath()}/app/${jsonobj.pkg_name}/${jsonobj.pkg_name}.csv`).then(res => {
                fr.readAsText(res, 'utf-8');
            })
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

//获取应用数据
function getAppData(url) {
    return new Promise(async (resolve) => {
        let DownUrl = url;
        let data = await fetch(DownUrl)
            .then((response) => response.blob())
            .then((res) => {
                //获取文件格式
                var index = DownUrl.lastIndexOf(".");
                //获取文件后缀判断文件格式
                var fileType = DownUrl.substr(index + 1);
                let blod = new Blob([res]);
                resolve(blod)
            });
    })
}

function editApp() {

    console.log($(".appData").val());
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

    var app_id = $("input[name='app_id']").val();

    //表单提交
    //var jsonstr = form2JsonString("form-app-edit");
    var jsonstr = '{"app_id":' + app_id + ',"app_name":"' + app_name + '"}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "app.cgi/edit",
        contentType: "application/json",
        //data:JSON.stringify({"id":"1"}),  //如果不添加  contentType:"application/json" 则data必须是json对象，应该是{"id"："1"}
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            if (obj.result == 0) {
                showMessager($.i18n.prop("common.edit.tips"), obj.result);
            }

            parent.getApps();
        },
        error: function () {
            showMessager($.i18n.prop("common.edit_failure.tips"), "-1");
        }
    });
}

function back() {
    window.location = "app.html";
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

    getApp(getUrlParam("app_id"));
});
