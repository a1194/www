var Device = {
    dev_id: 0,
    name: "",
    sort_id: 0,
    protocol: 0,
    room_id: 0,
    sn: "",
    addr: 0,
    state_len: 0,
    states: []
};

var slider_send_change = false;
var dev_list = [];
var all_dev_list = [];
var action_type = 0;

function setActionType(type) {
    action_type = type;
}

function setAllDevList(data) {
    if (data.length == 0)
        all_dev_list = [];
    else
        all_dev_list = all_dev_list.concat(data);
}

function getAllDevName(sn) {
    sn = sn + "";
    for (var index in all_dev_list) {
        var dev = all_dev_list[index];
        if (dev.sn == sn) {
            return dev.name;
        }
    }
    return "";
}

function setDevList(data) {
    if (data.length == 0)
        dev_list = [];
    else
        dev_list = dev_list.concat(data);
}

function getDevList() {
    return dev_list;
}

function getSubDevList() {
    var new_dev_list = [];
    for (let i in dev_list) {
        if (dev_list[i].sort_id == SORT_ID.CONTROL_PANEL || dev_list[i].sort_id == SORT_ID.AI_GATEWAY)
            continue;
        new_dev_list.push(dev_list[i]);
    }
    return new_dev_list;
}

function getDevNameById(id) {
    id = parseInt(id);
    for (index in dev_list) {
        var dev = dev_list[index];
        if (dev.dev_id == id) {
            return dev.name;
        }
    }
    return "";
}

function getDevSort(dev_id) {
    dev_id = parseInt(dev_id);
    for (i in dev_list) {
        if (dev_list[i].dev_id == dev_id) {
            return dev_list[i].sort_id;
        }
    }
    return 0;
}

function getDevSortBySn(sn) {
    for (i in dev_list) {
        if (dev_list[i].sn == sn) {
            return dev_list[i].sort_id;
        }
    }
    return 0;
}

function getDevName(sn) {
    sn = sn + "";
    for (var index in dev_list) {
        var dev = dev_list[index];
        if (dev.sn == sn) {
            return dev.name;
        }
    }
    return "";
}

function getDevSn(dev_id) {
    dev_id = parseInt(dev_id);
    for (i in dev_list) {
        if (dev_list[i].dev_id == dev_id) {
            return dev_list[i].sn;
        }
    }
    return "";
}

function doGetDeviceInfo(dev_id) {
    sendMsgToHost("getDeviceInfo", {
        "dev_id": parseInt(dev_id)
    });
}

function doGetDevices() {
    sendMsgToHost("getDevices", {});
}

function doDelDevice(dev_id) {
    sendMsgToHost("delDevice", {
        "dev_id": parseInt(dev_id)
    });
}

function doDelDevices(ids) {
    sendMsgToHost("delDevices", {
        "ids": ids
    });
}

function doEditDevice(msg_obj) {
    sendMsgToHost("editDevice", msg_obj);
}

function doSaveDevice(sn, room_id, name) {
    sendMsgToHost("saveDevice", {
        "sn": sn,
        "room_id": parseInt(room_id),
        "name": name
    });
}

function doAddKnxDevice(room_id, name, sort_id, maddr, gaddrs) {
    sendMsgToHost("addKnxDevice", {
        "name": name,
        "room_id": parseInt(room_id),
        "sort_id": parseInt(sort_id),
        "maddr": parseInt(maddr),
        "gaddrs": gaddrs,
    });
}

function doDeviceControlBySn(sn, sort_id, service, msg_obj) {
    var payload_obj = {
        "sn": sn,
        "sort_id": parseInt(sort_id),
        "service": service,
        "msg": msg_obj
    };
    sendMsgToHost("deviceControl", payload_obj);
}


function getFirstState(attrs) {
    var state = new Object;
    state.name = "";
    state.value = 0;
    state.min = 0;
    state.max = 0;
    for (var k in attrs) {
        state.name = attrs[k].name;
        state.value = attrs[k].value;
        state.min = attrs[k].min;
        state.max = attrs[k].max;
        break;
    }
    return state;
}

