// 获取菜单数据
function getMenus() {
  return new Promise((resolve, reject) => {
    var jsonstr = "{}";
    $.ajax({
      url: getCGIPath() + "menu.cgi/getAll",
      contentType: "application/json",
      data: jsonstr,
      type: "POST",
      success: function (data) {
        console.log(data);
          console.log($.parseJSON(data));
          resolve($.parseJSON(data))
      },
      error: function () {
          showMessager($.i18n.prop("common.operate_failure.tips"), "-1");
      }
  })
  
});
}

// 确认修改
function editMenu() {

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

  console.log($("#menu_type").val());
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
    url: getCGIPath() + "menu.cgi/edit",
    contentType: "application/json",
    data: JSON.stringify(data),
    type: "POST",
    success: function (data) {
        if(!$.parseJSON(data).result) {
          closeWin(parent);
          showMessager($.i18n.prop("common.edit.tips"), data.result);
          parent.reload();
        } else {
          showMessager($.i18n.prop("common.edit_failure.tips"), data.result);
        }
        
    },
    error: function () {
        showMessager($.i18n.prop("common.operate_failure.tips"), data.result);
    }
  })
}

$(function() {


  const menuId = JSON.parse(decodeURIComponent(getUrlParam("data")))
  
  console.log((menuId));
  getMenus().then(res => {
    const currentData = res.find(item => {
      return item.menu_id == menuId
    })
    console.log(currentData);
    $(".menu_id").val(currentData.menu_id)
    $(".menu_name").val(currentData.name)
    $(".parent_id").val(currentData.parent_id)
    $("#order_num").val(currentData.order_num)
    $(".path").val(currentData.path)
    $(".menu_type").val(currentData.menu_type)
    $(".icon").val(currentData.icon)
    $("#show").val(currentData.show)
    

    
    $(".parent_id").prop("disabled", "disabled")
    // $(".order_num").prop("disabled", "disabled")
    $(".menu_type").prop("disabled", "disabled")
    $(".menu_id").prop("disabled", "disabled")

    layui.form.render()
  })
})