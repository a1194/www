var Action = {
    sn: "",
    sort_id: 0,
    service: "",
    attr: "",
    value: 0,
    state: 0
};

var action_list = [];

function addActionList(data) {
    action_list.push(data);
}

function setActionList(data) {
    if (data.length == 0)
        action_list = [];
    else {
        action_list = action_list.concat(data);
    }

}

function getActionList() {
    return action_list;
}

function getActionListTotal() {
    return action_list.length;
}

function getActionName(sn, service, msg) {
    if (service == "scene") {
        //var scene_id = parseInt(sn);
        return getAllSceneNameById(msg.scene_id);
    }
    else if (service == "combineScene") {
        //var scene_id = parseInt(sn);
        return getAllCombineSceneNameById(msg.scene_id);
    }
    else
        return getAllDevName(sn);
}

function getActionValue(value) {
    if (typeof value == 'object')
        return JSON.stringify(value);
    else
        return value;
}

function formatActionValue(d) {
    try {
        const sn = d.action.sn
        const snName = dev_list.find(item => item.sn == sn)?.name || sn
        const str = `${snName} / ${d.action.service} / ${JSON.stringify(d.action.msg)}`

        return d.type == 3? str : ""
    } catch (error) {
        return ""
    }
}

function removeAction(sn, service) {
    for (index in action_list) {
        var action = action_list[index];
        if (action.sn == sn && action.service == service) {
            action_list.splice(index, 1);
        }
    }
    layui.table.reload('action-table', {
        data: $.extend(true, [], action_list)
    });
}

function addDevAction(actionobj) {
    for (index in action_list) {
        var action = action_list[index];
        if (action.sn == actionobj.sn && action.service == actionobj.service) {
            action_list.splice(index, 1);
        }
    }

    action_list.unshift(actionobj);

    layui.table.reload('action-table', {
        data: $.extend(true, [], action_list)
    });
}

function clearDevAction() {
    action_list = [];
    layui.table.reload('action-table', {
        data: $.extend(true, [], action_list)
    });
}

function addSceneAction(actionobj) {
    for (index in action_list) {
        var action = action_list[index];
        if (action.msg.hasOwnProperty("scene_id")) {
            var scene_id = action.msg.scene_id;
            console.log('scene_id: ' + scene_id);
            if (scene_id == actionobj.msg.scene_id && action.service == actionobj.service) {
                action_list.splice(index, 1);
            }
        }
    }

    action_list.unshift(actionobj);

    layui.table.reload('action-table', {
        data: $.extend(true, [], action_list)
    });
}
