var Eide = {
    dev_id: 0,
    name: "",
    sort_id: 0,
    sub_id: 0,
    funcs: "",
    func_total: 0
};

var eide_list = [];

function setEideList(data) {
    if (data.length == 0)
        eide_list = [];
    else
        eide_list = eide_list.concat(data);
}

function getEideList() {
    return eide_list;
}

function doGetEides() {
    sendMsgToHost("getEides", {});
}

function doDelEide(dev_id) {
    sendMsgToHost("delEide", {
        "dev_id": parseInt(dev_id)
    });
}

function doDelEides(ids) {
    sendMsgToHost("delEides", {
        "ids": ids
    });
}

function doSetEide(dev_id, sub_id, funcs) {
    sendMsgToHost("setEide", {
        "dev_id": parseInt(dev_id),
        "sub_id": parseInt(sub_id),
        "funcs": funcs,
    });
}

function createEideFuncs(sort_id) {
    $(".func-container").empty();
    var services = getServices(sort_id);
    for (index in services) {
        var service = services[index];
        console.log("name: " + service.name);
        var reg = new RegExp("\"", "g");
        var attrsstr = JSON.stringify(service.attrs).replace(reg, "&#34");
        createEideFunc(service.name, service.rw, attrsstr, "", "");

    }
}

function createEideFunc(service, rw, attr, func_id) {
    //prepend
    var html = "";
    html += '<div class="gaddr-item">\n' +
        '                <div class="item">\n' +
        '                   <div class="left">\n' +
        '                       <label class="layui-form-label"> ' + $.i18n.prop("center.knx.service")  + ' </label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <input name="serviceName" type="text" readonly="readonly" style="background-color: #fafafa;"\n' +
        '                           class="layui-input" value="' + service + '">\n' +
        '                   </div>\n'+
        '                </div>\n'
    html += 
        '                <div class="item">\n' +
        '                   <div class="left">\n' + 
        '                       <label class="layui-form-label">' + $.i18n.prop("eide.fun_id")  + '</label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <input name="serviceFuncId" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip")  + '" autocomplete="off"\n' +
        '                           class="layui-input" value="' + func_id + '">\n' +
        '                   </div>\n'+
        '                </div>\n'+
        '              </div>\n'
    $(".func-container").append(html);
        /*
        '                <label class="layui-form-label">属性</label>\n' +
        '                <div class="layui-input-block">\n' +
        '                    <input name="serviceAttr" type="text" lay-verify="required" placeholder="请输入" autocomplete="off"\n' +
        '                           class="layui-input" value="' + attr + '">\n' +
        '                </div>\n' +
        */
    layui.form.render();
}