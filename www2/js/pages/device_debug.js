var table;

function msgCallback(data) {
    var obj = $.parseJSON(data)
    console.log(obj);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "saveDeviceCb") {
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.operate.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.operate_failure.tips"), obj.payload.result);
            }
        } else if (obj.method == "getSceneConfigsCb") {
            if (obj.payload.index == 1) {
                setSceneList([]);
            }
            setSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                createScenes();
            }
        } else if (obj.method == "getCombineScenesCb") {
            if (obj.payload.index == 1) {
                setCombineSceneList([]);
            }
            setCombineSceneList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                createCombineScenes();
            }
        } else if (obj.method == "getSortsCb") {
            console.log(obj);
            if (obj.payload.index == 1) {
                setSortList([]);
            }
            setSortList(obj.payload.data);

            if (obj.payload.index == obj.payload.total) {
                getDevices();
                getSceneConfigs();
                getCombineScenes();
            }
        } else if (obj.method == "getDevicesCb") {
            if (obj.payload.index == 1) {
                setDevList([]);
            }
            var list = obj.payload.data;
            var new_list = [];
            for (var index in list) {
                if (list[index].sort_id != SORT_ID.CONTROL_PANEL && list[index].sort_id != SORT_ID.AI_GATEWAY)
                    new_list.push(list[index]);
            }
            setDevList(new_list);

            if (obj.payload.index == obj.payload.total) {
                createDevices(true);
                getStates();
            }
        } else if (obj.method == "deviceStateCb") { 
            if (obj.payload.hasOwnProperty("sn") && obj.payload.hasOwnProperty("sort_id") && obj.payload.hasOwnProperty("service") &&
                obj.payload.hasOwnProperty("msg")) {
                // console.log("sn: " + obj.payload.sn);
                // console.log("sort_id: " + obj.payload.sort_id);
                // console.log("service: " + obj.payload.service);
                updateDevice(obj.payload.sn, obj.payload.service, obj.payload.msg)
                if (obj.payload.service == "button1") {
                    doCombineScene(1);
                } else if (obj.payload.service == "button2") {
                    doCombineScene(2);
                }
            }
        } else if (obj.method == "getStatesCb") {
            if (obj.payload.index == 1) {
                setStateList([]);
            }
            var list = obj.payload.data;
            var new_list = [];
            for (var index in list) {
                if (list[index].sort_id != SORT_ID.CONTROL_PANEL && list[index].sort_id != SORT_ID.AI_GATEWAY)
                    new_list.push(list[index]);
            }
            setStateList(new_list);

            if (obj.payload.index == obj.payload.total) {
                updateDevices();
            }

        }
    }
}

function back() {
    window.location = "device.html";
}

function goAdd() {
    window.location = '../../device_add_test.html';
}

function getCombineScenes() {
    doGetCombineScenes();
}

function getSceneConfigs() {
    doGetSceneConfigs();
}

function getDevices() {
    doGetDevices();
}

function getSorts() {
    doGetSorts();
}


function toggle(sn) {
    let currentHtnl = event.currentTarget.innerHTML
    // event.currentTarget.innerHTML = currentHtnl == "▲" ? "▼" : "▲"
    document.getElementById(`toggle${sn}`).innerHTML = currentHtnl == "▲" ? "▼" : "▲"
    var id = "#" + sn;
    $(id).toggle();
}

function getStates() {
    doGetStates();
}

//编辑
function edit() {
    
    if($(".itxstBtnSave").css("display") == 'none') {
        $(".itxstBtnSave").css("display", "block") 
        $(".itxstBtn").each(function() {
            $(this).css("cursor", "move")
        })
    } else {
        $(".itxstBtnSave").css("display", "none")
        $(".itxstBtn").each(function() {
            $(this).css("cursor", "pointer")
        })
    }
    
    sortable.options.disabled = !sortable.options.disabled
    sortable1.options.disabled = !sortable1.options.disabled
    sortable2.options.disabled = !sortable2.options.disabled
    sortable3.options.disabled = !sortable3.options.disabled

    
}

//JS
$(function () {
    getSorts();

    layui.use(function() {
        var form = layui.form;
        var layer = layui.layer;

        form.on('checkbox(isShow)', function(data){
            dev_list.forEach(item => {
                if(!data.elem.checked) {
                    const bar = document.getElementById(`toggle${item.sn}`)
                    if(bar) bar.innerHTML = "▼"
                    $('#' + item.sn).css("display", "none")
                } else {
                    const bar = document.getElementById(`toggle${item.sn}`)
                    if(bar) bar.innerHTML = "▲"
                    $('#' + item.sn).css("display", "block")
                }
            })
            var elem = data.elem; // 获得 checkbox 原始 DOM 对象
            
        });
        form.render()
    })

    $("#checkbox").attr("title", $.i18n.prop("device.show_all"))
});
