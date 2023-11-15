var dropdown



function addPicture() {
    const d = {
        name: "目录3",
        parent_id: 0,
        file_type: 1,
        path: "/"
    }
    const data = JSON.stringify(d)
    $.ajax({
        url: getCGIPath() + "file.cgi/add",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (data) {
            console.log($.parseJSON(data));
            getFile()
            dropdown.reload()
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function deleteFile() {
    const d = {
        file_id: 3
    }
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "file.cgi/del",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (data) {
            console.log($.parseJSON(data));
            getFile()
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

//点击目录
function dirClick(id) {
    console.log(id);
}

//创建目录
function addDir() {
    openWin("创建目录", `file_add_dir.html`);
}

function reload() {
    $(window.frames.frameElement).attr('src', $(window.frames.frameElement).attr('src'))
}

function handleChange() {
    document.getElementById('file-iframe').src= 'file_other.html?id=1'
}

// 添加文件
function addFile() {
    openWin("新增", `file_add.html`);
}
$(function() {
    // deleteFile()
    //获取目录
    getFile(1).then(res => {
        createDir(res)
        // console.log(res);
    })     
    layui.use(function(){
        dropdown = layui.dropdown;
        var layer = layui.layer;
        var util = layui.util;
        var upload = layui.upload;
        // 菜单点击事件
        dropdown.on('click(demo-menu)', function(options){
            console.log(this, options);
            
            // 显示 - 仅用于演示
            // layer.msg(util.escape(JSON.stringify(options)));
        });

    });
   
   
    // console.log(getRootPath());
    // console.log(getCGIPath());
})