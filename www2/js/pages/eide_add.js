function msgCallback(data) {

    var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "addEideCb") {
                    if (obj.payload.result == 0) {
                        closeWin(parent);
                        showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                        parent.reLoad();
                    } else {
                        showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
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
            var obj = $.parseJSON(data);
            if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
                if (obj.method == "addEideCb") {
                    if (obj.payload.result == 0) {
                        closeWin(parent);
                        showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                        parent.reLoad();
                    } else {
                        showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
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


    
}

function addEideDevice() {

    var objName = $("input[name='name']");
            var name = objName.val();
            if ("" == name) {
                $("#name").tips({
                    side: 3,
                    msg: $.i18n.prop("common.enter_name.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objName.focus();
                return;
            }

            var objRoomId = $('#room-select');
            var room_id = objRoomId.val();
            if ("" == room_id) {
                $("#room_id").tips({
                    side: 3,
                    msg: $.i18n.prop("common.select_house.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objRoomId.focus();
                return;
            }

            console.log("room_id: " + room_id);

            var objSortId = $('#sort-select');
            var sort_id = objSortId.val();
            if ("" == sort_id) {
                objSortId.tips({
                    side: 3,
                    msg: $.i18n.prop("common.select_sort.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objSortId.focus();
                return;
            }
            sort_id = parseInt(sort_id);
            console.log("sort_id: " + sort_id);

            /*
            var objMaddr = $('#maddr');
            var maddr = objMaddr.val();
            if (!isKnxAddr(maddr)) {
                objMaddr.tips({
                    side: 3,
                    msg: '请输入正确的物理地址',
                    bg: '#AE81FF',
                    time: 3
                });
                objMaddr.focus();
                return;
            }
            //var maddr = (parseInt(arr[0]) & 0xff) + ((parseInt(arr[1]) & 0xff) << 8) + ((parseInt(arr[2]) & 0xff) << 16);
            var maddr = knxAddrToIntAddr(maddr);
            */

            var funcs = "[";
            var exit_flag = false;
            $(".func-item").each(function (i) {
                var value1 = $(this).find("input[name = 'serviceName']").val();
                var value2 = "";
                var value3 = $(this).find("input[name = 'serviceFuncId']").val();

                if (value3 == "") {
                    $(this).tips({
                        side: 1,
                        msg: $.i18n.prop("common.function_id"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    exit_flag = true;
                    return;
                }

                if (i != 0) {
                    funcs += ',';
                }

                funcs += ('{"service":"' + value1 + '","func_id":' + func_id + '}');
            });
            funcs += ']';

            console.log("funcs: " + funcs);
            if (exit_flag)
                return;

            doAddEideDevice(room_id, name, sort_id, sub_id, $.parseJSON(funcs));



    
}

function back() {
    window.location = "eide.html";
}

function getSorts() {
    doGetSorts();
}

function getSortNames() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "sort.cgi/getNames",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            for (var index in jsonobj) {
                var sortobj = jsonobj[index];
                var protocol = parseInt(sortobj.protocol);
                if (protocol == PROTOCOL_TYPE.KNX)
                    $('#sort-select').append(new Option(sortobj.name, sortobj.sort_id));
            }
            //$('#sort-select').append(new Option("开","1"));
            layui.form.render('select');
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

function getRooms() {
    var jsonstr = "{}";
    $.ajax({
        url: getCGIPath() + "room.cgi/getAll",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            var objs = $.parseJSON(data);
            for (var index in objs) {
                var roomobj = objs[index];
                $('#room-select').append(new Option(roomobj.name, roomobj.room_id));
            }
            layui.form.render('select');
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(sort-select)', function (data) {
            //$('#name').val(getSortName(data.value));
            createFuncs(data.value);
        });
    });

    getRooms();
    getSorts();
    getSortNames();
});