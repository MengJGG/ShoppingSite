'use strict';

var good_id = 0;  // 当前商品ID
var getGoods_index = 0;
// 判断localStorage是否存在goods_data，如果不存在则初始化goods_data
if (!localStorage.getItem("goods_data")) {
    localStorage.setItem("goods_data", JSON.stringify({}));
}

var goods_data = localStorage.getItem("goods_data");  // 商品数据字典
var goods_item = [
    "../Resource/JSONData/guitar/fender.json",
    "../Resource/JSONData/guitar/martin.json",
    "../Resource/JSONData/guitar/taylor.json",
    "../Resource/JSONData/guitar/yamaha.json",
    "../Resource/JSONData/food/xican.json",
    "../Resource/JSONData/racket/Yonex/gongjianxilie.json",
    "../Resource/JSONData/racket/Yonex/jiguangxilie.json",
    "../Resource/JSONData/racket/Yonex/tianfuxilie.json"
];  // 商品数据字典


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
    const keys = goods_item;
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
    goods_data = JSON.parse(localStorage.getItem("goods_data"));
    for (let key of goods_item) { // 使用 Object.keys() 获取键
        for (let i = 0; i < goods_data[key].data.length; i++) {
            let id = "" + goods_data[key].data[i].id;
            if (id_list.includes(id)) {
                result.push(goods_data[key].data[i]);
            }
        }
    }
    return result;
}


// 检查登录状态
function checkLoginState(timer=null) {
    //console.log('checkLoginState');
    const UserMsg = document.querySelector('.login_mes-container #username');
    const section = document.querySelector('.login_mes-container section');
    let user = localStorage.getItem("CurrentUser");
    if (user) {
        UserMsg.textContent = JSON.parse(user).username;
        section.innerHTML = `<a href="#" onclick="API_logout()" id="msg">退出登录</a>`;
        sessionStorage.setItem("ui", "login");
        if (timer) {
            clearInterval(timer);
        }
    } else {
        if (sessionStorage.getItem("ui") == "login") {
            section.innerHTML = `
                <a href="user.html" id="msg">登录</a>
                <span style="cursor: default;">|</span>
                <a href="user.html" id="msg">注册</a>`;
            UserMsg.textContent = "未登录";
            sessionStorage.setItem("ui", "logout");
        }
    }
}

// 监听页面加载事件，添加定时器检查登录状态
function addCheckLoginTimer() {
    const timerForCheckLogin = setInterval(() => checkLoginState(timerForCheckLogin), 500);
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
    try {
        initGoodsData();
    } catch (error) {
        console.error(error);
    }
}
init();


// 注册接口
// 当用户点击注册按钮时，调用该接口
// 注册失败显示错误信息，注册成功跳转到登录页面
function API_register(username=null, password=null) {
    if (username == null || password == null) {
        const usernameInput = document.getElementsByName('username')[0];
        const passwordInput = document.getElementsByName('password')[0];
        // 预留方案，如果有email或者二次密码
        // const email = document.getElementsByName('email')[0];
        // const password_2 = document.getElementsByName('password2')[0];

        // 验证用户输入的用户名是否已被注册

        username = usernameInput.value;
        password = passwordInput.value;
    }
    // 验证用户名是否已被注册
    let UserList = localStorage.getItem('UserList');  // 获取本地存储的用户列表
    if (UserList === null) {
        UserList = [];  // 如果UserList没有被存储过，初始化为一个空数组
    } else {
        UserList = JSON.parse(UserList);  // 将字符串解析为数组
    }

    for (let i = 0; i < UserList.length; i++) {
        if (UserList[i].username == username) {  // 注册失败
            API_dialog('用户名已被注册');  // 可以采用直接显示在用户名输入框的错误提示信息
            return false;
        }
    }
    /* 注册成功 */
    // 存储用户信息到本地存储中
    const user = {
        username: username,
        password: password
    };

    UserList.push(user);  // 直接添加对象到数组中
    localStorage.setItem('UserList', JSON.stringify(UserList));
    localStorage.setItem("CurrentUser", JSON.stringify(user));  // 存储当前登录用户信息到本地存储中
    return true;
    // 跳转到登录页面
    // window.location.href = '../WebContent/user.html';
}

// 登录接口
// 当用户点击登录按钮时，调用该接口
// 登录失败时显示错误信息，返回null
function API_login(username=null, password=null, showWelcome=true) {
    if (username == null || password == null) {
        const usernameInput = document.getElementsByName('username')[0];
        const passwordInput = document.getElementsByName('password')[0];

        username = usernameInput.value;
        password = passwordInput.value;
    }
    // 验证用户名和密码是否匹配
    let UserList = localStorage.getItem('UserList');  // 获取本地存储的用户列表
    if (UserList === null) {
        UserList = [];  // 如果UserList没有被存储过，初始化为一个空数组
    } else {
        UserList = JSON.parse(UserList);  // 将字符串解析为数组
    }
    if (UserList) {  // 判断UserList是否存在
        for (let i = 0; i < UserList.length; i++) {
            if (UserList[i].username == username && UserList[i].password == password) {  // 登录成功
                if (showWelcome) {
                    API_dialog('登录成功');
                }
                localStorage.setItem("CurrentUser", JSON.stringify(UserList[i]));  // 存储当前登录用户信息到本地存储中
                return true;
            }
        }
    } else {
        UserList = [];
        localStorage.setItem('UserList', JSON.stringify(UserList));
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
    }, 500);
}

