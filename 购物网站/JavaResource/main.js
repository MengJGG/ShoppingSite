'use strict';


var goods_data = {};  // 商品数据字典
const GoodsItemsForInit = [
    {"guitar": ["../Resource/JSONData/guitar/fender.json",
                "../Resource/JSONData/guitar/martin.json",
                "../Resource/JSONData/guitar/taylor.json",
                "../Resource/JSONData/guitar/yamaha.json"]
    },
    {"food":["../Resource/JSONData/food/xican.json"]},
    {"racket":[
        {
            "Yonex":[
                "../Resource/JSONData/racket/gongjianxilie.json",
                "../Resource/JSONData/racket/jiguangxilie.json",
                "../Resource/JSONData/racket/tianfuxilie.json"
            ]
        },
        {
            "Li-Ning": []
        },
        {
            "Victor": []
        }
    ]}
]

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


// 使用搜索树初始化商品的数据（用于数据量较小的情况）
// 返回字典形式的商品数据，如果出错则返回null
function initGoodsData(items) {
    try {
        for (let i = 0; i < items.length; i++) {
            
        }

    } catch (error) {
        console.error(error);
        return null;
    }
    return goodsData;
}

// window.addEventListener('DOMContentLoaded', async () => {
//     const data = await fetchData('../Resource/JSONData/food/xican.json');
//     console.log(data);
// });


// 注册接口
// 当用户点击注册按钮时，调用该接口
function API_register() {
    const usernameInput = document.getElementsByName('username')[0];
    const passwordInput = document.getElementsByName('password')[0];
    // 预留方案，如果有email或者二次密码
    // const email = document.getElementsByName('email')[0];
    // const password_2 = document.getElementsByName('password2')[0];

    // 验证用户输入的用户名是否已被注册

    const username = usernameInput.value;
    const password = passwordInput.value;

    // 获取cookie
    


}