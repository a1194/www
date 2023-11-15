var table;
var room_id = 0;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        } else if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
                setAllSceneList([]);
            }
            var list = obj.payload.data;
            setAllSceneList(list);
            var new_list = [];
            for (var index in list) {
                if (list[index].room_id == room_id)
                    new_list.push(list[index]);
            }
            setSceneList(new_list);

            if (obj.payload.index == obj.payload.total) {
                createScenes();
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
                setAllDevList([]);
            }
            var list = obj.payload.data;
            setAllDevList(list);
            var new_list = [];
            for (var index in list) {
                if (list[index].room_id == room_id && list[index].sort_id != SORT_ID.CONTROL_PANEL && list[index].sort_id != SORT_ID.AI_GATEWAY)
                    new_list.push(list[index]);
            }
            setDevList(new_list);

            if (obj.payload.index == obj.payload.total) {
                createDevices(true);
            }
        } else if (obj.method == "getCombineScenesCb") {
            if (obj.payload.index == 1) {
                setCombineSceneList([]);
                setAllCombineSceneList([]);
            }
            var list = obj.payload.data;
            setAllCombineSceneList(list);
            var new_list = [];
            for (var index in list) {
                if (list[index].room_id == room_id)
                    new_list.push(list[index]);
            }
            setCombineSceneList(new_list);

            if (obj.payload.index == obj.payload.total) {
                createCombineScenes();
            }

        } else if (obj.method == "addSpeechConfigCb") {
            if (obj.payload.result == 0) {
                showMessager("添加成功", obj.payload.result);
                closeLoading();
                back();
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
                if (rooms.length > 0) {
                    room_id = rooms[0].room_id;
                    $("#room-select").val(room_id);
                }
                layui.form.render('select');
                getDevices();
                getSceneConfigs();
                getCombineScenes();
            }
        }
    }
}

function back() {
    window.location = "speechconfig.html";
}

function getRooms() {
    doGetRooms();
}

function addSpeechConfig() {
    //表单验证
    var objWords = $("input[name='words']");
    var words = objWords.val();
    if ("" == words) {
        objWords.tips({
            side: 3,
            msg: '请输入词条',
            bg: '#AE81FF',
            time: 3
        });
        objWords.focus();
        return;
    }

    var objRoomId = $("select[name='room_id']");
    var room_id = objRoomId.val();
    if ("" == room_id) {
        objRoomId.tips({
            side: 3,
            msg: '请选择房屋',
            bg: '#AE81FF',
            time: 3
        });
        objRoomId.focus();
        return;
    }

    // var objId = $("input[name='word_id']");
    // var word_id = objId.val();
    // if ("" == word_id) {
    //     objId.tips({
    //         side: 3,
    //         msg: '请输入词条ID',
    //         bg: '#AE81FF',
    //         time: 3
    //     });
    //     objId.focus();
    //     return;
    // }

    openLoading(10000);
    doAddSpeechConfig(words, room_id, getActionList());
}

function getSorts() {
    doGetSorts();
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getCombineScenes() {
    doGetCombineScenes();
}

function getDevices() {
    doGetDevices();
}

function toggle(sn) {
    var id = "#" + sn;
    $(id).toggle();
}

$(function () {
    layui.use('table', function () {
        var form = layui.form;
        table = layui.table;

        table.render({
            elem: '#action-table'
            //,url:'data.json'
            , toolbar: '#action-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , limit: Number.MAX_VALUE
            , cellMinWidth: 80
            , title: '用户数据表'
            , cols: [[
                {field: 'name', title: '设备', width: 260, sort: false, templet: function (d) {
                        return getActionName(d.sn, d.service, d.msg);
                    }}
                , {field: 'service', title: '服务', width: 200}
                , {field: 'msg', title: '值', width: 300, templet: function (d) {
                        return JSON.stringify(d.msg);
                    }}
                , {fixed: 'right', title: '操作', toolbar: '#action-shortcut', width: 300}
            ]]
            , data: []
        });

        //监听行工具事件
        table.on('tool(action-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'del') {
                removeAction(data.sn, data.service);
            }
        });

        form.on('checkbox(all_on)', function(obj){
            if (obj.elem.checked == true) {
                //选中事件
                $('input:checkbox[name=all_off]').attr("checked", false);
                clearDevAction();
                var devices = getDevList();
                for (var index in devices) {
                    var device = devices[index];
                    var payload_obj = {
                        "sn": device.sn,
                        "sort_id": parseInt(device.sort_id),
                        "service": "switch",
                        "msg": {"on":1}
                    };
                    addDevAction(payload_obj);
                }
                form.render();

            }else{
                //未选中事件
                clearDevAction();
            }
        });

        form.on('checkbox(all_off)', function(obj){
            if (obj.elem.checked == true) {
                //选中事件
                $('input:checkbox[name=all_on]').attr("checked", false);
                clearDevAction();
                var devices = getDevList();
                for (var index in devices) {
                    var device = devices[index];
                    var payload_obj = {
                        "sn": device.sn,
                        "sort_id": parseInt(device.sort_id),
                        "service": "switch",
                        "msg": {"off":0}
                    };
                    addDevAction(payload_obj);
                }
                form.render();
            }else{
                //未选中事件
                clearDevAction();
            }
        });

        form.on('select(room-select)', function (data) {
            console.log('data.value: ' + data.value);
            room_id = data.value;
            getDevices();
            getSceneConfigs();
            getCombineScenes();
        });
    });

    getRooms();
    getSorts();
});