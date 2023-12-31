//定义双向链表存放浏览历史
var operation_history = new DbList({
        "parent_id": "-1",
        "is_active": false
    }),
    timeOutFn = null,
    is_ctrl_down = false,
    is_shift_down = false,
    focus_index = -1;
/*mode:1->复制  2->剪切
 * id:被复制或剪切的文件或文件夹的id
 * parent_id:被复制文件的上级目录id
 * can_paste:false->不能黏贴 true->能黏贴
 * */
oprate_param = {
    "mode": "",
    "id": "",
    "parent_id": "",
    "can_paste": false
};

function init(parent_id, mode) {
    //初始化导航栏
    navigation(parent_id);
    //将当前页面插入历史记录链表里面
    /*mode
     *0:初始化进入页面
     *1:新建文件夹
     *2:删除文件夹或文件
     *3:刷新当前文件夹
     *4:将当前目录下的文件夹和文件排序
     *5:上传文件
     *6:打开文件夹
     *7:点击后退按钮
     *8:点击前进按钮
     *9:点击主页
     *10:返回上一层目录
     *11:点击地址栏
     *
     */
    if (mode == 0) {
        operation_history.insertLast({
            "parent_id": parent_id,
            "is_active": true
        });
    } else if (mode == 1) {
        //新建文件夹不插入历史记录
    } else if (mode == 2) {
        //删除文件夹或文件不会改变历史记录
    } else if (mode == 3) {
        //刷新当前文件夹不插入历史记录
    } else if (mode == 4) {
        //排序不插入历史记录
    } else if (mode == 5) {
        //上传文件现在会重新进入页面，这个之后改
    } else if (mode == 6) {
        //打开文件夹会删除父目录(也就是当前激活的目录)往后的所有记录，再插入新的子目录记录
        var currNode = find_active_node();
        operation_history.removeAfter(currNode);
        currNode.element.is_active = false;
        operation_history.insertLast({
            "parent_id": parent_id,
            "is_active": true
        });
    } else if (mode == 7) {
        var currNode = find_active_node();
        currNode.element.is_active = false;
        currNode.previous.element.is_active = true;
    } else if (mode == 8) {
        var currNode = find_active_node();
        currNode.element.is_active = false;
        currNode.next.element.is_active = true;
    } else if (mode == 9) {
        //返回主页会删除父目录(也就是当前激活的目录)往后的所有记录，再插入新的子目录(主页)记录
        var currNode = find_active_node();
        operation_history.removeAfter(currNode);
        currNode.element.is_active = false;
        operation_history.insertLast({
            "parent_id": parent_id,
            "is_active": true
        });
    } else if (mode == 10) {
        //返回上级目录会删除父目录(也就是当前激活的目录)往后的所有记录，再插入新的子目录(上级目录)记录
        var currNode = find_active_node();
        operation_history.removeAfter(currNode);
        currNode.element.is_active = false;
        operation_history.insertLast({
            "parent_id": parent_id,
            "is_active": true
        });
    } else if (mode == 11) {
        //点击地址栏仅仅往历史记录里面加一条记录,如果链表里面最后一条记录
        //与将要添加的相同则不添加记录而是把最后一条记录设为激活状态
        var currNode = find_active_node(),
            lastNode = operation_history.findLast();
        currNode.element.is_active = false;
        if (lastNode.element.parent_id == parent_id) {
            lastNode.element.is_active = true;
        } else {
            operation_history.insertLast({
                "parent_id": parent_id,
                "is_active": true
            });
        }
    }
    //载入文件夹
    load();
    //载入信息栏   第一个参数->  1:展示文件夹的记录数   2:展示选中的文件信息  3:展示选中的文件夹数目
    //       第二个参数-> 展示的文件的id
    info(1, 0);    
    //绑定右键菜单
    contextMenu();
    //绑定左键事件
    leftClick();
    //绑定获取焦点事件
    focus();
    //绑定失去焦点事件
    blur();
    //定义文件名更改事件
    change();
    //定义双击事件
    dbclick();
    //定义键盘按键按下事件
    keydown();
    //定义键盘按键弹起事件
    keyup();
    //将元素绑定拖拽方法--还没开发完
    //drag();
}

//在历史记录中找到当前的节点
function find_active_node() {
    var currNode = operation_history.getHead();
    while (currNode.element.is_active != true) {
        currNode = currNode.next;
    }
    return currNode;
}

