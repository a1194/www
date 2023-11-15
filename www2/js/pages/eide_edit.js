
function msgCallback(data) {
    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "setEideCb") {
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
                getEide(getUrlParam("dev_id"));
            }
        }
    }
}

function setEide() {
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

    var objSubId = $('#sub_id');
    var sub_id = objSubId.val();
    if ("" == sub_id) {
        objSubId.tips({
            side: 3,
            msg: $.i18n.prop("center.eide.sub_id.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objSubId.focus();
        return;
    }

    var funcs = "[";
    var exit_flag = false;
    $(".func-item").each(function (i) {
        var value1 = $(this).find("input[name = 'serviceName']").val();
        var value2 = "";
        var value3 = $(this).find("input[name = 'serviceFuncId']").val();

        if (value3 == "") {
            $(this).tips({
                side: 1,
                msg: $.i18n.prop("center.function_id.tips"),
                bg: '#AE81FF',
                time: 3
            });
            exit_flag = true;
            return;
        }

        if (i != 0) {
            funcs += ',';
        }

        funcs += ('{"service":"' + value1 + '","attr":"' + value2 + '","func_id":' + value3 + '}');
    });
    funcs += ']';

    console.log("funcs: " + funcs);
    if (exit_flag)
        return;

    doSetEide(dev_id, sub_id, $.parseJSON(funcs));
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

function getEide(dev_id) {
    //表单提交
    var jsonstr = '{"dev_id":' + dev_id + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "eide.cgi/getEide",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            var dev_id = jsonobj.dev_id;
            var sort_id = getDevSort(dev_id);
            $("#form-eide-edit").setform(jsonobj);
            $("#name").val(getDevNameById(dev_id));
            $('#sort-select').val("" + sort_id);
            layui.form.render('select');
            for (index in jsonobj.funcs) {
                var func = jsonobj.funcs[index];
                var reg = new RegExp("\"", "g");
                var attrsstr = JSON.stringify(getSortAttrs(sort_id, func.service)).replace(reg, "&#34");
                var rw = getSortRw(sort_id, func.service);
                createEideFunc(func.service, rw, attrsstr, func.func_id);
            }
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}


function back() {
    window.location = "eide.html";
}


$(function () {
    // $("#form-eide-edit").append(
    //     `
            
    //     `
    // )
    
    layui.use(['layer', 'jquery', 'form'], function () {
        
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('select(sort-select)', function (data) {
            $('#name').val(getSortName(data.value));
            createEideFuncs(data.value);
        });
        form.render()
    });

    getSorts();
    getSortNames();
    
});