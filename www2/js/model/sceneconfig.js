var SceneConfig = {
    scene_id: 0,
    name: "",
    protocol: 0,
    room_id: 0,
    actions: [],
    action_total: 0,
    state: 0,
    update_flag: 0
};

var scene_list = [];
var all_scene_list = [];

function setAllSceneList(data) {
    if (data.length == 0)
        all_scene_list = [];
    else
        all_scene_list = all_scene_list.concat(data);
}

function getAllSceneNameById(scene_id) {
    for (var index in all_scene_list) {
        var scene = all_scene_list[index];
        if (scene.scene_id == scene_id) {
            return scene.name;
        }
    }
    return "";
}

function setSceneList(data) {
    if (data.length == 0)
        scene_list = [];
    else
        scene_list = scene_list.concat(data);
}

function getSceneList() {
    return scene_list;
}

function getSceneNameById(id) {
    id = parseInt(id);
    for (index in scene_list) {
        var scene = scene_list[index];
        if (scene.scene_id == id) {
            return scene.name;
        }
    }
    return "";
}

function doGetSceneConfigs() {
    sendMsgToHost("getSceneConfigs", {});
}

function doGetSceneConfig(scene_id) {
    sendMsgToHost("getSceneConfig", {
        "scene_id": parseInt(scene_id)
    });
}

function doAddSceneConfig(name, protocol, room_id, actions_obj) {
    sendMsgToHost("addSceneConfig", {
        "name": name,
        "protocol": parseInt(protocol),
        "room_id": parseInt(room_id),
        "actions": actions_obj
    });
}

function doAddKnxSceneConfig(name, gaddr, value, room_id, actions_obj) {
    sendMsgToHost("addKnxSceneConfig", {
        "name": name,
        "gaddr": parseInt(gaddr),
        "value": parseInt(value),
        "room_id": parseInt(room_id),
        "actions": actions_obj
    });
}

function doEditSceneConfig(scene_id, name, room_id, actions_obj) {
    sendMsgToHost("editSceneConfig", {
        "scene_id": parseInt(scene_id),
        "name": name,
        "room_id": parseInt(room_id),
        "actions": actions_obj
    });
}

function doDelSceneConfig(scene_id) {
    sendMsgToHost("delSceneConfig", {
        "scene_id": parseInt(scene_id)
    });
}

function doDelSceneConfigs(ids) {
    sendMsgToHost("delSceneConfigs", {
        "ids": ids
    });
}

function doScene(scene_id) {
    var action_obj = {
        "sn": "",
        "service": "scene",
        "msg": {
            "scene_id": parseInt(scene_id)
        }
    };

    sendMsgToHost(action_obj.service, action_obj.msg);

    addSceneAction(action_obj);

    return action_obj;
}

var sortable2
function createScenes() {
    var jq_objs = [];
    var scene_html = "";
    var body_html = "";
    for (let i in scene_list) {
        console.log("scene_id: " + scene_list[i].scene_id);
        console.log("name: " + scene_list[i].name);
        var id = "s_" + scene_list[i].scene_id;
        body_html += ('<div class="dev-card-item"><button id="' + id + '"' + ' type="button" class="layui-btn layui-btn-primary">' + scene_list[i].name + '</button></div>');
        var jq = new Object;
        jq.id = id;
        jq_objs.push(jq);
    }

    console.log("scene_html: " + scene_html);


    scene_html =
                "        <div class=\"dev-card\">\n" +
                "            <div class=\"dev-card-head\">"+ $.i18n.prop("main.dev_scene_config") +"</div>\n" +
                "            <div class=\"dev-card-body\"><div class=\"dev-card-item\">" +
                body_html +
                "\n" +
                "            </div>\n" +
                "            </div>\n" +
                "    </div>";

            $(".scene-container").empty();
            $(".scene-container").append(scene_html);
    

    for (let i in jq_objs) {
        var jq = jq_objs[i];
        $("#" + jq.id).click(function () {
            var array = $(this).attr('id').split("_", 2);
            var scene_id = array[1];
            doScene(scene_id);
        });
    }
    var g2 = document.getElementById('container2');
    var ops2 = {
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
    sortable2 = Sortable.create(g2, ops2);
}

// function createScenes() {
//     var jq_objs = [];
//     var scene_html = "";
//     var body_html = "";
//     for (let i in scene_list) {
//         console.log("scene_id: " + scene_list[i].scene_id);
//         console.log("name: " + scene_list[i].name);
//         var id = "s_" + scene_list[i].scene_id;
//         body_html += ('<div class="dev-card-item"><button id="' + id + '"' + ' type="button" class="layui-btn layui-btn-primary">' + scene_list[i].name + '</button></div>');
//         var jq = new Object;
//         jq.id = id;
//         jq_objs.push(jq);
//     }
//
//     for (let i in knx_scene_list) {
//         console.log("scene_id: " + knx_scene_list[i].scene_id);
//         console.log("name: " + knx_scene_list[i].name);
//         var id = "ks_" + knx_scene_list[i].scene_id;
//         body_html += ('<div class="dev-card-item"><button id="' + id + '"' + ' type="button" class="layui-btn layui-btn-primary">' + knx_scene_list[i].name + '</button></div>');
//         var jq = new Object;
//         jq.id = id;
//         jq_objs.push(jq);
//     }
//
//     console.log("scene_html: " + scene_html);
//
//     scene_html =
//         "        <div class=\"dev-card\">\n" +
//         "            <div class=\"dev-card-head\">设备场景</div>\n" +
//         "            <div class=\"dev-card-body\"><div class=\"dev-card-item\">" +
//         body_html +
//         "\n" +
//         "            </div>\n" +
//         "            </div>\n" +
//         "    </div>";
//
//     $(".scene-container").empty();
//     $(".scene-container").append(scene_html);
//
//     for (let i in jq_objs) {
//         var jq = jq_objs[i];
//         $("#" + jq.id).click(function () {
//             var array = $(this).attr('id').split("_", 2);
//             var scene_id = array[1];
//             doScene(scene_id);
//         });
//     }
// }