// 跳转到指定页面接口
// page: 要跳转的页面路径，如果传入空字符串则跳转到首页(../WebContent/index.html)
// page: string  (格式："../WebContent/你要跳转的页面.html")
function API_jumpToPage(page="../WebContent/index.html", data=null, data_name="", flag=false) {
    if (data != null && data_name != "") {
        sessionStorage.setItem(data_name, JSON.stringify(data));  // 缓存数据到sessionStorage中
    }
    if (flag) {
        // 新增页面
        window.open(page, "_blank");
    } else {
        window.location.href = page;
    }
}

function API_jumpToPage(page="../WebContent/index.html", data_name="", data=null, flag=false) {
    if (data != null && data_name != "") {
        sessionStorage.setItem(data_name, JSON.stringify(data));  // 缓存数据到sessionStorage中
    }
    if (flag) {
        // 新增页面
        window.open(page, "_blank");
    } else {
        window.location.href = page;
    }
}

// 获取sessionStorage中的数据接口
// 返回sessionStorage中的数据，如果没有则返回null
function API_parseStoredData(data_name="display_good") {
    const data = sessionStorage.getItem(data_name);
    if (data) {
        return JSON.parse(data);
    }
}

// 搜索接口
// 当用户输入搜索内容时，调用该接口, text为搜索内容 text: string
// 跳转到搜索结果的页面
function API_search(keyword) {
    const results = []; // 存储搜索结果的数组
    let goods_data = JSON.parse(localStorage.getItem("goods_data"));
    // 遍历 goods_data 中的每个分类
    Object.keys(goods_data).forEach(category => {
        const categoryData = goods_data[category];
        
        // 确保 data 是一个数组
        if (Array.isArray(categoryData.data)) {
            // 在当前分类的数据中筛选出符合关键字的商品
            const matchedItems = categoryData.data.filter(item => 
                item.name.toLowerCase().includes(keyword.toLowerCase())
            );
            
            // 将匹配到的商品添加到结果列表中，并记录所属分类
            if (matchedItems.length > 0) {
                matchedItems.forEach(item => {
                    results.push(item);
                });
            }
        } else {
            console.warn(`分类 ${category} 的 data 不是一个数组`);
        }
    });
    
    return results;
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
    var cart = user.cart;
    if (!cart) {
        cart = [];
        user["cart"] = cart;
    }
    let good = API_parseGoodId(id);
    if (good != null) {
        cart.push(good);
    }
    API_updateUserInfo(null, "cart", cart);
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
    var cart = user.cart;
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
    if (id == null) return null;
    let goods_data = JSON.parse(localStorage.getItem("goods_data"));
    for (let key of goods_item) {
        for (let i = 0; i < goods_data[key].data.length; i++) {
            if (goods_data[key].data[i].id == id) {
                return goods_data[key].data[i];
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
    return user.cart;
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

function API_showGoods(display_goods, GoodContainer, sort = 0) {
    // 根据sort参数对display_goods进行排序
    let goodsCopy = [...display_goods]; // 创建一个拷贝避免修改原数组
    
    if (sort === 1) { 
        // 升序（按价格从低到高）
        goodsCopy.sort((a, b) => {
            // 提取价格字符串中的数字并转换为数字
            // 判断a.prices是不是字符串
            if (typeof b.price == "string") {
                b.price = parseFloat(b.price.replace("¥","").replace("￥","").replace("$","").replace(" ",""));
            }
            if (typeof a.price == "string") {
                a.price = parseFloat(a.price.replace("¥","").replace("￥","").replace("$","").replace(" ",""));
            }
            return a.price - b.price; // 按price属性升序排列
        });
    } else if (sort === 2) {
        // 降序（按价格从高到低）
        goodsCopy.sort((a, b) => {
            if (typeof b.price == "string") {
                b.price = parseFloat(b.price.replace("¥","").replace("￥","").replace("$","").replace(" ",""));
            }
            if (typeof a.price == "string") {
                a.price = parseFloat(a.price.replace("¥","").replace("￥","").replace("$","").replace(" ",""));
            }
            return b.price - a.price; // 按price属性降序排列
        });
    }

    // 如果sort参数不为1或2，则保持原顺序

    for (let i = 0; i < goodsCopy.length; i++) { 
        let row = i % 4; // 0-3循环，实现四列布局
        let good = goodsCopy[i];
        
        GoodContainer.children[row].innerHTML += `
            <div class="item" data-GoodId="${good.id}" onclick="console.log('${good.id}')">
                <div class="images" onclick="API_jumpToPage('../WebContent/goodsDetail.html', ${good.id}, 'display_good', true)">
                    <img src="${good.image_url}" alt="">
                </div>
                <div class="content">
                    <p>${good.name}</p>
                    <span>${good.price}.00</span> <!-- 假设价格为整数，显示为两位小数 -->
                </div>
                <div class="add-btn" onclick="API_addToCart('${good.id}')">+</div>
            </div>`;
    }
}


function API_resetGetGoodsIndex() {
    getGoods_index = 0;
}

function API_getIdByName(name) {
    let goods_data = JSON.parse(localStorage.getItem("goods_data"));
    for (let key of goods_item) {
        for (let i = 0; i < goods_data[key].data.length; i++) {
            if (goods_data[key].data[i].name == name) {
                return goods_data[key].data[i].id;
            }
        }
    }
    return null;
}

function API_updateUserInfo(username=null, data_name, data) {
    const current_user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (username == null) {
        username = current_user.username;
    }
    try {
        if (current_user.username == username) {
            current_user[data_name] = data;
            localStorage.setItem("CurrentUser", JSON.stringify(current_user));
        }
    } catch (error) {
        return;
    }
    const user_list = JSON.parse(localStorage.getItem("UserList"));
    try {
        for (let i = 0; i < user_list.length; i++) {
            if (user_list[i].username == username) {
                user_list[i][data_name] = data;
                localStorage.setItem("UserList", JSON.stringify(user_list));
                return;
            }
        }
    } catch (error) {
        return;
    }
}