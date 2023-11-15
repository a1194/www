var keep_is_dhcp = 0;

function editNetwork() {

    layui.layer.open({
        type: 1
        ,
        title: false
        ,
        closeBtn: false
        ,
        offset: 'auto'
        ,
        content: '<div style="padding: 20px 50px 20px 50px; line-height: 24px; background-color: #393D49; color: #fff; font-weight: 300;">' + $.i18n.prop("netconfig.warn.tips") + '</div>'
        ,
        btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.close")]
        ,
        area: '300px;'
        ,
        btnAlign: 'c' //按钮居中
        ,
        shade: [0.5, '#fff']
        ,
        yes: function () {
            if (keep_is_dhcp) {
                //表单验证
                var objDns = $("input[name='dns']");
                var dns = objDns.val();
                if ("" == dns || !checkIP(dns)) {
                    $("#dns").tips({
                        side: 3,
                        msg: $.i18n.prop("netconfig.enter_dns_add.tips"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    objDns.focus();
                    return;
                }
                var json_obj = {
                    "is_dhcp": keep_is_dhcp,
                    "dns": dns
                };
                console.log(JSON.stringify(json_obj));
                showMessager($.i18n.prop("common.setting.tips"));
                doEditNetwork(json_obj);
            } else {
                //表单验证
                var objIp = $("input[name='ip']");
                var ip = objIp.val();
                if ("" == ip || !checkIP(ip)) {
                    $("#ip").tips({
                        side: 3,
                        msg: $.i18n.prop("netconfig.enter_ip_add.tips"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    objIp.focus();
                    return;
                }

                var objGw = $("input[name='gw']");
                var gw = objGw.val();
                if ("" == gw || !checkIP(gw)) {
                    $("#gw").tips({
                        side: 3,
                        msg: $.i18n.prop("netconfig.enter_gateway_add.tips"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    objGw.focus();
                    return;
                }

                var objMask = $("input[name='mask']");
                var mask = objMask.val();
                if ("" == mask) {
                    $("#mask").tips({
                        side: 3,
                        msg: $.i18n.prop("netconfig.sub_mask.tips"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    objMask.focus();
                    return;
                }

                var objDns = $("input[name='dns']");
                var dns = objDns.val();
                if ("" == dns || !checkIP(dns)) {
                    $("#dns").tips({
                        side: 3,
                        msg: $.i18n.prop("netconfig.enter_dns_add.tips"),
                        bg: '#AE81FF',
                        time: 3
                    });
                    objDns.focus();
                    return;
                }
                var json_obj = {
                    "is_dhcp": keep_is_dhcp,
                    "ip": ip,
                    "gw": gw,
                    "mask": mask,
                    "dns": dns
                };
                console.log(JSON.stringify(json_obj));
                showMessager($.i18n.prop("common.setting.tips"));
                doEditNetwork(json_obj);
            }


            //var jsonstr = "{\"ip\":\"" + ip + "\"}";
            // $.ajax({
            //     url: getCGIPath() + "setting.cgi/setSetting",
            //     contentType: "application/json",
            //     data: jsonstr,
            //     type: "POST",
            //     success: function (data) {
            //         console.log(data);
            //         $("#form-setting").setform($.parseJSON(data));
            //         showMessager("设置成功");
            //     },
            //     error: function () {
            //         showMessager("操作失败", "-1");
            //     }
            // });
            layui.layer.closeAll();
        }
        ,
        no: function (index, layero) {
            layui.layer.closeAll();
        }
    });

    
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
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

/*
function setDhcp() {
    //shell("udhcpc &");
    //return;
    layui.layer.open({
        type: 1
        ,
        title: false
        ,
        closeBtn: false
        ,
        offset: 'auto'
        ,
        content: '<div style="padding: 20px 50px 20px 50px; line-height: 24px; background-color: #393D49; color: #fff; font-weight: 300;">设置DHCP需要使用新的IP重新进入，确定要设置吗？</div>'
        ,
        btn: ['确定', '关闭']
        ,
        area: '300px;'
        ,
        btnAlign: 'c' //按钮居中
        ,
        shade: [0.5, '#fff']
        ,
        yes: function () {
            var json_obj = {
                "is_dhcp":1,
                "dns":
            };
            doEditSetting(json_obj);
            // $.ajax({
            //     url: getCGIPath() + "setting.cgi/setSetting",
            //     contentType: "application/json",
            //     data: "{\"is_dhcp\":1}",
            //     type: "POST",
            //     success: function (data) {
            //         console.log(data);
            //         $("#form-setting").setform($.parseJSON(data));
            //         showMessager("设置成功");
            //     },
            //     error: function () {
            //         showMessager("操作失败", "-1");
            //     }
            // });
            layui.layer.closeAll();
        }
        ,
        no: function (index, layero) {
            layui.layer.closeAll();
        }
    });
}
*/

function formatDateTime(inputTime) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}

function getSetting() {
    //表单提交
    $.ajax({
        url: getCGIPath() + "setting.cgi/getSetting",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            console.log(data);
            var json_obj = $.parseJSON(data);
            $("#form-setting").setform(json_obj);
            //console.log("is_dhcp: " + $('input[name="is_dhcp"]:checked').val());
            console.log("is_dhcp: " + json_obj.is_dhcp);

            if (json_obj.is_dhcp) {
                //$('input[name="is_dhcp"]:eq(0)').attr('checked',true);
               // $('input[name="is_dhcp"]:eq(1)').attr('checked',false);
                $("#ip").attr("disabled","disabled")
                $("#mask").hide();
                $("#gw").hide();
            }
            else {
               // $('input[name="is_dhcp"]:eq(0)').attr('checked',false);
                //$('input[name="is_dhcp"]:eq(1)').attr('checked',true);
                $("#ip").removeAttr('disabled');
                $("#mask").show();
                $("#gw").show();
                keep_is_dhcp = 0;
            }
            keep_is_dhcp = json_obj.is_dhcp;

            layui.form.render();
            //formatDateTime();
        },
        error: function () {
            showMessager("操作失败", "-1");
        }
    });
}

// function msgCallback(msg) {
//     var obj = $.parseJSON(msg);
//     switch (obj.cmd) {
//         case 101: {
//             if (obj.payload != null && obj.payload != "") {
//                 var payloadObj = $.parseJSON(obj.payload);
//                 var ip = payloadObj.ip;
//                 var mac = payloadObj.mac;
//             }
//             break;
//         }
//     }
// }

$(function () {
    getSetting();

    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;
        form.on('radio(is_dhcp)', function (data) {
            if (this.value == "0") {
                //getSetting();
                $("#ip").removeAttr('disabled');
                $("#mask").show();
                $("#gw").show();
                keep_is_dhcp = 0;
            } else if (this.value == "1") {
                $("#ip").attr("disabled","disabled")
                $("#mask").hide();
                $("#gw").hide();
                keep_is_dhcp = 1;
            }
        });
        $(".no").attr("title", $.i18n.prop("common.no"))
        $(".yes").attr("title", $.i18n.prop("common.yes"))
        form.render()
    });

    // $('input[type=radio][name='is_dhcp]').change(function () {
    //     alert(123);
    // });
});