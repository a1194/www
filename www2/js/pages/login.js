function getRootPath() {//获得根目录
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    return curWwwPath.substring(0,pos);
}

function getCGIPath() {
    return getRootPath() + "/alinkboot/sys/www/cgi-bin/";
    //return "http://192.168.1.41/";
}

function showMessager(msg) {
    layui.layer.msg(msg, function () {
        time:2000
    });
}

var table;


function getVerif() {
    //表单提交
    var jsonstr = "{}";
    $.ajax({
        url: getCGIPath() + "user.cgi/getVerif",
        contentType: "application/json",
        data: jsonstr,
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            //getUsers();
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"));
        }
    });
}

function Base64() {

    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.toString();
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}

function doLogin() {
    var $1 = $.trim($("#account").val());
    var $2 = $.trim($("#password").val());

    if ($1 == '') {
        layer.msg($.i18n.prop("user.empty_user.tips"), function () {
            time:2000
        });
        return false;
    }

    if ($2 == '') {
        layer.msg($.i18n.prop("user.empty_password.tips"), function () {
            time:2000
        });
        return false;
    }

    //var md5_pwd = hex_md5($2);

    //var jsonstr = form2JsonString("form-login");
    var base = new Base64();
    var base64_pwd = base.encode($2);
    console.log("base64_pwd: " + base64_pwd);
    var jsonstr = '{"account":"' + $1 + '","password":"' + base64_pwd + '"}';
    console.log("jsonstr: " + jsonstr);

    $.ajax({
        url: getCGIPath() + "user.cgi/login",
        contentType: "application/json",
        type: 'post',
        data: jsonstr,
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            console.log(obj);
            if (obj.result == 0) {
                sessionStorage.setItem('account', obj.param.account);
                sessionStorage.setItem('type', obj.param.type);
                sessionStorage.setItem('session_id', obj.param.session_id);
                sessionStorage.setItem('sec', obj.param.sec);
                sessionStorage.setItem('user_id', obj.param.user_id);
                location.href = "main.html";
            }
            else {
                layer.msg(obj.msg);
                $("#password").val("");
                //location.reload();
            }
        }
    });
}


//JS
$(function () {
    //判断当前窗口是否有顶级窗口，如果有就让当前的窗口的地址栏发生变化，
    //这样就可以让登陆窗口显示在整个窗口了

    if (window.top != null && window.top.document.URL != document.URL) {
        window.top.location = document.URL;
        return;
    }

    $(document).keyup(function (event) {
        if (event.keyCode === 13) {
            doLogin();
            //alert("32423424");
            return false;
        }
    })

    getVerif();

    // layui.use(['form', 'jquery', 'layedit', 'laydate'], function () {
    //
    // });
});