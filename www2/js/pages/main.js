

function getCurrectIframeName() {
    var name = $('.layui-tab-title').find($("li.layui-this")).attr("lay-id");
    return name;
}

function logout() {
    layer.confirm($.i18n.prop("common.logout.tips"), {
        title: $.i18n.prop("common.logout"),
        btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
    },function (index) {
        var session_id = sessionStorage.getItem('session_id');
        var jsonstr = '{"session_id":"' + session_id + '"}';
        console.log('jsonstr: ' + jsonstr);
        $.ajax({
            url: getCGIPath() + "user.cgi/logout",
            contentType: "application/json",
            data: jsonstr,
            type: "POST",
            success: function (data) {
                console.log("data: " + data);
                var obj = $.parseJSON(data);
                if (obj.result == 0) {
                    //sessionStorage.clear();
                    showMessager($.i18n.prop("common.operate.tips"));
                    location.href = "login.html";
                }
            },
            error: function () {
                showMessager("common.operate_failure.tips");
            }
        });
        layer.close(index);
    });
    
}

//var localIp = readFile("ip.cfg");
var localIp = window.location.host;
console.log("localIp: " + localIp);






var myMessage;
var mqtt;
var options;
var host = localIp;
var port = 9001;
var userName = "acematic";
var password = "ACEMATIC2018_";
var isConnected = false;

var uuid = Date.now() + Math.random().toString(36).substr(2,4);
var clientTopic = "/client/" + uuid;
var clientsTopic = "/clients";
console.log("uuid: " + uuid);

function getUUID() {
    return uuid;

    // var uid = [];
    // var hexDigits = "0123456789abcdefghijklmnopqrst";
    // for (var i = 0; i < 32; i++) {
    //     uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    // }
    // uid[6] = "4";
    // uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1);
    // var uuid = uid.join("");
    // return uuid;
}

// onConnect 事件
function onConnect() {
    console.log('connected.');
    // 订阅 download topic
    var subOptions = {
        qos: 0,
        onSuccess: onSubscribe
    };
    mqtt.subscribe(clientsTopic, subOptions);
    mqtt.subscribe(clientTopic, subOptions);
    isConnected = true;
}

function onConnectionLost(responseObject) {//断开连接
    isConnected = false;
    console.log("onConnectionLost:" + responseObject.errorCode);
    if (responseObject.errorCode !== 0) {
        console.log("errorMessage:" + responseObject.errorMessage);
        mqttReConnect();
    }
}

// 订阅主题成功事件
function onSubscribe(context) {
    console.log('subscribe success');
    console.log(context);
}

// 连接失败事件
function onFailure(message) {
    console.log('connect failed.');
    setTimeout("mqttConnect()", 2000);
}

// onMessageArrived 事件
function onMessageArrived(message) {
    //console.log("destinationName: " + message.destinationName);
    console.log("from mqtt: " + message.payloadString);

    //var name = getCurrectIframeName();
    var name = "main-iframe"
    //console.log('iframe name: ' + name);
    if (name != null && name != "") {
        try {
            if (message.destinationName == clientTopic || message.destinationName == clientsTopic) {
                if (window.frames[name].window.msgCallback && typeof(window.frames[name].window.msgCallback) == "function") {
                    window.frames[name].window.msgCallback(message.payloadString);
                }
            }
        } catch (e) {
            console.log("msgCallback error!");
        }
    }
}

function mqttPublish(topic, data) {
    if (!isConnected) {
        console.log("mqtt is not connected!");
        return;
    }

    console.log('mqtt send: ' + data);
    var msg = new Paho.MQTT.Message(data);
    msg.destinationName = topic;
    mqtt.send(msg);
}

// 建立 MQTT websocket 连接
function mqttConnect() {
    console.log('connecting to ' + host + ':' + port);
    var client = getUUID();
    mqtt = new Paho.MQTT.Client(host, port, client);
    options = {
        timeout: 10,
        onSuccess: onConnect,
        onFailure: onFailure,
        userName: userName,
        password: password,
        mqttVersion: 4
    };
    mqtt.onConnectionLost = onConnectionLost;
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(options);
}