function getNextState(attrs, curr_state) {
    //var next_state = new Object;
    var next_state = JSON.parse(JSON.stringify(curr_state));
    ;
    var next_flag = false;
    console.log('attrs.length: ' + attrs.length);
    if (attrs.length > 1) {
        for (var k in attrs) {
            if (next_flag) {
                next_state.name = attrs[k].name;
                next_state.value = attrs[k].value;
                break;
            }

            if (attrs[k].name == curr_state.name && attrs[k].value == curr_state.value) {
                if (k == (attrs.length - 1)) {
                    next_state.name = attrs[0].name;
                    next_state.value = attrs[0].value;
                    break;
                } else {
                    next_flag = true;
                }
            }
        }
    }

    console.log('next_state name: ' + next_state.name);
    console.log('next_state value: ' + next_state.value);

    return next_state;
}

function createButtonDevices() {
    for (var index in dev_list) {
        var devobj = dev_list[index];
        $('#button-dev-select').append(new Option(devobj.name, devobj.dev_id));
    }
    layui.form.render('select');
}

var sortable1 

function createDevices(haveMore) {
    var jq_objs = [];
    var dev_html = "";

    //haveMore = false;

    for (let i in dev_list) {
        let flag = 1
        console.log("name: " + dev_list[i].name);
        console.log("sn: " + dev_list[i].sn);
        console.log("sort_id: " + dev_list[i].sort_id);
        var services = getServices(dev_list[i].sort_id);
        var switch_html = "";
        var service_html = "";
        console.log("services length: " + services.length);
        if(services.length == 1 && services[0].name == "switch") {
            flag = 0
        }
        for (let j in services) {
            //console.log("serviceName: " + services[j].name);
            // for (var key in services[j].attrs) {
            //     console.log("attr.name: " + key);
            //     console.log("attr.value: " + services[j].attrs[key]);
            // }
            var state = getFirstState(services[j].attrs);
            var rw = services[j].rw;
            console.log("state.name: " + state.name);
            console.log("state.min: " + state.min);
            //console.log("state.rw: " + rw);
            if (state.name == "pm25") {
                services[j].state = state;
                var id = "dev_" + i + "_" + j;
                switch_html = switch_html + "<button id=\"" + "" + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + dev_list[i].name + "</button>";
                service_html = service_html + "<br/><div id=\"" + id + "\"></div>" + "<span>" + services[j].name + ": </span><span>" + state.min + "</span><br/>";
                if (rw != 2) {
                    var jq = new Object;
                    jq.id = id;
                    jq.state = state;
                    jq_objs.push(jq);
                }
            } else if (state.name == "percent" || state.name == "cct" || state.name == "temperature" || state.name == "pm25" || state.name == "formaldehyde" || state.name == "o3" || state.name == "tvoc" || state.name == "co2") {
                services[j].state = state;
                var id = "dev_" + i + "_" + j;
                service_html = service_html + "<br/><div id=\"" + id + "\"></div>" + "<span>" + services[j].name + ": </span><span>" + state.min + "</span><br/>";
                if (rw != 2) {
                    var jq = new Object;
                    jq.id = id;
                    jq.state = state;
                    jq_objs.push(jq);
                }
            } else if (state.name != "") { 
                console.log(services[j].name);
                services[j].state = state;
                var id = "dev_" + i + "_" + j;
                if (services[j].name == "switch" || services[j].name == "status")
                    switch_html = switch_html + "<button id=\"" + id + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + dev_list[i].name + "</button>";
                else if (services[j].name == "mode" && isCurtain(dev_list[i].sort_id)) {
                    switch_html = switch_html + "<button id=\"" + "" + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + dev_list[i].name + "</button>";
                    service_html = service_html + "<div class=\"dev-card-item\"><button id=\"" + id + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + state.name + "</button><p>" + services[j].name + "</p></div>";
                }
                else if (services[j].name == "playPause") {
                    switch_html = switch_html + dev_list[i].name;
                }
                else if (services[j].name == "mode" || services[j].name == "switch1" || services[j].name == "switch2" || services[j].name == "switch3" || services[j].name == "switch4" || services[j].name == "fan" || services[j].name == "stop") {
                    service_html = service_html + "<div class=\"dev-card-item\"><button id=\"" + id + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + state.name + "</button><p>" + services[j].name + "</p></div>";
                }
                else if(services[j].name == "keyReporting") {
                    if(!services.find(item => item.name == 'switch')) {
                        switch_html = switch_html + "<button type=\"button\" class=\"layui-btn layui-btn-primary\">" + dev_list[i].name + "</button>";
                    }
                    if(state.max != 1) {
                        service_html = service_html + "<br/><div id=\"" + id + "\"></div>" + "<span>" + services[j].name + ": </span><span>" + state.min + "</span><br/>";
                    } else {
                        service_html = service_html + "<div class=\"dev-card-item\"><button id=\"" + id + "\" type=\"button\" class=\"layui-btn layui-btn-primary\">" + 1 + "</button></div>";
                    }
                    
                }

                var jq = new Object;
                jq.id = id;
                jq.state = state;
                jq_objs.push(jq);
            }
        }
        dev_list[i].services = JSON.parse(JSON.stringify(services));

        if (flag) {
            dev_html = dev_html +
                "        <div class=\"dev-card\">\n" +
                "            <div class='tit'>"  + dev_list[i].sn  +  "</div>" +
                "<hr/>" +
                "            <div class=\"dev-card-head\">" + switch_html + "<a href=\"javascript:;\" onclick=\"toggle('" + dev_list[i].sn + "')\" id=\"toggle"+ dev_list[i].sn + "\">▼</a>"  + "</div>\n" + 
                "            <div class=\"dev-card-body\" id=\"" + dev_list[i].sn + "\"" + ">\n" +
                service_html +
                "\n" +
                "                <br/>\n" +
                "            </div>\n" +
                "    </div>";
        } else {
            dev_html = dev_html +
                "        <div class=\"dev-card\">\n" +
                "            <div class='tit'>"  + dev_list[i].sn  +  "</div>" +
                "<hr/>" +
                "            <div class=\"dev-card-head\">" + switch_html + "</div>\n" +
                "            </div>\n" +
                "    </div>";
        }

        // console.log("dev_html: " + dev_html);
    }

    $(".dev-container").empty();
    $(".dev-container").append(dev_html);

    for (let i in dev_list) {
        $("#" + dev_list[i].sn).hide();
    }

    try {
        var g1 = document.getElementById('container1');
        var ops1 = {
            disabled: true,
            animation: 300,
            group: { name: "group", pull: true, put: true },
            // group: { name: "group1", pull: true, put: true },
            //拖动结束
            // onEnd: function (evt) {
            //     console.log(evt);
            //     //获取拖动后的排序
            //     var arr = sortable1.toArray();
            //     document.getElementById("msg").innerHTML = "A组排序结果：" + JSON.stringify(arr);
            // },
        };
        sortable1 = Sortable.create(g1, ops1);
    } catch (error) {
        
    }

    console.log(jq_objs);
    for (let i in jq_objs) {
        //console.log("jq type: " + jq_objs[i].type);
        var jq = jq_objs[i];
        if (jq.state.name == "percent" || jq.state.name == "cct" || jq.state.name == "temperature" || jq.state.name == "num") {
            if (jq.state.max == 1) {
                $("#" + jq.id).click(function () {
                    doDeviceControl($(this).attr('id'), 1);
                });
            } else {
                $("#" + jq.id).slider({
                    orientation: "horizontal",
                    range: "min",
                    min: jq.state.min,
                    max: jq.state.max,
                    value: jq.state.min,
                    // slide: function () {
                    //     var val = $(this).slider("value");
                    //     $(this).next().next().html(val);
                    //     doDeviceControl($(this).attr('id'), val);
                    // },
                    // change: function () {
                    //     var val = $(this).slider("value");
                    //     $(this).next().next().html(val);
                    //     doDeviceControl($(this).attr('id'), val);
                    // }
                    slide: function () {
                        var orig_val = $(this).next().next().html();
                        console.log(orig_val);
                        var val = $(this).slider("value");
                        console.log("value1: " + val);
                        if (orig_val != val) {
                            $(this).next().next().html(val);
                            // doDeviceControl($(this).attr('id'), val);
                        } else {
                            slider_send_change = true;
                        }
                    },
                    change: function () {
                        var val = $(this).slider("value");
                        console.log("value2: " + val);
                        $(this).next().next().html(val);
                        if (slider_send_change) {
                            doDeviceControl($(this).attr('id'), val);
                            slider_send_change = false;
                        }
                    }
                });
            }

            // layui.use(function(){
            //     var slider = layui.slider;
            //     // 渲染
            //     slider.render({
            //       elem: `#${jq.id}`,
            //       min: jq.state.min, // 最小值
            //       max: jq.state.max // 最大值
            //     });
            // });
        } else {
            $("#" + jq.id).click(function () {
                doDeviceNextControl($(this).attr('id'));
            });
        }
    }
}

