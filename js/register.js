// 注册页JS


var email = document.getElementById('usr');
var pwd = document.getElementById('pwd');
var regcode = document.getElementById('regcode');

// 正则验证
var testCode = {
    email: /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/,
    pass: /^\w{6,20}$/,
    code: /^([a-zA-Z\d]){4}$/
}

// 邮箱正则验证
email.onblur = function () {
    var val = this.value;
    var tip = document.getElementById('tip1');

    if (testCode.email.test(val)) {
        tip.style.opacity = '0';
    }
    else {
        tip.style.opacity = '1';
    }
}
// 密码正则验证
pwd.onblur = function () {
    var val = this.value;
    var tip = document.getElementById('tip2');

    if (testCode.pass.test(val)) {
        tip.style.opacity = '0';
    }
    else {
        tip.style.opacity = '1';
    }
}
// 验证码正则验证
regcode.onblur = function () {
    var val = this.value;
    var tip = document.getElementById('tip3');

    if (testCode.code.test(val)) {
        tip.style.opacity = '0';
    }
    else {
        tip.style.opacity = '1';
    }
}

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

//注册新用户
async function reister() {

    //获取用户输入的帐号
    let user = $("#usr").val();
    //获取用户输入的密码
    let pwd = $("#pwd").val();
    //获取用户输入的验证码
    let codes = $("#regcode").val();

    //验证用户输入的帐号、密码格式
    // let ureg = /^$/;   //验证帐号格式的正则

    pwd = $.md5(pwd); //将密码加密
    let [e, d] = await sendAjax({
        url: 'http://localhost:3000/reguser',
        type: 'post',
        data: {
            user,
            pwd,
            codes,
            codeval
        }
    });

    if (d.code == 200) { //注册成功
        location.href = "login.html";
    } else { //注册失败
        alert(d.msg);
    }
}