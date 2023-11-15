
function setIp() {
    layui.layer.open({
        type: 1
        ,
        title: false
        ,
        closeBtn: false
        ,
        offset: 'auto'
        ,
        content: '<div style="padding: 20px 50px 20px 50px; line-height: 24px; background-color: #393D49; color: #fff; font-weight: 300;">设置IP需要使用新的IP重新进入，确定要设置吗？</div>'
        ,
        btn: ['确定', '关闭']
        ,
        area: '300px;'
        ,
        btnAlign: 'c' //按钮居中
        ,
        shade: [0.5, '#fff']
        ,
        yes: function () {
            //表单验证
            var objIp = $("input[name='ip']");
            var ip = objIp.val();
            if ("" == ip || !checkIP(ip)) {
                // alert('请输入正确的IP地址');
                $("#ip").tips({
                    side: 3,
                    msg: '请输入正确的IP地址',
                    bg: '#AE81FF',
                    time: 3
                });
                objIp.focus();
                return;
            }

            //表单提交
            var jsonstr = form2JsonString("form-sysinfo");
            console.log('jsonstr: ' + jsonstr);
            $.ajax({
                url: getCGIPath() + "system.cgi/setSysInfo",
                contentType: "application/json",
                data: jsonstr,
                type: "POST",
                success: function (data) {
                    showMessager("设置成功", "0");
                },
                error: function () {
                    showMessager("操作失败", "-1");
                }
            });
            layui.layer.closeAll();
        }
        ,
        no: function (index, layero) {
            layui.layer.closeAll();
        }
    });
}

function setDhcp() {
    layui.layer.open({
        type: 1
        ,
        title: false
        ,
        closeBtn: false
        ,
        offset: 'auto'
        ,
        content: '<div style="padding: 20px 50px 20px 50px; line-height: 24px; background-color: #393D49; color: #fff; font-weight: 300;">设置DHCP需要使用新的IP重新进入，确定要设置吗？</div>'
        ,
        btn: ['确定', '关闭']
        ,
        area: '300px;'
        ,
        btnAlign: 'c' //按钮居中
        ,
        shade: [0.5, '#fff']
        ,
        yes: function () {
            //表单提交
            $.ajax({
                url: getCGIPath() + "system.cgi/setSysInfo",
                contentType: "application/json",
                data: "{\"dhcp\":1}",
                type: "POST",
                success: function (data) {
                    //alert(data);
                    showMessager("设置成功", "0");
                    //parent.location.reload();
                },
                error: function () {
                    showMessager("操作失败", "-1");
                }
            });
            layui.layer.closeAll();
        }
        ,
        no: function (index, layero) {
            layui.layer.closeAll();
        }
    });
}

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



function getSysInfo() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "system.cgi/getSysInfo",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            const dataObj = $.parseJSON(data)
            console.log(dataObj);
            $("#showTime").val(dataObj.date)
            $("#showVersion").val(dataObj.version)
            
            // $("#form-sysinfo").setform();
            //formatDateTime();

        },
        error: function () {

        }
    });
}
let flag = false
//点击设置时间
function resetInfo() {
    formatTime(new Date())
}


//设置时间请求
function setTime(newTime) {
    var jsonstr = '{"time":"' + newTime + '"}';
    console.log(jsonstr);
    $.ajax({
        url: getCGIPath() + "system.cgi/setLocalTime",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            const parseData = $.parseJSON(data)
            if(parseData.result == 0) {
                $("#showTime").val(newTime)  
                showMessager($.i18n.prop("common.setting.tips"), data.result);
            } else {
                showMessager($.i18n.prop("common.setting_failure.tips"), data.result);
            }

        },
        error: function (err) {
            showMessager($.i18n.prop("common.setting_failure.tips"), err.result);
        }
    });
}

