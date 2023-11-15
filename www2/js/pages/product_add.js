var transfer = layui.transfer;

function back() {
    window.location = "product.html";
}

function addProduct() {

    var getData = transfer.getData('service-transfer'); //获取右侧数据
    var services = [];
    for (var i = 0; i < getData.length; i++) {
        console.log('service id: ' + getData[i]["value"]);
        services.push(parseInt(getData[i]["value"]));
    }

    //alert(JSON.stringify(services));
    //return;

    //表单验证
    var objName = $("input[name='name']");
    var name = objName.val();


    if ("" == name) {
        $("#name").tips({
            side: 3,
            msg: $.i18n.prop("common.enter_product.tips"),
            bg: '#AE81FF',
            time: 3
        });
        objName.focus();
        return;
    }
    var sort_id = $('#sort-select').val();

    //表单提交
    //var jsonstr = form2JsonString("form-prod-add");
    //var jsonstr = "{\"name\":\"" + name + "\"," + "\"services\":\"";
    var jsonstr = '{"name":"' + name + '","sort_id":' + sort_id + ',"services":' + JSON.stringify(services) + '}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "product.cgi/add",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            closeWin(parent);
            if(obj.result == 0) {
                showMessager($.i18n.prop("common.add.tips"), obj.result);
            } else {
                showMessager($.i18n.prop("common.add_failure.tips"), obj.result);
            }
            
            parent.reLoad();
        },
        error: function () {
            showMessager($.i18n.prop("common.create_failure.tips"), "-1");
        }
    });


    

    
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

function getServiceNames() {
    //表单提交
    var jsonstr = "{}";
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "service.cgi/getNames",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //$("#form-sysinfo").setform($.parseJSON(data));
            //formatDateTime();

            data = data.replace(/service_id/g, "value");
            data = data.replace(/name/g, "title");

            layui.transfer.render({
                elem: '#service-transfer'
                , title: [$.i18n.prop("product.not_selected"), $.i18n.prop("product.selected")]  //自定义标题
                , id: 'service-transfer'
                , data: $.parseJSON(data)
                //,width: 150 //定义宽度
                , height: 340 //定义高度
                , text: {
                    none: $.i18n.prop("common.no_data")
                }
            })

            transfer.reload('service-transfer', {
                data: $.parseJSON(data)
                // , showSearch: true
            })

            

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

        form.on('select(data-type-select)', function (data) {
            //alert(data.value);

        });

        transfer.render({
            elem: '#service-transfer'
            , title: ['未选择', '已选择']  //自定义标题
            , id: 'service-transfer'
            , data: []
            , value: []
            //,width: 150 //定义宽度
            , height: 210 //定义高度
            , showSearch: true
        });
    });

    getServiceNames();
    getSortNames();
});