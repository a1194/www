function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "addKnxCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager("添加成功", obj.payload.result);
                parent.reLoad();
            } else {
                showMessager("添加失败", obj.payload.result);
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

function removeService(othis) {
    $(othis).parents(".gaddr-item").remove();
}

function addKnxDevice() {
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: '请输入名称',
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
            msg: '请选择房屋',
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
            msg: '请选择品类',
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
    var maddr = 0;
    console.log("maddr: " + maddr);

    var gaddrs = "[";
    var exit_flag = false;
    $(".gaddr-item").each(function (i) {
        var value1 = $(this).find("input[name = 'serviceName']").val();
        //var value2 = $(this).find("input[name = 'serviceAttr']").val();
        var value2 = "";
        var value3 = $(this).find("input[name = 'serviceCtlAddr']").val();
        var value4 = $(this).find("input[name = 'serviceStaAddr']").val();

        var ctl_addr = 0;
        var sta_addr = 0;
        if (value3 != "") {
            if (isKnxAddr(value3))
                ctl_addr = knxAddrToIntAddr(value3);
            else {
                $(this).tips({
                    side: 1,
                    msg: '组地址格式不正确，地址使用/号分割',
                    bg: '#AE81FF',
                    time: 3
                });
                exit_flag = true;
                return;
            }
            if (ctl_addr == 0) {
                $(this).tips({
                    side: 1,
                    msg: '组地址不能为空',
                    bg: '#AE81FF',
                    time: 3
                });
                exit_flag = true;
                return;
            }
        }

        if (value4 != "") {
            if (isKnxAddr(value4))
                sta_addr = knxAddrToIntAddr(value4);
            else {
                $(this).tips({
                    side: 1,
                    msg: '组地址格式不正确，地址使用/号分割',
                    bg: '#AE81FF',
                    time: 3
                });
                exit_flag = true;
                return;
            }
        }

        if (i != 0) {
            gaddrs += ',';
        }

        gaddrs += ('{"service":"' + value1 + '","ctl_addr":' + ctl_addr + ',"sta_addr":' + sta_addr + '}');
    });
    gaddrs += ']';

    console.log("gaddrs: " + gaddrs);
    if (exit_flag)
        return;

    doAddKnxDevice(room_id, name, sort_id, maddr, $.parseJSON(gaddrs));
}

function back() {
    window.location = "knx.html";
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
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
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
        var form = layui.form
        // layui.jquery(".confirm").text($.i18n.prop('common.confirm'))
        // layui.jquery(".cancel").text($.i18n.prop('common.cancel'))
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(sort-select)', function (data) {
            //$('#name').val(getSortName(data.value));
            createGAddrs(data.value);
        });
        layui.jquery(".none").text($.i18n.prop('common.none'))
        form.render()
    });
    getRooms();
    getSorts();
    getSortNames();

    

});