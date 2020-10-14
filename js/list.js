// 列表页JS


// 一级分类数据
async function firstCategory() {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/firstCategory'
    });
    let arr = data.data;
    let first = ``;
    arr.forEach((val, index) => {
        let clastr = '';
        if (index == 0) {
            clastr = "class='firstcate'";
        }
        first += `<li><a firstid="${val.first_id}" ${clastr} onclick="clickfirstcate(this)" href="javascript:;">${val.first_name}</a></li>`;
    });
    $('.sort_content .content1').html(first);

    secondcate(data.data[0].first_id);
}
firstCategory();

//单击某个一级分类：
function clickfirstcate(obj) {
    $(obj).addClass('firstcate').parent().siblings().children().removeClass();

    //获取当前被单击的一级类别id
    let cateid = $(".firstcate").attr('firstid');
    secondcate(cateid);
}

//二级分类数据
async function secondcate(curid) {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/secondcate',
        data: {
            'ids': curid
        }
    });

    let arr = data.data;
    let first = '';
    arr.forEach((item, index) => {
        let clastr = '';
        if (index == 0) {
            clastr = "class='secondcate'";
        }
        first += `<li><a ${clastr} secondid="${item.second_id}" onclick="clicksecondcate(this)" href="javascript:;">${item.second_name}</a></li>`;

    })

    $('.sort_content .content2').html(first);

    thirdcate(data.data[0].second_id);
}

//单击某个二级分类：
function clicksecondcate(obj) {
    $(obj).addClass('secondcate').parent().siblings().children().removeClass();

    //获取当前被单击的二级类别id
    let cateid = $(obj).attr('secondid');
    thirdcate(cateid);
}

//三级分类数据
async function thirdcate(sid) {
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/thirdcate',
        data: {
            ids: sid
        }
    });

    let arr = data.data;
    let first = '';
    arr.forEach((item, ind) => {
        let str = '';
        if (ind == 0) {
            str = "class='thirdcate'";
        }
        first += `<li><a onclick="clickthiredcate(this)" thirdid="${item.thired_id}" ${str} href="javascript:;">${item.thired_name}</a></li>`;
    })

    $('.sort_content .content3').html(first);
    goodslist();
}

//单击某个三级类别： 
function clickthiredcate(e) {
    $(e).addClass('thirdcate').parent().siblings().children().removeClass();
    goodslist();
}

//每页要显示的条数
let limits = 12;
//游标位置
let starts = 0;
//第几页
let curp = 1;

//显示每页信息
async function showPage(num = 1) {
    //获取当前被选中的三级类别id
    let thiredid = $(".thirdcate").attr('thirdid');

    //计算某个三级类别下的总商品个数
    let [err, data] = await sendAjax({
        url: 'http://localhost:3000/totalpage',
        data: {
            thiredid
        }
    });
    let totals = data.data[0].total;
    let totalPage = Math.ceil(totals / limits);

    let pstr = '';
    for (let i = 1; i <= totalPage; i++) {
        let str = '';
        if (i == 1) {
            str = 'class="active"'
        }
        pstr += `<li onclick="clickpage(${i})" ${str}><a href="javascript:;">${i}</a></li>`;
    }
    $('.turn_page ul').html(`<li onclick='prepage()'><a href='javascript:;'>上一页</a></li>${pstr}<li onclick='nextpage(${totalPage})'><a href='javascript:;'>下一页</a></li>`);
    $('.c_many .cm_title p').html(`共${totals}件商品&#xe606;<span>1</span>/${totalPage}&#xe603;`);
    $('.c_many .cm_title p span').html(num);

    test(num);
}

function test(num) {
    let active = document.querySelector(`.turn_page ul li:nth-child(${num + 1})`);
    $(active).parent().children().removeClass();
    $(active).addClass('active');
}

//上一页：
function prepage() {
    if (curp > 1) {
        //计算上一页的页数
        curp--;
        clickpage(curp);
    }
}

// 下一页
function nextpage(totalPage) {
    if (curp < totalPage) {
        curp++;
        clickpage(curp);
    }
}

//用户单击分页信息：
function clickpage(num) {
    //重新计算游标位置
    starts = (num - 1) * limits;
    goodslist(num); //查询商品数据
    curp = num; //重新设置当前页数
}

//根据某个三级类别id查询其下面的商品信息并渲染：
async function goodslist(num) {
    //获取当前被选中的三级类别id
    let thiredid = $(".thirdcate").attr('thirdid');

    let [err, data] = await sendAjax({
        url: "http://localhost:3000/categoods",
        type: 'post',
        data: {
            curid: thiredid,
            limits,
            starts
        }
    });

    let arr = data.data;
    let first = '';
    arr.forEach(item => {
        first += `<li>
        <a href="product_details.html?gid=${item.goods_id}"><img src="${item.img}" alt=""></a>
        <p class="price">¥ ${item.goods_price}</p>
        <p style="margin-bottom: 5px;"><a href="product_details.html?gid=${item.goods_id}">${item.goods_name}</a></p>
        <p class="color">不要错过，不要辜负</p>
        <p><i>已有</i><span class="color">${item.num}万+</span><i>人评价</i></p>
        <span class="iconfont car">&#xf0179;&nbsp;加入购物车</span><span class="collection">收藏</span>
    </li>`;
    })
    $('.cm_content ul').html(first);

    showPage(num);
}