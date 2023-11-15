
var TRIGGER_TYPE = {
    CLICK: 1,
    TIME: 2,
    SMART: 3,
    SPEECH: 4
};

var DEV_TYPE = {
    UNKNOWN: 0,
    GATEWAY: 1,
    SWITCH_LIGHT: 2,
    DIM_LIGHT: 3,
    COLOR_TEMPERATURE_LIGHT: 4,
    CURTAIN: 5,
    AIR: 6,
    NEW_WIND: 7,
    FLOOR_HEATING: 8,
    SWITCH_PANEL: 9,
    SCENE_PANEL: 10,
    MUSIC: 11,
    ENVIRONMENTAL_DETECTOR: 12,
    SWITCH_MODULE: 13,
    HUMAN_INFRARED_DETECTOR: 14,
    WINDOW_MAGNETISM: 15,
    HANES_MASTER: 16,
    HANES_SLAVE: 17,
    EXHAUST_FAN: 18,
    SCENE_SWITCH: 19
};

var SORT_ID = {
    UNKNOWN_DEVICE: 0,
    CONTROL_PANEL: 1,
    AI_GATEWAY: 2,
    SCENE: 100,
    /*
    COMMON_SWITCH_LIGHT: 3,
    COMMON_DIM_LIGHT: 4,
    COMMON_COLOR_TEMPERATURE_LIGHT: 5,
    COMMON_CURTAIN: 6,
    COMMON_AIR: 7,
    COMMON_NEW_WIND: 8,
    COMMON_FLOOR_HEATING: 9,
    COMMON_1_KEY_SWITCH_PANEL: 10,
    COMMON_2_KEY_SWITCH_PANEL: 11,
    COMMON_4_KEY_SWITCH_PANEL: 12,
    COMMON_6_KEY_SWITCH_PANEL: 13,
    COMMON_8_KEY_SCENE_PANEL: 14,
    COMMON_MUSIC: 15,
    */

    BLE_MESH_SWITCH_LIGHT: 1001,
    BLE_MESH_DIM_LIGHT: 1002,
    BLE_MESH_COLOR_TEMPERATURE_LIGHT: 1003,
    BLE_MESH_CURTAIN: 1004,
    BLE_MESH_AIR: 1005,
    BLE_MESH_NEW_WIND: 1006,
    BLE_MESH_FLOOR_HEATING: 1007,
    BLE_MESH_1_KEY_SWITCH_PANEL: 1008,
    BLE_MESH_2_KEY_SWITCH_PANEL: 1009,
    BLE_MESH_4_KEY_SWITCH_PANEL: 1010,
    BLE_MESH_6_KEY_SWITCH_PANEL: 1011,
    BLE_MESH_8_KEY_SCENE_PANEL: 1012,
    BLE_MESH_MUSIC: 1013,

    KNX_SWITCH_LIGHT: 2001,
    //KNX_ABSOLUTE_DIM_LIGHT: 2002,
    KNX_DIM_LIGHT: 2003,
    KNX_COLOR_TEMPERATURE_LIGHT: 2004,
    KNX_3_WAY_SWITCH: 2005,
    KNX_CURTAIN: 2006,
    KNX_AIR: 2007,
    KNX_HVAC_AIR: 2008,
    KNX_NEW_WIND: 2009,
    KNX_FLOOR_HEATING: 2010,
    KNX_ENVIRONMENTAL_DETECTOR: 2011,
    KNX_MUSIC: 2012,

    EIDE_SWITCH_LIGHT: 3001,
    EIDE_DIM_LIGHT: 3002,
    EIDE_CURTAIN: 3004,
    EIDE_AIR: 3005,
    EIDE_NEW_WIND: 3006,
    EIDE_FLOOR_HEATING: 3007,
    EIDE_MUSIC: 3008,
    EIDE_SCENE: 3010

};

var PROTOCOL_TYPE = {
    BLE_MESH: 1,
    KNX: 2,
    ABUS: 3,
    ZIGBEE: 4,
    TCPIP: 5,
    PVT_KNX: 6,
    MODBUS: 7,
    EIDE: 8
};