function contextMenu() {
    contextMenu_folder();
    contextMenu_blank();
    contextMenu_file();
}

function contextMenu_folder() {
    $("#divall li.folder").contextMenu('myMenu2', {
        bindings: {
            'open': function(t) {
                console.log(t);
                //alert("进入这个文件夹");
                var id = $(t).children().attr("data-id");
                init(id, 6);
            },
            'rename': function(t) {
                //重命名
                var folder = $(t).children("input.changename"),
                    folder_name = folder.val(),
                    id = folder.attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0;
                doc_type = $(t).hasClass("folder") ? "" : folder.attr("data-filetype"),
                    parent_id = $("#navigation").val(),
                    params = {
                        "folder_name": folder_name,
                        "id": id,
                        "is_directory": is_directory,
                        "doc_type": doc_type,
                        "parent_id": parent_id,
                        "description": ""
                    };
                K.form.setparams($("#M8610F001"), params);
                K.popup($("#M8610P001"));
            },
            'delete': function(t) {
                //删除文件夹
                var id = $(t).children("input.changename").attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0,
                    params = {
                        "id": id,
                        "is_directory": is_directory
                    };
                dele(params);
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
            }/*,
            'copy': function(t) {
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
            },
            'paste': function(t) {
                var folder = $(t).children("input.changename"),
                    id = folder.attr("data-id");
                if (oprate_param.can_paste != true) {
                    alert("剪切板中无内容!");
                } else {
                    if (oprate_param.parent_id == id) {
                        alert("文件已存在!");
                    } else {
                        //黏贴

                    }
                }
            }*/
        },
        onContextMenu: function(e) {
            var i_index = $(e.target).attr("index"),
                all_focus_index = [];
            $("#divall").find("li").each(function(i) {
                if ($(this).hasClass("focus")) {
                    all_focus_index.push($(this).attr("index"));
                }
            });
            if ($.inArray(i_index, all_focus_index) == -1) {
                $("#divall").find("li").each(function(i) {
                    $(this).removeClass("focus");
                });
                $(e.target).addClass("focus");
            }
            return true;
        }
    });
}

function contextMenu_file() {
    $("#divall li.file").contextMenu('myMenu3', {
        bindings: {
            'rename': function(t) {
                //重命名
                var folder = $(t).children("input.changename"),
                    folder_name = folder.val(),
                    id = folder.attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0,
                    doc_type = $(t).hasClass("folder") ? "" : folder.attr("data-filetype"),
                    parent_id = $("#navigation").val(),
                    params = {
                        "folder_name": folder_name,
                        "id": id,
                        "is_directory": is_directory,
                        "doc_type": doc_type,
                        "parent_id": parent_id,
                        "description": ""
                    };
                K.form.setparams($("#M8610F001"), params);
                K.popup($("#M8610P001"));
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
                //删除单个文件
                var id = $(t).children("input.changename").attr("data-id"),
                    is_directory = $(t).hasClass("folder") ? 1 : 0,
                    params = {
                        "id": id,
                        "is_directory": is_directory
                    };
                dele(params);
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
            }
        },
        onContextMenu: function(e) {
            var i_index = $(e.target).attr("index"),
                all_focus_index = [];
            $("#divall").find("li").each(function(i) {
                if ($(this).hasClass("focus")) {
                    all_focus_index.push($(this).attr("index"));
                }
            });
            if ($.inArray(i_index, all_focus_index) == -1) {
                $("#divall").find("li").each(function(i) {
                    $(this).removeClass("focus");
                });
                $(e.target).addClass("focus");
            }
            return true;
        }
    });
}

function contextMenu_blank() {
    $("#all_folder").contextMenu('myMenu1', {
        bindings: {
            'newfolder': function(t) {
                //获取新文件夹的名称
                var folder_names = [],
                    newfolder_name = "";
                $("#all_folder").find("ul").eq(0).find("li.folder").each(function(index) {
                    folder_names.push($(this).children("input.changename").val());
                });
                for (var i = 0; i < 100; i++) {
                    if (i == 0) {
                        newfolder_name = "新文件夹";
                    } else {
                        newfolder_name = "新文件夹[" + i + "]";
                    }
                    if ($.inArray(newfolder_name, folder_names) == -1) {
                        break;
                    };
                }
                //调用新增文件夹代码
                var params = {
                    "id": $("#navigation").val(),
                    "discription": "",
                    "folder_name": newfolder_name
                };
                var flag = add_folder(params);
                if (flag) {     			
                    init($("#navigation").val(), 1);
                }
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
                init($("#navigation").val(), 3);
            },
            'sort': function(t) {
                init($("#navigation").val(), 4);
            },
            'upload': function(t) {
                //上传文件
                var $M8610F002 = $("#M8610F002");
                K.form.reset($M8610F002);
                K.field.value($('#upload_id'), $("#navigation").val());
                K.popup($("#M8610P002"));
            }
        }
    });
}

