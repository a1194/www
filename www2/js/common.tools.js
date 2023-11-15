function readFile(fileName) {
    var xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', fileName, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

function getObjAllAttribute(obj) {
    var description = "";
    for (var i in obj) {
        description += i + " = " + obj[i] + "\n";
    }
    return description;
}

function checkIP(value) {
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = value.match(exp);
    if (reg == null) {
        return false;
    } else {
        return true;
    }
}

function checkMac(value) {
    var exp = /^([a-fA-F0-9]{2}:){5}([a-fA-F0-9]{2})$/;
    var reg = value.match(exp);
    if (reg == null) {
        return false;
    } else {
        return true;
    }
}

function form2JsonString(formId) {
    var paramArray = $('#' + formId).serializeArray();
    /*请求参数转json对象*/
    var jsonObj = {};
    $(paramArray).each(function () {
        if (this.name.indexOf("id") != -1 || this.name == "type" || this.name == "protocol" || this.name == "state" || this.name == "no")
            jsonObj[this.name] = parseInt(this.value);
        else
            jsonObj[this.name] = this.value;
    });
    // json对象再转换成json字符串
    return JSON.stringify(jsonObj);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function getUrlParamAndDecode(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = decodeURI(window.location.search.substr(1)).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}

function formatDateTime() {
    var date = new Date();
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return y + m + d + h + minute + second;
}
