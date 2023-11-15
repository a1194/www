var table;
var room_id = 0;

var device_list = []

function msgCallback(data) {
    var obj = $.parseJSON(data);
    console.log(obj);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editCombineSceneCb") {
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                closeLoading();
                back();
            }
        } else if (obj.method == "getSortsCb") {
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {

            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
                setAllDevList([]);
            }
            var list = obj.payload.data;
            setAllDevList(list);
            // var new_list = [];
            // for (var index in list) {
            //     if (list[index].room_id == room_id && list[index].sort_id != SORT_ID.CONTROL_PANEL && list[index].sort_id != SORT_ID.AI_GATEWAY)
            //         new_list.push(list[index]);
            // }
            for (var index in list) {
                if (list[index].sort_id != SORT_ID.CONTROL_PANEL && list[index].sort_id != SORT_ID.AI_GATEWAY)
                    device_list.push(list[index]);
            }

            setDevList(device_list);

            if (obj.payload.index == obj.payload.total) {
                createDevices(true);
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
        } else if (obj.method == "getCombineSceneCb") {
            $("#form-combinescene-edit").setform(obj.payload);
            layui.form.render('select');
            setTriggerList(obj.payload.triggers);
            table.reload('trigger-table', {
                data: $.extend(true, [], getTriggerList())
            });
            setActionList(obj.payload.actions);
            table.reload('action-table', {
                data: $.extend(true, [], getActionList())
            });
        } else if (obj.method == "getRoomsCb") {
            if (obj.payload.index == 1) {
                setRoomList([]);
            }
            setRoomList(obj.payload.data);

            
            const data = [{
                name: "未分类",
                value: 0
            }]
            if (obj.payload.index == obj.payload.total) {
                var rooms = getRoomList();
                for (var index in rooms) {
                    var roomobj = rooms[index];
                    $('#room-select').append(new Option(roomobj.name, roomobj.room_id));
                    data.push({
                        name: roomobj.name, value: roomobj.room_id
                    })
                }
                if (rooms.length > 0) {
                    room_id = rooms[0].room_id;
                    $("#room-select").val(room_id);
                }
                xmSelect.render({
                    el: document.querySelector('#xm-select-con'),
                    data,
                    tips: $.i18n.prop("common.please_select"),
                    style: {
                        width: "260px"
                    },
                    clickClose: true,
                    on: function(data) {
                        var arr = data.arr;
                        if(arr.length) {
                            const values = arr.map( item => item.value )
                            const newList = device_list.filter(item => values.includes(item.room_id))
                            dev_list = newList
                            createDevices(true);
                        } else {
                            dev_list = device_list
                            createDevices(true);
                        }
                    }
                })
                layui.form.render('select');
                getDevices();
                getSceneConfigs();
                getCombineScene(getUrlParam("scene_id"));
            }
        }
    }
}

function getCombineScene(scene_id) {
    doGetCombineScene(parseInt(scene_id));
}

function back() {
    window.location = "combinescene.html";
}