function mqttReConnect() {
    mqtt.connect(options);
}

mqttConnect();


function showMessager(msg, result) {
    if (result == null) {
        myMessage.add(msg);
    } else {
        var type = "error";
        if (result == 0)
            type = "success"
        myMessage.add(msg, type);
    }
}

function frameChange() {
    //获取body高度
    var h = $('.layui-body').height() - 64;
    //设置tab的高度，
    $(".layui-tab").css("height", h + "px");
}

$(window).resize(function () {
    frameChange();
});


function openTab(othis, i) {

    var e = window.event || arguments.callee.caller.arguments[0];
    e.stopPropagation()

    var path = $(othis).attr("path");
    var title = $(othis).text();
    
    

    $("#tab-title").html(title);
    $("#tab-content").attr("src", path);


    // if(!$(`.item${i}`).hasClass("layui-nav-itemed")) {
    //     $(`.item${i}`).addClass("layui-nav-itemed")
    // } 
    $(".ddClass.layui-this").each(function() {
        // console.log(this);
        $(this).removeClass("layui-this")
    })
    $(othis).parent().addClass("layui-this")
    /*
    $(othis).parent().removeClass("layui-this")
    var exist = $("li[lay-id='" + name + "']").length; //判断是否存在tab
    if (exist == 0) {
        layui.element.tabAdd('tab-filter', {
            title: title,
            content: '<iframe name="' + name + '"' + ' scrolling="auto" src="' + name + '.html' + '" frameborder="0" style="width:100%;height:100%;"></iframe>',
            id: name //实际使用一般是规定好的id，这里以时间戳模拟下
        })
    }

    layui.element.tabChange('tab-filter', name);

    $("#tab-title").html(title);
    $("#tab-content").attr("src", name + '.html');
    */
}

function itemClick(othis) {
    if(!$(othis).hasClass("layui-nav-itemed")) {
        $(othis).addClass("layui-nav-itemed")
    } else {
        $(othis).removeClass("layui-nav-itemed")
    }
    
}

function initNav(res) {
    console.log(res);
    var account = sessionStorage.getItem('account');
    $('#account').html(account);
    // if (parseInt(type) == 1) {
        $('#nav-container').empty();
        //获取父元素
        const parents = res.filter(item => {
            return item.parent_id == 0
        })
        //获取子元素
        const childdrens = res.filter(item => {
            return item.parent_id != 0
        })
        for(const parent of parents) {
            const children = childdrens.filter(item => item.parent_id == parent.menu_id)
            parent.children = children
        }
        
        console.log(parents);
        //遍历父元素
        for(let index in parents) {
            let i = Number(index) + 1

            try {
                $('#nav-container').append(
                    
                    `<li class="layui-nav-item ${index == 0 ? 'layui-nav-itemed' : ''} item${i}" onclick="itemClick(this)" title="${$.i18n.prop(parents[index].name)}">\n` + 
                        `<a class="" href="javascript:;" >\n` +
                            `<i class="layui-icon layui-icon-down layui-nav-more"></i>\n` +
                            `<span data-i18n-text="${parents[index].name}" class="testClass"></span>\n` +
                            
                        `</a>\n` +
                        `<dl class="layui-nav-child" id="child${i}">\n` +
                        `</dl>\n` +
                    `</li>\n`
                
                )   
            } catch (error) {
                $('#nav-container').append(
                        
                    `<li class="layui-nav-item ${index == 0 ? 'layui-nav-itemed' : ''} item${i}" onclick="itemClick(this)" title="${parents[index].name}">\n` + 
                        `<a class="" href="javascript:;" >\n` +
                            `<i class="layui-icon layui-icon-down layui-nav-more"></i>\n` +
                            `<span  class="testClass">${parents[index].name}</span>\n` +
                            
                        `</a>\n` +
                        `<dl class="layui-nav-child" id="child${i}">\n` +
                        `</dl>\n` +
                    `</li>\n`
                
                )
            }
            for(const child of parents[index].children) {
                try {
                    $(`#child${i}`).append(
                    
                        `<dd class="ddClass" title="${$.i18n.prop(child.name)}"><a href="javascript:;" onclick="openTab(this, ${i})" path="${child.path}" data-i18n-text="${child.name}"></a></dd>\n`

                    
                    )
                } catch (error) {
                    $(`#child${i}`).append(
                        
                        `<dd class="ddClass" title="${child.name}"><a href="javascript:;" onclick="openTab(this, ${i})" path="${child.path}" >${child.name}</a></dd>\n`

                    
                )
                }
                
                
                
            }

        }
       
}

