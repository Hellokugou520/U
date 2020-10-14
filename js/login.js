// 登录页JS


// 生成验证码
let codeval = '';
//创建验证码 
async function genecode() {
    let [e, d] = await sendAjax({
        url: 'http://localhost:3000/createcode'
    });
    //将获取到的验证码放入指定位置
    $("#codes").html(d.data.img);
    codeval = d.data.txt;

}
genecode();
//换一张验证码
$("#codes").click(function () {
    genecode();
})


//用户登录
async function userlogin() {
    //获取用户输入的帐号
    let user = $("#user").val();
    //获取用户输入的密码
    let pwd = $("#pwd").val();
    pwd = $.md5(pwd);
    //获取用户输入的验证码
    let codes = $("#regcode").val();

    let [e, d] = await sendAjax({
        url: 'http://localhost:3000/loginact',
        type: 'post',
        data: {
            user,
            pwd,
            codes,
            codeval
        }
    });

    if (d.code == 200) { //登录成功
        alert(d.msg);
        localStorage['token'] = d.data.tokens;
        localStorage['uname'] = d.data.user;
        location.href = '../index.html';

    } else { //登录失败
        alert(d.msg);
    }
}