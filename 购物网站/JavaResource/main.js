'use strict';

var good_id = 0;  // 当前商品ID
var goods_data = {
    "../Resource/JSONData/guitar/fender.json" : [],
    "../Resource/JSONData/guitar/martin.json" : [],
    "../Resource/JSONData/guitar/taylor.json" : [],
    "../Resource/JSONData/guitar/yamaha.json" : [],
    "../Resource/JSONData/food/xican.json" : [],
    "../Resource/JSONData/racket/Yonex/gongjianxilie.json" : [],
    "../Resource/JSONData/racket/Yonex/jiguangxilie.json" : [],
    "../Resource/JSONData/racket/Yonex/tianfuxilie.json" : []
};  // 商品数据字典

const search_tree = [
    {"guitar": ["../Resource/JSONData/guitar/fender.json",
                "../Resource/JSONData/guitar/martin.json",
                "../Resource/JSONData/guitar/taylor.json",
                "../Resource/JSONData/guitar/yamaha.json"]
    },
    {"food":["../Resource/JSONData/food/xican.json"]},
    {"racket":
        {
            "Yonex":[
                "../Resource/JSONData/racket/Yonex/gongjianxilie.json",
                "../Resource/JSONData/racket/Yonex/jiguangxilie.json",
                "../Resource/JSONData/racket/Yonex/tianfuxilie.json"
            ],    
            "Li-Ning": [],
            "Victor": []
        }
    }
];

// localStorage { user: { username: "admin", password: "123456" }, cart: [] }
// localStorage { UserList: [ user, user, user,...] }
// localStorage { CurrentUser: user }

// 初始化商品数据保存在goods_data字典中
function initGoodsData() {
    good_id = 0;  // 重置商品ID
    let init_flag = false;
    const keys = Object.keys(goods_data);
    for (let i = 0; i < keys.length; i++) {
        if (goods_data[keys[i]].length == 0) {
            init_flag = true;
            break;
        }
    }
    // 如果所有商品已经初始化过，则直接返回
    if (!init_flag) {
        return;
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // 异步获取数据
        fetchData(key).then(data => {  // data: array
            // 分配商品ID
            for (let j = 0; j < data.length; j++) {
                data[j]["id"] = good_id;
                good_id++;
            }
            goods_data[key] = data;
        });
    }
}

function output() {
    console.log(goods_data);
}
// let UserList = [{
//     "username": "admin",
//     "password": "123456",
//     "cart": [{

//     }]
// }];


// 从服务器获取数据, path为请求的路径
// 返回对应的数据，如果出错则返回null
async function fetchData(path) {
    try {
        const response = await fetch(path);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}


// 注册接口
// 当用户点击注册按钮时，调用该接口
// 注册失败显示错误信息，注册成功跳转到登录页面
function API_register() {
    const usernameInput = document.getElementsByName('username')[0];
    const passwordInput = document.getElementsByName('password')[0];
    // 预留方案，如果有email或者二次密码
    // const email = document.getElementsByName('email')[0];
    // const password_2 = document.getElementsByName('password2')[0];

    // 验证用户输入的用户名是否已被注册

    const username = usernameInput.value;
    const password = passwordInput.value;

    // 验证用户名是否已被注册
    let UserList = localStorage.getItem('UserList');  // 获取本地存储的用户列表
    for (let i = 0; i < UserList.length; i++) {
        if (UserList[i].username == username) {  // 注册失败
            alert('用户名已被注册');  // 可以采用直接显示在用户名输入框的错误提示信息
            return;
        }
    }
    /* 注册成功 */
    // 存储用户信息到本地存储中
    const user = {
        username: username,
        password: password
    };
    UserList.push(user);
    localStorage.setItem('UserList', JSON.stringify(UserList));
    localStorage.setItem("CurrentUser", JSON.stringify(user));  // 存储当前登录用户信息到本地存储中

    // 跳转到登录页面
    window.location.href = '../WebContent/user.html';
}

// 登录接口
// 当用户点击登录按钮时，调用该接口
// 登录失败时显示错误信息，返回null
function API_login() {
    const usernameInput = document.getElementsByName('username')[0];
    const passwordInput = document.getElementsByName('password')[0];

    const username = usernameInput.value;
    const password = passwordInput.value;
    // 验证用户名和密码是否匹配
    let UserList = localStorage.getItem('UserList');  // 获取本地存储的用户列表
    for (let i = 0; i < UserList.length; i++) {
        if (UserList[i].username == username && UserList[i].password == password) {  // 登录成功
            alert('登录成功');
            localStorage.setItem("CurrentUser", JSON.stringify(UserList[i]));  // 存储当前登录用户信息到本地存储中
            return true;
        }
    }
    /* 登录失败 */  
    alert('用户名或密码错误');  // 可以采用直接显示在用户名输入框的错误提示信息
    return false;
}

// 退出登录接口
// 当用户点击注销按钮时，调用该接口
function API_logout() {
    localStorage.removeItem("CurrentUser");  // 清除本地存储的当前登录用户信息
    const timerForCheckLogin = setInterval(function() {
        checkLoginState(timerForCheckLogin);  // 重新检查登录状态
    }, 1000);
}

// 跳转到指定页面接口
// page: 要跳转的页面路径，如果传入空字符串则跳转到首页(../WebContent/index.html)
// page: string  (格式："../WebContent/你要跳转的页面.html")
function API_jumpToPage(page="../WebContent/index.html") {
    // 采用伪无刷跳转
    window.location.href = page;
}

// 搜索接口
// 当用户输入搜索内容时，调用该接口, text为搜索内容 text: string
// 跳转到搜索结果的页面
function API_search(text) {
    if (text == '') {
        return;
    }  // TODO: 优化搜索功能，实现模糊搜索
    for (let key in goods_data) {
        for (let i = 0; i < goods_data[key].length; i++) {
            if (goods_data[key][i].name.includes(text)) {
                API_jumpToPage(`../WebContent/search_result.html?id=${goods_data[key][i].id}`);
                return;
            }
        }
    }
}

// 检查登录状态接口
// 返回true表示已登录，false表示未登录
function API_checkLogin() {
    const user = localStorage.getItem("CurrentUser");
    if (user) {
        return true;
    } else {
        return false;
    }
}

// 加入购物车接口
// 当用户点击商品时，调用该接口, id为商品ID id: number
function API_addToCart(id) {
    if (!API_checkLogin()) {
        alert('请先登录');
        return;
    }
    // 向购物车中添加商品
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    const cart = user.cart;
    cart.push(id);
}

// 从购物车中移除商品接口
// 当用户点击购物车中的商品时，调用该接口, id为商品ID id: number
function API_removeFromCart(id) {
    if (!API_checkLogin()) {
        alert('请先登录');
        return;
    }
    // 从购物车中移除商品
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    const cart = user.cart;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i] == id) {
            cart.splice(i, 1);
            break;
        }
    }
}

