var Product = {
    prod_id: 0,
    name: "",
    sort_id: 0,
    state: 0,
    services: ""
}

function doAddProduct(msg_obj) {
    sendMsgToHost("addProduct", msg_obj);
}

function doEditProduct(msg_obj) {
    sendMsgToHost("editProduct", msg_obj);
}

function doDelProduct(prod_id) {
    sendMsgToHost("delProduct", {
        "area_id": parseInt(prod_id)
    });
}

function doSetProductState(prod_id) {
    sendMsgToHost("setProductState", {
        "prod_id": parseInt(prod_id)
    });
}
