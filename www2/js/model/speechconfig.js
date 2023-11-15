var SpeechConfig = {
    word_id: 0,
    words: [],
    room_id: 0,
    actions: [],
    action_total: 0
};

var speech_list = [];

function setSpeechList(data) {
    if (data.length == 0)
        speech_list = [];
    else
        speech_list = speech_list.concat(data);
}

function getSpeechList() {
    return speech_list;
}

function doGetSpeechConfigs() {
    sendMsgToHost("getSpeechConfigs", {});
}

function doGetSpeechConfig(word_id) {
    sendMsgToHost("getSpeechConfig", {
        "word_id": parseInt(word_id)
    });
}

function doDelSpeechConfig(word_id) {
    sendMsgToHost("delSpeechConfig", {
        "word_id": parseInt(word_id)
    });
}

function doDelSpeechConfigs(ids) {
    sendMsgToHost("delSpeechConfigs", {
        "ids": ids
    });
}

function doAddSpeechConfig(words, room_id, actions_obj) {
    sendMsgToHost("addSpeechConfig", {
        "words": words,
        "room_id": parseInt(room_id),
        "actions": actions_obj
    });
}

function doEditSpeechConfig(word_id, words, room_id, actions_obj) {
    sendMsgToHost("editSpeechConfig", {
        "word_id": parseInt(word_id),
        "words": words,
        "room_id": parseInt(room_id),
        "actions": actions_obj
    });
}

function doSpeech(word) {
    sendMsgToHost("speech", {
        "word": word
    });
}