//加载文件夹和文件
function load() {
    var parentid = $("#navigation").val(),
    	rows = select("M8610EQ006",{"id":parentid});
    $("#divall").empty();
    if(rows.length > 0){
		var str = "";
		for(var i = 0; i < rows.length; i++){
			if(rows[i].is_directory == "1"){
                str += "<li class='folder' title='" + rows[i].folder_name + "' index='" + i + "'><input type='text' class='changename' value='";
                str += rows[i].folder_name;
                str += "' data-id='" + rows[i].id + "' disabled='disabled' data-last-value='" + rows[i].folder_name + "'/></li>";
            }else if(rows[i].is_directory == "0"){
                var doc_fullname = rows[i].folder_name,
                    doc_name = doc_fullname.substring(0, doc_fullname.lastIndexOf('.')),
                    doc_type = doc_fullname.substring(doc_fullname.lastIndexOf('.') + 1),
                    doc_type_class = $.inArray(doc_type, ["doc", "docx", "xls", "xlsx", "pdf"]) != -1 ? doc_type : "other-filetype";
                str += "<li class='file " + doc_type_class + "' title='" + rows[i].folder_name + "' index='" + i + "'><input type='text' class='changename' value='";
                str += doc_name;
                str += "' data-id='" + rows[i].id + "' data-filetype='" + doc_type + "' disabled='disabled' data-last-value='" + rows[i].folder_name + "'/></li>";
            }
		}
		$("#divall").append(str);
    }
}

function info(mode, id) {
    var str = "";
    if (mode == 1) { //展示目录下的对象数目
        $("#info-bar").empty();
        str += '<div class="folder info-icon"></div>';
        str += '<div class="info-detail"><form class="detail-form"><div class="detail-field detail-field2" ><span><var class="detail-var">';
        str += $("#divall").children("li").length;
        str += '</var>个对象</span></div>';
        str += '</form></div>';
        $("#info-bar").append(str);
    } else if (mode == 2) {
        $("#info-bar").empty();
        var rows = select("M8610EQ008",{"id":id});
        if(rows.length > 0){
        	var row = rows[0],
            	folder_name = row.folder_name,
            	is_directory = row.is_directory,
            	file_type = is_directory == "1" ? "" : folder_name.substring(folder_name.lastIndexOf('.') + 1),
            	file_type_class = file_type == "" ? "folder" : ($.inArray(file_type, ["doc", "docx", "xls", "xlsx", "pdf"]) != -1 ? file_type : "other-filetype"),
            	file_type_info = is_directory == "1" ? "文件夹" : folder_name.substring(folder_name.lastIndexOf('.') + 1) + "文件",
            	crt_username = row.crt_username,
            	upd_username = row.upd_username,
            	crt_date = row.crt_date,
            	crt_time = row.crt_time,
            	upd_date = row.upd_date,
            	upd_time = row.upd_time;
        	str += '<div class="' + file_type_class + ' info-icon"></div><div class="info-detail"><form class="detail-form"><div class="detail-field" ><label>文件名:</label><span>';
        	str += folder_name;
        	str += '</span></div><div class="detail-field" ><label>创建人:</label><span>';
        	str += crt_username != null ? crt_username : '';
        	str += '</span></div><div class="detail-field" ><label>修改人:</label><span>';
        	str += upd_username != null ? upd_username : '';
        	str += '</span></div><div class="detail-field" ><label>文件类型:</label><span>';
        	str += file_type_info;
        	str += '</span></div><div class="detail-field" ><label>创建时间:</label><span>';
        	str += crt_date != "" && crt_date != null ? crt_date.substring(0, 4) + '/' + crt_date.substring(4, 6) + "/" + crt_date.substring(6, 8) : "";
        	str += crt_time != "" && crt_time != null ? "  " + crt_time.substring(0, 2) + ":" + crt_time.substring(2, 4) + ":" + crt_time.substring(4, 6) : "";
        	str += '</span></div><div class="detail-field" ><label>修改时间:</label><span>';
        	str += upd_date != "" && upd_date != null ? upd_date.substring(0, 4) + '/' + upd_date.substring(4, 6) + "/" + upd_date.substring(6, 8) : "";
        	str += upd_time != "" && upd_time != null ? "  " + upd_time.substring(0, 2) + ":" + upd_time.substring(2, 4) + ":" + upd_time.substring(4, 6) : "";
        	str += '</span></div></form></div>';
        	$("#info-bar").append(str);
        }
    } else if (mode == 3) {
        $("#info-bar").empty();
        str += '<div class="folder info-icon"></div>';
        str += '<div class="info-detail"><form class="detail-form"><div class="detail-field detail-field2" ><span>已选中<var class="detail-var">';
        str += $("#divall").children("li.focus").length;
        str += '</var>个对象</span></div>';
        str += '</form></div>';
        $("#info-bar").append(str);
    }
}

