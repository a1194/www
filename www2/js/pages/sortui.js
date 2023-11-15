var table

function getSortUis(d) {
    const data = JSON.stringify(d)
    $.ajax({
        url: getCGIPath() + "sortui.cgi/getSortUis",
        contentType: "application/json",
        data,
        type: "POST",
        success: function (res) {
            var data = $.parseJSON(res);
            console.log(data);
            table.reload("sortui-table", {
                data
            })
        },
        error: function (err) {
            console.log(err);
            // showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

// function getSortUi(d) {
//     const data = JSON.stringify(d)
//     $.ajax({
//         url: getCGIPath() + "sortui.cgi/getSortUi",
//         contentType: "application/json",
//         data,
//         type: "POST",
//         success: function (res) {
//             // var data = $.parseJSON(res);
//             console.log(res);
//         },
//         error: function (err) {
//             console.log(err);
//             // showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
//         }
//     });
// }

function setState(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "sortui.cgi/setState",
        contentType: "application/json",
        data,
        type: "POST",
        success: function (res) {
            var data = $.parseJSON(res);
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            console.log(err);
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

function del(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "sortui.cgi/del",
        contentType: "application/json",
        data,
        type: "POST",
        success: function (res) {
            var data = $.parseJSON(res);
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
                getSortUis({})
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            console.log(err);
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

function add(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "sortui.cgi/add",
        contentType: "application/json",
        data,
        type: "POST",
        success: function (res) {
            console.log(res);
            // var data = $.parseJSON(res);
            // console.log(data);
            // if(data.result == 0) {
            //     showMessager($.i18n.prop("common.operate.tips"), data.result);
            // } else {
            //     showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            // }
        },
        error: function (err) {
            console.log(err);
            // showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

function getSortUi(d) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "sortui.cgi/getSortUi",
        contentType: "application/json",
        data,
        type: "POST",
        success: function (res) {
            var data = $.parseJSON(res);
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            console.log(err);
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

$(function() {
    console.log(getCGIPath());
    // add({
    //     name: "色温灯面板",
    //     sort_id: 2001,
    //     pages: []
    // })
    // getSortUi({id: 50041})
    getSortUis({})
    layui.use(function() {
        table = layui.table
        var form = layui.form;
        table.render({
            elem: '#sortui-table'
            //,url:'data.json'
            // , toolbar: 
            //     `
            //         <div id="sortui-toolbar">
            //             <div class="layui-btn-container">
            //                 <button class="layui-btn layui-btn-sm add" lay-event="goAdd">${$.i18n.prop("common.add_new")}</button>
            //             </div>
            //         </div>
            //     ` 
            , toolbar: true
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
            , title: '品类面板配置表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'sort_id', title: "sort_id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: $.i18n.prop("sortui.name"), width: 200}
                , {field: 'state', title: $.i18n.prop("common.state"), width: 120, templet: function(d) {
                    console.log(d);
                    let tem = ''
                    if(d.state == "1") {
                        tem += 
                            `
                                <input type="checkbox" name="AAA" title="启用|禁用" lay-skin="switch" checked lay-filter="checkbox-filter" data-id="${d.id}" data-sort_id="${d.sort_id}"> 
                            `
                    } else {
                        tem += 
                            `
                                <input type="checkbox" name="BBB" title="启用|禁用" lay-skin="switch" lay-filter="checkbox-filter" data-id="${d.id}" data-sort_id="${d.sort_id}"> 
                            `
                    }
                    
                    return tem
                }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), width: 450, templet: function(d) {
                    let tem =
                        `   
                            <a class="layui-btn layui-btn-xs " lay-event="edit">${$.i18n.prop("common.edit")}</a>
                            <a class="layui-btn layui-btn-danger layui-btn-xs del" lay-event="del">${$.i18n.prop("common.delete")}</a>
                        `
                    return tem
                }}
            ]]
            , page: {
                prev: $.i18n.prop("common.prev"),
                next: $.i18n.prop("common.next"),
                layout: ['prev','page','next'],
            }
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                table.on("toolbar(sortui-table)", function(obj) {
                    if(obj.event == 'exportFile') {
                        table.exportFile("sortui-table", listData, 'xls')
                    }
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            window.open(getRootPath() + "/user/www/index.html", "_blank");
                            // var newTab = window.open('about:blank');
                            // newTab.location.href = getRootPath() + "/user/www/index.html";
                            break;
                        case 'getCheckLength':
                            var data = checkStatus.data;
                            layer.msg('选中了：' + data.length + ' 个');
                            break;
                        case 'isAll':
                            layer.msg(checkStatus.isAll ? '全选' : '未全选');
                            break;
                        case 'refresh':
                            getSortUis({});
                            break;

                    }
                })
            }
        })



        table.on('tool(sortui-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                // console.log(data.id);
                window.open(getRootPath() + `/user/www/index.html?id=${data.id}&sort_id=${data.sort_id}`, "_blank");
                // var newTab = window.open('about:blank');
                // newTab.location.href = `http://localhost:5173?id=${data.sort_id}`;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    del({
                        id: data.id
                    });
                    layer.close(index);
             }); 
            } 
            // else if(obj.event === 'open') {
            //     // window.open("http://localhost:5173/", "_blank");
            //     var newTab = window.open('about:blank');
            //     newTab.location.href = `http://localhost:5173?id=${data.sort_id}`;
            // }
        });

        form.on('switch(checkbox-filter)', function(data) {
            console.log(data);
            const elem = data.elem
            const state = elem.checked ? 1 : 0
            const obj = {
                id: Number($(elem).attr("data-id")),
                sort_id: Number($(elem).attr("data-sort_id")),
                state
            }
            console.log(obj);
            setState(obj)
        });
    })
})