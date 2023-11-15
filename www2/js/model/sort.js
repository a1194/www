var Sort = {
    sort_id: 0,
    name: "",
    protocol: 0,
    services: [],
    sn: ""
};

var sort_list = [];

function setSortList(data) {
    if (data.length == 0)
        sort_list = [];
    else
        sort_list = sort_list.concat(data);
}

function getSortList() {
    return sort_list;
}

function hasSwitchService(sort_id) {
    sort_id = parseInt(sort_id);
    for (index in sort_list) {
        var sort = sort_list[index];
        if (sort_id == sort.sort_id) {
            for (j in sort.services) {
                var service = sort.services[j];
                if ("switch" == service.name) {
                    return true;
                }
            }
        }
    }
    return false;
}

function doGetSorts() {
    sendMsgToHost("getSorts", {});
}


function doDelSort(sort_id) {
    sendMsgToHost("delSort", {
        "sort_id": parseInt(sort_id)
    });
}

function doDelSorts(ids) {
    sendMsgToHost("delSorts", {
        "ids": ids
    });
}

function doAddSort(msg_obj) {
    sendMsgToHost("addSort", msg_obj);

}

function doEditSort(msg_obj) {
    sendMsgToHost("editSort", msg_obj);
}

function getSortName(id) {
    id = parseInt(id);
    for (index in sort_list) {
        var sort = sort_list[index];
        if (sort.sort_id == id) {
            return sort.name;
        }
    }
    return "";
}

function getSortRw(id, serviceName) {
    id = parseInt(id);
    for (index in sort_list) {
        var sort = sort_list[index];
        if (sort.sort_id == id) {
            for (j in sort.services) {
                var services = sort.services[j];
                if (services.name == serviceName) {
                    return services.rw;
                }
            }
        }
    }
    return 0;
}

function getSortDevType(id) {
    id = parseInt(id);
    for (index in sort_list) {
        var sort = sort_list[index];
        if (sort.sort_id == id) {
            if(getDevTypeText(sort.dev_type) == '网关')
            return 1
        }
    }
    return 0;
}

function getSortAttrs(id, serviceName) {
    id = parseInt(id);
    for (index in sort_list) {
        var sort = sort_list[index];
        if (sort.sort_id == id) {
            for (j in sort.services) {
                var services = sort.services[j];
                if (services.name == serviceName) {
                    return services.attrs;
                }
            }
        }
    }
    return "";
}

function getServices(sort_id) {
    sort_id = parseInt(sort_id);
    var services = null;
    for (let i in sort_list) {
        if (sort_list[i].sort_id == sort_id) {
            services = sort_list[i].services;
            break;
        }
    }
    return services;
}

