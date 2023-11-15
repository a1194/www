function addFileRequest(data) {
    $.ajax({
        url: getCGIPath() + "file.cgi/add",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const r = $.parseJSON(res)
            if(r.result == 0) {
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
    if(!name) {
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
    console.log(data);
    addFileRequest(data)

    
    
}

$(function() {

    
    layui.use(function() {
        const form = layui.form

        // if(getUrlParam("type") == 1) {
        //     $("#file_type").append(
        //         `
        //             <option value="1" selected>目录</option>
        //         `
        //     )
        // }
        // if(getUrlParam("id")) {
        //     $("#parent_id").val(getUrlParam("id"))
        // } else {
        //     $("#parent_id").val(0)
        // }
        $("#parent_id").val(0)
        form.render()
    })
})