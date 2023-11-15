function addFileRequest(data) {
    console.log(333333);
    $.ajax({
        url: getCGIPath() + "file.cgi/add",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const r = $.parseJSON(res)
            if (r.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), r.result)
                closeWin(parent);
                parent.reload()
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), r.result);
            }

        },
        error: function (err) {
            showMessager($.i18n.prop("common.operate_failure.tips"), err.result);
        }
    });
}

//添加文件
function addFile() {
    const name = String($("#file_name").val())
    const parent_id = parseInt($("#parent_id").val())
    const file_type = parseInt($("#file_type").val())
    const path = String($("#path").val())
    if (!name) {
        $("#file_name").tips({
            side: 3,
            msg: $.i18n.prop("common.content_empty"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }
    console.log(name, parent_id, file_type, path);
    const d = {
        name,
        parent_id,
        file_type,
        path: "/"
    }
    const data = JSON.stringify(d)
    addFileRequest(data)



}

$(function () {
    const path = getUrlParam("path")
    console.log(path);
    layui.use(function () {
        var upload = layui.upload;
        var element = layui.element;
        var $ = layui.$;
        // 制作多文件上传表格
        var uploadListIns = upload.render({
            elem: '#ID-upload-demo-files',
            elemList: $('#ID-upload-demo-files-list'), // 列表元素对象
            url: getCGIPath() + "upload.cgi", // 此处用的是第三方的 http 请求演示，实际使用时改成您自己的上传接口即可。
            accept: 'file',
            multiple: true,
            number: 20,
            auto: false,
            data: {
                path
            },
            bindAction: '#ID-upload-demo-files-action',
            choose: function (obj) {
                console.log(obj);
                var that = this;
                var files = this.files = obj.pushFile(); // 将每次选择的文件追加到文件队列
                // 读取本地文件
                obj.preview(function (index, file, result) {
                    var tr = $(['<tr id="upload-' + index + '">',
                    '<td>' + file.name + '</td>',
                    '<td>' + (file.size / 1024).toFixed(1) + 'kb</td>',
                    '<td><div class="layui-progress" lay-filter="progress-demo-' + index + '"><div class="layui-progress-bar" lay-percent=""></div></div></td>',
                        '<td>',
                        `<button class="layui-btn layui-btn-xs demo-reload layui-hide">${$.i18n.prop("file.re_upload")}</button>`,
                        `<button class="layui-btn layui-btn-xs layui-btn-danger demo-delete">${$.i18n.prop("common.delete")}</button>`,
                        '</td>',
                        '</tr>'].join(''));

                    // 单个重传
                    tr.find('.demo-reload').on('click', function () {
                        obj.upload(index, file);
                    });

                    // 删除
                    tr.find('.demo-delete').on('click', function () {
                        delete files[index]; // 删除对应的文件
                        tr.remove(); // 删除表格行
                        // 清空 input file 值，以免删除后出现同名文件不可选
                        uploadListIns.config.elem.next()[0].value = '';
                    });

                    that.elemList.append(tr);
                    element.render('progress'); // 渲染新加的进度条组件
                });
            },
            done: function (res, index, upload) { // 成功的回调
                console.log(res);
                var that = this;
                // if(res.code == 0){ // 上传成功
                var tr = that.elemList.find('tr#upload-' + index)
                    , tds = tr.children();
                tds.eq(3).html(''); // 清空操作
                delete this.files[index]; // 删除文件队列已经上传成功的文件

                
                
                return;
                //}
                this.error(index, upload);
            },
            allDone: function (obj) { // 多文件上传完毕后的状态回调
                console.log(obj)
                
                closeWin(parent);
                parent.formatPath()
                showMessager($.i18n.prop("common.operate.tips"), 0);
            },
            error: function (index, upload) { // 错误回调
                var that = this;
                var tr = that.elemList.find('tr#upload-' + index);
                var tds = tr.children();
                // 显示重传
                tds.eq(3).find('.demo-reload').removeClass('layui-hide');

                closeWin(parent);
                parent.formatPath()
                showMessager($.i18n.prop("common.operate_failure.tips"), -1);
            },
            progress: function (n, elem, e, index) { // 注意：index 参数为 layui 2.6.6 新增
                element.progress('progress-demo-' + index, n + '%'); // 执行进度条。n 即为返回的进度百分比
            }
        });
    })
})