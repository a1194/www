const files = []
let path = ['']
let treePath = []
let loadIndex
let isRenameOpen = false

//记录按键是否按下
let is_ctrl_down = false
let is_shift_down = false

//ctrl和shift按下
function keydown() {
    $(document).keydown(function(event) {
        if (event.which == '17') {
            is_ctrl_down = true;
        } else if (event.which == '16') {
            is_shift_down = true;
        }
    });
}
//ctrl和shift抬起
function keyup() {
    $(document).keyup(function(event) {
        if (event.which == '17') {
            is_ctrl_down = false;
        } else if (event.which == '16') {
            is_shift_down = false;
        }
    });
}

//获取文件
function getFiles(d = {}, isTree = false) {
    loadIndex = layer.load(0)
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "file.cgi/getFiles",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const data = $.parseJSON(res)
            console.log(data);
            if(!isTree) {
                load(data)
            } else {
                loadTree(data)
            }
        },
        error: function (err) {
            const data = $.parseJSON(err)
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

//删除文件
function deleteFile(d) {
    const data = JSON.stringify(d)
    console.log(data);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: getCGIPath() + "file.cgi/del",
            contentType: "application/json",
            type: "POST",
            data,
            success: function (res) {
                const data = $.parseJSON(res)
                console.log(data);
                if(data.result == 0) {
                    resolve()
                } else {
                    reject()
                }
            },
            error: function (err) {
                reject()
            }
        });
    }) 
}

//文件重命名
function reName(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "file.cgi/uname",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const data = $.parseJSON(res)
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
                formatPath()
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            const data = $.parseJSON(err)
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

//新增文件夹
function addFolder(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "file.cgi/add",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const data = $.parseJSON(res)
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
                formatPath()
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            const data = $.parseJSON(err)
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

//移动文件
function moveFild(d) {
    const data = JSON.stringify(d)
    console.log(data);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: getCGIPath() + "file.cgi/move",
            contentType: "application/json",
            type: "POST",
            data,
            success: function (res) {
                const data = $.parseJSON(res)
                console.log(data);
                if(data.result == 0) {
                    resolve()
                } else {
                    reject()
                }
                
            },
            error: function (err) {
                reject()
            }
        });
    })
    
}