function doDeviceControl(id, value) {
    var array = id.split("_", 3);
    var dev_idx = array[1];
    var serv_idx = array[2];
    var sn = dev_list[dev_idx].sn;
    var sort_id = dev_list[dev_idx].sort_id;
    var service = dev_list[dev_idx].services[serv_idx];
    var state = getFirstState(service.attrs);
    state.value = value;
    dev_list[dev_idx].services[serv_idx].state = state;

    var msg_str = "{\"" + state.name + "\":" + state.value + "}";
    var payload_obj = {
        "sn": sn,
        "sort_id": parseInt(sort_id),
        "service": service.name,
        "msg": JSON.parse(msg_str)
    };
    sendMsgToHost("deviceControl", payload_obj);
    console.log(payload_obj);
    if (action_type == 1) {
        var trigger_obj = {
            "type": TRIGGER_TYPE.SMART,
            "value": "",
            "action": payload_obj
        };
        
        addSmartTrigger(trigger_obj);
    }
    else if (action_type == 2)
        addDevAction(payload_obj);
}

function doDeviceNextControl(id) {
    console.log("send id: " + id);

    var array = id.split("_", 3);
    var dev_idx = array[1];
    var serv_idx = array[2];
    var sn = dev_list[dev_idx].sn;
    var sort_id = dev_list[dev_idx].sort_id;
    var service = dev_list[dev_idx].services[serv_idx];
    console.log(dev_list);

    console.log("dev_idx: " + dev_idx);
    console.log("serv_idx: " + serv_idx);
    console.log("sn: " + sn);

    console.log('curr_state.name: ' + service.state.name);
    console.log('curr_state.value: ' + service.state.value);
    console.log(service);
    var state = getNextState(service.attrs, service.state);

    dev_list[dev_idx].services[serv_idx].state = state;
    if (service.name != "switch" && service.name != "status")
        $("#" + id).html(state.name);

    if (state.name == "on" || state.name == "manned" || state.name == "alarm") {
        $("#" + id).removeClass("layui-btn-primary");
    } else if (state.name == "off" || state.name == "unmanned" || state.name == "normal") {
        $("#" + id).addClass("layui-btn-primary");
    }

    var msg_str = "{\"" + state.name + "\":" + state.value + "}";
    var payload_obj = {
        "sn": sn,
        "sort_id": parseInt(sort_id),
        "service": service.name,
        "msg": JSON.parse(msg_str)
    };
    sendMsgToHost("deviceControl", payload_obj);

    if (action_type == 1) {
        var trigger_obj = {
            "type": TRIGGER_TYPE.SMART,
            "value": "",
            "action": payload_obj
        };
        addSmartTrigger(trigger_obj);
    }
    else if (action_type == 2)
        addDevAction(payload_obj);
}

