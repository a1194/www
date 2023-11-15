
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "addSortCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.add.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.payload.result);
            }
        }
    }
    
}

function removeService(othis) {
    $(othis).parents(".service-item").remove();
}

function addSort() {

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

    var protocol = $("#protocol-select").val();
    var dev_type = $("#dev-type-select").val();

    var json_str = '{"name":"' + name + '","protocol":' + protocol + ',"dev_type":' + dev_type + ',"services":';
    var services = "[";
    $(".service-item").each(function (i) {
        var value1 = $(this).find("input[name = 'serviceName']").val();
        var value2 = $(this).find("input[name = 'serviceAttrs']").val();
        var value3 = $(this).find("select[name = 'rw-type']").val();
        //console.log('value1: ' + value1);
        //console.log('value2: ' + value2);
        if (value1 == "") {
            $(this).tips({
                side: 1,
                msg: $.i18n.prop("common.content_empty"),
                bg: '#AE81FF',
                time: 3
            });
            return;
        }

        if (i != 0) {
            services += ',';
        }

        services += ('{"name":"' + value1 + '","attrs":' + value2 + ',"rw":' + value3 + '}');
    });
    services += ']';
    console.log("services: " + services);
    if (services == "[]")
        return;

    json_str = json_str + services + "}";
    console.log('json_str: ' + json_str);
    doAddSort($.parseJSON(json_str));

    
}

function back() {
    window.location = "sort.html";
}

function createService(serviceName, serviceAttrs, rw) {
    var options = "";
    switch (rw) {
        case 1:
            options = '                        <option value="1" selected="true">'+ $.i18n.prop("common.only_write") +'</option>\n' +
            '                        <option value="2">'+ $.i18n.prop("common.only_read") +'</option>\n' +
            '                        <option value="3">'+ $.i18n.prop("common.read_or_write") +'</option>\n';

            break;
        case 2:
            options = '                        <option value="1">'+ $.i18n.prop("common.only_write") +'</option>\n' +
            '                        <option value="2" selected="true">'+ $.i18n.prop("common.only_read") +'</option>\n' +
            '                        <option value="3">'+ $.i18n.prop("common.read_or_write") +'</option>\n';

            
            break;
        case 3:
            options = '                        <option value="1">'+ $.i18n.prop("common.only_write") +'</option>\n' +
            '                        <option value="2">'+ $.i18n.prop("common.only_read") +'</option>\n' +
            '                        <option value="3" selected="true">'+ $.i18n.prop("common.read_or_write") +'</option>\n';
            break;
    }
    //prepend
    $(".service-container").append('<div class="service-item">\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' +  $.i18n.prop("sort.service") +'</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="serviceName" type="text" lay-verify="required" placeholder="' +  $.i18n.prop("common.input_tip") +'" autocomplete="off"\n' +
    '                           class="layui-input" value="' + serviceName + '">\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' +  $.i18n.prop("sort.attribute") +'</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="serviceAttrs" type="text" lay-verify="required" placeholder="' +  $.i18n.prop("common.input_tip") +'" autocomplete="off"\n' +
    '                           class="layui-input" value="' + serviceAttrs + '">\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' +  $.i18n.prop("sort.permissions") +'</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <select name="rw-type" id="rw-type">\n' +
    options +
    '                    </select>\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <a href="javascript:;" onclick="removeService(this)">&times;</a>\n' +
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
        // for(const item of devType) {
        //     $("#dev-type-select").append(`<option value=${item.value}>${item.name}</option>`)
        // }
        // form.render("#dev-type-select")
        form.render()
    });



});