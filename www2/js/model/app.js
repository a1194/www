var app = {
    app_id: 0,
    app_name: "",
    apk_name: "",
    state: 0,
    ver: ""
};
var apps = []

function doSetAppState(msg_obj) {
    sendMsgToHost("setAppState", msg_obj);
}

function createApp(apps) {
    $(".layui-tab-content").empty()
    let tem = ''
    apps.forEach(item => {
        const itemData = JSON.stringify(item)
        tem += `
            <div class="item">
                <div class="left">
                    <i class="layui-icon layui-icon-app"></i>
                    <div class="state state${item.app_id}" onclick='handleStateClick(${itemData})'>
                        ${item.state == 1 ? '启用' : '禁用'}
                    </div>
                </div>
                <div class="right">
                    <div class="name" title='${item.app_name}'>${item.app_name}</div>
                    <div class='version'>${item.ver}</div>
                    <div class="control">
                        <div class="btn1" onclick='handleBtn1Click(${item.app_id})'>
                            <i class="layui-icon layui-icon-edit"></i>
                            <span class='constolItem'>修改</span>
                        </div>
                        <div class="btn2" onclick='handleBtn2Click(${item.app_id})'>
                            <i class="layui-icon layui-icon-delete"></i>
                            <span class='constolItem'>卸载</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    })
    $(".layui-tab-content").append(tem)

    

    // $(".btn2").click(function() {
    //     openWin($.i18n.prop("common.change"), "app_edit.html?app_id=" + data.app_id);
    // })
}


function createStore() {
    $(".layui-tab-content").empty()
}