function isKeyPanel(sort_id) {
    switch (sort_id) {
       // case SORT_ID.BLE_MESH_1_KEY_SWITCH_PANEL:
       // case SORT_ID.BLE_MESH_2_KEY_SWITCH_PANEL:
        case SORT_ID.BLE_MESH_4_KEY_SWITCH_PANEL:
        case SORT_ID.BLE_MESH_6_KEY_SWITCH_PANEL:
        case SORT_ID.BLE_MESH_8_KEY_SCENE_PANEL:
            return 1;
    }
    return 0;
}

function isDim(sort_id) {
    switch (sort_id) {
        case SORT_ID.BLE_MESH_DIM_LIGHT:
        case SORT_ID.BLE_MESH_COLOR_TEMPERATURE_LIGHT:
        case SORT_ID.KNX_COLOR_TEMPERATURE_LIGHT:
        case SORT_ID.KNX_DIM_LIGHT:
        case SORT_ID.EIDE_DIM_LIGHT:
            return 1;
    }
    return 0;
}

function isCurtain(sort_id) {
    switch (sort_id) {
        case SORT_ID.BLE_MESH_CURTAIN:
        case SORT_ID.KNX_CURTAIN:
        case SORT_ID.EIDE_CURTAIN:
            return 1;
    }
    return 0;
}