function navigation(parent_id) {
    $("#navigation").val(parent_id);
    //查询文件路径
    var id = parent_id,
        flag = true,
        path = [],
        str = "";
    do {
    	var rows = select("M8610EQ005",{"id":id});
    	if(rows.length > 0){
    		var row = rows[0];
    		if(row.parent_id != 0){
    			path.unshift({
                    "folder_name": row.folder_name,
                    "parent_id": id
                });
                id = row.parent_id;
    		}else{
    			flag = false;
                path.unshift({
                    "folder_name": row.folder_name,
                    "parent_id": id
                });
    		}
    	}
    } while (flag);
    $("#folder-navigation").empty();
    for (var i = 0; i < path.length; i++) {
        str += '<a class="foldername" data-id="' + path[i].parent_id + '">' + path[i].folder_name + '</a>';
        if (i != path.length - 1) {
            str += '<img class="triangle" src="images/triangle.png"/>';
        }
    }
    $("#folder-navigation").append(str);
}

function paste(param) {
    Util.ajaxRequest({
        url: "pasteDocManage.json",
        params: param,
        async: false,
        afterSuccess: function(json) {
            alert(3);
            var msg = json.returnmsg;
            var success = json.success;
            if (success == false) {
                if (msg == "windows") {
                    Tools.alert("请检查windows的文档上传路径配置是否正确！");
                }
            }
            if (success == true) {

            }
            return false;
        }
    }, false);
}