//格式化时间
function formatTime(t) {
    console.log(t);
    const splitArr = String(t).split(" ")
    const newTime = `${splitArr[0]} ${splitArr[1]} ${splitArr[2].replace(/\b(0+)/gi," ")} ${splitArr[4]} ${splitArr[3]}`
    console.log(newTime);
    setTime(newTime)
    // let bar 
    // if(!t) {
    //     bar = new Date()
    // } else {
    //     bar = new Date(t)
    // }
    
    // const year = bar.getFullYear()
    // const month = bar.getMonth() + 1
    // const day = bar.getDate()
    // const time = bar.toLocaleTimeString()

    // const newTime = `${year}-${month}-${day} ${time}`
    // // console.log(formatTime);
    // return newTime


}
// function msgCallback(msg) {
//     var obj = jQuery.parseJSON(msg);
//     switch (obj.cmd) {
//         case 101: {
//             if (obj.payload != null && obj.payload != "") {
//                 var payloadObj = jQuery.parseJSON(obj.payload);
//                 var ip = payloadObj.ip;
//                 var mac = payloadObj.mac;
//                 var version = payloadObj.version;
//             }
//             break;
//         }
//     }
// }

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editLanguageCb") {
            if (obj.payload.result == 0) {
                layui.layer.closeAll();
                showMessager("修改成功", obj.payload.result);
                parent.location.reload();
            } else {
                showMessager("修改失败", obj.payload.result);
            }
        } else if (obj.method == "restoringFactoryCb") {
            if (obj.payload.result == 0) {
                layui.layer.closeAll();
                showMessager("操作成功", obj.payload.result);
                parent.location.reload();
            } else {
                showMessager("操作失败", obj.payload.result);
            }
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

    console.log(device_item_file);

    if (!device_item_file) {
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

    console.log("file name: " +  device_item_file.name);
    if (device_item_file.name != "sys.img") {
        openDialog($.i18n.prop("common.upgrade_failure.tips"), $.i18n.prop("common.confirm"));
        return ;
    }

    //openLoading(5000);

    console.log(device_item_file);
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

function getSetting() {
    //表单提交
    $.ajax({
        url: getCGIPath() + "setting.cgi/getSetting",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            console.log(data);
            var json_obj = $.parseJSON(data);
            $('#language-select').val("" + json_obj.language);
            layui.form.render('select');
            //formatDateTime();
        },
        error: function () {

        }
    });
}

function restoringFactory() {
    layui.layer.confirm($.i18n.prop("common.restoring_factory.tip"), function (index) {
        doRestoringFactory();
        layui.layer.close(index);
    });
}

function editLanguage() {

    var obj = {
        type: 1
        ,
        title: false
        ,
        closeBtn: false
        ,
        offset: 'auto'
        ,
        content: `<div style="padding: 20px 50px 20px 50px; line-height: 24px; background-color: #393D49; color: #fff; font-weight: 300;">${$.i18n.prop("common.save_change")}</div>`
        ,
        btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.close")]
        ,
        area: '300px;'
        ,
        btnAlign: 'c' //按钮居中
        ,
        shade: [0.5, '#fff']
        ,
        yes: function () {
            var objLanguageId = $('#language-select');
            var language = objLanguageId.val();
            if ("" == language) {
                objLanguageId.tips({
                    side: 3,
                    msg: '请选择语言',
                    bg: '#AE81FF',
                    time: 3
                });
                objLanguageId.focus();
                return;
            }
            language = parseInt(language);
            console.log("language: " + language);

            var json_obj = {
                "language": language
            };
            console.log(JSON.stringify(json_obj));
            doEditLanguage(json_obj);
            if (language == 1) {
                sessionStorage.setItem('language', "zh-CN");
            } else if(language == 2) {
                sessionStorage.setItem('language', "en");
            } else if(language == 3) {
                sessionStorage.setItem('language', "ru");
            }
                
            //layui.layer.closeAll();
        }
        ,
        no: function (index, layero) {
            layui.layer.closeAll();
        }
    }
    

    layui.layer.open(obj);
}



$(function () {
    layui.use(function() {
        var upload = layui.upload;

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
    getSysInfo();
    getSetting();
    $("input[name='date']").change(function () {
        alert("文本已被修改");
    });
    
   
     
    console.log(new Date());
});
