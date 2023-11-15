
function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function getAppInfo() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "app.cgi/getAppInfo",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log(data);
            $("#form-app-deploy").setform($.parseJSON(data));
            //formatDateTime();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function msgCallback(msg) {
    var obj = jQuery.parseJSON(msg);
    switch (obj.cmd) {
        case 101: {
            if (obj.payload != null && obj.payload != "") {
                var payloadObj = jQuery.parseJSON(obj.payload);
                var version = payloadObj.version;
            }
            break;
        }
    }
}

function onProgress(event) {
    var event = event || window.event;
    console.log("loaded：" + event.loaded); //已经上传大小情况(已上传大小，上传完毕后就 等于 附件总大小)
    //console.log(event.total);  //附件总大小(固定不变)
    var loaded = Math.floor(100 * (event.loaded / event.total)); //已经上传的百分比
    $('.progress > div').css('width', loaded + "%");
}
function startClick() {
    upload(chooseFile)
}
let chooseFile 
function upload(file) {
    


    // var device_item_file = $("#dbFile")[0].files[0]; // Getting the properties of file from file field
    var device_item_file = file
    if (null == device_item_file) {
        // alert('请输入正确的IP地址');
        $("#ID-upload-demo-choose").tips({
            side: 3,
            msg: $.i18n.prop("common.select_field.tips"),
            bg: '#AE81FF',
            time: 3
        });
        $("#ID-upload-demo-choose").focus();
        return;
    }

    //openLoading(5000);
    console.log("file name: " +  device_item_file.name);
    if (device_item_file.name != "user.img") {
        openDialog($.i18n.prop("common.upgrade_failure.tips"), $.i18n.prop("common.confirm"));
        return ;
    }

    var form_data = new FormData(); // Creating object of FormData class
    form_data.append("file", device_item_file);
    console.log("form_data: " + form_data);
    //表单提交
    //var jsonstr = "{}";
    //console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "upload.cgi",
        //contentType: "multipart/form-data",
        data: form_data,
        type: "post",
        async: true,
        processData: false,
        contentType: false,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (onProgress && xhr.upload) {
                xhr.upload.addEventListener("progress", onProgress, false);
                return xhr;
            }
        },
        success: function (data) {
            console.log(data);
            var obj = $.parseJSON(data);
            if (obj.result == 0) {
                layui.layer.open({
                    type: 1
                    , title: false
                    , closeBtn: false
                    , offset: 'auto'
                    , content: `<div style="padding: 50px; line-height: 16px; background-color: #393D49; color: #fff; font-weight: 300;">${$.i18n.prop("common.upgrade")}</div>`
                    , btn: $.i18n.prop("common.confirm")
                    , area: '300px;'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0
                    , yes: function () {
                        parent.location.reload();
                    }
                });
            } else {
                showMessager(obj.msg, obj.result);
            }
        },
        error: function () {
            //console.log(response);
            showMessager($.i18n.prop("common.upgrade_failure"), "-1");
        }
    });


    
}

$(function () {
    layui.use(function() {
        var upload = layui.upload
        // 渲染
        upload.render({
            elem: '#ID-upload-demo-choose',
            url: '', // 此处配置你自己的上传接口即可
            auto: false,
            accept: "file",
            bindAction: '#ID-upload-demo-action',
            choose: function(res) {
                res.preview((index, file) => {
                    console.log(file);
                    $(".chooseName").css("display", "block")
                    $(".chooseName").text(file.name)
                    chooseFile = file
                })
            }
        });
    })
    // var alinkMsg = new AlinkMsg();
    // var data = alinkMsg.getSystemInfoMsg();
    // parent.mqttPublish(data);
    getAppInfo();

    $("input[name='date']").change(function () {

    });

    $("#dbFile").change(function () {
        $("#tx").html($("#dbFile").val());
    })
});
