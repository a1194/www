var Knx = {
    dev_id: 0,
    name: "",
    sort_id: 0,
    maddr: 0,
    gaddrs: "",
    gaddr_total: 0
};

var knx_list = [];

function setKnxList(data) {
    if (data.length == 0)
        knx_list = [];
    else
        knx_list = knx_list.concat(data);
}

function getKnxList() {
    return knx_list;
}

function doGetKnxs() {
    sendMsgToHost("getKnxs", {});
}

function doDelKnx(dev_id) {
    sendMsgToHost("delKnx", {
        "dev_id": parseInt(dev_id)
    });
}

function doDelKnxs(ids) {
    sendMsgToHost("delKnxs", {
        "ids": ids
    });
}

function doSetKnx(dev_id, maddr, gaddrs) {
    sendMsgToHost("setKnx", {
        "dev_id": parseInt(dev_id),
        "maddr": parseInt(maddr),
        "gaddrs": gaddrs,
    });
}

function intAddrToKnxAddr(addr) {
    return ((addr & 0xff0000) >> 16) + "/" + ((addr & 0xff00) >> 8) + "/" + (addr & 0xff);
}

function knxAddrToIntAddr(addr_str) {
    var arr = addr_str.split("/");
    if (arr.length == 3)
        return parseInt(arr[2]) + (parseInt(arr[1]) << 8) + (parseInt(arr[0]) << 16);
    else
        return 0;
}

function isKnxAddr(addr_str) {
    return addr_str.split("/").length == 3 ? true : false;
}

function createGAddrs(sort_id) {
    $(".gaddr-container").empty();
    var services = getServices(sort_id);
    for (index in services) {
        var service = services[index];
        console.log("name: " + service.name);
        var reg = new RegExp("\"", "g");
        var attrsstr = JSON.stringify(service.attrs).replace(reg, "&#34");
        createGAddr(service.name, service.rw, attrsstr, "", "");

        // for (key in service.attrs) {
        //     createGAddr(service.name, key, "", "");
        //     var node = {
        //         "service": service.name,
        //         "attr": key,
        //         "ctl_addr": 0,
        //         "sta_addr": 0
        //     };
        //     //gaddr_list.push(node);
        // }
    }
}

function createGAddr(service, rw, attr, ctl_addr, sta_addr) {
    //prepend
    
        /*
        '                <label class="layui-form-label">属性</label>\n' +
        '                <div class="layui-input-block">\n' +
        '                    <input name="serviceAttr" type="text" lay-verify="required" placeholder="请输入" autocomplete="off"\n' +
        '                           class="layui-input" value="' + attr + '">\n' +
        '                </div>\n' +
        */

        var html = "";
                html += '<div class="gaddr-item">\n' +
                    '                <div class="item">\n' +
                    '                   <div class="left">\n' +
                    '                       <label class="layui-form-label">' + $.i18n.prop("center.knx.service")+ '</label>\n' +
                    '                   </div>\n' +
                    '                   <div class="right">\n' +
                    '                    <input name="serviceName" type="text" readonly="readonly" style="background-color: #fafafa;"\n' +
                    '                           class="layui-input" value="' + service + '">\n' +
                    '                   </div>\n'+
                    '                </div>\n';
                if (rw == RW.QUERY_SET || rw == RW.QUERY_SET_NOTIFY) {
                    html += 
                    '                <div class="item">\n' +
                    '                   <div class="left">\n' +
                    '                       <label class="layui-form-label">' + $.i18n.prop("center.kxn.control_add")+ '</label>\n' +
                    '                   </div>\n' +
                    '                   <div class="right">\n' +
                    '                       <input name="serviceCtlAddr" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip")+ '" autocomplete="off"\n' +
                    '                           class="layui-input" value="' + ctl_addr + '">\n' +
                    '                   </div>\n'+
                    '                </div>\n';
                } else {
                    html += 
                    '                <div class="item">\n' +
                    '                   <div class="left">\n' +
                    '                      <label class="layui-form-label">' + $.i18n.prop("center.kxn.control_add")+ '</label>\n' +
                    '                   </div>\n' +
                    '                   <div class="right">\n' +
                    '                    <input name="serviceCtlAddr" type="text" readonly="readonly" style="background-color: #fafafa;"\n' +
                    '                           class="layui-input" value="' + ctl_addr + '">\n' +
                    '                   </div>\n'+
                    '                </div>\n';
                }

                if (true) {
                    html += 
                    '                <div class="item">\n' +
                    '                   <div class="left">\n' +
                    '                       <label class="layui-form-label">' + $.i18n.prop("center.knx.state_add")+ '</label>\n' +
                    '                   </div>\n' +
                    '                   <div class="right">\n' +
                    '                    <input name="serviceStaAddr" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip")+ '" autocomplete="off"\n' +
                    '                           class="layui-input" value="' + sta_addr + '">\n' +
                    '                   </div>\n' +
                    '                 </div>\n'+
                    '                <a href="javascript:;" onclick="removeService(this)">&times;</a>\n' +
                    '            </div>';
                } else {
                    html += 
                    '                <div class="item">\n' +
                    '                   <div class="left">\n' +
                    '                       <label class="layui-form-label">' + $.i18n.prop("center.knx.state_add")+ '</label>\n' +
                    '                   </div>\n' +
                    '                   <div class="right">\n' +
                    '                    <input name="serviceStaAddr" type="text" readonly="readonly" style="background-color: #fafafa;"\n' +
                    '                           class="layui-input" value="' + sta_addr + '">\n' +
                    '                   </div>\n' +
                    '                 </div>\n'+
                    '                <a href="javascript:;" onclick="removeService(this)">&times;</a>\n' +
                    '            </div>';
                }

                $(".gaddr-container").append(html);


                layui.form.render();
    
}