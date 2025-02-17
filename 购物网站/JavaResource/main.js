'use strict';

var good_id = 0;  // 当前商品ID
var getGoods_index = 0;
// 判断localStorage是否存在goods_data，如果不存在则初始化goods_data
if (!localStorage.getItem("goods_data")) {
    localStorage.setItem("goods_data", JSON.stringify({}));
}

var goods_data = localStorage.getItem("goods_data");  // 商品数据字典
var goods_item = {
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
    let goods_data = { 
        "../Resource/JSONData/guitar/fender.json" : [],
        "../Resource/JSONData/guitar/martin.json" : [],
        "../Resource/JSONData/guitar/taylor.json" : [],
        "../Resource/JSONData/guitar/yamaha.json" : [],
        "../Resource/JSONData/food/xican.json" : [],
        "../Resource/JSONData/racket/Yonex/gongjianxilie.json" : [],
        "../Resource/JSONData/racket/Yonex/jiguangxilie.json" : [],
        "../Resource/JSONData/racket/Yonex/tianfuxilie.json" : []
    };  // 商品数据字典
    good_id = 0;  // 重置商品ID
    let init_flag = false;
    const keys = Object.keys(goods_item);
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

    keys.map(key => {
        let data = fetchData(key) // data: array            
        // 分配商品ID
        for (let j = 0; j < data.data.length; j++) {
            data.data[j]["id"] = good_id;
            good_id++;
        }
        goods_data[key] = data;
    });
    localStorage.setItem("goods_data", JSON.stringify(goods_data));
    // const fetchPromises = keys.map(key => {
    //     // 异步获取数据
    //     return fetchData(key).then(data => {  // data: array
    //         // 分配商品ID
    //         for (let j = 0; j < data.length; j++) {
    //             data[j]["id"] = good_id;
    //             good_id++;
    //         }
    //         goods_data[key] = data;
    //     });
    // });

    // 等待所有数据获取完成
    // Promise.all(fetchPromises).then(() => {
    //     localStorage.setItem("goods_data", JSON.stringify(goods_data));  // 缓存商品数据到sessionStorage中
        
    // });
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
async function fetchDataAsync(path) {
    try {
        const response = await fetch(path);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function fetchData(path) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send();
    if (xhr.status === 200) {
        console.log(xhr.responseText);
        return JSON.parse(xhr.responseText);
    } else {
        console.error('Failed to fetch data:', xhr.statusText);
        return null;
    }
}


// 根据商品ID列表获取商品信息列表
// id_list: 商品ID列表
// 返回对应商品的详细信息的列表，如果没有则返回空列表
function parseGoodIdList(id_list) {
    let result = [];
    for (let key of goods_item) {
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
        if (section.innerHTML == `<a onclick="API_logout()" id="msg">退出登录</a>`) {
            section.innerHTML = `
                <a href="user.html" id="msg">登录</a>
                <span style="cursor: default;">|</span>
                <a href="user.html" id="msg">注册</a>`;
        }
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
});

function init() {
    console.log('main.json init');
    initGoodsData();
}
init();


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
            API_dialog('用户名已被注册');  // 可以采用直接显示在用户名输入框的错误提示信息
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
            API_dialog('登录成功');
            localStorage.setItem("CurrentUser", JSON.stringify(UserList[i]));  // 存储当前登录用户信息到本地存储中
            return true;
        }
    }
    /* 登录失败 */  
    API_dialog('用户名或密码错误');  // 可以采用直接显示在用户名输入框的错误提示信息
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
function API_jumpToPage(page="../WebContent/index.html", data=null, data_name="") {
    if (data != null && data_name != "") {
        sessionStorage.setItem(data_name, JSON.stringify(data));  // 缓存数据到sessionStorage中
    }
    window.location.href = page;
}

// 获取sessionStorage中的数据接口
// 返回sessionStorage中的数据，如果没有则返回null
function API_parseStoredData(data_name="") {
    const data = sessionStorage.getItem(data_name);
    if (data) {
        return JSON.parse(data);
    }
}

// 搜索接口
// 当用户输入搜索内容时，调用该接口, text为搜索内容 text: string
// 跳转到搜索结果的页面
function API_search(text) {
    if (text == '') {
        return;
    }  // TODO: 优化搜索功能，实现模糊搜索
    for (let key of goods_item) {
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
        API_dialog('请先登录');
        return false;
    }
    // 向购物车中添加商品
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    const cart = user.cart;
    cart.push(id);
    return true;
}

// 从购物车中移除商品接口
// 当用户点击购物车中的商品时，调用该接口, id为商品ID id: number
function API_removeFromCart(id) {
    if (!API_checkLogin()) {
        API_dialog('请先登录');
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
    for (let key of goods_item) {
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
        API_dialog('请先登录');
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
        API_dialog('请先登录');
        return;
    }
    // 清空购物车
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    user.cart = [];
    localStorage.setItem("CurrentUser", JSON.stringify(user));
}

function API_getGoods(num, category_paths=[], total=0) {
    let goods_data = JSON.parse(localStorage.getItem("goods_data"));
    if (category_paths.length == 0 || category_paths == "null") {
        category_paths = ["../Resource/JSONData/guitar/fender.json",
                        "../Resource/JSONData/food/xican.json",
                        "../Resource/JSONData/racket/Yonex/gongjianxilie.json",
                        "../Resource/JSONData/food/xican.json"
        ];
        num = 1;
    }
    if (total != 0 && category_paths.length == 1) {  // 在只有一个分类的情况下，如果传入了total，则直接返回total个商品
        num = total;
    }
    // 根据分类路径获取商品列表
    let result = [];
    for (let category_path of category_paths) {
        if (goods_data[category_path].data.length < num) {  // 如果商品数量不足num，则返回全部商品
            result.push(goods_data[category_path].data);
            continue;
        }
        for (let i = getGoods_index; i < num + getGoods_index; i++) {  // 随机获取num个商品
            //let index = Math.floor(Math.random() * goods_data[category_path].data.length);
            if (goods_data[category_path].data[i] != undefined) {
                result.push(goods_data[category_path].data[i]);
            } else {
                break;
            }
        }
    }
    getGoods_index += num;

    return result;
}

// 订阅接口
// 当用户点击订阅时，调用该接口
function API_subscribe() {
    const input = document.querySelector('.bottom-container .input-container input');
    // 选中内容
    input.select();
    API_dialog('订阅成功! 我们会第一时间推送最新消息。', 4500);
}

function API_dialog(text, duration=1500) {
    // 往页面中添加对话框
    const dialog = document.createElement('div');
    dialog.innerHTML = `<div class="dialog">${text}</div>`;
    document.body.appendChild(dialog);
    dialog.style.display = 'block';
    setTimeout(function() {
        dialog.style.animation = 'fade-out 0.3s forwards';
        setTimeout(function() {
            document.body.removeChild(dialog);
        }, 300);
    }, duration);
}

function API_showGoods(display_goods, GoodContainer) {
    for (let i = 0; i < display_goods.length; i++) {
        // 0-3余数循环
        let row = i % 4;
        let good = display_goods[i];
        GoodContainer.children[row].innerHTML += `
        <div class="item" data-GoodId="${good.id}" onclick="console.log('${good.id}')">
            <div class="images">
                <img src="${good.image_url}" alt="">
            </div>
            <div class="content">
                <p>${good.name}</p>
                <span>${good.price}</span>
            </div>
            <div class="add-btn" onclick="API_addToCart('${good.id}')">+</div>
        </div>`;
    }
}

function API_resetGetGoodsIndex() {
    getGoods_index = 0;
}