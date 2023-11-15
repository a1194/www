var checked = false;

function msgCallback(data) {
    if (checked) {
       // var content = $("#msg").text();
       // $("#msg").text(content + data + "\n\r");
    }
}

function deviceMsgCallback(data) {
    if (checked) {
       // var content = $("#msg").text();
       // $("#msg").text(content + data + "\n\r");
    }
}

//JS
$(function () {
    layui.use(['layer', 'jquery', 'form'], function () {
        var layer = layui.layer,
            $ = layui.jquery,
            form = layui.form;

        form.on('switch(monitorSwitch)', function(data){
            checked = this.checked ?  true  : false;
        });
    });

   // $("#msg").text("1232323232");
});
