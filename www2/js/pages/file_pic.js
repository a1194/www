

$(function() {
    getFile(3).then(res => {
        console.log(res);
    })

    $("#btn").dblclick(function(){
        $(window.frames.frameElement).attr('src', $(window.frames.frameElement).attr('src'))
    });
})