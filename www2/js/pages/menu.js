var treeTable

// function reLoad() {
//     getMenus();
// }

function getMenus() {
    return new Promise((resolve, reject) => {
        // 表单提交
        var jsonstr = '{}';
        $.ajax({
            url: getCGIPath() + "menu.cgi/getAll",
            contentType: "application/json",
            data: jsonstr,
            type: "POST",
            success: function (data) {
                console.log(data);
                console.log($.parseJSON(data));
                resolve($.parseJSON(data))
                // $("#form-sysinfo").setform($.parseJSON(data));
                // formatDateTime();
                // table.reload('menu-table', {
                //     data: $.parseJSON(data)
                // });
            },
            error: function () {
                showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
            }
        });
    })

    // console.log(getMenusList());
}


//格式化数据
function formatData(res) {
    const parent = res.filter(item => {
        return item.parent_id == 0
    })
    const childrens = res.filter(item => {
        return item.parent_id != 0
    })
    parent.forEach((item, index) => {
        item.isParent = '1'
        try {
            item.name = $.i18n.prop(item.name)
        } catch (error) {
            console.warn(error)
        }
        childrens.forEach(child => {
            if (child.parent_id == item.menu_id) {
                if (!item.children) {
                    item.children = []
                }
                try {
                    child.name = $.i18n.prop(child.name)
                } catch (error) {
                    console.warn(error)
                }
                item.children.push(child)
            }
        })
    })
    return parent
}

//重载数据
function reload() {
    getMenus().then(res => {
        const data = formatData(res)
        console.log(data);
        try {
            treeTable.reloadData("ID-treeTable-demo", {
                data
            })
        } catch (error) {
            console.log(error);
        }
    })

}
//删除菜单
function delMenu(id) {
    //表单提交
    var jsonstr = '{"menu_id":' + id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "menu.cgi/del",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            if (obj.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.result);
            }
            reload()
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}
//JS
$(function () {
    getMenus().then(res => {
        const data = formatData(res)
        layui.use(function () {
            // console.log(layui.jquery(".ctUser").text())
            // layui.jquery(".add").text($.i18n.prop('common.add_new'))
            $(".edit").text($.i18n.prop('common.edit'))
            $(".del").text($.i18n.prop('common.delete'))

            treeTable = layui.treeTable;
            var layer = layui.layer;
            var table = layui.table
            var dropdown = layui.dropdown;
            // 渲染
            var inst = treeTable.render({
                elem: '#ID-treeTable-demo',
                toolbar: `
                <div id="menu-toolbar">
                    <div class="layui-btn-container">
                        <button class="layui-btn layui-btn-sm add" lay-event="goAdd">${$.i18n.prop("common.add_new")}</button>
                    </div>
                </div>
              ` //开启头部工具栏，并为其绑定左侧模板
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
                }, {
                    title: $.i18n.prop("common.refresh")
                    , layEvent: 'refresh'
                    , icon: 'layui-icon-refresh'
                }],
                title: '菜单列表',
                tree: {
                    view: {
                        showIcon: false
                    }
                    , limits: [100, 200]
                    , limit: 100
                    , page: {
                        prev: $.i18n.prop("common.prev"),
                        next: $.i18n.prop("common.next"),
                        layout: ['prev', 'page', 'next'],
                    }
                },
                cols: [[
                    { type: 'checkbox', fixed: 'left' },
                    { field: 'menu_id', title: 'id', width: 130, sort: true, fixed: 'left' },
                    { field: 'name', title: $.i18n.prop("menu.menu_name"), width: 240, fixed: 'left' },
                    { field: 'path', title: $.i18n.prop("menu.path"), width: 250 },
                    {
                        field: 'show', title: $.i18n.prop("menu.show"), width: 120, templet: function (d) {
                            const tem1 =
                                `
                            <span>${$.i18n.prop("common.yes")}</span>
                        `
                            const tem2 =
                                `
                            <span>${$.i18n.prop("common.no")}</span>
                        `
                            if (d.show) {
                                return tem1

                            } else {
                                return tem2
                            }
                        }
                    },
                    { field: 'menu_type', title: $.i18n.prop("menu.name"), width: 120 },
                    {
                        fixed: "right", title: $.i18n.prop("common.operate"), width: 340, templet: function (d) {
                            let tem =
                                `
                            <a class="layui-btn layui-btn-xs " lay-event="edit">${$.i18n.prop("common.edit")}</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs del" lay-event="del">${$.i18n.prop("common.delete")}</a>
                        `
                            if (d.isParent) {
                                let addTem =
                                    `
                                <a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="add">${$.i18n.prop("common.add")}</a>
                            `
                                tem = addTem + tem
                            }
                            return tem
                        }
                    }
                ]],

                data,
                done: function (res, curr, count) {
                    console.log(res);
                    var listData = res.data
                    // console.log(res);
                    treeTable.on("toolbar(ID-treeTable-demo)", function (obj) {
                        console.log(obj);
                        if (obj.event == 'exportFile') {
                            table.exportFile("ID-treeTable-demo", listData, 'xls')
                        }
                        var checkStatus = treeTable.checkStatus(obj.config.id);
                        switch (obj.event) {
                            case 'goAdd':
                                openWin($.i18n.prop("menu.add_menu"), 'menu_add.html');
                                break;
                            case 'getCheckLength':
                                var data = checkStatus.data;
                                layer.msg('选中了：' + data.length + ' 个');
                                break;
                            case 'isAll':
                                layer.msg(checkStatus.isAll ? '全选' : '未全选');
                                break;

                            case 'refresh':
                                getMenus().then(res => {
                                    treeTable.reloadData("ID-treeTable-demo", {
                                        data: formatData(res)
                                    })
                                })

                                break;
                        }
                    })
                }
            });
            // });
            // 单元格工具事件
            treeTable.on('tool(' + inst.config.id + ')', function (obj) {
                console.log(obj);
                var layEvent = obj.event; // 获得 lay-event 对应的值
                if (layEvent === "edit") {
                    // layer.msg(trData);
                    const newData = JSON.stringify(obj.data.menu_id)

                    openWin($.i18n.prop("menu.edit_menu"), "menu_edit.html?data=" + encodeURIComponent(newData));
                } else if (layEvent === "del") {
                    layer.confirm($.i18n.prop("common.del.tip"), {
                        title: $.i18n.prop("common.delete"),
                        btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                    }, function (index) {
                        delMenu(obj.data.menu_id)
                        layer.close(index);
                    });

                } else if (layEvent === "add") {
                    console.log(data);
                    const type = 'addChildren'
                    openWin($.i18n.prop("menu.add_menu"), "menu_add.html?type=" + type + '&parent_id=' + obj.data.menu_id);
                }
            });
        });
    })




});