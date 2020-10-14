// 首页JS


// 运动框架
function getStyle(obj, attr) {
    if (window.getComputedStyle) {
        return getComputedStyle(obj)[attr];
    } else {
        return obj.currentStyle[attr];
    }
}

function move(obj, json, callback) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        var onOff = true; // 开头

        // for里面改开关的状态
        for (var attr in json) {
            var target = json[attr]; // target是目标  attr是属性

            if (attr === 'opacity') {
                var iNow = getStyle(obj, 'opacity') * 100; // 当前的位置
            } else {
                var iNow = parseInt(getStyle(obj, attr)); // 当前的位置
            }

            var dir = (target - iNow) / 10; // (目标 - 当前) / 系数
            dir = dir > 0 ? Math.ceil(dir) : Math.floor(dir);

            iNow += dir; // 下一步应该运动到的位置

            if ((iNow >= target && dir > 0) || (iNow <= target && dir < 0)) {
                iNow = target;
            }

            if (attr === 'opacity') {
                obj.style.opacity = iNow / 100;
                obj.style.filter = 'alpha(opacity = ' + iNow + ')';
            } else {
                obj.style[attr] = iNow + 'px';
            }

            if (iNow != target) {
                onOff = false;
            }
        }

        if (onOff) {
            clearInterval(obj.timer);
            callback && callback();
        }
    }, 30);
}

// 轮播图
function banners() {
    var banner = document.querySelector('.rotation_chart .w');
    var ul = document.querySelector('.run_banner');
    var li = document.querySelectorAll('.run_banner li');
    var lBtn = document.querySelector('.left_arrow');
    var rBtn = document.querySelector('.right_arrow');
    var span = document.querySelectorAll('.dots span');
    var clientW = 1000;
    var count = 0;
    var timer = null;

    ul.style.width = li.length * clientW + 'px';
    for (var i = 0; i < li.length; i++) {
        li[i].style.width = clientW + 'px';
    }

    timer = setInterval(auto, 3000);
    banner.onmouseover = function () {
        clearInterval(timer);
        lBtn.style.display = 'block';
        rBtn.style.display = 'block';
    }
    banner.onmouseout = function () {
        timer = setInterval(auto, 3000);
        lBtn.style.display = 'none';
        rBtn.style.display = 'none';
    }

    lBtn.onclick = function () {
        count--;
        if (count < 0) {
            count = li.length - 1;
        }
        change();
    }
    rBtn.onclick = auto;

    for (var i = 0; i < span.length; i++) {
        span[i].index = i;
        span[i].onclick = function () {
            count = this.index;
            change();
        }
    }

    function auto() {
        count++;
        if (count >= li.length) {
            count = 0;
        }
        change();
    }

    function change() {
        move(ul, {
            left: -clientW * count
        });
        for (var i = 0; i < span.length; i++) {
            span[i].className = '';
        }
        span[count].className = 'active';
    }
}

// 轮播图数据
async function bannerData() {
    let [err, data] = await sendAjax({
        url: 'http://106.13.114.114:5000/api/bannerList'
    });
    let arr = data.list;
    let banner = ``;
    for (var val of arr) {
        banner += `<li><img src="${val.coverimg}" alt=""></li>`;
    }
    $('.run_banner').html(banner);
    banners();
}
bannerData();

// 一级分类
async function firstCategory() {
    let [err, data] = await sendAjax({
        url: 'http://106.13.114.114:5000/api/firstCategory'
    });
    let arr = data.list;
    for (var val1 of arr) {
        let first = ``;
        for (var val2 of val1) {
            first += `<a href='javascript:;'>${val2.firstName}</a>
                    <span></span>`;
        }
        $('.firstCategory').append($('<li></li>').html(first));
    }
}
firstCategory();

// 人气好货
async function EvalGoodList() {
    let [err, data] = await sendAjax({
        url: 'http://106.13.114.114:5000/api/getEvalGoodList'
    });
    let arr = data.list;
    console.log(arr);
    for (var val of arr) {
        let first = ``;
        first += `<a href="javascript:;"><img src="${val.imageUrl}"></a>
        <p><a href="javascript:;">${val.goodsName}</a></p>`;
        $('.popular_goods .content ul').append($('<li></li>').html(first));
    }
}
EvalGoodList();