let currentApp

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setAppStateCb") {
            if(obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
                getApps()
                // if(currentApp.state == 1) {
                //     $(`.state${currentApp.app_id}`).html('禁用')
                // } else {
                //     $(`.state${urrentApp.app_id}`).html('启用')
                // }
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        } 
    }
}

//获取所有app
function getApps(d = {}) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "app.cgi/getAll",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            console.log(JSON.parse(res));
            apps = JSON.parse(res)
            createApp(apps)
        },
        error: function (err) {
            console.log(err);
            const data = $.parseJSON(err)
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}
//删除app
function delApp(d = {}) {
    const data = JSON.stringify(d)
    console.log(data);
    $.ajax({
        url: getCGIPath() + "app.cgi/del",
        contentType: "application/json",
        type: "POST",
        data,
        success: function (res) {
            const data = JSON.parse(res)
            console.log(data);
            if(data.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), data.result);
                getApps()
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
            }
        },
        error: function (err) {
            console.log(err);
            const data = $.parseJSON(err)
            showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
        }
    });
}

//新增
function handleAdd() {
    console.log("add");
    openWin($.i18n.prop("common.change"), "app_add.html");
}


//修改
function handleBtn1Click(id) {
    openWin($.i18n.prop("common.change"), "app_edit.html?app_id=" + id);
}
//删除
function handleBtn2Click(app_id) {
    console.log("delete");
    layer.confirm("确定要卸载吗？", {
        title: "卸载",
        btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
    }, function (index) {
        delApp({ app_id })
        layer.close(index);
        new FileReader
    });
}

//修改状态
function handleStateClick(item) {
    console.log(item);
    const d = {
        app_id: item.app_id,
        state: item.state == 1 ? 0 : 1
    }
    console.log(d);
    doSetAppState(d)
    // currentApp = item
}

$(function () {
    getApps()
    layui.use(function () {
        var element = layui.element;

        // 切换事件
        element.on('tab(layui-tab)', function (data) {
            console.log(this.getAttribute('lay-id'));
            // console.log(data.index); // 得到当前 tab 项的所在下标
            // console.log(data.elem); // 得到当前的 tab 容器
            const id = this.getAttribute('lay-id')
            if(id == 'installed') {
                getApps()
            } else if (id == 'store') {
                createStore()
            }
        });

    });

    
})