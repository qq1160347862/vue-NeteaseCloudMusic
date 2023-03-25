import service from "../index.js";
//获取热门歌手
export const getHotArtists = () => {
    return service({
        method:"GET",
        url:'/top/artists?limit=30'
    })
}

//获取歌手分类列表
export const getArtistsCategory = (data) => {
    return service({
        method:"GET",
        url:`/artist/list?type=${data.type}&area=${data.area}&initial=${data.initial}`
    })
}