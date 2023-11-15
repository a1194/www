
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
        if (obj.method == "addKnxCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

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


function back() {
    window.location = "device.html";
}
function startClick() {
    upload(chooseFile)
}
let chooseFile 
function upload(file) {
    /*
    var device_item_file = $("#dbFile")[0].files[0]; // Getting the properties of file from file field

    if (null == device_item_file) {
        // alert('请输入正确的IP地址');
        $("#dbFile").tips({
            side: 3,
            msg: '请选择文件',
            bg: '#AE81FF',
            time: 3
        });
        $("#dbFile").focus();
        return;
    }

    console.log("file name: " +  device_item_file.name);
    if (device_item_file.name != "eide_config.json") {
        openDialog($.i18n.prop("common.illegal_file.tips"), $.i18n.prop("common.confirm"));
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
                layui.layer.open({
                    type: 1
                    , title: false
                    , closeBtn: false
                    , offset: 'auto'
                    , content: '<div style="padding: 50px; line-height: 16px; background-color: #393D49; color: #fff; font-weight: 300;">添加成功。</div>'
                    , btn: '确定'
                    , area: '300px;'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0
                    , yes: function () {
                        layui.layer.closeAll();
                        parent.location.reload();
                    }
                });
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
            }
        },
        error: function () {
            showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
        }
    });
    */
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
            if (device_item_file.name != "eide_config.json") {
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
    layui.use(function () {
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

    });

    $("#dbFile").change(function () {
        $("#tx").html($("#dbFile").val());
    });

    $('#export').change(function(e) {
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function(ev) {
            try {
                var data = ev.target.result
                var workbook = XLSX.read(data, {
                    type: 'binary'
                }) // 以二进制流方式读取得到整份excel表格对象
                var persons = []; // 存储获取到的数据
            } catch (e) {
                console.log('文件类型不正确');
                return;
            }
            // 表格的表格范围，可用于判断表头是否数量是否正确
            var fromTo = '';
            // 遍历每张表读取
            for (var sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    fromTo = workbook.Sheets[sheet]['!ref'];
                    console.log(fromTo);
                    persons = persons.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
                    //break; // 如果只取第一张表，就取消注释这行
                }
            }
            //在控制台打印出来表格中的数据
            console.log(persons);
            $("#area").val(JSON.stringify(persons));
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    });
});