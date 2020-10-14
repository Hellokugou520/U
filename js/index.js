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

// 选项卡
function tab(liValue, divValue) {
    var li = document.querySelectorAll(liValue);
    var div = document.querySelectorAll(divValue);

    for (var i = 0; i < li.length; i++) {
        li[i].index = i;

        li[i].onmouseover = function () {
            for (var i = 0; i < li.length; i++) {
                li[i].className = '';
                div[i].style.display = 'none';
            }

            this.className = 'active';
            div[this.index].style.display = 'block';
        }
    }
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
        url: 'http://localhost:3000/banners'
    });
    let arr = data.data;
    let banner = ``;
    for (var val of arr) {
        banner += `<li><img src="${val.img}" alt=""></li>`;
    }
    $('.run_banner').html(banner);
    banners();
}
bannerData();

// 一级分类数据
async function firstCategory() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/firstCategory'
    });
    let arr = data.data;
    let first = ``;
    arr.forEach((val, index) => {
        first += `<a href='javascript:;'>${val.first_name}</a>
                    <span></span>`;
        if ((index + 1) % 3 == 0) {
            $('.firstCategory').append($('<li></li>').html(first));
            first = ``;
        }
    })
    first=`<a href='javascript:;'>${arr[18].first_name}</a>
    <span></span><a href='javascript:;'>${arr[19].first_name}</a>
    <span></span>`
    $('.firstCategory').append($('<li></li>').html(first));
}
firstCategory();

// 排行榜数据
async function rankingList() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/rankingList'
    });
    let arr = data.data;

    // 排行榜商品类别
    arr.forEach((item, index) => {
        let first = ``;
        if (index == 0) {
            first += `<a class='active' href='javascript:;'>${item.thired_name}</a>`;
        }
        else {
            first += `<a href='javascript:;'>${item.thired_name}</a>`;
        }
        $('.ranking_list .item ul').append($('<li></li>').html(first));
    });

    // 当前类别下的商品详情
    arr.forEach((item, index) => {
        let first = ``;
        item.goods_list.forEach((item, index) => {
            first += `<li class="clearfix">
            <a href="html/product_details.html?gid=${item.goods_id}"><img src="${item.img}" alt=""></a>
            <p><a href="">${item.goods_name}</a></p>
            <div class="price f-l">¥${item.goods_price}</div>
            <div class="price f-r">销量NO1</div>
        </li>`;
        })
        $('.ranking_list .content').append($('<ul></ul>').html(first));
    });

    tab('.ranking_list .item ul li a', '.ranking_list .content ul');
}
rankingList();

// 人气好货数据
async function EvalGoodList() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/evalGoodList'
    });
    let arr = data.data;
    for (var val of arr) {
        let first = ``;
        first += `<a href="html/product_details.html?gid=${val.goods_id}"><img src="${val.img}"></a>
        <p><a href="javascript:;">${val.goods_name}</a></p>`;
        $('.popular_goods .content ul').append($('<li></li>').html(first));
    }
}
EvalGoodList();

// 四大金刚数据
async function categoods() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/categoods'
    });
    let arr = data.data;
    let first = ``;
    for (var val of arr) {
        first += `<div class="clothing_accessories f-l">
        <div class="ca_title clearfix">
            <div class="purple_div f-l"></div>
            <div class="left f-l">${val.big_title}</div>
            <div class="QR_code f-l"></div>
            <div class="right f-r">
                <ul class="clearfix">
                </ul>
            </div>
        </div>
        <div class="content" style='background: url(${'http://106.13.114.114:5000/' + val.image_url}) no-repeat;background-size: 190px 360px'>
            <div class="f-r">
                <ul class="clearfix">
                </ul>
            </div>
        </div>
    </div>`;
    }
    $('.content3 .w').html(first);

    // 三级标题&四个商品
    arr.forEach((item, index) => {
        let first = ``;
        let second = ``;
        let temp1 = item.third_cate;
        let temp2 = item.goods_list;

        // 三级标题
        for (var val of temp1) {
            first += `<li><a href="">${val.thired_name}</a></li>`;
        }
        $(`.content3 .w div.clothing_accessories:nth-child(${index + 1}) .ca_title .right ul`).html(first);

        // 四个商品
        temp2.forEach((item, index) => {
            second += `<li class="li${index + 1}">
            <a href="html/product_details.html?gid=${item.goods_id}">
                <p class="p1">${item.goods_name}</p>
                <img src="${item.img}">
            </a>
        </li>`;
        });
        $(`.content3 .w div.clothing_accessories:nth-child(${index + 1}) .content div ul`).html(second);
    });

}
categoods();

// 猜你喜欢
async function guessgoods() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/guessgoods'
    });
    let arr = data.data;
    let first = ``;
    for (var val of arr) {
        first += `<li>
        <a href="html/product_details.html?gid=${val.goods_id}">
            <img src="${val.img}" alt="">
            <p class="name">${val.goods_name}</p>
            <p class="price">¥${val.goods_price}<span>找相似</span></p>
            <p class="discount">领券50-10</p>
        </a>
    </li>`;
    }
    $('.gyli .content').html(first);
}
guessgoods();