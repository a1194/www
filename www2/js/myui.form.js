(function ($) {
    $.fn.extend({
        // 调用方式：$("xxxxx").getform();
        getform: function () {
            var obj = {};
            var array = $(this).serializeArray();
            $.each(array, function () {
                obj[this.name] = this.value;
            });
            return obj;
        },
        // 调用方式： $("xxx").setform(json);
        // $("标签x").setform(json数据); 给标签x内文本框自动赋值json数据
        //$("#div").setform(${jsondata}); json格式 : {"name":"1","sax":"2","checkbox":"1,2,3"}
        setform: function (jsonValue) {
            if (typeof(jsonValue) != "undefined") {
                var obj = this;
                $.each(jsonValue, function (name, ival) {
                    console.log("name: " + name);
                    console.log("ival: " + ival);
                    var $input = obj.find("input[name=" + name + "]");
                    console.log("attr: " + $input.attr("type"));
                    if ($input.attr("type") == "radio" || $input.attr("type") == "checkbox") {
                        $input.each(function () {
                            if (Object.prototype.toString.apply(ival) == '[object String]') { // [object String] 或者 [object Array]
                                var arr = new Array();
                                arr = ival.split(","); //字符串分割
                                for (var i = 0; i < arr.length; i++) {
                                    if ($(this).val() == arr[i]) {
                                        $(this).attr("checked", "checked");
                                    }
                                }
                            } else {
                                if ($(this).val() == ival) {
                                    $(this).attr("checked", "checked");
                                }
                            }
                        });
                    } else if ($input.attr("type") == "textarea") { // 多行文本框
                        obj.find("[name=" + name + "]").html(ival);
                    } else {
                        obj.find("[name=" + name + "]").val(ival);
                    }
                });
            }
        },
        // 调用方式： $("xxx").disform(yyy); 标签disabled:true,yyy为disabled:false
        // $("标签x").setform(标签y); 除标签y以外,禁用标签x内全部文本只读,标签y可以为空
        //$("#disform").disform();
        //$("#disform").disform("#div");
        disform: function (jsonValue) {
            var obj = this;
            $("#" + obj[0].id + " input").each(function () {
                this.disabled = true
                this.style.backgroundColor = "#dcdcdc";
            })
            $("#" + obj[0].id + " textarea").each(function () {
                this.disabled = true
                this.style.backgroundColor = "#dcdcdc";
            })
            $("#" + obj[0].id + " select").each(function () {
                this.disabled = true
                this.style.backgroundColor = "#dcdcdc";
            })
            if (jsonValue != '') {
                $(jsonValue + " input").each(function () {
                    this.disabled = false
                    this.style.backgroundColor = "#ffffff";
                })
                $(jsonValue + " textarea").each(function () {
                    this.disabled = false
                    this.style.backgroundColor = "#ffffff";
                })
                $(jsonValue + " select").each(function () {
                    this.disabled = false
                    this.style.backgroundColor = "#ffffff";
                })
            }
        },
        //$("标签x").disformtrue(); 标签x内全部元素解除只读状态
        //$("#text_essas").disformtrue();
        disformtrue: function () {
            var obj = this;
            $("#" + obj[0].id + " input").each(function () {
                this.disabled = false
                this.style.backgroundColor = "#ffffff";
            })
            $("#" + obj[0].id + " textarea").each(function () {
                this.disabled = false
                this.style.backgroundColor = "#ffffff";
            })
            $("#" + obj[0].id + " select").each(function () {
                this.disabled = false
                this.style.backgroundColor = "#ffffff";
            })
        }
    });
})(jQuery)