function getActiveProduct() {
    var jsonstr = "{}";
    //表单提交
    $.ajax({
        url: getCGIPath() + "product.cgi/getActive",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var jsonobj = $.parseJSON(data);
            initNav(jsonobj.services);
        },
        error: function () {
            initNav([]);
        }
    });

    // var jsonstr = '{"prod_id":' + 1 + '}';
    // console.log('jsonstr: ' + jsonstr);
    // $.ajax({
    //     url: getCGIPath() + "product.cgi/getProduct",
    //     contentType: "application/json",
    //     data: jsonstr,
    //     type: "POST",
    //     success: function (data) {
    //         console.log("data2: " + data);
    //         var jsonobj = $.parseJSON(data);
    //
    //     },
    //     error: function () {
    //         showMessager("操作失败", "-1");
    //     }
    // });
}

function getMenus() {
    const type = sessionStorage.getItem("type")
    
        //表单提交
        var jsonstr = '{"type":' + type + '}';
        $.ajax({
            url: getCGIPath() + "menu.cgi/getAll",
            contentType: "application/json",
            data: jsonstr,
            type: "POST",
            success: function (data) {
                // resolve($.parseJSON(data))
                initNav($.parseJSON(data));
                initLanguage();
            },
            error: function () {
                showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
                // reject()
            }
        });
    
}



$(function () {
    
    //获取菜单
    getMenus()

    layui.use(['element', 'layer', 'util'], function () {
    
        var element = layui.element
        , layer = layui.layer
        , util = layui.util
        , $ = layui.$;
        //头部事件
        util.event('lay-header-event', {
            //左侧菜单事件
            menuLeft: function (othis) {
                layer.msg('展开左侧菜单的操作', {icon: 0});
            }
            , menuRight: function () {
                layer.open({
                    type: 1
                //   type: 2
                    , content: ''
                    , area: ['260px', '100%']
                    , offset: 'rt' //右上角
                    , anim: 5
                    , shadeClose: true
                    , title: $.i18n.prop("common.message")
                });
            }
        });
        
    });

    //页面发生变化改变
    frameChange();
    getSetting();


    myMessage = new MyMessage.message({
        /*默认参数，下面为默认项*/
        iconFontSize: "20px", //图标大小,默认为20px
        messageFontSize: "12px", //信息字体大小,默认为12px
        showTime: 3000, //消失时间,默认为3000
        align: "center", //显示的位置类型center,right,left
        positions: { //放置信息距离周边的距离,默认为10px
            top: "60px",
            bottom: "10px",
            right: "10px",
            left: "10px"
        },
        message: "这是一条消息", //消息内容,默认为"这是一条消息"
        type: "normal", //消息的类型，还有success,error,warning等，默认为normal
    });

    /*两种不同的设置方式*/
    myMessage.setting({
        align: "right" //会覆盖前面的所有设置,可以创建不同的对象去避免覆盖
    });
    myMessage.setting("showTime", "3000");

    /*
    $('#btn1').click(function() {
        message.add("普通的消息");
    });
    $('#btn2').click(function() {
        message.add("成功的消息", "success");
    });
    $('#btn3').click(function() {
        message.add("警告的消息", "warning");
    });
    $('#btn4').click(function() {
        message.add("错误的消息", "error");
    });
    */
    showMessager("Welcome", null);

    layui.jquery(".testClass").html($.i18n.prop('sort.unknown_device'))
    
    $(".nav-title").click(function() {
        // document.getElementById("tab-content").src = "home.html"
        $("#tab-content").attr("src", "home.html")
        $(".ddClass").removeClass("layui-this")
        $(".layui-nav-item").removeClass("layui-nav-itemed")
    })
    layui.element.init();
});