var Trigger = {
    type: 0,
    key: "",
    value: ""
};

var trigger_list = [];

function addTriggerList(data) {
    trigger_list.push(data);
}

function setTriggerList(data) {
    if (data.length == 0)
        trigger_list = [];
    else {
        trigger_list = trigger_list.concat(data);
    }
}

function getTriggerList() {
    return trigger_list;
}

function getTriggerListTotal() {
    return trigger_list.length;
}

function removeTrigger(obj) {
    console.log(obj, trigger_list);
    for (index in trigger_list) {
        var trigger = trigger_list[index];
        if (trigger.type == TRIGGER_TYPE.SMART) {
            if (trigger.type == obj.type && trigger.key == obj.key && trigger.sn == obj.sn) {
                trigger_list.splice(index, 1);
            }
        } else {
            if (trigger.type == obj.type && trigger.key == obj.key && (JSON.stringify(trigger.value) == JSON.stringify(obj.value))) {
                trigger_list.splice(index, 1);
            }
        }
    }
    layui.table.reloadData('trigger-table', {
        data: $.extend(true, [], trigger_list)
    });
}

function addSmartTrigger(triggerobj) {
    for (index in trigger_list) {
        var action = trigger_list[index].action;
        if (action.sn == triggerobj.action.sn && action.service == triggerobj.action.service) {
            trigger_list.splice(index, 1);
        }
    }

    

    // const triggerSn = triggerobj.action.sn
    // const snName = dev_list.find(item => item.sn == triggerSn).name
    // console.log(dev_list);
    // console.log(snName);
    // triggerobj.action.name = snName

    // const str = `${snName}/${triggerobj.sort_id}/${triggerobj.services}/${triggerobj.msg}`

    trigger_list.unshift(triggerobj);
    layui.table.reloadData('trigger-table', {
        data: $.extend(true, [], trigger_list)
    });
}

function addBasicTrigger(type, value) {
    var payload_obj = {
        "type": parseInt(type),
        "value": value,
        "action": {}
    };
    if (type == TRIGGER_TYPE.CLICK ) {
        for (index in trigger_list) {
            var trigger = trigger_list[index];
            if (trigger.type == type) {
                trigger_list.splice(index, 1);
            }
        }
    }
    if(type == TRIGGER_TYPE.TIME) {
        const index = trigger_list.findIndex(item => JSON.stringify(item.value) == JSON.stringify(value))
        console.log(trigger_list, index);
        if(index != -1) {
            trigger_list.splice(index, 1);
            layui.layer.msg($.i18n.prop("center.combine_scene.condition_added.tips"));
        }
    }

    trigger_list.unshift(payload_obj);

    console.log(payload_obj);
    layui.table.reloadData('trigger-table', {
        data: $.extend(true, [], trigger_list)
    });
}