function updateDevice(sn, service, msg) {
    var state = new Object;
    state.name = "";
    state.value = 0;
    //var attrValue = 0;
    for (var key in msg) {
        state.name = key;
        state.value = msg[key];
        break;
    }

    for (let i in dev_list) {
        if (dev_list[i].sn == sn) {
            var services = getServices(dev_list[i].sort_id);
            for (let j in services) {
                if (services[j].name == service) {
                    dev_list[i].services[j].state = state;
                    var id = "dev_" + i + "_" + j;
                    console.log("id: " + id);
                    console.log("state.name: " + state.name);
                    if (state.name == "percent" || state.name == "cct" || state.name == "temperature" || state.name == "pm25" || state.name == "formaldehyde" || state.name == "o3" || state.name == "tvoc" || state.name == "co2" || state.name == "num") {
                        try {
                            console.log((services[j].state.name == 'num') && (services[j].state.min == services[j].state.max));
                            $("#" + id).next().next().html(state.value);
                            $("#" + id).slider("value", state.value);

                        } catch (e) {

                        }
                    } else if (state.name != "") {
                        if (service != "switch" && service != "status")
                            $("#" + id).html(state.name);
                        if (state.name == "on" || state.name == "manned" || state.name == "alarm") {
                            $("#" + id).removeClass("layui-btn-primary");
                        } else if (state.name == "off" || state.name == "unmanned" || state.name == "normal") {
                            $("#" + id).addClass("layui-btn-primary");
                        }
                    }
                    if (isKeyPanel(dev_list[i].sort_id))
                        updateSwitch(sn);

                    // if (isDim(dev_list[i].sort_id))
                    //     updateDimSwitch(sn);

                    return;
                }
            }
        }
    }
}

