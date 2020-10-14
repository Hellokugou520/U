function sendAjax({ url,
    type = 'get',
    data = {},
    dataType = 'json' } = {}) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url,
            type,
            data,
            dataType,
            success: function (d) {
                resolve([null, d]);
            },
            error: function (e) {
                resolve([e, '']);
            }
        });
    });
}