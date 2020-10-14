// 商品详情页JS


//商品详细数据
async function goodsDetails() {
    //获取url地址中的参数
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
    let goodsId = GetRequest().gid;

    let [err, data] = await sendAjax({
        url: `http://localhost:3000/goodsinfo`,
        data: {
            gid: goodsId
        }
    });
    let arr = data.data;
    let first = `<div class="photo f-l">
    <img src="${arr.goods_img[0].img}" style="width:430px;height:430px">
    <ul class="clearfix iconfont">
        <li class="item1"><a href="javascript:;">&#xe606;</a></li>
        <li class="item2"><a href="javascript:;"><img src="${arr.goods_img[0].img}" alt=""></a></li>
        <li class="item2"><a href="javascript:;"><img src="${arr.goods_img[1].img}" alt=""></a></li>
        <li class="item2"><a href="javascript:;"><img src="${arr.goods_img[2].img}" alt=""></a></li>
        <li class="item2"><a href="javascript:;"><img src="${arr.goods_img[3].img}" alt=""></a></li>
        <li class="item2"><a href="javascript:;"><img src="${arr.goods_img[4].img}" alt=""></a></li>
        <li class="item1"><a href="javascript:;">&#xe603;</a></li>
    </ul>
</div>
<div class="content f-r">
    <p class="p1">${arr.goods_info[0].goods_name}</p>
    <p class="p2">【门店同款】立即抢购！9号不高于3199！前200名晒单送1399元JBL重低音！下单送苹果华为通用蓝牙耳机！</p>
    <p class="p3">旗舰声控电视，可家电互联。咨询客服有惊喜！全国联保 官方正品。 <a href="">点击查看活动详情！</a></p>
    <div class="price clearfix">
        <div class="f-l">
            <p class="p4">促销价<span>¥${arr.goods_info[0].goods_price}</span></p>
            <p class="p5">累计评价<a href="">${arr.goods_eval.length}+</a></p>
            <p class="p6">运费<span>满19包邮</span></p>
        </div>
        <div class="f-r">
            收藏
        </div>
    </div>
    <div class="model">${arr.goods_style[0].style_name}<a href="javascript:;" class="lr1">${arr.goods_style[0].style_value}</a></div>
    <ul class="number clearfix">
        <li class="n1">购买数量</li>
        <li class="n2"><a href="">－</a></li>
        <li class="n3"><a href="">1</a></li>
        <li class="n2"><a href="">＋</a></li>
    </ul>
    <div class="buy clearfix">
        <div class="button1"><a href="">加入购物车</a></div>
        <div class="button2"><a href="">立即购买</a></div>
    </div>
</div>`;
    $('.product_content .w').html(first);
}
goodsDetails();