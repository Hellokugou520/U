//封装函数:发送ajax请求
function sendAjax({ url, type = 'get', data = {}, dataType = 'json' } = {}) {
    url = `http://localhost:3000${url}`;
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type,
            data,
            dataType,
            headers: {
                Authorization: localStorage['token']
            },
            success: function(d) {
                //  console.log(d, 999);
                resolve([null, d]);
            },
            error: function(e) {
                resolve([e, '']);
            }
        });
    });

}


//获取url地址中的参数
function getSearchArg(argName) {
    // 去掉锚点连接
    let theHref = window.location.href;
    let searchStr;
    if (theHref.indexOf("#") > -1) {
        searchStr = theHref.substr(0, theHref.indexOf("#"));
    } else {
        searchStr = theHref.substr(0);
    }
    let [, arr = ""] = searchStr.split("?");
    let argArr = arr.split("&");
    for (let i = 0; i < argArr.length; i++) {
        let smallArgArr = argArr[i].split("=");
        if (smallArgArr[0] === argName) {

            return decodeURIComponent(smallArgArr[1]); // decodeURIComponent方法: URL编码转换成中文的
        }
    }
    return "";
};