'use strict';


var goods_data = {};  // 商品数据字典
const GoodsItemsForInit = [
    {"guitar": ["../Resource/JSONData/guitar/fender.json",
                "../Resource/JSONData/guitar/martin.json",
                "../Resource/JSONData/guitar/taylor.json",
                "../Resource/JSONData/guitar/yamaha.json"]
    },
    {"food":["../Resource/JSONData/food/xican.json"]},
    {"racket":["../Resource/JSONData/racket/gongjianxilie.json",
               "../Resource/JSONData/racket/jiguangxilie.json",
               "../Resource/JSONData/racket/tianfuxilie.json"
    
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


// 初始化商品的数据（用于数据量较小的情况）
// 返回字典形式的商品数据，如果出错则返回null
function initGoodsData() {
    try {
        for (let i = 0; i < items.length; i++) {
            goodsData[items[i]] = fetchData()
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
