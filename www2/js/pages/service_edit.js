
function getService(service_id) {
    //表单提交
    var jsonstr = '{"service_id":' + service_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/getService",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            $("#form-service-edit").setform(jsonobj);
            for (var index in jsonobj.attrs) {
                //console.log(key);
                var attr = jsonobj.attrs[index];
                var valueType = 0;
                var value = attr.value;
                if ($.type( value ) == "number")
                    valueType = 0;
                else if ($.type( value ) == "boolean")
                    valueType = 1;
                else if ($.type( value ) == "string")
                    valueType = 2;
                else if ($.type( value ) == "object") {
                    valueType = 3;
                    var reg = new RegExp("\"", "g");
                    value = JSON.stringify(value).replace(reg, "&#34");
                }
                createAttr(attr.key, valueType, "" + value);
            }
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function removeAttr(othis) {
    $(othis).parents(".attr-item").remove();
}

function editService() {

    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_service_name"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var service_id = $("input[name='service_id']").val();

    //表单提交
    //var jsonstr = form2JsonString("form-service-edit");
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
                msg: $.i18n.prop("common.content_empty"),
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
    //var jsonstr2 = form2JsonString("form-service-edit");
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/edit",
        contentType: "application/json",
        //data:JSON.stringify({"id":"1"}),  //如果不添加  contentType:"application/json" 则data必须是json对象，应该是{"id"："1"}
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.edit.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.result);
            }
            parent.reLoad();
        },
        error: function () {
            showMessager($.i18n.prop("common.edit_failure.tips"), "-1");
        }
    });


    
}

function back() {
    window.location = "service.html";
}

function createAttr(key, valueType, value) {
    var options = "";
    
    switch (valueType) {
        case 0:
            options = '                        <option value="0" selected="true">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3">object</option>\n';
            break;
        case 1:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1" selected="true">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3">object</option>\n';
            break;
        case 2:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2" selected="true">string</option>\n' +
                '                        <option value="3">object</option>\n';
            break;
        case 3:
            options = '                        <option value="0">int</option>\n' +
                '                        <option value="1">bool</option>\n' +
                '                        <option value="2">string</option>\n' +
                '                        <option value="3" selected="true">object</option>\n';
            break;
    }
    //prepend
    $(".attr-container").append(
    '               <div class="attr-item">\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("service.attribute") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="attr" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip") + '" autocomplete="off"\n' +
    '                           class="layui-input" value="' + key + '">\n' +
    '                   </div>\n' +
    '                 </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("service.value_type") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <select name="value-type" id="value-type">\n' +
    options +
    '                    </select>\n' +
    '                   </div>\n' +
    '                 </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("service.value") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="value" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip") + '" autocomplete="off"\n' +
    '                           class="layui-input" value="' + value + '">\n' +
    '                   </div>\n' +
    '                 </div>\n' +
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
    });

    getService(getUrlParam("service_id"));
});