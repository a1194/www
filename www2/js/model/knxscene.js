var KnxScene = {
    scene_id: 0,
    name: "",
    gaddr: 0
};

var knx_scene_list = [];

function setKnxSceneList(data) {
    if (data.length == 0)
        knx_scene_list = [];
    else
        knx_scene_list = knx_scene_list.concat(data);
}

function getKnxSceneList() {
    return knx_scene_list;
}

function doGetKnxScenes() {
    sendMsgToHost("getKnxScenes", {});
}

function doDelKnxScene(scene_id) {
    sendMsgToHost("delKnxScene", {
        "scene_id": parseInt(scene_id)
    });
}

function doDelKnxScenes(ids) {
    sendMsgToHost("delKnxScenes", {
        "ids": ids
    });
}

function doSetKnxScene(scene_id, gaddr, value) {
    sendMsgToHost("setKnxScene", {
        "scene_id": parseInt(scene_id),
        "gaddr": parseInt(gaddr),
        "value": parseInt(value)
    });
}

