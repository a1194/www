var table;
var is_test_start = false;
var select_data = [];
var timeoutId = -1;

function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getSortsCb") {
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
        } else {
            $("#msg-log").prepend(data + "<br\>");
            //layui.element.init();
        }
    }
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

function shell(cmd) {
    console.log("cmd: " + cmd);
    var base = new Base64();
    var base64_cmd = base.encode(cmd);
    console.log("base64_cmd: " + base64_cmd);
    var json_str = '{"cmd":"' + base64_cmd + '"}';

    $.ajax({
        url: getCGIPath() + "system.cgi/shell",
        //contentType: "application/json",
        contentType: 'application/json;charset=utf-8',
        data: base64_cmd,
        type: "POST",
        success: function (data) {
            $("#msg-log").prepend(data + "<br\>");
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

// function shell(cmd) {
//     doShell(cmd);
// }

// 获取CPU、内存、硬盘占用情况
function getSysState() {
    $.ajax({
        url: getCGIPath() + "system.cgi/getSysState",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            $("#msg-log").prepend(data + "<br\>");
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

var step = 1;
var select_index = 0;

function startTest() {

    var msg = "";
    switch (step) {
        case 1:
            getSysState();
            msg = $.i18n.prop("center.read_information");
            break;
        case 2:
            shell("ping -c 1 " + $("#ip").val());
            //shell($("#ip").val());
            msg = $.i18n.prop("center.ping_test.tips");
            break;
        case 3:
            var sn = select_data[select_index].sn;
            var sort_id = parseInt(select_data[select_index].sort_id);
            var service = "switch";
            var value = {"on": 1};
            doDeviceControlBySn(sn, sort_id, service, value);
            msg = $.i18n.prop("center.control_all_open.tips");
            break;
        case 4:
            var sn = select_data[select_index].sn;
            var sort_id = parseInt(select_data[select_index].sort_id);
            var service = "switch";
            var value = {"off": 0};
            doDeviceControlBySn(sn, sort_id, service, value);
            msg = $.i18n.prop("center.control_all_close.tips");
            break;
    }

    if (step == 3 || step == 4) {
        select_index++;
        if (select_index == select_data.length) {
            select_index = 0;
            if (step == 4) {
                step = 1;
            } else {
                step++;
            }
        }
        timeoutId = setTimeout("startTest()", "1000");
    } else {
        step++;
        timeoutId = setTimeout("startTest()", "1000");
    }
    parent.showMessager(msg);

    
}

function stopTest() {
    closeLoading();
}

//JS
$(function () {
    getSorts();

    layui.use('code', function () {
        // 执行渲染
        //layui.code(); // 此处注释是因为修饰器在别的 js 中已经执行过了
        // custom more about
        layui.code({
            elem: '#custom1',
            about: [
                '<a href="javascript:;">复制</a>',
                '<a href="about:blank" target="_blank">跳转</a>'
            ].join('')
        });
    });

    layui.use(['table', 'form'], function () {
        table = layui.table;
        var form = layui.form;

        var obj = {
            elem: '#device-table'
            , limits: [100, 200]
            , limit: 100
            , title: '设备数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'dev_id', title: "id", width: 120, fixed: 'left', unresize: true}
                , {field: 'sn', title: 'sn', width: 180}
                , {field: 'name', title: $.i18n.prop("device.name"), width: 200}
                , {field: 'sort_id', title: $.i18n.prop("sort.name"), width: 200}
            ]]
            , page: false
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }
        }
        table.render(obj);
        

        form.on('switch(test-switch)', function (data) {
            //parent.log_switch = this.checked;
            if (this.checked) {
                select_data = table.checkStatus('device-table').data;
                console.log("select_data: " + select_data);
                console.log("select_data len: " + select_data.length);

                if (parseInt(select_data.length) == 0) {
                    layer.msg($.i18n.prop("center.combine_scene.select_device.tips"), {
                        time: 2000
                    });
                    if (this.checked)
                        $('#test-switch').removeAttr("checked");
                    else
                        $('#test-switch').attr( "checked", 'true');
                    form.render();
                    return;
                }

                if (parseInt(select_data.length) > 10) {
                    layer.msg($.i18n.prop("center.select_limit.tips"), {
                        time: 2000
                    });
                    if (this.checked)
                        $('#test-switch').removeAttr("checked");
                    else
                        $('#test-switch').attr( "checked", 'true');
                    form.render();
                    return;
                }
                var ip = $("#ip").val();
                console.log("ip: " + ip);
                if (ip == "" || !checkIP(ip)) {
                    layer.msg($.i18n.prop("center.enter_ip.tips"), {
                        time: 2000
                    });
                    if (this.checked)
                        $('#test-switch').removeAttr("checked");
                    else
                        $('#test-switch').attr( "checked", 'true');
                    form.render();
                    return;
                }

                is_test_start = true;
                select_index = 0;
                step = 1;
                startTest();
            } else {
                clearTimeout(timeoutId);
                timeoutId = -1;
                is_test_start = false;
                stopTest();
            }
        });

        
    });

    $("#clear").on('click', function () {
        $("#msg-log").html("");
    });
});
