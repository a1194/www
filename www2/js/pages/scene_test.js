var table;
var is_test_start = false;
var test_total = 0;
var success_total = 0;
var fail_total = 0;
var test_scene_id = 0;
var select_data = [];

function msgCallback(data) {
    var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "getSceneConfigsCb") {
                    if (obj.payload.index == 1) {
                        setSceneList([]);
                    }
                    setSceneList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        table.reload('sceneconfig-table', {
                            data: getSceneList()
                        });
                    }
                } else if (obj.method == "addSceneConfigCb") {
                    if (!is_test_start)
                        return;
                    if (obj.payload.result == 0) {
                        success_total++;
                        $("#success-total").html(success_total);
                        showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                        closeDialog();
                        // openDialog('2秒后进入下一轮测试...', '马上进入下一轮', 2000, function () {
                        //     startTest(new_scene_id);
                        // });
                        test_scene_id = obj.payload.scene_id;
                        startTest(test_scene_id);
                    } else {
                        fail_total++;
                        $("#fail-total").html(fail_total);
                        showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
                    }
                } else if (obj.method == "delSceneConfigCb") {
                    if (!is_test_start)
                        return;
                    if (obj.payload.result == 0) {
                        success_total++;
                        $("#success-total").html(success_total);
                        showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
                        closeDialog();
                        openDialog('2秒后进入下一轮测试...', '马上进入下一轮', 2000, function () {
                            startTest(test_scene_id);
                        });
                    } else {
                        fail_total++;
                        $("#fail-total").html(fail_total);
                        showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
                    }
                } else if (obj.method == "editSceneConfigCb") {
                    if (!is_test_start)
                        return;
                    if (obj.payload.result == 0) {
                        success_total++;
                        $("#success-total").html(success_total);
                        showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                        closeDialog();
                        // openDialog('2秒后进入下一轮测试...', '马上进入下一轮', 2000, function () {
                        //     startTest(new_scene_id);
                        // });
                        startTest(test_scene_id);
                    } else {
                        fail_total++;
                        $("#fail-total").html(fail_total);
                        showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
                    }
                } else if (obj.method == "getRoomsCb") {
                    if (obj.payload.index == 1) {
                        setRoomList([]);
                    }
                    setRoomList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        var rooms = getRoomList();
                        for (var index in rooms) {
                            var roomobj = rooms[index];
                            $('#room-select').append(new Option(roomobj.name, roomobj.room_id));
                        }
                        layui.form.render('select');
                        getDevice(getUrlParam("dev_id"));
                    }
                } else if (obj.method == "getSortsCb") {
                    if (obj.payload.index == 1) {
                        setSortList([]);
                    }
                    setSortList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        getDevices();
                    }
                } else if (obj.method == "getDevicesCb") {
                    if (obj.payload.index == 1) {
                        setDevList([]);
                    }
                    setDevList(obj.payload.data);

                    if (obj.payload.index == obj.payload.total) {
                        table.reload('device-table', {
                            data: getSubDevList()
                        });
                    }
                }
            }
    
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getRooms() {
    doGetRooms();
}

function getSorts() {
    doGetSorts();
}

function getDevices() {
    doGetDevices();
}

var step = 0;

function startTest(scene_id) {
    var msg = "";
    var timeout = 3000;
    step++;
    switch (step) {
        case 1:
            setActionList([]);
            for (index in select_data) {
                var payload_obj = {
                    "sn": select_data[index].sn,
                    "sort_id": parseInt(select_data[index].sort_id),
                    "service": "switch",
                    "msg": {"on": 1}
                };
                addActionList(payload_obj);
            }
            doAddSceneConfig("全开测试", 0, getActionList());
            msg = "配置为全开...";
            timeout = 3000 * select_data.length;
            break;
        case 2:
            doScene(scene_id);
            break;
        case 3:
            setActionList([]);
            for (index in select_data) {
                var payload_obj = {
                    "sn": select_data[index].sn,
                    "sort_id": parseInt(select_data[index].sort_id),
                    "service": "switch",
                    "msg": {"off": 0}
                };
                addActionList(payload_obj);
            }
            doEditSceneConfig(scene_id, "全关测试", 0, getActionList());
            msg = "配置为全关...";
            timeout = 3000 * select_data.length;
            break;
        case 4:
            doScene(scene_id);
            break;
        case 5:
            step = 0;
            doDelSceneConfig(scene_id);
            msg = "删除配置中...";
            timeout = 3000;
            break;
    }

    if (step == 2 || step == 4) {
        closeDialog();
        openDialog('3秒后进入下一轮测试...', '马上进入下一轮', 3000, function () {
            startTest(scene_id);
        });
    } else {
        openLoading2(timeout, function () {
            console.log("设置超时！");
            fail_total++;
            $("#fail-total").html(fail_total);
            startTest(scene_id);
        });

        test_total++;
        $("#test-total").html(test_total);
        parent.showMessager(msg);
    }
}

function stopTest() {
    closeLoading();
}

//JS
$(function () {
    getSorts();
    getSceneConfigs();

    layui.use('table', function () {
        table = layui.table;
        var form = layui.form;

        table.render({
            elem: '#device-table'
            , limits: [200]
            , limit: 200
            , title: '设备数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: '设备ID', width: 120, fixed: 'left', unresize: true}
                , {field: 'sn', title: 'SN', width: 180}
                , {field: 'name', title: '设备名称', width: 200}
                , {field: 'sort_id', title: '品类ID', width: 80}
            ]]
            , page: false
            , data: []
        });

        table.render({
            elem: '#sceneconfig-table'
            , limits: [100, 200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'scene_id', title: '场景ID', width: 120, fixed: 'left', unresize: true, sort: true}
                , {field: 'name', title: '场景名称', width: 200}
                // , {field: 'scenes', title: '场景', width: 360, templet: function (d) {
                //         return JSON.stringify(d.scenes);
                //     }}
                , {
                    field: 'room_id', title: '房屋', width: 200, templet: function (d) {
                        return getRoomName(d.room_id);
                    }
                }
                , {field: 'state', title: '状态', width: 120}
            ]]
            , page: true
            , data: []
        });

        //监听行工具事件
        table.on('tool(sceneconfig-table)', function (obj) {
            var data = obj.data;
            if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delSceneConfig(data.scene_id);
                    layer.close(index);
                });
            }
        });

        form.on('switch(test-switch)', function (data) {
            //parent.log_switch = this.checked;
            if (this.checked) {
                select_data = table.checkStatus('device-table').data;
                console.log("select_data: " + select_data);
                console.log("select_data len: " + select_data.length);

                if (parseInt(select_data.length) == 0) {
                    layer.msg("请选择设备！", {
                        time: 2000
                    });
                    if (this.checked)
                        $('#test-switch').removeAttr("checked");
                    else
                        $('#test-switch').attr( "checked", 'true');
                    form.render();
                    return;
                }

                test_total = 0;
                $("#test-total").html(test_total);
                is_test_start = true;
                startTest(-1);
            } else {
                is_test_start = false;
                stopTest();
            }
        });
    });
});
