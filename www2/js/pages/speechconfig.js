var table;
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSpeechConfigsCb") {
            if (obj.payload.index == 1) {
                setSpeechList([]);
            }
            setSpeechList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                table.reload('speechconfig-table', {
                    data: getSpeechList()
                });
            }
        } else if (obj.method == "delSpeechConfigCb" || obj.method == "delSpeechConfigsCb") {
            if (obj.payload.result == 0) {
                closeLoading();
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
        } else if (obj.method == "speechCb") {
            if (obj.payload.result == 0) {
                //closeLoading();
            }
        }
    }
}

function delSpeechConfig(word_id) {
    openLoading(3000);
    doDelSpeechConfig(word_id);
}

function delSpeechConfigs(ids) {
    openLoading(3000);
    doDelSpeechConfigs(ids);
}

function getSpeechConfigs() {
    doGetSpeechConfigs();
}

function getRooms() {
    doGetRooms();
}

function speech() {
    //表单验证
    var objWord = $("input[name='word']");
    var word = objWord.val();
    if ("" == word) {
        $("#word").tips({
            side: 3,
            msg: '请输入词条',
            bg: '#AE81FF',
            time: 3
        });
        objWord.focus();
        return;
    }

    doSpeech(word);
}

//JS
$(function () {

    layui.use('table', function () {
        table = layui.table;

        table.render({
            elem: '#speechconfig-table'
            //,url:'data.json'
            , toolbar: '#speechconfig-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: ['filter', 'exports', 'print', { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: '刷新'
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '用户数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'word_id', title: '词条ID', width: 120, fixed: 'left', unresize: true}
                , {field: 'words', title: '词条', width: 200}
                , {field: 'room_id', title: '房屋', width: 200, templet: function (d) {
                        return getRoomName(d.room_id);
                    }}
                , {fixed: 'right', title: '操作', toolbar: '#speechconfig-shortcut', width: 300}
            ]]
            , page: true
            , data: []
        });

        //头工具栏事件
        table.on('toolbar(speechconfig-table)', function (obj) {
            var checkStatus = table.checkStatus(obj.config.id);
            switch (obj.event) {
                case 'goAdd':
                    window.location = 'speechconfig_add.html';
                    break;
                case 'dels':
                    //var checkStatus = table.checkStatus(obj.config.id);
                    var ids = [];
                    if (checkStatus.data.length > 0) {
                        $.each(checkStatus.data, function (index, item) {
                            ids.push(item.word_id)
                        });
                        layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                            delSpeechConfigs(ids);
                            layer.close(index);
                        });
                    } else {
                        layer.msg($.i18n.prop("common.select.tips"));
                    }
                    break;
                case 'refresh':
                    getSpeechConfigs();
                    break;
            }
            ;
        });

        //监听行工具事件
        table.on('tool(speechconfig-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                window.location = "speechconfig_edit.html?word_id=" + data.word_id;
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("common.del.tip"), function (index) {
                    delSpeechConfig(data.word_id);
                    layer.close(index);
                });
            }
        });
    });

    getRooms();
    getSpeechConfigs();
});