//下载
function download(d) {
    // const data = JSON.stringify(d)
    // console.log(data);
    $.ajax({
        url: getCGIPath() + "download.cgi",
        contentType: "multipart/form-data",
        type: "POST",
        success: function (res) {
            console.log(res);
            // const data = $.parseJSON(res)
            // console.log(data);
        },
        error: function (err) {
            console.log(err);
            // const data = $.parseJSON(err)
            // showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

//加载目录和文件
function load(data) {
    layer.close(loadIndex)
    $("#content").empty()
    let tem = ''
    let imagesUrl = []
    data.forEach((item, index) => {
        if(item.type == 4) {
            tem += 
                `
                    <div class="box folder" title="${item.name}">
                        <div class="ablum f"></div>
                        <div id="name"  data-path="${item.name}">${item.name}</div>
                    </div>
                `
        } else if(item.type == 8) {
            tem += 
                `
                    <div class="box file pic" id="pic" title="${item.name}">
                        <div class="ablum bg" data-url="${getRootPath()}/files${formatPath(false)}/${item.name}"></div>
                        <div id="name" data-path="${item.name}">${item.name}</div>
                    </div>
                `
            imagesUrl.push(`${getRootPath()}/files${formatPath(false)}/${item.name}`)
        }
        
    })
    $("#content").append(tem)
    console.log(imagesUrl);
    // <img src="${getRootPath()}/${path.join("/")}/${item.name}" alt="">
    $(".ablum.bg").each(function(index) {
        console.log(imagesUrl[index])
        $(this).css("background-image", `url('${imagesUrl[index]}')`)
    })

    //单击事件
    leftClick()
    //双击事件
    dbClick()
    //设置面包屑
    setBreadcrumb()
    //绑定右键事件
    contextMenu()
}

//右键移动时加载数据
function loadTree(data) {
    layer.close(loadIndex)
    console.log(data);
    $("#showTree").empty()
    let tem = 
        `
            <div class="treeItem" id="treeBack">
                <div class="treeImage">
                    <img src="./images/fold_ablum.png" alt="" srcset="">
                </div>
                <div class="treeName">..</div>
            </div>
        `
    data.forEach((item, index) => {
        if(item.type == 4) {
            tem += 
                `
                    <div class="treeItem treeFolder" data-name="${item.name}">
                        <div class="treeImage">
                            <img src="./images/fold_ablum.png" alt="" srcset="">
                        </div>
                        <div class="treeName">${item.name}</div>
                    </div>
                `
        }
    })
    $("#showTree").append(tem)

    //单击事件
    $(".treeItem").click(function() {
        $(".treeItem").each(function() {
            $(this).removeClass("focus")
        })
        $(this).addClass("focus")
    })

    //双击事件
    $(".treeItem.treeFolder").dblclick(function() {
        const path = $(this).attr("data-name")
        if(path) treePath.push(path)
        let p = ""
        treePath.forEach(item => {
            p += "/" + item
        })
        console.log(p, treePath);
        getFiles({
            path: p
        }, true)
    })
    $("#treeBack").dblclick(function() {
        if(!treePath.length) return
        treePath.pop()
        console.log(treePath);
        let p = ""
        treePath.forEach(item => {
            p += "/" + item
        })
        console.log(p);
        getFiles({
            path: p
        }, true)
    })
}



//格式化路径并重新加载文件
function formatPath(flag = true) {
    let bar = ''
    path.forEach((item, index) => {
        if(index != 0) {
            bar += '/' + item
        }
    })
    if(flag) {
        getFiles({path: bar})
    } else {
        return bar
    }
}

//单击事件
function leftClick() {
    $("#content .box").click(function(event) {
        event.stopPropagation()
        if(is_ctrl_down && !is_shift_down) {
            if($(this).hasClass("focus")) {
                $(this).removeClass("focus")
            } else {
                $(this).addClass("focus")
            }
        } else{
            $("#content .box").each(function() {
                if($(this).hasClass("focus")) {
                    $(this).removeClass("focus")
                }
            })
            $(this).addClass("focus")
        }
    })
    $("#file-content").click(function() {
        $("#content .box").each(function() {
            if($(this).hasClass("focus")) {
                $(this).removeClass("focus")
            }
        })
    })
}

//双击事件
function dbClick() {
    //获取路径
    $("#content .folder").dblclick(function() {
        const p = $(this).children("#name").attr("data-path")
        path.push(p)
        formatPath()
    })
    $("#content .pic").dblclick(function() {
        let current = $(this).find(".ablum.bg").attr("data-url")
        const data = []
        console.log(current);
        $("#content .pic").each(function(index) {
            // console.log($(this).find("img").attr("src"));
            data.push({
                pid: index,
                src: $(this).find(".ablum.bg").attr("data-url")
            })
            
        })
        const currentIndex = data.findIndex(item => item.src == current)
        layer.photos({
            photos: {
              "title": "Photos",
              "start": currentIndex,
              "data": data
            }
        })
    })
    if(path.length != 1) {
        $("#back").removeClass("layui-btn-disabled")
    }

    
}

//设置面包屑
function setBreadcrumb() {
    $("#breadcrumb").empty()
    path.forEach((item, index) => {
        $("#breadcrumb").append(
            `
                <div class="tab" data-path="${item}">
                    <span>${item}</span>
                    <span>/</span>
                </div>
            `
        )
    })

    $(".tab").click(function() {
        const p = $(this).attr("data-path")
        const index = path.findIndex(item => {
            return item == p
        })
        path = path.slice(0, index + 1)
        setBreadcrumb()
        formatPath()
        if(path.length == 1) {
            $("#back").addClass("layui-btn-disabled")
        }
    })
}

// 后退
function handleBack() {
    if(path.length == 1) return

    path = path.slice(0, -1)
    console.log(path);
    setBreadcrumb()
    formatPath()
    if(path.length == 1) {
        $("#back").addClass("layui-btn-disabled")
    }
}


//添加文件
function handleAdd() {
    openWin("新增", `file_add.html?path=${formatPath(false)}`);
}

//绑定右键事件
function contextMenu() {
    contextMenu_blank();
    contextMenu_folder();
    contextMenu_file();
}


function contextMenu_blank() {
    $("#file-content").contextMenu('myMenu1', {
        bindings: {
            'newfolder': function(t) {
                //新建文件夹
                const path = formatPath(false)
                layer.prompt({title: $.i18n.prop("file.new_folder")}, function(value, index, elem){
                    if(value === '') return elem.focus();
                    console.log({
                        path: path,
                        name: value,
                        type: 4
                    });
                    addFolder({
                        path,
                        name: value,
                        type: 4
                    })
                    // 关闭 prompt
                    layer.close(index);
                });
            },
            /*'paste': function(t) {
                //黏贴
                var parent_id = $("#navigation").val();
                if (oprate_param.can_paste != true) {
                    Tools.alert("无黏贴内容");
                } else {
                    if (oprate_param.parent_id == parent_id) {
                        Tools.alert("文件已存在!");
                        paste(oprate_param);
                    } else {
                        Tools.alert("正在黏贴");
                        paste(oprate_param);
                    }
                }
                //oprate_param.can_paste = false;
                //init($("#navigation").val(),3);				
            },*/
            'flush': function(t) {
                //刷新
                formatPath()
            },
            'sort': function(t) {
                init($("#navigation").val(), 4);
            },
            'selectAll': function(t) {
                //全选
                $("#content .box").each(function() {
                    if(!$(this).hasClass("focus")) {
                        $(this).addClass("focus")
                    }
                })
            }
        }
    });
}


function contextMenu_folder() {
    $(".folder").contextMenu('myMenu2', {
        bindings: {
            'open': function(t) {
                console.log(t);
                alert("进入这个文件夹");
                var id = $(t).children().attr("data-id");
                init(id, 6);
            },
            'rename': function(t) {
                isRenameOpen = true
                //重命名
                const name = $(t).attr("title")
                const path = formatPath(false)
                console.log(name, name);
                layer.prompt({
                    title: $.i18n.prop("file.rename"),
                    value: name,
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")],
                }, function reNameFn(value, index, elem){
                    if(value === '') return elem.focus();
                    console.log(value);
                    reName({
                        path,
                        name,
                        new_name: value
                    })
                    // 关闭 prompt
                    layer.close(index);
                });
            },
            'delete': function(t) {
                //删除文件夹
                const name = $(t).attr("title")
                const path = formatPath(false)
                console.log(name, path);
                layer.confirm($.i18n.prop("area.delete.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                },function (index) {
                    const promiseArr = []
                    $("#content .box.focus").each(function() {
                        promiseArr.push(deleteFile({
                            name: $(this).attr("title"),
                            path
                        }))
                    })
                    Promise.all(promiseArr).then(res => {
                        showMessager($.i18n.prop("common.operate.tips"), 0);
                        formatPath()
                    }).catch(err => {
                        showMessager($.i18n.prop("common.operate_failure.tips"), -1);
                    })
                    layer.close(index);
                });
            },
            'download': function(t) {
                //将文件夹打包下载
                var folder = $(t).children("input.changename"),
                    id = folder.attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0,
                    folder_name = folder.val(),
                    parent_id = $("#navigation").val(),
                    params = {
                        "id": id,
                        "is_directory": is_directory,
                        "folder_name": folder_name,
                        "parent_id": parent_id
                    };
                //download(params);
                Tools.alert("下载成功!");
            },
            'move': function(t) {
                $("#showTree").css("display", "block")
                const p = formatPath(false)
                
                const lastPath = $("#showTree .treeFolder.focus").attr("data-name")
                if(lastPath) newPath += '/' + lastPath
                layer.open({
                    type: 1,
                    area: ['420px', '240px'], // 宽高
                    content: $('#showTree'),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")],
                    title: $.i18n.prop("file.move"),
                    btn1: function(index, layero, that){
                        let newPath = ''
                        treePath.forEach(item => {
                            newPath += '/' + item
                        })
                        const promiseArr = []
                        $(".box.focus").each(function() {
                            const name = $(this).attr("title");
                            console.log(p, name, newPath);
                            promiseArr.push(moveFild({
                                path: p,
                                name,
                                new_path: newPath
                            }))
                        })
                        Promise.all(promiseArr).then(res => {
                            showMessager($.i18n.prop("common.operate.tips"), 0);
                            formatPath()
                        }).catch(err => {
                            showMessager($.i18n.prop("common.operate_failure.tips"), -1);
                        })
                        layer.close(index)
                    },
                    btn2: function(index, layero, that){
                        $("#showTree").empty()
                        layer.close(index)
                    },
                    end: function(){
                        $("#showTree").css("display", "none")
                    },
                    success: function() {
                        treePath = []
                        getFiles({
                            path: "/"
                        }, true)
                    }
                });
            }
        },
        onContextMenu: function(e) {
            if($(".box.focus").length <= 1) {
                $(".box").each(function() {
                    $(this).removeClass("focus")
                })
            }
            $(e.target).parent().addClass("focus")
            
            // console.log(e);
            // var i_index = $(e.target).attr("index"),
            //     all_focus_index = [];
            // $("#divall").find("li").each(function(i) {
            //     if ($(this).hasClass("focus")) {
            //         all_focus_index.push($(this).attr("index"));
            //     }
            // });
            // if ($.inArray(i_index, all_focus_index) == -1) {
            //     $("#divall").find("li").each(function(i) {
            //         $(this).removeClass("focus");
            //     });
            //     $(e.target).addClass("focus");
            // }
            return true;
        }
    });
}

function contextMenu_file() {
    $(".file").contextMenu('myMenu3', {
        bindings: {
            'rename': function(t) {
                const name = $(t).attr("title")
                const v = name.substring(0, name.lastIndexOf("."))
                console.log(name, v);
                const path = formatPath(false)
                //重命名
                layer.prompt({
                    title: $.i18n.prop("file.rename"),
                    value: v,
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function(value, index, elem){
                    if(value === '') return elem.focus();
                    console.log(value);
                    reName({
                        path,
                        name,
                        new_name: value
                    })
                    // deleteFile({name: $(t).attr("title")})
                    // 关闭 prompt
                    layer.close(index);
                });
            },
            /*'copy': function(t) {
                //复制
                var focus_id = [];
                $("#divall").find("li").each(function(i) {
                    if ($(this).hasClass("focus")) {
                        focus_id.push($(this).children("input.changename").attr("data-id"));
                    }
                });
                oprate_param.mode = 1;
                oprate_param.id = focus_id;
                oprate_param.parent_id = $("#navigation").val();
                oprate_param.can_paste = true;
                alert("copy了：" + focus_id);
            },
            'cut': function(t) {
                //剪切
                var focus_id = [];
                $("#divall").find("li").each(function(i) {
                    if ($(this).hasClass("focus")) {
                        focus_id.push($(this).children("input.changename").attr("data-id"));
                    }
                });
                oprate_param.mode = 2;
                oprate_param.id = focus_id;
                oprate_param.parent_id = $("#navigation").val();
                oprate_param.can_paste = true;
                alert("cut了：" + focus_id);
            },*/
            'delete': function(t) {
                //删除文件
                const name = $(t).attr("title")
                const path = formatPath(false)
                console.log(name, path);
                layer.confirm($.i18n.prop("area.delete.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                },function (index) {
                    const promiseArr = []
                    $("#content .box.focus").each(function() {
                        promiseArr.push(deleteFile({
                            name: String($(this).attr("title")),
                            path
                        }))
                    })
                    Promise.all(promiseArr).then(res => {
                        showMessager($.i18n.prop("common.operate.tips"), 0);
                        formatPath()
                    }).catch(err => {
                        showMessager($.i18n.prop("common.operate_failure.tips"), -1);
                    })
                    layer.close(index);
                });
            },
            'download': function(t) {
                //下载单个文件
                var folder = $(t).children("input.changename"),
                    id = folder.attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0,
                    folder_name = folder.val() + "." + folder.attr("data-filetype"),
                    parent_id = $("#navigation").val(),
                    params = {
                        "id": id,
                        "is_directory": is_directory,
                        "folder_name": folder_name,
                        "parent_id": parent_id
                    };
                //download(params);
                Tools.alert("下载成功!");
            },
            'move': function(t) {
                console.log($(t).attr("title"));
                $("#showTree").css("display", "block")
                const p = formatPath(false)
                layer.open({
                    type: 1,
                    area: ['420px', '240px'], // 宽高
                    content: $('#showTree'),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")],
                    title: $.i18n.prop("file.move"),
                    btn1: function(index, layero, that){
                        console.log(name, p);
                        let newPath = ''
                        treePath.forEach(item => {
                            newPath += '/' + item
                        })
                        const lastPath = $("#showTree .treeFolder.focus").attr("data-name")
                        if(lastPath) newPath += '/' + lastPath
                        const promiseArr = []
                        $(".box.focus").each(function() {
                            const name = $(this).attr("title");
                            console.log(p, name, newPath);
                            promiseArr.push(moveFild({
                                path: p,
                                name,
                                new_path: newPath
                            }))
                        })
                        Promise.all(promiseArr).then(res => {
                            showMessager($.i18n.prop("common.operate.tips"), 0);
                            formatPath()
                        }).catch(err => {
                            showMessager($.i18n.prop("common.operate_failure.tips"), -1);
                        })
                        layer.close(index)
                    },
                    btn2: function(index, layero, that){
                        $("#showTree").empty()
                        layer.close(index)
                    },
                    end: function(){
                        $("#showTree").css("display", "none")
                    },
                    success: function() {
                        treePath = []
                        getFiles({
                            path: "/"
                        }, true)
                    }
                });
            }
        },
        onContextMenu: function(e) {
            if($(".box.focus").length <= 1) {
                $(".box").each(function() {
                    $(this).removeClass("focus")
                })
            }
            $(e.target).parent().addClass("focus")
            
            
            // $(e.target).parent().addClass("focus")
            // var i_index = $(e.target).attr("index"),
            //     all_focus_index = [];
            // $("#divall").find("li").each(function(i) {
            //     if ($(this).hasClass("focus")) {
            //         all_focus_index.push($(this).attr("index"));
            //     }
            // });
            // if ($.inArray(i_index, all_focus_index) == -1) {
            //     $("#divall").find("li").each(function(i) {
            //         $(this).removeClass("focus");
            //     });
            //     $(e.target).addClass("focus");
            // }
            return true;
        }
    });
}



$(function() {
    //获取根目录
    getFiles()
    //监听鼠标按下
    keydown()
    keyup()

    layui.use(function() {
        var layer = layui.layer;
        var util = layui.util;
        tree = layui.tree;

    })
    download()
})