function drag() {
    $("#divall li").each(function(i) {
        //$(".item_content .item").each(function(i) {	
        this.init = function() { // 初始化
                this.box = $(this);
                console.log("left: " + this.box.offset().left + " top: " + this.box.offset().top);
                $(this).attr("index", i);
                /*.css({
                				position : "absolute",
                				left : this.box.offset().left,
                				top : this.box.offset().top
                			}).appendTo("#divall")*/
                this.drag();
            },
            this.move = function(callback) { // 移动
                $(this).stop(true).animate({
                    left: this.box.offset().left,
                    top: this.box.offset().top
                }, 500, function() {
                    if (callback) {
                        callback.call(this);
                    }
                });
            },
            this.collisionCheck = function() {
                var currentItem = this;
                var direction = null;
                $(this).siblings(".item").each(function() {
                    if (
                        currentItem.pointer.x > this.box.offset().left &&
                        currentItem.pointer.y > this.box.offset().top &&
                        (currentItem.pointer.x < this.box.offset().left + this.box.width()) &&
                        (currentItem.pointer.y < this.box.offset().top + this.box.height())
                    ) {
                        // 返回对象和方向
                        if (currentItem.box.offset().top < this.box.offset().top) {
                            direction = "down";
                        } else if (currentItem.box.offset().top > this.box.offset().top) {
                            direction = "up";
                        } else {
                            direction = "normal";
                        }
                        this.swap(currentItem, direction);
                    }
                });
            },
            this.swap = function(currentItem, direction) { // 交换位置
                if (this.moveing) return false;
                var directions = {
                    normal: function() {
                        var saveBox = this.box;
                        this.box = currentItem.box;
                        currentItem.box = saveBox;
                        this.move();
                        $(this).attr("index", this.box.index());
                        $(currentItem).attr("index", currentItem.box.index());
                    },
                    down: function() {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = currentItem.box.index();
                        var endIndex = node.box.index();;
                        for (var i = endIndex; i > startIndex; i--) {
                            var prevNode = $(".item_container .item[index=" + (i - 1) + "]")[0];
                            node.box = prevNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = prevNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    },
                    up: function() {
                        // 移到上方
                        var box = this.box;
                        var node = this;
                        var startIndex = node.box.index();
                        var endIndex = currentItem.box.index();;
                        for (var i = startIndex; i < endIndex; i++) {
                            var nextNode = $(".item_container .item[index=" + (i + 1) + "]")[0];
                            node.box = nextNode.box;
                            $(node).attr("index", node.box.index());
                            node.move();
                            node = nextNode;
                        }
                        currentItem.box = box;
                        $(currentItem).attr("index", box.index());
                    }
                };
                directions[direction].call(this);
            },
            this.drag = function() { // 拖拽
                var oldPosition = new Position();
                var oldPointer = new Pointer();
                var isDrag = false;
                var currentItem = null;
                $(this).mousedown(function(e) {
                    e.preventDefault();
                    oldPosition.left = this.box.offset().left;

                    oldPosition.top = this.box.offset().top;
                    console.log("oldleft" + oldPosition.left + "oldtop" + oldPosition.top);
                    oldPointer.x = e.clientX;
                    oldPointer.y = e.clientY;
                    isDrag = true;

                    currentItem = this;

                });
                /*$(document).mousemove(function(e) {
                	var currentPointer = new Pointer(e.clientX, e.clientY) ;
                	if(!isDrag) return false ;
                	$(currentItem).css({
                		"opacity" : "0.8",
                		"z-index" : 999
                	}) ;
                	var left = currentPointer.x - oldPointer.x + oldPosition.left ;
                	var top = currentPointer.y - oldPointer.y + oldPosition.top ;
                	$(currentItem).css({
                		left : left,
                		top : top
                	}) ;
                	currentItem.pointer = currentPointer ;
                	// 开始交换位置
                	
                	//currentItem.collisionCheck() ;
                	
                	
                }) ;
                $(document).mouseup(function() {
                	if(!isDrag) return false ;
                	isDrag = false ;
                	currentItem.move(function() {
                		$(this).css({
                			"opacity" : "1",
                			"z-index" : 0
                		}) ;
                	}) ;
                }) ;*/
            };
        this.init();
    });
}

function leftClick() {
    //点击文件夹
    $("#divall li").click(function(event) {
        var $this = $(this),
            folder_name = $this.children("input.changename"),
            index = $this.attr("index");
        if (is_ctrl_down == true && is_shift_down == false) { //按下ctrl			
            event.stopPropagation();
            focus_index = index;
            $("#divall").find("li").each(function(index) {
                $(this).children("input.changename").attr("disabled", "disabled");
            });
            if ($this.hasClass("focus")) {
                $this.removeClass("focus");
            } else {
                $this.addClass("focus");
            }
            info(3, 0);
        } else if (is_ctrl_down == false && is_shift_down == true) { //按下shift
            event.stopPropagation();
            if (focus_index == -1) {
                focus_index = index;
                $this.addClass("focus");
            } else {
                var index_min = Math.min(index, focus_index),
                    index_max = Math.max(index, focus_index);
                $("#divall").find("li").each(function(i) {
                    var i_index = $(this).attr("index");
                    $(this).removeClass("focus");
                    $(this).children("input.changename").attr("disabled", "disabled");
                    if (i_index >= index_min && i_index <= index_max) {
                        $(this).addClass("focus");
                    }
                });
            }
            info(3, 0);
        } else {
            event.stopPropagation();
            $("#divall").find("li").each(function(index) {
                $(this).removeClass("focus");
                $(this).children("input.changename").attr("disabled", "disabled");
            });
            $this.addClass("focus");
            focus_index = index;
            clearTimeout(timeOutFn);
            timeOutFn = setTimeout(function() {
                folder_name.removeAttr("disabled");
                info(2, folder_name.attr("data-id"));
            }, 300);
        }

    });
    //点击文件名称
    $("#divall li input.changename").click(function(event) {
        if (is_ctrl_down == false) { //没有按下ctrl
            event.stopPropagation();
            console.log("input click");
        }

    });
    //点击空白的地方
    $("#all_folder").click(function() {
        console.log("blank click");
        $("#divall").find("li").each(function(index) {
            $(this).removeClass("focus");
            $(this).children("input.changename").attr("disabled", "disabled");
        });
        info(1, 0);
    });
    //点击后退按钮
    $("button.backward").off("click").click(function() {
        console.log("backward click");
        var currNode = find_active_node();
        if (currNode.previous.previous != null) {
            var preNode = currNode.previous,
                parent_id = preNode.element.parent_id;
            init(parent_id, 7);
        }
    });
    //点击前进按钮
    $("button.forward").off("click").click(function() {
        console.log("forward click");
        var currNode = find_active_node();
        if (currNode.next != null) {
            var nextNode = currNode.next,
                parent_id = nextNode.element.parent_id;
            init(parent_id, 8);
        }
    });
    //点击主页按钮
    $("button.home").off("click").click(function() {
        console.log("home click");
        if ($("#navigation").val() != 1) {
            init(1, 9);
        }
    });
    //点击返回上级目录
    $("button.gotopre").off("click").click(function() {
        console.log("gotopre click");
        if ($("#navigation").val() != 1) {
            //查询上级目录的parent_id
        	var rows = select("M8610EQ005",{"id": $("#navigation").val()});
        	if(rows.length > 0){
        		var parent_id = rows[0].parent_id;
                if (parent_id != 0) {
                    init(parent_id, 10);
                }
        	}
        }
    });
    //点击地址栏地址
    $("a.foldername").off("click").click(function() {
        var parent_id = $(this).attr("data-id");
        if ($("#navigation").val() != parent_id) {
            init(parent_id, 11);
        }
    });
}

function focus() {
    $("#divall li input.changename").focus(function() {
        console.log("input focus");
    });

    $("#divall li").focus(function() {
        console.log("li focus");
    });
}

function blur() {
    $("#divall li").blur(function() {
        console.log("li blur");
    });

    $("#divall li input.changename").blur(function() {
        console.log("input blur");
        $(this).attr("disabled", "disabled");
    });

}

function change() {
    $("#divall li input.changename").change(function() {
        console.log("input change");
        var folder = $(this).parent("li"),
            data_last_value = $(this).attr("data-last-value"),
            folder_name = $(this).val(),
            id = $(this).attr("data-id"),
            is_directory = folder.hasClass("folder") ? 1 : 0,
            doc_type = folder.hasClass("folder") ? "" : $(this).attr("data-filetype"),
            parent_id = $("#navigation").val(),
            params = {
                "folder_name": folder_name,
                "id": id,
                "is_directory": is_directory,
                "doc_type": doc_type,
                "parent_id": parent_id,
                "description": ""
            };
        if (update_folder_name(params)) {
            $(this).attr("data-last-value", folder_name);
            info(2, $(this).attr("data-id"));
        } else {
            $(this).val(data_last_value);
        }
    });
}

function dbclick() {
    $("#divall li.folder").dblclick(function() {
        clearTimeout(timeOutFn);
        console.log("li dblclick");
        var folder = $(this).children("input.changename");
        init(folder.attr("data-id"), 6);
    });
}

function keydown() {
    $(document).keydown(function(event) {
        if (event.which == '17') {
            is_ctrl_down = true;
        } else if (event.which == '16') {
            is_shift_down = true;
        }
    });
}

function keyup() {
    $(document).keyup(function(event) {
        if (event.which == '17') {
            is_ctrl_down = false;
        } else if (event.which == '16') {
            is_shift_down = false;
        }
    });
}

//新增目录
var add_folder = function(params) {
    var flag = false;
    if (!testFolderName(params.folder_name)) {
        Tools.alert("文件夹名不能包括\\\/:*?\"<>|等特殊符号");
        return flag;
    }
    if (judgeDocExist(params.id, params.folder_name)) {
        Tools.alert("该目录已存在，不能添加");
        return flag;
    }
    var param = {
        description: params.description,
        folder_name: params.folder_name,
        is_directory: 1,
        parent_id: params.id,
        port_level: 1,
        username: "semitree",
        date: new Date().Format("yyyyMMdd"),
        time: new Date().Format("hhmmss")
    };
    insert("M8610ES001",param);
    return true;
};


//修改文件名称
var update_folder_name = function(params) {
    var folder_name = "",
        flag = false;
    if (params.is_directory == 1) {
        folder_name = params.folder_name;
    } else {
        folder_name = params.folder_name + '.' + params.doc_type;
    }
    if (!testFolderName(params.folder_name)) {
        Tools.alert("文件名不能包括\\\/:*?\"<>|等特殊符号");
        return flag;
    }
    if (judgeDocUpdate(params.id, folder_name)) {
        Tools.alert("该目录/文档已存在，请重新输入!");
        return flag;
    }
    var current_date = new Date(),
    	date = current_date.Format("yyyyMMdd"),
    	time = current_date.Format("hhmmss");
    update("M8610EU001",{"description":params.description,
    					"folder_name":params.folder_name,
    					"username":"semitree",
    					"date":date,
    					"time":time,
    					"id":params.id
    					});    
    flag = true;
   // K.popup.close($("#M8610P001"));
    //修改文件名
    $("#divall").find("input[data-id=" + params.id + "]").val(params.folder_name);
    return flag;
};

//上传文档
var uploadFile = function(params) {
    var $need_appendix = $('#M8610F002').find('input[name=need_appendix]'),
    	fileList = $need_appendix.get(0).files,
    	fileNameWithSuffixList = [],
    	fileNameList = [];
    		
    $.each(fileList,function(index,file){
    	var name = file.name;
    	fileNameWithSuffixList.push(name);
    	fileNameList.push(name.substring(0, name.lastIndexOf('.')));
    });
    if(fileNameWithSuffixList.length == 0){
    	$.pt({
    		target: $need_appendix,
    		position: 'r',
    		align: 't',
    		width: 'auto',
    		height: 'auto',
    		content:"请先选择文件"
    	});
    	return;
    }else{
    	$.each(fileNameList,function(index,fileName){
    		//文件名真实长度不能超过100
            var blen = 0;
            for (var i = 0; i < fileName.length; i++) {
                if ((fileName.charCodeAt(i) & 0xff00) != 0) {
                    blen++;
                }
                blen++;
            }
            if (blen > 100) {
            	$.pt({
            		target: $need_appendix,
            		position: 'r',
            		align: 't',
            		width: 'auto',
            		height: 'auto',
            		content:"文件名过长!(支持50个中文或100个英文)"
            	});
            	console.log("文件名过长!(支持50个中文或100个英文)");
                return false;
            }
    	});
    	$.each(fileNameWithSuffixList,function(index,docName){
    		var param = {
    				description: "",
    		        folder_name: docName,
    		        is_directory: 0,
    		        parent_id: params.id,
    		        port_level: 1,
    		        username: "semitree",
    		        date: new Date().Format("yyyyMMdd"),
    		        time: new Date().Format("hhmmss")
    		};
    		insert("M8610ES001",param);
    	});
    }
    init($("#navigation").val(), 1);
    K.popup.close($("#M8610P002"));
    return true;
};

var dele = function(params) {
    //查询该目录下是否存在子目录/文档
	var rows = select("M8610EQ004",{"id":params.id}),
		desc = rows.length > 0 ? "删除整个文件夹(包含所有子目录和子文档)?" : "确认删除?";
	Tools.confirm(desc, function(ok) {
        if (ok) {
            deleteDoc(params);
            init($("#navigation").val(), 2);
        }
    });
};

//删除文档或目录
var deleteDoc = function(params) {
	var is_directory = params.is_directory,
		id = params.id;
	if(is_directory == 0){//删除单个文件
		del("M8610ED001",{"id":id});
	}else{//删除文件夹
		//递归删除文件夹下所有的子文件和文件夹
		var rows = select("M8610EQ006",{"id":id});
		if(rows.length > 0){
			for(var i = 0; i < rows.length; i++){
				deleteDoc(rows[i]);
			}			
		}
		del("M8610ED001",{"id":id});
	}	
};

//打包下载文件夹或文件
var download = function(params) {
    var $M8610F003 = $("#M8610F003");
    K.form.reset($M8610F003);
    K.field.value($('#_id'), params.id);
    K.field.value($('#p_id'), params.parent_id);
    K.field.value($('#f_name'), params.folder_name);
    K.field.value($('#i_directory'), params.is_directory);
    if (params.is_directory == 1) {
        Tools.confirm("是否打包下载整个文件夹?(可能需要较长时间，请耐心等待)", function(ok) {
            if (ok) {
                //判断所下载的目录是否为空
                Util.ajaxRequest({
                    url: "directoryIsNull.json",
                    params: params,
                    async: false,
                    afterSuccess: function(json) {
                        var msg = json.returnmsg;
                        if (msg == "目录为空") {
                            Tools.alert("请不要下载空目录");
                        }
                        if (msg == "目录不为空") {
                            K.submit($('#M8610F003'), null, true);
                        }
                        return false;
                    }
                }, false);
            }
        });
    } else {
        K.submit($('#M8610F003'), null, true);
    }
};

var testFolderName = function(folderName) {
    var reg = new RegExp('^[^\\\\\\/:*?\\"<>|]+$');
    return reg.test(folderName);
};

//同一父目录下不能有同名目录或同名文档
function judgeDocUpdate(id, name) {
    var pd = false;
    /*var rows = select("M8610EQ002",{"id":id,"folder_name":name});
    if(rows.length > 0){
    	if (rows[0].count > 0) {
            pd = true;
        } else {
            pd = false;
        }
    }*/
    return pd;
};

//新增目录、上传文档时校验同目录下是否有同名目录/文档
function judgeDocExist(id, folder_name) {
    var pd = false;
    /*var rows = select("M8610EQ003",{"id":id,"folder_name":folder_name});
    if(rows.length > 0){
    	if (rows[0].count > 0) {
            pd = true;
        } else {
            pd = false;
        }
    }*/
    return pd;
}

//选择文件时动态加载信息框
function select_file(ele){
	var $this = $(ele),
		fileList = $this.get(0).files,
		fileNameList = [],
		fieldsetNameList = [];
	//获取所有选择文件的文件名
	for(var i = 0; i < fileList.length; i++){
		fileNameList.push(fileList[i].name);
	}
	//获取所有已有的图片fieldset名
	$("#M8610F002").children("fieldset.picture-fieldset").each(function(){
		var $this = $(this),
			$legend = $this.children("legend"),
			legend_name = $legend.text();
		fieldsetNameList.push(legend_name);
	});
	for(var index in fieldsetNameList){
		if($.inArray(fieldsetNameList[index],fileNameList) == -1){
			$("#M8610F002").find("legend.picture-legend:contains("+fieldsetNameList[index]+")").parent().remove();
		}
	}
	var first = true;
	$.each(fileNameList,function(index,fileName){		
		if($.inArray(fileName,fieldsetNameList) == -1){
			
			//添加一个对应的fieldset
			var html = "",checked = "";
			if(first){
				checked = "checked";
			}
			html += '<fieldset class="single-fieldset picture-fieldset">'+
			'<legend class="picture-legend">'+fileName+'</legend>'+
			'<input class="hide" name="picture_name" value="'+fileName+'">'+
			'<div>'+
				'<label class="my-label">标题:</label>'+
				'<input class="my-input" type="text" name="picture_title" placeholder="请输入图片标题" maxlength="16"/>'+
				'<input type="radio" '+checked+' name="cover" value="'+fileName+'">设为封面'+
			'</div><div>'+
				'<label class="my-textarea-label">描述:</label>'+
				'<textarea class="my-textarea" name="picture_desc" placeholder="请输入图片描述" maxlength="100"></textarea>'+
			'</div></fieldset>';
			$("#M8610F002").append(html);
			textarea_bind();
			first = false;
		}
	});
	//K.init($("#M8610F002"));
}

function textarea_bind(){
	$("#M8610F002").find("textarea").each(function(index){
		$(this).unbind('input').bind('input',function(){
    		var self =this,
    			maxLength = parseInt($(this).attr("maxlength")),
    			curLength = $(this).val().length,
				span_html = "";
    		span_html += '<span><var class="word">'+(maxLength-curLength)+'</var>/'+maxLength+'</span>';
    		console.log(span_html);
        	$.pt({
        		target: self,
        		position: 'r',
        		align: 't',
        		width: 'auto',
        		height: 'auto',
        		content:span_html
        	});       		
    	});
	});
}

/*
 * 定义拖动类
 */
function Pointer(x, y) {
    this.x = x;
    this.y = y;
}

function Position(left, top) {
    this.left = left;
    this.top = top;
}