var VALUE_TYPE = {
    INT: 0,
    BOOL: 1,
    STRING: 2,
    ARRAY: 3
};

var SERVICE_ID = {
    KEY: 1,
    BLE_MESH: 2,
    KNX: 3,
    HILINK: 4,
    TUYA: 5,
    FEIYAN: 6,
    WDOG: 7,
    LED: 8,
    EIDE: 9
};


var RW = {
    QUERY: 1,		//查询
    SET: 2,         //设置
    QUERY_SET: 3,		//查询/设置
    NOTIFY: 4,			//通知
    QUERY_NOTIFY: 5,		//查询/通知
    QUERY_SET_NOTIFY: 7		//查询/设置/通知
    /*
    ONLY_WRITE: 1,
    ONLY_READ: 2,
    READ_WRITE: 3
    */
};


function getSetting() {
    //表单提交
    $.ajax({
        url: getCGIPath() + "setting.cgi/getSetting",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            console.log(data);
            var json_obj = $.parseJSON(data);
            var language = json_obj.language;
            console.log("language: " + language);
            if (language == 1) {
                sessionStorage.setItem('language', "zh-CN");
                setLang("zh-CN");
            } else if(language == 2) {
                sessionStorage.setItem('language', "en");
                setLang("en");
            } else if(language == 3) {
                sessionStorage.setItem('language', "ru");
                setLang("ru");
            }
        },
        error: function () {

        }
    });
}

function initLanguage() {
    var language = sessionStorage.getItem('language');
    console.log("language: " + language);

    // if(language  == 'en') {
    //     $('.usercreate').html($.i18n.prop('main.user'))
    // }
    setLang("zh-CN");
    if (language == null || language == "") {
        getSetting();
    } else {
        setLang(language);
    }
}


function getRootPath() {//获得根目录
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    return curWwwPath.substring(0,pos);
}

function getCGIPath() {
    return getRootPath() + "/alinkboot/sys/www/cgi-bin/";
}

var HOST_TOPIC = "/host";
var CLIENT_TOPIC = "/clients";

function getProtocolText(protocol) {
    switch (protocol) {
        case PROTOCOL_TYPE.BLE_MESH:
            return "BLEMESH";
        case PROTOCOL_TYPE.KNX:
            return "KNX";
        case PROTOCOL_TYPE.ABUS:
            return "ABUS";
        case PROTOCOL_TYPE.ZIGBEE:
            return "ZIGBEE";
        case PROTOCOL_TYPE.TCPIP:
            return "TCPIP";
        case PROTOCOL_TYPE.PVT_KNX:
            return "PVTKNX";
        case PROTOCOL_TYPE.MODBUS:
            return "MODBUS";
        case PROTOCOL_TYPE.EIDE:
            return "EIDE";
        default:
            return $.i18n.prop("common.none");
    }
}

function getDevTypeText(dev_type) {
    switch (dev_type) {
        case DEV_TYPE.GATEWAY:
            return $.i18n.prop("sort.gateway");
        case DEV_TYPE.SWITCH_LIGHT:
            return $.i18n.prop("device.switch_light");
        case DEV_TYPE.DIM_LIGHT:
            return $.i18n.prop("device.dim_light");
        case DEV_TYPE.COLOR_TEMPERATURE_LIGHT:
            return $.i18n.prop("device.color_temperature_light");
        case DEV_TYPE.CURTAIN:
            return $.i18n.prop("device.curtain");
        case DEV_TYPE.AIR:
            return $.i18n.prop("device.air");
        case DEV_TYPE.NEW_WIND:
            return $.i18n.prop("device.new_wind");
        case DEV_TYPE.FLOOR_HEATING:
            return $.i18n.prop("device.floor_heating");
        case DEV_TYPE.SWITCH_PANEL:
            return $.i18n.prop("device.switch_panel");
        case DEV_TYPE.SCENE_PANEL:
            return $.i18n.prop("device.scene_panel");
        case DEV_TYPE.MUSIC:
            return $.i18n.prop("device.music");
        case DEV_TYPE.ENVIRONMENTAL_DETECTOR:
            return $.i18n.prop("device.environmental_detector");
        case DEV_TYPE.SWITCH_MODULE:
            return $.i18n.prop("device.switch_module");
        case DEV_TYPE.HUMAN_INFRARED_DETECTOR:
            return $.i18n.prop("device.human_infrared_detector");
        case DEV_TYPE.WINDOW_MAGNETISM:
            return $.i18n.prop("deivce.window_magnetism");
        case DEV_TYPE.HANES_MASTER:
            return $.i18n.prop("device.hanes_master");
        case DEV_TYPE.HANES_SLAVE:
            return $.i18n.prop("device.hanes_slave");
        case DEV_TYPE.EXHAUST_FAN:
            return $.i18n.prop("device.exhaust_fan");
        case DEV_TYPE.SCENE_SWITCH:
            return $.i18n.prop("device.scene_switch");
        default:
            return $.i18n.prop("device.unknown_device");
    }
}

