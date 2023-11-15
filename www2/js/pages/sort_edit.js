
function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "editSortCb") {
            if (obj.payload.result == 0) {
                closeWin(parent);
                showMessager($.i18n.prop("common.edit.tips"), obj.payload.result);
                parent.reLoad();
            } else {
                showMessager($.i18n.prop("common.edit_failure.tips"), obj.payload.result);
            }
        }
    }

    
}

function getSort(sort_id) {

    var jsonstr = '{"sort_id":' + sort_id + '}';
    console.log('jsonstr: ' + jsonstr);
    console.log(getCGIPath() + "sort.cgi/getSort");
    $.ajax({
        url: getCGIPath() + "sort.cgi/getSort",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            $("#form-sort-edit").setform(obj);
            //console.log("protocol: " + obj.protocol);
            $('#protocol-select').val("" + obj.protocol);
            $('#dev-type-select').val("" + obj.dev_type);
            $("#protocol-select").trigger("change");

            for (var index in obj.services) {
                var service = obj.services[index];
                //console.log("index: " + index);
                //console.log("attr: " + attrobj.attr);
                var reg = new RegExp("\"", "g");
                var attrsstr = JSON.stringify(service.attrs).replace(reg, "&#34");
                createService(service.name, attrsstr, parseInt(service.rw));
            }
            layui.form.render()
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
    
    
}

function removeService(othis) {
    $(othis).parents(".service-item").remove();
}

function editSort() {

    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();
    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: $.i18n.prop("sort.enter_name.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }

    var sort_id = $("input[name='sort_id']").val();
    var protocol = $("#protocol-select").val();
    var dev_type = $("#dev-type-select").val();

    //表单提交
    //var jsonstr = form2JsonString("form-sort-edit");
    var jsonstr = '{"sort_id":' + sort_id + ',' + '"name":"' + name + '","protocol":' + protocol + ',"dev_type":' + dev_type + ',"services":[';
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
            jsonstr += ',';
        }

        jsonstr += ('{"name":"' + value1 + '","attrs":' + value2 + ',"rw":' + value3 + '}');
    });
    jsonstr += ']}';
    //jsonstr = JSON.stringify({"name":"test","sorts":{"on":1}});
    //var jsonstr2 = form2JsonString("form-sort-edit");
    console.log('jsonstr: ' + jsonstr);
    doEditSort($.parseJSON(jsonstr));

    
}

function back() {
    window.location = "sort.html";
}

function createService(serviceName, serviceAttrs, rw) {
    var options = "";
    for(let i in RW) {
        if(getRwText(rw) == getRwText(RW[i])) {
            options += `<option selected="true" value="${RW[i]}">${getRwText(RW[i])}</option>`
        } else {
            options += `<option value="${RW[i]}">${getRwText(RW[i])}</option>`
        }
    }

    // switch (rw) {
    //     case 1:
    //         options = '                        <option value="1" selected="true">' + $.i18n.prop("common.only_write") + '</option>\n' +
    //             '                        <option value="2">' + $.i18n.prop("common.only_read") + '</option>\n' +
    //             '                        <option value="3">' + $.i18n.prop("common.read_or_write") + '</option>\n';
            
    //         break;
    //     case 2:
    //         options = '                        <option value="1">' + $.i18n.prop("common.only_write") + '</option>\n' +
    //             '                        <option value="2" selected="true">' + $.i18n.prop("common.only_read") + '</option>\n' +
    //             '                        <option value="3">' + $.i18n.prop("common.read_or_write") + '</option>\n';
    //         break;
    //     case 3:
    //         options = '                        <option value="1">' + $.i18n.prop("common.only_write") + '</option>\n' +
    //             '                        <option value="2">' + $.i18n.prop("common.only_read") + '</option>\n' +
    //             '                        <option value="3" selected="true">' + $.i18n.prop("common.read_or_write") + '</option>\n';
    //         break;
    //     default:
    //         options = '                        <option value="0" selected="true">' + $.i18n.prop("common.none") + '</option>\n' +
    //             '                        <option value="1">' + $.i18n.prop("common.only_write") + '</option>\n' +
    //             '                        <option value="2">' + $.i18n.prop("common.only_read") + '</option>\n' +
    //             '                        <option value="3">' + $.i18n.prop("common.read_or_write") + '</option>\n';
    //         break;
    // }

    //prepend
    $(".service-container").append(
    '               <div class="service-item">\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">'+ $.i18n.prop("sort.service") +'</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="serviceName" type="text" lay-verify="required" placeholder="'+ $.i18n.prop("common.input_tip") +'" autocomplete="off"\n' +
    '                           class="layui-input" value="' + serviceName + '">\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">'+ $.i18n.prop("sort.attribute") +'</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                    <input name="serviceAttrs" type="text" lay-verify="required" placeholder="'+ $.i18n.prop("common.input_tip") +'" autocomplete="off"\n' +
    '                           class="layui-input" value="' + serviceAttrs + '">\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">'+ $.i18n.prop("sort.permissions") +'</label>\n' +
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
        form.render()
    });

    getSort(getUrlParam("sort_id"));
});