function updateDevices() {
    console.log("state total: " + state_list.length);
    for (let i in state_list) {
        for (let j in state_list[i].states) {
            var msg = state_list[i].states[j].msg;
            var state = new Object;
            state.name = "";
            state.value = 0;
            //var attrValue = 0;
            for (var key in msg) {
                state.name = key;
                state.value = msg[key];
                break;
            }
            dev_list[i].services[j].state = state;
            var serviceName = dev_list[i].services[j].name;
            var id = "dev_" + i + "_" + j;
            console.log("id: " + id);
            console.log("state.name: " + state.name);
            //console.log("state.value: " + state.value);
            console.log("serviceName: " + serviceName);
            if (state.name == "percent" || state.name == "cct" || state.name == "temperature" || state.name == "pm25" || state.name == "formaldehyde" || state.name == "o3" || state.name == "tvoc" || state.name == "co2" || state.name == "num") {
                try {
                    $("#" + id).next().next().html(state.value);
                    $("#" + id).slider("value", state.value);
                } catch (e) {

                }
            } else if (state.name != "") {
                if (serviceName != "switch" && serviceName != "status")
                    $("#" + id).html(state.name);
                if (state.name == "on" || state.name == "manned" || state.name == "alarm") {
                    $("#" + id).removeClass("layui-btn-primary");
                } else if (state.name == "off" || state.name == "unmanned" || state.name == "normal") {
                    $("#" + id).addClass("layui-btn-primary");
                }
            }
        }

        var sort_id = getDevSortBySn(state_list[i].sn);
        if (isKeyPanel(sort_id))
            updateSwitch(state_list[i].sn);

        // if (isDim(sort_id))
        //     updateDimSwitch(state_list[i].sn);
    }
}

function isAllOff(sn) {
    var is_all_on = false;
    for (let i in dev_list) {
        if (dev_list[i].sn == sn) {
            for (let j in dev_list[i].services) {
                //console.log("j: " + j);
                //console.log("services[j].name: " + dev_list[i].services[j].name);
                if (dev_list[i].services[j].name != "" && dev_list[i].services[j].name != "switch") {
                    if (dev_list[i].services[j].state.name == "on") {
                        is_all_on = true;
                    }
                }
            }
        }
    }
    return is_all_on;
}

function isLight0(sn) {
    var is_all_on = true;
    for (let i in dev_list) {
        if (dev_list[i].sn == sn) {
            for (let j in dev_list[i].services) {
                //console.log("j: " + j);
                //console.log("services[j].name: " + dev_list[i].services[j].name);
                if (dev_list[i].services[j].name == "brightness") {
                    if (dev_list[i].services[j].state.value == 0) {
                        is_all_on = false;
                    }
                }
            }
        }
    }
    return is_all_on;
}

function updateSwitch(sn) {
    var is_all_on = isAllOff(sn);
    console.log("is_all_on: " + is_all_on);
    var state = new Object;
    for (let i in dev_list) {
        if (dev_list[i].sn == sn) {
            var services = getServices(dev_list[i].sort_id);
            for (let j in services) {
                if (services[j].name == "switch") {
                    var id = "dev_" + i + "_" + j;
                    if (is_all_on) {
                        state.name = "on";
                        state.value = 1;
                        dev_list[i].services[j].state = state;
                        $("#" + id).removeClass("layui-btn-primary");
                        //$("#" + id).addClass("layui-btn-warm");
                    } else {
                        state.name = "off";
                        state.value = 0;
                        dev_list[i].services[j].state = state;
                        //$("#" + id).removeClass("layui-btn-warm");
                        $("#" + id).addClass("layui-btn-primary");
                    }
                    return;
                }
            }
        }
    }
}

function updateDimSwitch(sn) {
    var is_all_on = isLight0(sn);
    console.log("is_all_on: " + is_all_on);
    var state = new Object;
    for (let i in dev_list) {
        if (dev_list[i].sn == sn) {
            var services = getServices(dev_list[i].sort_id);
            for (let j in services) {
                if (services[j].name == "switch") {
                    var id = "dev_" + i + "_" + j;
                    if (is_all_on) {
                        state.name = "on";
                        state.value = 1;
                        dev_list[i].services[j].state = state;
                        $("#" + id).removeClass("layui-btn-primary");
                        //$("#" + id).addClass("layui-btn-warm");
                    } else {
                        state.name = "off";
                        state.value = 0;
                        dev_list[i].services[j].state = state;
                        //$("#" + id).removeClass("layui-btn-warm");
                        $("#" + id).addClass("layui-btn-primary");
                    }
                    return;
                }
            }
        }
    }
}
