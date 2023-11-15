var KeyConfig = {
    dev_id: 0,
    keys: [],
    key_total: 0,
    state: 0
};

var key_config_list = [];

var allKeyLength = -1

function setKeyConfigList(data) {
    if (data.length == 0)
        key_config_list = [];
    else
        key_config_list = key_config_list.concat(data);
}

function getKeyConfigList() {
    return key_config_list;
}

function doGetKeyConfigs() {
    sendMsgToHost("getKeyConfigs", {});
}

function doGetKeyConfig(dev_id) {
    sendMsgToHost("getKeyConfig", {
        "dev_id": parseInt(dev_id)
    });
}

function doSetKeyConfig(dev_id, keys_obj) {
    sendMsgToHost("setKeyConfig", {
        "dev_id": parseInt(dev_id),
        "keys": keys_obj
    });
}

function doDelKeyConfig(dev_id) {
    sendMsgToHost("delKeyConfig", {
        "dev_id": parseInt(dev_id)
    });
}

function doDelKeyConfigs(ids) {
    sendMsgToHost("delKeyConfigs", {
        "ids": ids
    });
}

function removeKey(othis) {
    $(othis).parents(".key-item").remove();
}

function createKeys(total) {
    $(".key-container").empty();
    for (var i = 0; i < total && i < 6; i++) {
        createKey(i + 1, 0, "按键" + (i + 1), 0);
    }
}

function createKey(no, type, name, value, length) {
    no = parseInt(no);
    var options1 = "";
    for (let i = 0; i < length; i++) {
        let index = i + 1
        if (index == no) {
            options1 += `<option value="${index}" selected="true">${index}</option>`
        } else {
            options1 += `<option value="${index}">${index}</option>`
        }
    }

    var options2 = ''
    // const types = ["本地按键", "场景执行", "按键上报"]
    // types.forEach((item, index) => {
    //     options2 += `<option value="${index}" selected="${index == type}">${item}</option>`
    // })
    switch (type) {
        case 0:
            options2 = '                        <option value="0" selected="true">本地按键</option>\n' +
                '                        <option value="1">场景执行</option>\n' +
                '                        <option value="2">按键上报</option>\n';
            break;
        case 1:
            options2 = '                        <option value="0">本地按键</option>\n' +
                '                        <option value="1" selected="true">场景执行</option>\n' +
                '                        <option value="2">按键上报</option>\n';
            break;
        case 2:
            options2 = '                        <option value="0">本地按键</option>\n' +
                '                        <option value="1">场景执行</option>\n' +
                '                        <option value="2" selected="true">按键上报</option>\n';
            break;
    }

    var options3 = '';
    if (type == 1) {
        var list = getSceneList();
        for (index in list) {
            var scene = list[index];
            if (scene.scene_id == value)
                var $op = '<option value="' + scene.scene_id + '" selected="true">' + scene.name + '</option>';
            else
                var $op = '<option value="' + scene.scene_id + '">' + scene.name + '</option>';
            options3 += $op;
        }
    } else {
        options3 = `<option value="0" selected="true">${$.i18n.prop("common.none")}</option>\n`;
    }


    $(".key-container").append(
        '               <div class="key-item">\n' +
        '                <div class="item">\n' +
        '                   <div class="left">\n' +
        '                    <label class="layui-form-label">' + $.i18n.prop("center.key_config.button.name") + '</label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <input name="name" type="text" lay-verify="required" placeholder="' + $.i18n.prop("common.input_tip") + '" autocomplete="off"\n' +
        '                           class="layui-input" value="' + name + '"/>\n' +
        '                   </div>\n' +
        '                </div>\n' +
        '                <div class="item">\n' +
        '                   <div class="left">\n' +
        '                       <label class="layui-form-label">' + $.i18n.prop("center.key_config.button.num") + '</label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <select name="no" id="key-no">\n' +
        options1 +
        '                    </select>\n' +
        '                   </div>\n' +
        '                </div>\n' +
        '                <div class="item">\n' +
        '                   <div class="left">\n' +
        '                       <label class="layui-form-label">' + $.i18n.prop("center.key_config.button.type") + '</label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <select name="type" lay-filter="key-type" id="key-type-' + no + '" data-no=' + no +'>\n' +
        options2 +
        '                    </select>\n' +
        '                   </div>\n' +
        '                </div>\n' +
        '                <div class="item">\n' +
        '                   <div class="left">\n' +
        '                       <label class="layui-form-label">' + $.i18n.prop("center.key_config.button.value") + '</label>\n' +
        '                   </div>\n' +
        '                   <div class="right">\n' +
        '                    <select name="value" id="key-value-' + no + '" >\n' +
        options3 +
        '                    </select>\n' +
        /*
        '                <div class="layui-input-block">\n' +
        '                    <input name="value" type="text" lay-verify="required" placeholder="请输入" autocomplete="off"\n' +
        '                           class="layui-input" value="' + value + '">\n' +
        */
        '                   </div>\n' +
        '                </div>\n' +
        '                <a href="javascript:;" onclick="removeKey(this)">&times;</a>\n' +
        '            </div>');


    layui.form.on('select(key-type)', function (data) {
        var elem = data.elem; // 获得 select 原始 DOM 对象
        var value = data.value; // 获得被选中的值
        var othis = data.othis; // 获得 select 元素被替换后的 jQuery 对象

        // console.log(elem, value);
        console.log($(elem).attr("data-no"));
        const no = $(elem).attr("data-no")

        if (value == '1') {
            var list = getSceneList();
            console.log(list);
            $(`#key-value-${Number(no)}`).empty()
            list.forEach((item, index) => {
                // console.log($(`#key-value-${Number(value)}`));
                if(index == 0) {
                    $(`#key-value-${Number(no)}`).append(`<option value="${item.scene_id}" selected="true">${item.name}</option>`)
                } else {
                    $(`#key-value-${Number(no)}`).append(`<option value="${item.scene_id}">${item.name}</option>`)
                }
            })
        } else {
            $(`#key-value-${Number(no)}`).empty()
            $(`#key-value-${Number(no)}`).append(`<option value="0" selected="true">${$.i18n.prop("common.none")}</option>`)
        }

        layui.form.render();
    });
    layui.form.render();



}
