
function checkSession() {
    var sec = sessionStorage.getItem('sec');
    var session_id = sessionStorage.getItem('session_id');

    var jsonstr = '{"sec":"' + sec + '","session_id":"' + session_id + '"}';
    console.log('jsonstr: ' + jsonstr);
    $.ajax({
        url: getCGIPath() + "user.cgi/checkSession",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            //console.log("data: " + data);
            var obj = $.parseJSON(data);
            if (obj.result != 0) {
                sessionStorage.clear();
                location.href = "login.html";
            }
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
            location.href = "login.html";
        }
    });
}


$(function () {
    checkSession();
});