// 根据商品ID获取商品信息
// id: 商品ID
// 返回对应商品的详细信息的字典，如果没有则返回null
function API_parseGoodId(id) {
    for (let key in goods_data) {
        for (let i = 0; i < goods_data[key].length; i++) {
            if (goods_data[key][i].id == id) {
                return goods_data[key][i];
            }
        }
    }
    return null;
}

// 获取购物车中的商品信息列表
// 返回对应商品的详细信息的 字典列表，如果没有则返回null
function API_getGoodsFromCart() {
    if (!API_checkLogin()) {
        alert('请先登录');
        return;
    }
    // 获取购物车中的商品ID列表
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    const cart = user.cart;  // 购物车中的商品ID列表
    const goods_list = parseGoodIdList(cart);
    if (goods_list.length == 0) {
        return null;
    }
    return goods_list;
}

// 清空购物车接口
// 当用户点击清空购物车时，调用该接口
function API_clearCart() {
    if (!API_checkLogin()) {
        alert('请先登录');
        return;
    }
    // 清空购物车
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    user.cart = [];
    localStorage.setItem("CurrentUser", JSON.stringify(user));
}

// 根据商品ID列表获取商品信息列表
// id_list: 商品ID列表
// 返回对应商品的详细信息的列表，如果没有则返回空列表
function parseGoodIdList(id_list) {
    let result = [];
    for (let key in goods_data) {
        for (let i = 0; i < goods_data[key].length; i++) {
            if (id_list.includes(goods_data[key][i].id)) {
                result.push(goods_data[key][i]);
            }
        }
    }
    return result;
}

// 检查登录状态
function checkLoginState(timer=null) {
    //console.log('checkLoginState');
    let user = localStorage.getItem("CurrentUser");
    if (user) {
        const UserMsg = document.querySelector('.login_mes-container #username');
        const section = document.querySelector('.login_mes-container section');
        UserMsg.textContent = user;
        section.innerHTML = `<a onclick="API_logout()" id="msg">退出登录</a>`;
        if (timer) {
            clearInterval(timer);
        }
    } else {
        const section = document.querySelector('.login_mes-container section');
        section.innerHTML = `
            <a href="user.html" id="msg">登录</a>
            <span style="cursor: default;">|</span>
            <a href="user.html" id="msg">注册</a>`;
    }
}

// 监听页面加载事件，添加定时器检查登录状态
function addCheckLoginTimer() {
    const timerForCheckLogin = setInterval(() => checkLoginState(timerForCheckLogin), 1000);
}

window.addEventListener('load', function() {
    var current_page = this.location.href.split('/').pop();  // 获取当前页面名称
    //console.log(current_page);
    /* 检查登录状态 */
    if (current_page != "user.html") {  // 除了登录页面外都要检查登录状态
        console.log('check login state');
        addCheckLoginTimer();
    }
    if (current_page == "index.html") {  // 只在首页初始化一次商品数据
        initGoodsData();
    }
    //output();
});