

//创建目录
// function createDir(res) {

//     const parents = res.filter(item => item.parent_id == 0)
//     const childrens = res.filter(item => item.parent_id != 0)
//     for(const parent of parents) {
//         parent.childrens = childrens.filter(item => item.parent_id == parent.file_id)
//     }
//     console.log(parents);
//     let flag = true
//     for(const index in parents) {
//         let tem = ''
//         if(!parents[index].childrens.length) {
//             if(index != 0) {
//                 tem += 
//                     `
//                         <li class="layui-menu-item-divider"></li>
//                     `
//             }
//             if(flag) {
//                 tem += 
//                     `
//                         <li lay-options="{id: 100}" class="layui-menu-item-checked">
//                             <div class="layui-menu-body-title">
//                                 <a href="javascript:;">${parents[index].name}</a>
//                                 <i class="layui-icon layui-icon-addition" onClick="createSubDir(${parents[index].file_id})"></i>
//                             </div>
//                         </li>

//                     `
//                 flag = !flag
//             } else {
//                 tem += 
//                     `
//                         <li lay-options="{id: 100}">
//                             <div class="layui-menu-body-title">
//                                 <a href="javascript:;">${parents[index].name}</a>
//                                 <i class="layui-icon layui-icon-addition" onClick="createSubDir(${parents[index].file_id})"></i>
//                             </div>
//                         </li>

//                     `
//             }
            
            
//         } else {
//             if(index != 0) {
//                 tem += 
//                     `
//                         <li class="layui-menu-item-divider"></li>
//                     `
//             }
//             tem +=
//                 `
//                     <li class="layui-menu-item-group layui-menu-item-down" lay-options="{type: 'group'}">
//                         <div class="layui-menu-body-title">
//                             <a href="javascript:;">${parents[index].name}</a>
//                             <i class="layui-icon layui-icon-addition" onClick="createSubDir(${parents[index].file_id})"></i>
//                             <i class="layui-icon layui-icon-up"></i>
//                         </div>
                
//                         <ul>
//                 `
//                 for(const children of parents[index].childrens) {
//                     if(flag) {
//                         tem +=
//                         `   
//                             <li lay-options="{id: 103}" class="layui-menu-item-checked">
//                                 <div class="layui-menu-body-title">
//                                     <a href="javascript:;">${children.name}</a>
//                                     <i class="layui-icon layui-icon-error" onClick="deleteDir(${children.file_id})"></i>
//                                 </div>
//                             </li>
//                         `
//                         flag = !flag
//                     } else {
//                         tem +=
//                             `   
//                                 <li lay-options="{id: 103}">
//                                     <div class="layui-menu-body-title">
//                                         <a href="javascript:;">${children.name}</a>
//                                         <i class="layui-icon layui-icon-error" onClick="deleteDir(${children.file_id})"></i>
//                                     </div>
//                                 </li>
//                             `
//                     }
                    
//                 }
//                 `
//                         </ul>
//                     </li>
//                 `
                
//         }
//         $("#demo-menu").append(tem)
//     }
// }

//获取文件列表
function getFile(file_type = "") {
    const d = {
        file_type
    }
    const data = JSON.stringify(d)
    console.log(data);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: getCGIPath() + "file.cgi/getFiles",
            contentType: "application/json",
            type: "POST",
            data,
            success: function (res) {
                console.log($.parseJSON(res));
                resolve($.parseJSON(res))
            },
            error: function (err) {
                console.log($.parseJSON(err));
                showMessager($.i18n.prop("common.operate_failure.tips"), err.result);
            }
        });
    })
}
//创建目录
function createDir(res) {
    let tem = ''
    if(res.length) {
        res.forEach((item, index) => {
            if(index == 0) {
                tem += 
                    `
                        <li lay-options="{id: 100}" class="layui-menu-item-checked">
                    `
            } else {
                tem += 
                    `
                        <li class="layui-menu-item-divider"></li>
                        <li lay-options="{id: 100}">
                    `
            }
            tem += 
                `
                        <div class="layui-menu-body-title" onClick="dirClick(${item.file_id})">
                            <a href="javascript:;">${item.name}</a>
                        </div>
                    </li>
                `
        })
        // tem += 
        //     `
        //         <li class="layui-menu-item-divider"></li>
        //         <li lay-options="{id: 100}">
        //             <div class="layui-menu-body-title" onClick="addDir()">
        //                 <a href="javascript:;" style="text-align: center; color: "#eaeaea"">+</a>
        //             </div>
        //         </li>
        //     `
    }
    
    $("#demo-menu").append(tem)
}