function editCombineScene() {
    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        objName.tips({
            side: 3,
            msg: $.i18n.prop("common.scene_name.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var objId = $("input[name='scene_id']");
    var scene_id = objId.val();
    if ("" == scene_id) {
        objId.tips({
            side: 3,
            msg: $.i18n.prop("common.scene_id.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objId.focus();
        return;
    }

    var objRoomId = $("select[name='room_id']");
    var room_id = objRoomId.val();
    if ("" == room_id) {
        objRoomId.tips({
            side: 3,
            msg: $.i18n.prop("common.select_house.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objRoomId.focus();
        return;
    }

    var objTriggerCondition = $("select[name='trigger_condition']");
    var trigger_condition = objTriggerCondition.val();
    if ("" == trigger_condition) {
        objTriggerCondition.tips({
            side: 3,
            msg: $.i18n.prop("common.trigger_condition.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objTriggerCondition.focus();
        return;
    }

    openLoading(10000);
    doEditCombineScene(scene_id, name, room_id, getTriggerList(), getActionList(), trigger_condition);
}

function getRooms() {
    doGetRooms();
}

function getSorts() {
    doGetSorts();
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getDevices() {
    doGetDevices();
}

function toggle(sn) {
    let currentHtnl = event.currentTarget.innerHTML
    event.currentTarget.innerHTML = currentHtnl == "▲" ? "▼" : "▲"
    var id = "#" + sn;
    $(id).toggle();
}
let selectContent = null
let time
function getTimeValue() {
    var values = "";
    time = $("#ID-laydate-shortcut-time").val()
    if(!time) {
        $("#ID-laydate-shortcut-time").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_value"),
            bg: '#AE81FF',
            time: 3
        });
        $("#ID-laydate-shortcut-time").focus();
        return;
    }

    values += time;
    
    const redoSelect = $("#redoSelect").val()
    var redo
    if(redoSelect == 'week') {
        if(selectContent.getValue().length) {
            redo = selectContent.getValue().map(item => item.value);
            values += "," + redoSelect 
            if (redo instanceof Array) {
                for (var index in redo) {
                    // values += "," + redo[index];
                    values += `,${redo[index]}`;
                }
            } else {
                values += "," + redo;
            }
        } else {
            $("#xm-select-demo").tips({
                side: 3,
                msg: $.i18n.prop("common.enter_value"),
                bg: '#AE81FF',
                time: 1
            });
            $("#xm-select-demo").focus();
            return;
        }
    } else if(redoSelect == 'time') {
        // console.log($("#ID-laydate-select-date").val());
        var value = $("#ID-laydate-select-date").val()
        if(value) {
            const formatValue = value.split("-")
            values += "," + redoSelect
            formatValue.forEach(item => {
                // values += `,${item}`
                values += `,${item}`
            }) 
        } else {
            $("#ID-laydate-select-date").tips({
                side: 3,
                msg: $.i18n.prop("common.enter_value"),
                bg: '#AE81FF',
                time: 1
            });
            $("#ID-laydate-select-date").focus();
            return;
        }
    } else if(redoSelect == 'everymonth') {
        // console.log($("#ID-laydate-select-date").val());
        var value = $("#ID-laydate-day").val()
        if(value) {
            // redo = selectContent
            values += `,${redoSelect},${value}`
        } else {
            $("#ID-laydate-day").tips({
                side: 3,
                msg: $.i18n.prop("common.enter_value"),
                bg: '#AE81FF',
                time: 1
            });
            $("#ID-laydate-day").focus();
            return;
        }
    } else if(redoSelect == 'everyyear') {
        // console.log($("#ID-laydate-select-date").val());
        var value = $("#ID-laydate-month-day").val()
        if(value) {
            values += "," + redoSelect
            const formatValue = value.split("-")
            formatValue.forEach(item => {
                values += `,${item}`
            })
        } else {
            $("#ID-laydate-month-day").tips({
                side: 3,
                msg: $.i18n.prop("common.enter_value"),
                bg: '#AE81FF',
                time: 1
            });
            $("#ID-laydate-month-day").focus();
            return;
        }
    } 
    else {
        redo = redoSelect;
        values += "," + redo;
    }
    console.log(values);
    addBasicTrigger(2, values);
}
$(function () {
    setActionType(2);
    layui.use(['table', 'jquery'], function () {
        var form = layui.form;
        table = layui.table;
        var laydate = layui.laydate
        var obj1 = {
            elem: '#trigger-table'
            , limit: Number.MAX_VALUE
            //,url:'data.json'
            , toolbar: '#trigger-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            }]
            , title: ''
            , cellMinWidth: 80
            , cols: [[
                {field: 'type', title: $.i18n.prop("common.type"), width: 100, sort: false, templet: function (d) {
                        return getTriggerType(d.type);
                    }}
                , {field: 'value', title: $.i18n.prop("common.value"), width: 280, edit: 'text', templet: function (d) {
                        return getActionValue(d.value);
                    }}
                , {field: 'action', title: $.i18n.prop("center.sceneconfig.action"), width: 350, sort: false, templet: function (d) {
                        return formatActionValue(d)
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#trigger-shortcut', width: 200}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(trigger-table)', function (obj) {
                    switch (obj.event) {
                        case 'exportFile':
                            table.exportFile("trigger-table", listData, 'xls')
                        break;
                    }

                });
            }
        }
        table.render(obj1);

        table.on('edit(trigger-table)', function(obj){
            //var trigger_list = table.getData("trigger-table");
            setTriggerList([]);
            setTriggerList(table.getData("trigger-table"));
        });

        var obj2 = {
            elem: '#action-table'
            , limit: Number.MAX_VALUE
            //,url:'data.json'
            , toolbar: '#action-toolbar' //开启头部工具栏，并为其绑定左侧模板
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
            }]
            , title: '用户数据表'
            , cellMinWidth: 80
            , cols: [[
                {field: 'name', title: $.i18n.prop("center.device"), width: 260, sort: false, templet: function (d) {
                        return getActionName(d.sn, d.service, d.msg);
                    }}
                , {field: 'service', title: $.i18n.prop("sort.service"), width: 120}
                , {field: 'msg', title: $.i18n.prop("service.value"), width: 300, templet: function (d) {
                        return JSON.stringify(d.msg);
                    }}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#action-shortcut', width: 200}
            ]]
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
            , done: function(res, curr, count){      //禁止选中
                var listData = res.data
                // console.log(res);
                //头工具栏事件
                table.on('toolbar(action-table)', function (obj) {
                    switch (obj.event) {
                        case 'exportFile':
                            table.exportFile("action-table", listData, 'xls')
                        break;
                    }
                });
            }
        }
        table.render(obj2);

        //监听行工具事件
        table.on('tool(trigger-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'del') {
                removeTrigger(data);
            }
        });

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
                    if(device.services.find(item => item.name == 'switch')) {
                        var payload_obj = {
                            "sn": device.sn,
                            "sort_id": parseInt(device.sort_id),
                            "service": "switch",
                            "msg": {"on":1}
                        };
                        addDevAction(payload_obj);
                    }
                    
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
                    if(device.services.find(item => item.name == 'switch')) {
                        var payload_obj = {
                            "sn": device.sn,
                            "sort_id": parseInt(device.sort_id),
                            "service": "switch",
                            "msg": {"off":0}
                        };
                        addDevAction(payload_obj);
                    }
                    
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
        });

        form.on('radio(action_type)', function (data) {
            if (this.value == "1") {
                setActionType(1);
                $("#scene-container").hide();
                $("#all_on_off").hide();
            } else if (this.value == "2") {
                setActionType(2);
                $("#scene-container").show();
                $("#all_on_off").show();
            }
        });

        layui.jquery(".trigger").text($.i18n.prop('center.combine_scene.trigger_con'))
        layui.jquery(".oneCondition").text($.i18n.prop('center.combine_scene.any_con'))
        layui.jquery(".click").val($.i18n.prop('center.combine_scene.click.tips'))
        layui.jquery(".Voice").val($.i18n.prop('center.combine_scene.voice.tips'))
        layui.jquery(".Time").val($.i18n.prop('center.combine_scene.time.tips'))
        layui.jquery(".touch").text($.i18n.prop('center.combine_scene.touch.tips'))
        layui.jquery(".open").text($.i18n.prop('center.open_all'))
        layui.jquery(".close").text($.i18n.prop('center.close_all'))

        layui.jquery(".del").text($.i18n.prop('common.delete'))
        layui.jquery(".action").text($.i18n.prop('center.sceneconfig.action'))

        laydate.render({
            elem: "#ID-laydate-shortcut-time",
            type: "time",
            format: 'HH:mm',
            btns: ['now', 'confirm'],
            value: new Date(Date.now()),
            lang: $.i18n.prop("center.combine_scene.lang"),
            onConfirm (value, date) {
                console.log(value, date);
                time = value
            }
        });
        form.on('select(select-filter)', function(data){
            var elem = data.elem; // 获得 select 原始 DOM 对象
            var value = data.value; // 获得被选中的值
            var othis = data.othis; // 获得 select 元素被替换后的 jQuery 对象
            console.log(data);
            // layer.msg(this.innerHTML + ' 的 value: '+ value); // this 为当前选中 <option> 元素对象
            if(data.value == 'week') {
                $(".select-week").css("display", 'block')
                $(".select-item:not(.select-week)").each(function() {
                    $(this).css("display", 'none')
                })
            } else if(data.value == 'time') {
                console.log(232323);
                // selectContent = newDate
                $(".select-date").css("display", 'block')
                $(".select-item:not(.select-date)").each(function() {
                    $(this).css("display", 'none')
                })
            } else if(data.value == 'everyyear') {
                // selectContent = newMonthDay
                $(".select-month-day").css("display", 'block')
                $(".select-item:not(.select-month-day)").each(function() {
                    $(this).css("display", 'none')
                })
            } else if(data.value == 'everymonth') {
                // selectContent = newhDay
                $(".select-day").css("display", 'block')
                $(".select-item:not(.select-day)").each(function() {
                    $(this).css("display", 'none')
                })
            } else {
                $(".select-item").css("display", 'none')
            }
        });

        selectContent = xmSelect.render({
            el: document.querySelector('#xm-select-demo'),
            data: [
                {name: $.i18n.prop("center.combine_scene.Mon"), value: "Mon"},
                {name: $.i18n.prop("center.combine_scene.Tue"), value: "Tue"},
                {name: $.i18n.prop("center.combine_scene.Wed"), value: "Wed"},
                {name: $.i18n.prop("center.combine_scene.Thu"), value: "Thu"},
                {name: $.i18n.prop("center.combine_scene.Fri"), value: "Fri"},
                {name: $.i18n.prop("center.combine_scene.Sat"), value: "Sat"},
                {name: $.i18n.prop("center.combine_scene.Sun"), value: "Sun"},
            ],
            tips: $.i18n.prop("common.please_select"),
        })
        //格式化日期年月日
        const newDate = formatTime()
        // 指定日期
        laydate.render({
            elem: '#ID-laydate-select-date',
            value: newDate,
            isInitValue: true,
            btns: ['now'],
            lang: $.i18n.prop("center.combine_scene.lang"),
            done: function(value, date) {
                console.log(value);
            }
        });
        //格式化日期月日
        const newMonthDay = formatTime("md")
        //每年
        laydate.render({
            elem: "#ID-laydate-month-day",
            value: newMonthDay,
            isInitValue: true,
            btns: ['now'],
            lang: $.i18n.prop("center.combine_scene.lang"),
            format: 'MM-dd',
            max: `${formatTime("y")}-12-31`,
            min: `${formatTime("y")}-1-1`,
            change: function(value, date){
                // console.log(value); // 日期字符，如： 2017-08-18
                if(date.month == 1) {
                    $("#layui-laydate3 .laydate-prev-m").css("display", "none")
                } else if(date.month == 12) {
                    $("#layui-laydate3 .laydate-next-m").css("display", "none")
                } else {
                    $("#layui-laydate3 .laydate-prev-m").css("display", "block")
                    $("#layui-laydate3 .laydate-next-m").css("display", "block")
                }
            },
            ready: function(date) {
                if(date.month == 1) {
                    $("#layui-laydate3 .laydate-prev-m").css("display", "none")
                } else if(date.month == 12) {
                    $("#layui-laydate3 .laydate-next-m").css("display", "none")
                } else {
                    $("#layui-laydate3 .laydate-prev-m").css("display", "block")
                    $("#layui-laydate3 .laydate-next-m").css("display", "block")
                }
            }
        });
        console.log(`${formatTime("y")}-12-31`);
        //格式化日期日
        const newhDay = formatTime("d")
        //每月
        laydate.render({
            elem: "#ID-laydate-day",
            value: newhDay,
            isInitValue: true,
            btns: ['now'],
            lang: $.i18n.prop("center.combine_scene.lang"),
            format: 'dd',
        });
        $(".all_on").attr("title", $.i18n.prop("center.open_all"))
        $(".all_off").attr("title", $.i18n.prop("center.close_all"))
        $(".addCondition").attr("title", $.i18n.prop("center.combine_scene_add_con"))
        $(".addWork").attr("title", $.i18n.prop("center.combine_scene_add_work"))

        form.on('checkbox(isShow)', function(data){
            dev_list.forEach(item => {
                if(!data.elem.checked) {
                    const bar = document.getElementById(`toggle${item.sn}`)
                    if(bar) bar.innerHTML = "▼"
                    $('#' + item.sn).css("display", "none")
                } else {
                    const bar = document.getElementById(`toggle${item.sn}`)
                    if(bar) bar.innerHTML = "▲"
                    $('#' + item.sn).css("display", "block")
                }
            })
            var elem = data.elem; // 获得 checkbox 原始 DOM 对象
            
        });


        
        form.render()
        // jQuery.i18n.properties({
        //     name: "common", // 资源文件名称
        //     path: 'i18n/', // 资源文件所在目录路径
        //     mode: 'map', // 模式：变量或 Map
        //     // language: language, // 对应的语言
        //     cache: false,
        //     // encoding: 'UTF-8',
        //     callback: function () { // 回调方法
        //         layui.use('jquery',function(){
        //
        //         })
        //     }
        // });
    });

    getRooms();
    getSorts();

    $(".Time").click(function() {
        timeValue = {}
        getTimeValue()
    })
    $("#checkbox").attr("title", $.i18n.prop("device.show_all"))
});