function getTriggerType(trigger_type) {
    switch (trigger_type) {
        case TRIGGER_TYPE.CLICK:
            return $.i18n.prop("center.combine_scene.click");
        case TRIGGER_TYPE.TIME:
            return $.i18n.prop("center.combine_scene.time");
        case TRIGGER_TYPE.SMART:
            return $.i18n.prop("center.combine_scene.smart");
        case TRIGGER_TYPE.SPEECH:
            return $.i18n.prop("center.combine_scene.speech");
    }
}

function getRwText(rw) {
    // QUERY: 1,		//查询
    // SET: 2,          //设置
    // QUERY_SET: 3,		//查询/设置
    // NOTIFY: 4,			//通知
    // QUERY_NOTIFY: 5,		//查询/通知
    // QUERY_SET_NOTIFY: 7		//查询/设置/通知
    switch (rw) {
        case RW.QUERY:
            return $.i18n.prop("common.query");
        case RW.SET:
            return $.i18n.prop("common.setting");
        case RW.QUERY_SET:
            return $.i18n.prop("common.query_set");
        case RW.NOTIFY:
            return $.i18n.prop("common.notify");
        case RW.QUERY_NOTIFY:
            return $.i18n.prop("common.query_notify");
        case RW.QUERY_SET_NOTIFY:
            return $.i18n.prop("common.query_set_notify");
    }
    
}

function getKeyTotal(sort_id) {
    switch (sort_id) {
        case SORT_ID.BLE_MESH_1_KEY_SWITCH_PANEL:
            return 1;
        case SORT_ID.BLE_MESH_2_KEY_SWITCH_PANEL:
            return 2;
        case SORT_ID.BLE_MESH_4_KEY_SWITCH_PANEL:
            return 4;
        case SORT_ID.BLE_MESH_6_KEY_SWITCH_PANEL:
            return 6;
        case SORT_ID.BLE_MESH_8_KEY_SCENE_PANEL:
            return 8;
        default:
            return 0;
    }
}

function getRelayTotal(sort_id) {
    switch (sort_id) {
        case SORT_ID.BLE_MESH_1_KEY_SWITCH_PANEL:
            return 1;
        case SORT_ID.BLE_MESH_2_KEY_SWITCH_PANEL:
            return 1;
        case SORT_ID.BLE_MESH_4_KEY_SWITCH_PANEL:
            return 2;
        case SORT_ID.BLE_MESH_6_KEY_SWITCH_PANEL:
            return 3;
        default:
            return 0;
    }
}

function showMessager(msg, result) {
    parent.showMessager(msg, result);
}

var loading = null;
var timer = null;
var win = null;

function closeLoading() {
    layui.layer.closeAll();
    clearTimeout(timer);
    //layui.layer.close(loading);
}

function openLoading(timeout, cb) {
    layui.layer.open({
        type: 2
        , title: false
        , closeBtn: false
        , offset: 'auto'
        , content: 'loading.html'
        , btn: $.i18n.prop("common.close")
        , area: ['390px', '260px']
        , btnAlign: 'c' //按钮居中
        , shade: [0.5, '#fff']
        , yes: function (index, layero) {
            layui.layer.closeAll();
        }
    });

    if (cb != null) {
        timer = setTimeout(cb, timeout);
    } else {
        timer = setTimeout(function () {
            layui.layer.closeAll();
            showMessager($.i18n.prop("common.operate_time_out"), 1);
        }, timeout);
    }

}

