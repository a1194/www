$(function () {
    getSysState();
    //getVerLog();
});

// 获取CPU、内存、硬盘占用情况
function getSysState() {
    $.ajax({
        url: getCGIPath() + "system.cgi/getSysState",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            console.log("data: " + data);
            var obj = $.parseJSON(data);
            set_cpu(obj.cpu);
            set_memory(obj.memory);
            set_disk(obj.disk);
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

function getVerLog() {
    $.ajax({
            url: getCGIPath() + "system.cgi/getVerLog",
        contentType: "application/json",
        data: "{}",
        type: "POST",
        success: function (data) {
            //console.log("data: " + data);
            var obj = $.parseJSON(data);
            var str = obj.data + "";
            str = str.replaceAll("更新日志: ", "<br />更新日志: <br />");
            str = str.replaceAll("；", "；<br />");
            $("#log").html(str);
        },
        error: function () {
            showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
        }
    });
}

// 设置扇形图
function set_cpu(str) {
    var str1 = parseInt(str);
    var str2 = 100 - str1;

    var dom = document.getElementById("container_cpu");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        backgroundColor: '#2c343c',

        title: {
            text: 'CPU',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 20,
            max: 100,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        
    };
    option.series = [
        {
            name: $.i18n.prop("home.proportion"),
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [
                {value: str1, name: $.i18n.prop("home.used")},
                {value: str2, name: $.i18n.prop("home.surplus")}
            ].sort(function (a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: '#2c343c'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}

function set_memory(str) {
    var str1 = parseInt(str);
    var str2 = 100 - str1;

    var dom = document.getElementById("container_memory");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        backgroundColor: '#2c343c',

        

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 20,
            max: 100,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        
    };
    
    option.title = {
        text: $.i18n.prop("home.memory"),
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    }
    option.series = [
        {
            name: $.i18n.prop("home.proportion"),
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [
                {value: str1, name: $.i18n.prop("home.used")},
                {value: str2, name: $.i18n.prop("home.surplus")}
            ].sort(function (a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: '#2c343c'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]


    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}


function set_disk(str) {
    var str1 = parseInt(str);
    var str2 = 100 - str1;

    var dom = document.getElementById("container_disk");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        backgroundColor: '#2c343c',

        

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 20,
            max: 100,
            inRange: {
                colorLightness: [0, 1]
            }
        }
        
    };
    
    
    option.title = {
        text: $.i18n.prop("home.disk"),
        left: 'center',
        top: 20,
        textStyle: {
            color: '#ccc'
        }
    }
    option.series = [
        {
            name: $.i18n.prop("home.proportion"),
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: [
                {value: str1, name: $.i18n.prop("home.used")},
                {value: str2, name: $.i18n.prop("home.surplus")}
            ].sort(function (a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: '#2c343c'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }
    ]

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
