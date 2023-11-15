var RelayConfig = {
    dev_id: 0,
    relays: [],
    relay_total: 0,
    state: 0
};

var relay_config_list = [];

function setRelayConfigList(data) {
    if (data.length == 0)
        relay_config_list = [];
    else
        relay_config_list = relay_config_list.concat(data);
}

function getRelayConfigList() {
    return relay_config_list;
}

function doGetRelayConfigs() {
    sendMsgToHost("getRelayConfigs", {});
}

function doGetRelayConfig(dev_id) {
    sendMsgToHost("getRelayConfig", {
        "dev_id": parseInt(dev_id)
    });
}

function doSetRelayConfig(dev_id, relays_obj) {
    sendMsgToHost("setRelayConfig", {
        "dev_id": parseInt(dev_id),
        "relays": relays_obj
    });
}

function doDelRelayConfig(dev_id) {
    sendMsgToHost("delRelayConfig", {
        "dev_id": parseInt(dev_id)
    });
}

function doDelRelayConfigs(ids) {
    sendMsgToHost("delRelayConfigs", {
        "ids": ids
    });
}

function removeRelay(othis) {
    $(othis).parents(".relay-item").remove();
}

function createRelays(total) {
    $(".relay-container").empty();
    for (var i = 0; i < total && i < 4; i++) {
        createRelay(i + 1, 0, "继电器" + (i + 1), 0);
    }
}

function createRelay(no, type, name, delay) {
    no = parseInt(no);
    var options1 = "";
    switch (no) {
        case 1:
            options1 = '                        <option value="1" selected="true">1</option>\n' +
                '                        <option value="2">2</option>\n' +
                '                        <option value="3">3</option>\n' +
                '                        <option value="4">4</option>\n';
            break;
        case 2:
            options1 = '                        <option value="1">1</option>\n' +
                '                        <option value="2" selected="true">2</option>\n' +
                '                        <option value="3">3</option>\n' +
                '                        <option value="4">4</option>\n';
            break;
        case 3:
            options1 = '                        <option value="1">1</option>\n' +
                '                        <option value="2">2</option>\n' +
                '                        <option value="3" selected="true">3</option>\n' +
                '                        <option value="4">4</option>\n';
            break;
        case 4:
            options1 = '                        <option value="1">1</option>\n' +
                '                        <option value="2">2</option>\n' +
                '                        <option value="3">3</option>\n' +
                '                        <option value="4" selected="true">4</option>\n';
            break;
    }

    var options2 = '<option value="0" selected="true">普通继电器</option>\n';
    var options3 = '<option value="0" selected="true">0</option>\n';

    
    //prepend
    $(".relay-container").append(
    '               <div class="relay-item">\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("center.relay.name") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                       <input name="name" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip") + '" autocomplete="off"\n' +
    '                               class="layui-input" value="' + name + '"/>\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("center.relay.num") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +
    '                       <select name="no" id="relay-no">\n' +
    options1 +
    '                       </select>\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +
    '                       <label class="layui-form-label">' + $.i18n.prop("center.relay.type") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +   
    '                       <select name="type" lay-filter="relay-type" id="relay-type-' + no + '">\n' +
    options2 +
    '                       </select>\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <div class="item">\n' +
    '                   <div class="left">\n' +   
    '                       <label class="layui-form-label">' + $.i18n.prop("center.relay.delay_time") + '</label>\n' +
    '                   </div>\n' +
    '                   <div class="right">\n' +  
    '                       <select name="delay" id="relay-delay-' + no + '">\n' +
    options3 +
    '                       </select>\n' +
    '                   </div>\n' +
    '                </div>\n' +
    '                <a href="javascript:;" onclick="removeRelay(this)">&times;</a>\n' +
    '            </div>');

    layui.form.render();

    
}
