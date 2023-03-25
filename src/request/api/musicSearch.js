import service from "../index.js";
//获取搜索音乐数据
export const getMusicSearched = (keywords,limit,offset) => {
    return service({
        method:"GET",
        url:'/cloudsearch',
        params:{
            keywords,
            limit,
            offset
        }
    })
}

//获取默认搜索关键词
export const getSearchWordDefault = () => {
    return service({
        method:"GET",
        url:'/search/default'
    })
}

// //获取热搜列表
// export const getSearchHot = () => {
//     return service({
//         method:"GET",
//         url:'/search/hot'
//     })
// }

//获取热搜列表(详细)
export const getSearchHotDetail = () => {
    return service({
        method:"GET",
        url:'/search/hot/detail'
    })
}

//获取热门话题(登录使用)
// export const getHotTopic = () => {
//     return service({
//         method:"GET",
//         url:'/hot/topic'
//     })
// }

//获取指定话题详情
// export const getTopicDetail = () => {
//     return service({
//         method:"GET",
//         url:'/topic/detail?actid=111551188'
//     })
// }

//获取指定话题详情热门动态
// export const getTopicDetailEvent = () => {
//     return service({
//         method:"GET",
//         url:'/topic/detail/event/hot?actid=111551188'
//     })
// }

//获取指定搜索建议词
export const getSuggestWord = (data) => {
    return service({
        method:"GET",
        url:`/search/suggest?keywords=${data}&type=mobile`
    })
}