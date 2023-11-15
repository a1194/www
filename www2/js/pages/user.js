var table;




function reLoad() {
    getUsers();
}

function getUsers() {
    //表单提交
    var jsonstr = "{}";
    $.ajax({
        url: getCGIPath() + "user.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //$("#form-sysinfo").setform($.parseJSON(data));
            //formatDateTime();
            table.reload('user-table', {
                data: $.parseJSON(data)
            });
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function delUser(user_id) {


    //表单提交
    var jsonstr = '{"user_id":' + user_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "user.cgi/del",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.result);
            }
            getUsers();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });


    
}

function getUserType(type) {
    if (type == 1)
        return $.i18n.prop("common.root");
    else if (type == 2)
        return $.i18n.prop("common.admin");
    else
        return $.i18n.prop("common.tester");
}

//JS
$(function () {
    getUsers();

    layui.use('table', function () {
        table = layui.table
        layui.jquery(".ctUser").text($.i18n.prop('common.add_new'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        layui.jquery(".reset_password").text($.i18n.prop('user.reset_password'))

        var obj = {
            elem: '#user-table'
            //,url:'data.json'
            , toolbar: '#user-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: [{
                title: $.i18n.prop("common.filter_column")
                , layEvent: "LAYTABLE_COLS"
                , icon: 'layui-icon-cols'
            }, {
                title: $.i18n.prop("common.export")
                , layEvent: 'exportFile'
                , icon: 'layui-icon-export'
            }, {
                title: $.i18n.prop("common.print")
                , layEvent: 'LAYTABLE_PRINT'
                , icon: 'layui-icon-print'
            }, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'user_id', title: "id", width: 120, fixed: 'left', unresize: true, user: true}
                , {field: 'name', title: $.i18n.prop("user.nickname"), width: 200}
                , {field: 'account', title: $.i18n.prop("user.username"), width: 200}
                , {field: 'type', title: $.i18n.prop("user.user_type"), width: 200, templet: function (d) {
                        return getUserType(d.type);
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#user-shortcut', width: 300}
            ]]
            , page: {
                prev: $.i18n.prop("common.prev"),
                next: $.i18n.prop("common.next"),
                layout: ['prev','page','next'],
                
            }
            , data: []
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                table.on("toolbar(user-table)", function(obj) {
                    var checkStatus = table.checkStatus(obj.config.id);  
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop("user.add_user"), 'user_add.html');
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;

                        case 'refresh':
                            getUsers();
                            break;
                        case 'exportFile':
                            table.exportFile("user-table", listData, 'xls')
                            break;
                    }

                })
            }
            , text: {
                none: $.i18n.prop("common.no_data")
            }
           
        }
        table.render(obj); 

        //监听行工具事件
        table.on('tool(user-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                openWin($.i18n.prop("user.change_user"), "user_edit.html?user_id=" + data.user_id);
            } else if (obj.event === 'resetPassword') {
                openWin($.i18n.prop("user.reset_password"), "user_reset_password.html?user_id=" + data.user_id);
            }  else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("user.delete_user.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delUser(data.user_id);
                    layer.close(index);
                });
            } 
        });

        $("[data-type]").each(() => {
            console.log($(this));
        })
        
    });


});