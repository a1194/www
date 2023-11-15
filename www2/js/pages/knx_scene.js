var table;

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function reLoad() {
    getKnxs();
}

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getKnxScenesCb") {
            if (obj.payload.index == 1) {
                setKnxSceneList([]);
            }
            setKnxSceneList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                table.reload('knx-scene-table', {
                    data: getKnxSceneList()
                });
            }
        } else if (obj.method == "delKnxSceneCb" || obj.method == "delKnxScenesCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }
}

function delKnxScene(scene_id) {
    openLoading(3000);
    doDelKnxScene(parseInt(scene_id));
}

function delKnxScenes(ids) {
    openLoading(3000);
    doDelKnxScenes(ids);
}

function getKnxScenes() {
    //doGetKnxs();
    var jsonstr = '{}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "knx_scene.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            table.reload('knx-scene-table', {
                data: $.parseJSON(data)
            });
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

//JS
$(function () {
    layui.use('table', function () {
        table = layui.table;

        var obj = {
            elem: '#knx-scene-table'
            //,url:'data.json'
            // , toolbar: '#knx-scene-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '刷新'
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: 'KNX场景数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'scene_id', title: "id", width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'gaddr', title: $.i18n.prop("center.scene.group_add"), width: 200, templet: function (d) {
                        return intAddrToKnxAddr(d.gaddr);
                    }}
                , {field: 'value', title: $.i18n.prop("center.key_config.button.value"), width: 200}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), width: 300, templet: function() {
                    const tem =
                    `
                        <a class="layui-btn layui-btn-xs" lay-event="goEdit">${$.i18n.prop("common.edit")}</a>
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
        }
        table.render(obj);
        

        //头工具栏事件
        table.on('toolbar(knx-scene-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'goAdd':
                    openWin($.i18n.prop("center.sceneconfig.add_knx_scene_addr"), 'knx_scene_add.html');
                    break;
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.scene_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delKnxScenes(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'refresh':
                    getKnxScenes();
                    break;
            }
            ;
        });

        //监听行工具事件
        table.on('tool(knx-scene-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'goEdit') {
                openWin($.i18n.prop("center.sceneconfig.edit_knx_scene_addr"), "knx_scene_edit.html?scene_id=" + data.scene_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delKnxScene(data.scene_id);
                    layer.close(index);
                });
            }
        });
    });

    getKnxScenes();
});
