
jQuery.download = function (url, method, filedir) {
    jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' +  // action请求路径及推送方法
        '<input type="text" name="filePath" value="' + filedir + '"/>' + // 文件路径
        '</form>')
        .appendTo('body').submit().remove();
    //var newTab = window.open('about:blank')
    //newTab.location.href = url;
};

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
       
    }
}

function doFflush(stream) {
    sendMsgToHost("fflush", {
        "stream": stream
    });
}

function download() {
    //表单提交
    // var jsonstr = '{"fileName":"alinkboot.db"}';
    // console.log('jsonstr: ' + jsonstr);
    // $.ajax({
    //     url: getCGIPath() + "download.cgi",
    //     contentType: "application/json",
    //     data: jsonstr,
    //     type: "POST",
    //     success: function (data) {
    //         $.download('/FileExport/DownLoadFile', 'post', data.value);
    //         //$("#form-sysinfo").setform($.parseJSON(data));
    //         //formatDateTime();
    //     },
    //     error: function () {
    //         showMessager("获取数据失败", "-1");
    //     }
    // });
    var newTab = window.open('about:blank');
    newTab.location.href = getCGIPath() + "download.cgi";
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

function notifyDbRestoreCb(result) {
    sendMsgToClients("dbRestoreCb", {
        "result": parseInt(result)
    })
}
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

    console.log("file name: " +  device_item_file.name);
    //if (!device_item_file.name.endsWith(".db")) {
    if (device_item_file.name != "alinkboot.db") {
        openDialog($.i18n.prop("common.restore_failure.tips"), $.i18n.prop("common.confirm"));
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
            console.log("ret: " + data);
            var obj = $.parseJSON(data);
            if (obj.result == 0) {
                notifyDbRestoreCb(0)
                layui.layer.open({
                    type: 1
                    , title: false
                    , closeBtn: false
                    , offset: 'auto'
                    , content: '<div style="padding: 50px; line-height: 16px; background-color: #393D49; color: #fff; font-weight: 300;">' + $.i18n.prop("backup.restore.tips") + '</div>'
                    , btn: $.i18n.prop("common.confirm")
                    , area: '300px;'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0
                    , yes: function () {
                        layui.layer.closeAll();
                        parent.location.reload();
                    }
                });

            } else {
                showMessager(obj.msg, obj.result);
            }
            
        },
        error: function () {
            //console.log(response);
            showMessager($.i18n.prop("common.reset_failure.tips"), "-1");
        }
    });

    
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

    $('#download').click(function(){
        //download();
        location.href="/cgi-bin/download.cgi";
    });

    
});