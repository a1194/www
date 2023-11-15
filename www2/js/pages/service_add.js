
function removeAttr(othis) {
    $(othis).parents(".attr-item").remove();
}



function addService() {
    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: '请输入服务名称',
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var objServiceId = $("#service_id");
    var service_id = objServiceId.val();
    if ("" == service_id) {
        objServiceId.tips({
            side: 3,
            msg: '请选择服务ID',
            bg: '#AE81FF',
            time: 3
        });
        objServiceId.focus();
        return;
    }

    //表单提交
    //var jsonstr = form2JsonString("form-service-add");
    var jsonstr = '{"service_id":' + service_id + ',' + '"name":"' + name + '","attrs":[';
    $(".attr-item").each(function (i) {
        var value1 = $(this).find("input[name = 'attr']").val();
        var value2 = $(this).find("select[name = 'value-type']").val();
        var value3 = $(this).find("input[name = 'value']").val();
        //console.log('value1: ' + value1);
        //console.log('value2: ' + value2);
        //console.log('value3: ' + value3);
        if (value1 == "" || value3 == "") {
            $(this).tips({
                side: 1,
                msg: '内容不能为空',
                bg: '#AE81FF',
                time: 3
            });
            return;
        }

        if (i != 0) {
            jsonstr += ',';
        }

        if (value2 == 2)        //string type
            jsonstr += ('{"key":"' + value1 + '","value":"' + value3 + '"}');
        else
            jsonstr += ('{"key":"' + value1 + '","value":' + value3 + '}');
    });
    jsonstr += ']}';
    //jsonstr = JSON.stringify({"name":"test","services":{"on":1}});
    //var jsonstr2 = form2JsonString("form-service-add");
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/add",
        contentType: "application/json",
        //data:JSON.stringify({"id":"1"}),  //如果不添加  contentType:"application/json" 则data必须是json对象，应该是{"id"："1"}
        data: jsonstr,
        //data: jsonstr,
        //data: $.parseJSON(jsonstr),
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            showMessager(obj.msg, obj.result);
            parent.reLoad();
        },
        error: function () {
            showMessager("创建失败", "-1");
        }
    });
}

function back() {
    window.location = "service.html";
}

/*
{"gw":{"rstKey":120}}

{"hilink":{"netLed":121}}

{"tuya":{"netLed":121}}

{"knx":{"baud":19200, "datLed":122}}

{"blemesh":{"baud":9600, "datLed":122}}

{"io":{"type":"out","num":126,"value":0}}

{"io":{"type":"in","num":127}}

{"ble":{"baud":9600, "datLed":128}}

{"sensor":{"type":"tempAndHumidity"}}
*/

/*
function createSkills(type) {
    $(".service-container").empty();
    switch (type) {
        case 1:         //网关模版
            createSkill("网关功能", "{\"gw\":{\"rstKey\":120}}");
            createSkill("Hilink生态", "{\"hilink\":{\"netLed\":121}}");
            createSkill("KNX通讯", "{\"knx\":{\"baud\":19200, \"datLed\":122}}");
            break;
        case 2:         //中控屏模版
            createSkill("网关功能", "{\"gw\":{\"rstKey\":120}}");
            createSkill("涂鸦生态", "{\"tuya\":{\"netLed\":121}}");
            createSkill("BleMesh通讯", "{\"blemesh\":{\"baud\":9600, \"datLed\":122}}");
            break;
        case 3:         //AI音箱模版
            break;
        case 4:         //按键面板模版
            createSkill("按键1", "{\"io\":{\"type\":\"in\",\"num\":1}}");
            createSkill("按键2", "{\"io\":{\"type\":\"in\",\"num\":2}}");
            createSkill("按键3", "{\"io\":{\"type\":\"in\",\"num\":3}}");
            createSkill("按键4", "{\"io\":{\"type\":\"in\",\"num\":4}}");
            break;
        case 5:         //温控主机模版
            break;
    }
}
*/

function createAttrs(service_id) {
    $(".attr-container").empty();
    switch (parseInt(service_id)) {
        case SERVICE_ID.KEY:
            createAttr("no", 0, 6);
            break;
        case SERVICE_ID.BLE_MESH:
            //createAttr("baud", 0, 115200);
            createAttr("ifName", 2, "/dev/ttyS5");
            break;
        case SERVICE_ID.KNX:
            createAttr("baud", 0, 19200);
            createAttr("ifName", 2, "/dev/ttyS3");
            break;
        case SERVICE_ID.HILINK:
            createAttr("ifName", 2, "eth0");
            break;
        case SERVICE_ID.TUYA:
            createAttr("ifName", 2, "eth0");
            break;
        case SERVICE_ID.FEIYAN:
            createAttr("ifName", 2, "eth0");
            break;
        case SERVICE_ID.WDOG:
            createAttr("io", 0, 2);
            break;
    }
}

function createAttr(key, valueType, value) {
    var options = "";
    switch (valueType) {
        case 0:
            options = '                        <option value="0" selected="true">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3">array</option>\n';
            break;
        case 1:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1" selected="true">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3">array</option>\n';
            break;
        case 2:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2" selected="true">string</option>\n' +
                '                        <option value="3">array</option>\n';
            break;
        case 3:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3" selected="true">array</option>\n';
            break;
    }
    //prepend
    $(".attr-container").append('<div class="attr-item">\n' +
        '                <label class="layui-form-label">属性</label>\n' +
        '                <div class="layui-input-block">\n' +
        '                    <input name="attr" type="text" lay-verify="required" placeholder="请输入" autocomplete="off"\n' +
        '                           class="layui-input" value="' + key + '">\n' +
        '                </div>\n' +
        '                <label class="layui-form-label">值类型</label>\n' +
        '                <div class="layui-input-block">\n' +
        '                    <select name="value-type" id="value-type">\n' +
        options +
        '                    </select>\n' +
        '                </div>\n' +
        '                <label class="layui-form-label">值</label>\n' +
        '                <div class="layui-input-block">\n' +
        '                    <input name="value" type="text" lay-verify="required" placeholder="请输入" autocomplete="off"\n' +
        '                           class="layui-input" value="' + value + '">\n' +
        '                </div>\n' +
        '                <a href="javascript:;" onclick="removeAttr(this)">&times;</a>\n' +
        '            </div>');
    layui.form.render();
}

$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });

        form.on('select(service-id-select)', function (data) {
            createAttrs(data.value);
            //console.log('custom: ' + custom.val());
        });
    });
});
