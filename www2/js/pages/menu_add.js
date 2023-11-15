function addMenu() {

  // if(!$("#menu_id").val()) {
  //   $("#menu_id").tips({
  //       side: 3,
  //       msg: $.i18n.prop("menu.enter_id.tips"),
  //       bg: '#AE81FF',
  //       time: 3
  //   });
  //   $("#menu_id").focus();
  //   return;
  // }

  if(!$("#menu_name").val()) {
    $("#menu_name").tips({
        side: 3,
        msg: $.i18n.prop("menu.enter_name.tips"),
        bg: '#AE81FF',
        time: 3
    });
    $("#menu_name").focus();
    return;
  }

  if(!$("#order_num").val()) {
    $("#order_num").tips({
        side: 3,
        msg: $.i18n.prop("menu.enter_order.tips"),
        bg: '#AE81FF',
        time: 3
    });
    $("#order_num").focus();
    return;
  }

  // if(!$("#path").val()) {
  //   $("#path").tips({
  //       side: 3,
  //       msg: $.i18n.prop("menu.enter_path.tips"),
  //       bg: '#AE81FF',
  //       time: 3
  //   });
  //   $("#path").focus();
  //   return;
  // }

  // if(!$("#icon").val()) {
  //   $("#icon").tips({
  //       side: 3,
  //       msg: $.i18n.prop("menu.enter_icon.tips"),
  //       bg: '#AE81FF',
  //       time: 3
  //   });
  //   $("#icon").focus();
  //   return;
  // }
  const data = {
    menu_id: Number($(".menu_id").val()),
    name: $(".menu_name").val(),
    parent_id: Number($(".parent_id").val()),
    order_num: Number($(".order_num").val()),
    path: $(".path").val() || '',
    menu_type: Number($("#menu_type").val()),
    icon: $(".icon").val() || '',
    show: Number($("#show").val())
  }
  console.log(JSON.stringify(data));
  $.ajax({
    url: getCGIPath() + "menu.cgi/add",
    contentType: "application/json",
    data: JSON.stringify(data),
    type: "POST",
    success: function (data) {
        console.log(data);
        if(!$.parseJSON(data).result) {
          closeWin(parent);
          showMessager($.i18n.prop("common.add.tips"), data.result);
          parent.reload();
          // reloadData()
        } else {
          showMessager($.i18n.prop("common.add_failure.tips"), data.result);
        }
        
    },
    error: function (data) {
        showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
    }
  })
}

$(function() {
  const type = getUrlParam("type")
  const parent_id = getUrlParam("parent_id")
  console.log(parent_id);
  console.log(type);
  if(type == 'addChildren') {
    $(".parent_id").val(parent_id)
    $(".parent_id").prop("disabled", "disabled")
  } else {
    $(".parent_id").val(0)
    $(".parent_id").prop("disabled", "disabled")
  }
    $(".menu_type").val(1)
    $(".menu_type").prop("disabled", "disabled")
    // $(".order_num").prop("disabled", "disabled")

    layui.form.render()
})