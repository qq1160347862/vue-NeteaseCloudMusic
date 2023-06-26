import service from "../index.js";
//获取轮播图数据
// 0: pc
// 1: android
// 2: iphone
// 3: ipad
export const getBanner = () => {
    return service({
        method:"GET",
        url:"/banner?type=2"
    })
}
//获取专辑内容
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
// 必选参数 : id: 专辑 id
// 接口地址 : /album
// 调用例子 : /album?id=32311
export const getAlbum = (id) => {
    return service({
        method:"GET",
        url:`/album?id=${id}`
    })
}

//获取发现好歌单
export const getMusicList = () => {
    return service({
        method:"get",
        url:"/personalized?limit=8"
    })
}
//获取登录状态
export const getLoginStatus = (cookie = '') => {
    return service({
        method:"POST",
        url:`/login/status?timestamp=${Date.now()}`,
        data:{
            cookie,
        }
    })
}
//登录
export const getPhoneLogin = (data) => {


    return service({
        method:"GET",
        url:`/login/cellphone`,
        withCredentials:true,
        params:{
            phone:data.phone,
            password:data.password,
            realIP:"116.25.146.177"
        },


    })
}
// 二维码登陆测试
export const getQrKey = () =>{
    return service({
        method:"GET",
        url:`/login/qr/key?timestamp=${Date.now()}`
    })
}

export const getQr = (key) =>{
    return service({
        method:"GET",
        url:`/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`
    })
}
export const checkQr = (key) =>{
    return service({
        method:"GET",
        url:`/login/qr/check?key=${key}&timestamp=${Date.now()}`
    })
}
//退出登录
export const getLogout = () => {
    return service({
        method:"GET",
        url:"/logout",
    })
}
