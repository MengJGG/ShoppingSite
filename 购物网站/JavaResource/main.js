'use strict';


// 从服务器获取数据, path为请求的路径
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


// window.addEventListener('DOMContentLoaded', async () => {
//     const data = await fetchData('../Resource/JSONData/food/xican.json');
//     console.log(data);
// });
