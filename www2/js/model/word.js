var Word = {
    word_id: 0,
    type: 0,
    value: ""
};

var word_list = [];

function setWordList(data) {
    if (data.length == 0)
        word_list = [];
    else
        word_list = word_list.concat(data);
}

function getWordList() {
    return word_list;
}

function doGetWords() {
    sendMsgToHost("getWords", {});
}

function doDelWord(word_id) {
    sendMsgToHost("delWord", {
        "word_id": parseInt(word_id)
    });
}

function doDelWords(ids) {
    sendMsgToHost("delWords", {
        "ids": ids
    });
}

function doAddWord(msg_obj) {
    sendMsgToHost("addWord", msg_obj);

}

function doEditWord(msg_obj) {
    sendMsgToHost("editWord", msg_obj);
}