function openLoading2(timeout, cb) {
    // loading = layui.layer.load(0, {
        layui.layer.load(0, {
            shade: 0,
            //shade: [0.1, '#fff'],
            time: timeout
        });

        // layui.layer.load(2, {
        //     shade: 0,
        //     //shade: [0.1, '#fff'],
        //     time: 60 * 1000,
        //     content: content
        // });

        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }

        if (cb != null) {
            timer = setTimeout(cb, timeout);
        } else {
            timer = setTimeout(function () {
                //layui.layer.close(loading);
                layui.layer.closeAll();
                showMessager($.i18n.prop("common.operate_time_out"), 1);
            }, timeout);
        }

}

function openLoading3(content, timeout) {
    // loading = layui.layer.load(0, {
        layui.layer.load(0, {
            shade: 1,
            shade: [0.2, '#fff'],
            content: content,
            time: timeout
        });

        if (timer != null) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(function () {
            //layui.layer.close(loading);
            layui.layer.closeAll();
            showMessager($.i18n.prop("common.operate_time_out"), 1);
        }, timeout);

}

function closeDialog() {
    clearTimeout(timer);
    timer = null;
    layui.layer.closeAll();
    //layui.layer.close(loading);
}

function openDialog(title, btnText, timeout, cb) {
    // loading = layui.layer.load(0, {
        layer.msg(title, {
            time: timeout,
            btn: [btnText],
            yes: function(){
                layui.layer.closeAll();
                if (timeout != null) {
                    clearTimeout(timer);
                }
                if (cb != null) {
                    cb();
                }

            }
        });

        if (cb != null) {
            if (timeout != null) {
                timer = setTimeout(cb, timeout);
            }
        } else {
            if (timeout != null) {
                timer = setTimeout(function () {
                    layui.layer.closeAll();
                    showMessager($.i18n.prop("common.operate_time_out"), 1);
                }, timeout);
            }
        }

}

function closeWin() {
    if (parent != null) {
        parent.layer.closeAll();
    } else {
        layer.closeAll();
    }
    win = null;
}

function openWin(title, url) {
    if (win != null) {
        layer.closeAll();
        win = null;
    }

    win = layer.open({
        type: 1 //此处以iframe举例
        ,
        title: title
        ,
        zIndex: layer.zIndex
        ,
        area: ['700px', '500px']
        ,
        shade: 0
        ,
        maxmin: true
        ,
        offset: 'auto'
        ,
        content: '<iframe name="sub-iframe" src="' + url + '"' + 'frameborder="no" border="no" height="98%" width="100%" scrolling="auto" box-sizing: "border-box"></iframe>'
    });
}

function setLang(language){
    $.i18n.properties({
        name: 'common',
        path: 'i18n/' + language + '/', //资源文件路径
        mode: 'map', //用Map的方式使用资源文件中的值
        language: language,
        callback: function () {//加载成功后设置显示内容
            //console.log("text:" + $.i18n.prop('searchPlaceholder'));
            try {
                //初始化页面元素
                $('[data-i18n-placeholder]').each(function () {
                    $(this).attr('placeholder', $.i18n.prop($(this).data('i18n-placeholder')));
                });
                $('[data-i18n-text]').each(function () {
                    //如果text里面还有html需要过滤掉
                    var html = $(this).html();
                    var reg = /<(.*)>/;
                    if (reg.test(html)) {
                        var htmlValue = reg.exec(html)[0];
                        $(this).html(htmlValue + $.i18n.prop($(this).data('i18n-text')));
                    }
                    else {
                        $(this).text($.i18n.prop($(this).data('i18n-text')));
                    }
                });
                $('[data-i18n-value]').each(function () {
                    $(this).val($.i18n.prop($(this).data('i18n-value')));
                });
                $('[data-i18n-title]').each(function () {
                    $(this).text($.i18n.prop($(this).data('i18n-title')));
                    //$(this).title($.i18n.prop($(this).data('i18n-title')));
                });
            }
            catch(ex){ }
        }
    });
}

$(function () {
    initLanguage();
});
