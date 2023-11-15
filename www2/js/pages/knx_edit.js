
function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setKnxCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
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
            }
            setDevList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                getKnx(getUrlParam("dev_id"));
            }
        }
    }

    
}

function setKnx() {

    var objDevId = $("input[name='dev_id']");
            var dev_id = objDevId.val();
            if ("" == dev_id) {
                objDevId.tips({
                    side: 3,
                    msg: $.i18n.prop("common.enter_device_id.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objDevId.focus();
                return;
            }

            var objMaddr = $('#maddr');
            var maddr = objMaddr.val();
            if (!isKnxAddr(maddr)) {
                objMaddr.tips({
                    side: 3,
                    msg: $.i18n.prop("common.enter_physical_add.tips"),
                    bg: '#AE81FF',
                    time: 3
                });
                objMaddr.focus();
                return;
            }
            //var maddr = (parseInt(arr[0]) & 0xff) + ((parseInt(arr[1]) & 0xff) << 8) + ((parseInt(arr[2]) & 0xff) << 16);
            var maddr = knxAddrToIntAddr(maddr);
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
                            msg: $.i18n.prop("common.group_address_type.tips"),
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
                            msg: $.i18n.prop("common.group_address_type.tips"),
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

                gaddrs += ('{"service":"' + value1 + '","attr":"' + value2 + '","ctl_addr":' + ctl_addr + ',"sta_addr":' + sta_addr + '}');
            });
            gaddrs += ']';

            console.log("gaddrs: " + gaddrs);
            if (exit_flag)
                return;

            doSetKnx(dev_id, maddr, $.parseJSON(gaddrs));
    
    
}

function getDevices() {
    doGetDevices();
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
                var sort_id = parseInt(sortobj.sort_id);
                if (sort_id != SORT_ID.CONTROL_PANEL && sort_id != SORT_ID.AI_GATEWAY)
                    $('#sort-select').append(new Option(sortobj.name, sortobj.sort_id));
            }
            //$('#sort-select').append(new Option("开","1"));
            layui.form.render('select');
            getDevices();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function getKnx(dev_id) {
    //表单提交
    var jsonstr = '{"dev_id":' + dev_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "knx.cgi/getKnx",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            var dev_id = jsonobj.dev_id;
            var sort_id = getDevSort(dev_id);
            $("#form-knx-edit").setform(jsonobj);
            $("#name").val(getDevNameById(dev_id));
            $("#maddr").val(intAddrToKnxAddr(jsonobj.maddr));
            $('#sort-select').val("" + sort_id);
            layui.form.render('select');
            //createGAddrs(jsonobj.sort_id);
            for (index in jsonobj.gaddrs) {
                var gaddr = jsonobj.gaddrs[index];
                var reg = new RegExp("\"", "g");
                var attrsstr = JSON.stringify(getSortAttrs(sort_id, gaddr.service)).replace(reg, "&#34");
                var rw = getSortRw(sort_id, gaddr.service);
                createGAddr(gaddr.service, rw, attrsstr, intAddrToKnxAddr(gaddr.ctl_addr), intAddrToKnxAddr(gaddr.sta_addr));
            }
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function removeService(othis) {
    console.log(othis);
    $(othis).parents(".gaddr-item").remove();
}

function back() {
    window.location = "knx.html";
}


$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(sort-select)', function (data) {
            $('#name').val(getSortName(data.value));
            createGAddrs(data.value);
        });
    });

    getSorts();
    getSortNames();
});