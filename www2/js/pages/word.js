var table;

function reLoad() {
    getWords();
}

function getUUID() {
    return parent.getUUID();
}

function mqttPublish(topic, data) {
    return parent.mqttPublish(topic, data);
}

function msgCallback(data) {

    var obj = $.parseJSON(data);
    if (obj.hasOwnProperty("method") && obj.hasOwnProperty("payload")) {
        if (obj.method == "getWordsCb") {
            if (obj.payload.index == 1) {
                setWordList([]);
            }
            setWordList(obj.payload.data);
            if (obj.payload.index == obj.payload.total) {
                table.reload('word-table', {
                    data: getWordList()
                });
            }
        } else if (obj.method == "delWordCb" || obj.method == "delWordsCb") {
            closeLoading();
            if (obj.payload.result == 0) {
                showMessager($.i18n.prop("common.delete_success.tips"), obj.payload.result);
            } else {
                showMessager($.i18n.prop("common.delete_failure.tips"), obj.payload.result);
            }
        }
    }

    if (window.frames["sub-iframe"].window.msgCallback && typeof(window.frames["sub-iframe"].window.msgCallback) == "function") {
        window.frames["sub-iframe"].window.msgCallback(data);
    }


    
}

function delWord(word_id) {
    openLoading(3000);
    doDelWord(parseInt(word_id));
}

function delWords(ids) {
    openLoading(3000);
    doDelWords(ids);
}

function getWords() {
    doGetWords();
}

//JS
$(function () {
    getWords();

    layui.use('table', function () {
        layui.jquery(".ctWord").text($.i18n.prop('common.add_new'))
        layui.jquery(".bulkDeletion").text($.i18n.prop('word.bulk_delete'))
        layui.jquery(".edit").text($.i18n.prop('common.edit'))
        layui.jquery(".del").text($.i18n.prop('common.delete'))
        table = layui.table;
        
        var obj = {
            elem: '#word-table'
            //,url:'data.json'
            , toolbar: '#word-toolbar' //开启头部工具栏，并为其绑定左侧模板
            , defaultToolbar: [{
                title: $.i18n.prop("common.filter_column")
                , layEvent: "LAYTABLE_COLS"
                , icon: 'layui-icon-cols'
            }, {
                title: $.i18n.prop("common.export")
                , layEvent: 'exportFile'
                , icon: 'layui-icon-export'
            }, {
                title: $.i18n.prop("common.print")
                , layEvent: 'LAYTABLE_PRINT'
                , icon: 'layui-icon-print'
            }, { //自定义头部工具栏右侧图标。如无需自定义，去除该参数即可
                title: $.i18n.prop("common.refresh")
                , layEvent: 'refresh'
                , icon: 'layui-icon-refresh'
            }]
            , limits: [100,200]
            , limit: 100
            , title: '语音词条数据表'
            , cols: [[
                {type: 'checkbox', fixed: 'left'}
                , {field: 'word_id', title: "id", width: 120, fixed: 'left', unresize: true, room: true}
                //, {field: 'type', title: '类型', width: 200}
                , {field: 'value', title: $.i18n.prop("word.value"), width: 200}
                , {fixed: 'right', title: $.i18n.prop("common.operate"), toolbar: '#word-shortcut', width: 300}
            ]]
            
            , data: []
            , text: {
                none: $.i18n.prop("common.no_data")
            }, page: {
                prev: $.i18n.prop("common.prev"),
                next: $.i18n.prop("common.next"),
                layout: ['prev','page','next'],
            }
            , done: function(res, curr, count) {
                var listData = res.data
                // console.log(res);
                table.on('toolbar(word-table)', function (obj) {
                    var checkStatus = table.checkStatus(obj.config.id);
                    switch (obj.event) {
                        case 'goAdd':
                            openWin($.i18n.prop("word.add_word"), "word_add.html");
                            break;
                        case 'dels':
                            //var checkStatus = table.checkStatus(obj.config.id);
                            var ids = [];
                            if (checkStatus.data.length > 0) {
                                $.each(checkStatus.data, function (index, item) {
                                    ids.push(item.word_id)
                                });
                                layer.confirm($.i18n.prop("word.delete.tips"), {
                                    title: $.i18n.prop("common.delete"),
                                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                                }, function (index) {
                                    delWords(ids);
                                    layer.close(index);
                                });
                            } else {
                                layer.msg($.i18n.prop("common.select.tips"));
                            }
                            break;
                        case 'refresh':
                            getWords();
                            break;
                        case 'exportFile':
                            table.exportFile("word-table", listData, 'xls')
                        break;
                    }
                    ;
                });
            }
        }
        table.render(obj);

        

        
        table.on('tool(word-table)', function (obj) {
            var data = obj.data;
            //console.log(obj)
            if (obj.event === 'edit') {
                openWin($.i18n.prop("word.edit"), "word_edit.html?word_id=" + data.word_id);
            } else if (obj.event === 'del') {
                layer.confirm($.i18n.prop("word.dele.tips"), {
                    title: $.i18n.prop("common.delete"),
                    btn: [$.i18n.prop("common.confirm"), $.i18n.prop("common.cancel")]
                }, function (index) {
                    delWord(data.word_id);
                    layer.close(index);
                });
            }
        });

    });
});
