var CombineScene = {
    scene_id: 0,
    name: "",
    room_id: 0,
    actions: [],
    action_total: 0
};

var combine_scene_list = [];
var all_combine_scene_list = [];

function setAllCombineSceneList(data) {
    if (data.length == 0)
        all_combine_scene_list = [];
    else
        all_combine_scene_list = all_combine_scene_list.concat(data);
}

function getAllCombineSceneNameById(scene_id) {
    for (var index in all_combine_scene_list) {
        var combine_scene = all_combine_scene_list[index];
        if (combine_scene.scene_id == scene_id) {
            return combine_scene.name;
        }
    }
    return "";
}

function setCombineSceneList(data) {
    if (data.length == 0)
        combine_scene_list = [];
    else
        combine_scene_list = combine_scene_list.concat(data);
}

function getCombineSceneList() {
    return combine_scene_list;
}

function getCombineSceneNameById(id) {
    id = parseInt(id);
    for (var index in combine_scene_list) {
        var combine_scene = combine_scene_list[index];
        if (combine_scene.scene_id == id) {
            return combine_scene.name;
        }
    }
    return "";
}


function doGetCombineScenes() {
    sendMsgToHost("getCombineScenes", {});
}

function doGetCombineScene(scene_id) {
    sendMsgToHost("getCombineScene", {
        "scene_id": parseInt(scene_id)
    });
}

function doAddCombineScene(name, room_id, triggers_obj, actions_obj, trigger_condition) {
    sendMsgToHost("addCombineScene", {
        "name": name,
        "room_id": parseInt(room_id),
        "triggers": triggers_obj,
        "actions": actions_obj,
        "trigger_condition": parseInt(trigger_condition)
    });
}

function doEditCombineScene(scene_id, name, room_id, triggers_obj, actions_obj, trigger_condition) {
    sendMsgToHost("editCombineScene", {
        "scene_id": parseInt(scene_id),
        "name": name,
        "room_id": parseInt(room_id),
        "triggers": triggers_obj,
        "actions": actions_obj,
        "trigger_condition": parseInt(trigger_condition)
    });
}

function doDelCombineScene(scene_id) {
    sendMsgToHost("delCombineScene", {
        "scene_id": parseInt(scene_id)
    });
}

function doDelCombineScenes(ids) {
    console.log(ids);
    sendMsgToHost("delCombineScenes", {
        "ids": ids
    });
}

function doCombineScene(scene_id) {
    var action_obj = {
        "sn": scene_id,
        "service": "combineScene",
        "msg": {
            "scene_id": parseInt(scene_id)
        }
    };

    sendMsgToHost(action_obj.service, action_obj.msg);

    addSceneAction(action_obj);

    return action_obj;
}


function doSetCombineSceneState(scene_id, state) {
    console.log(scene_id, state);
    sendMsgToHost("setCombineSceneState", {
        scene_id,
        state
    });
}

var sortable
var sortable3
function createCombineScenes() {
    var jq_objs = [];
    var combine_scene_html = "";
    var body_html = "";
    for (let i in combine_scene_list) {
        console.log("scene_id: " + combine_scene_list[i].scene_id);
        console.log("name: " + combine_scene_list[i].name);
        var id = "cs_" + combine_scene_list[i].scene_id;
        body_html += ('<div class="dev-card-item" ><button id="' + id + '"' + ' type="button" class="layui-btn layui-btn-primary itxstBtn">' + combine_scene_list[i].name + '</button></div>');
        var jq = new Object;
        jq.id = id;
        jq_objs.push(jq);
    }

    console.log("combine_scene_html: " + combine_scene_html);

    combine_scene_html =
        "        <div class=\"dev-card\">\n" +
        `            <div class="dev-card-head">
                        <span>${$.i18n.prop("main.combine_scene")}</span>
                        <button type="button" class="layui-btn layui-btn-sm itxstBtnSave" style="display: none; flex: 0">${$.i18n.prop("common.save")}</button>
                    </div>\n`+
        "            <div class=\"dev-card-body\" id=\"itxst\" >" +
        body_html +
        "\n" +
        "            </div>\n" +
        "    </div>";

    $(".combine-scene-container").empty();
    $(".combine-scene-container").append(combine_scene_html);
    

    for (let i in jq_objs) {
        var jq = jq_objs[i];
        $("#" + jq.id).click(function () {
            var array = $(this).attr('id').split("_", 2);
            var scene_id = array[1];
            doCombineScene(scene_id);
        });
    }
     //获取对象
     var el = document.getElementById('itxst');
     //设置配置
     var ops = {
         disabled: true,
         animation: 300,
         //拖动结束
         onEnd: function (evt) {
            //  console.log(evt);
            //  //获取拖动后的排序
            //  var arr = sortable.toArray();
            //  alert(JSON.stringify(arr));
            $("#itxst").find("button").each(function() {
                console.log($(this).text());
            })
         },
        };
     //初始化
     sortable = Sortable.create(el, ops);

    var g3 = document.getElementById('container3');
    var ops3 = {
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
    sortable3 = Sortable.create(g3, ops3);
}

function doSpeech(word) {
    sendMsgToHost("speech", {
        "word": word
    });
}

function speech() {
    //表单验证
    var objWord = $("input[name='word']");
    var word = objWord.val();
    if ("" == word) {
        $("#word").tips({
            side: 3,
            msg: $.i18n.prop("center.combine_scene.entry_enter"),
            bg: '#AE81FF',
            time: 3
        });
        objWord.focus();
        return;
    }

    doSpeech(word);
    
}
