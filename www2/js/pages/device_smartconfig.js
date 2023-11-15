var keep_name;

function openAddFail() {
    layui.layer.open({
        type: 2
        , offset: 'auto'
        , content: `<div style="padding: 20px 100px;">\'+ ${$.i18n.prop("common.operate_failure.tips")} +\'</div>`
        , btn: $.i18n.prop("common.confirm")
        , area: ['360px', '260px']
        , btnAlign: 'c' //按钮居中
        //,shade: 0 //不显示遮罩
        , shade: [0.1, '#fff']
        , yes: function (index, layero) {
            layui.layer.closeAll();
            back();
        }
    });
}

function openAddFinished(sn, sort_id, name) {
    layui.layer.open({
        type: 2
        , offset: 'auto'
        , content: encodeURI('device_add_finished.html?sn=' + sn + '&sort_id=' + sort_id + '&name=' + name)
        , btn: $.i18n.prop("common.confirm")
        , area: ['400px', '320px']
        , btnAlign: 'c' //按钮居中
        //,shade: 0 //不显示遮罩
        , shade: [0.1, '#fff']
        , yes: function (index, layero) {
            $(layero).find("iframe")[0].contentWindow.saveDevice();
            layui.layer.closeAll();
            back();
        }
    });
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "smartConfigCb") {
            closeDiscovery();
            if (obj.payload.result == 0)
                openAddFinished(obj.payload.sn, obj.payload.sort_id, keep_name);
            else
                openAddFail();
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

function back() {
    closeDiscovery();
    window.location = "device.html";
}

function closeDiscovery() {
    closeLoading();
    doCloseDiscovery();
}

function smartConfig(sn, sort_id, protocol) {
    openLoading2(60000, function () {
        back();
    });
    doSmartConfig(sn, sort_id, protocol);
}

function getSorts() {
    doGetSorts();
}

$(function () {
    var sn = getUrlParam('sn');
    var sort_id = getUrlParam('sort_id');
    var protocol = getUrlParam('protocol');
    keep_name = getUrlParamAndDecode('name');
    smartConfig(sn, parseInt(sort_id), parseInt(protocol));
});
