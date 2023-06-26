import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {getMusicComment, getMusicLyric, getMusicSonComment} from "../request/api/musicList.js";
import {getPhoneLogin} from "../request/api/home.js";
import {getAccount, getLevel, getUserMusicList} from "../request/api/local.js";
import {getMusicListSongAll} from "../request/api/userMusicList.js";

export default createStore({
    state: {
        //用户信息
        userInfos:{
            id:0,      //用户id
            nickname:'用户名称',    //用户名称
            gender:0,       //用户性别0未设置，1男，2女
            avatarUrl:'http://p1.music.126.net/Se0n1_p0z8_DUQXNLILOKQ==/109951167721662139.jpg',   //用户头像url
            signature:'用户简历',   //用户简历
            backgroundUrl:'http://p1.music.126.net/2zSNIqTcpHL2jIvU6hG0EA==/109951162868128395.jpg',   //用户背景图
            follows:999,    //关注
            followeds:999,  //粉丝
            level:99//等级
        },
        //音乐播放列表,下面的值是按教程来得默认值
        playList:[{
            al:{
                id: 35737398,
                name: "拾贰",
                pic: 109951162972885980,
                picUrl: "http://p3.music.126.net/cfeO77CDbqYx_i1B-XlXFg==/109951162972885982.jpg",
                pic_str: "109951162972885982",
            },
            ar:[{
              name:"方拾贰（方十二）",
            }],
            id:490106148,
            name:"山下"
        }],
        userMusicList:[],   //用户歌单
        userFavoriteMusicListId:0,//用户喜爱歌单ID（用于添加收藏）
        userFavoriteMusicList:{},//用户喜爱歌单信息
        userFavoriteSongList:[],//用户最喜爱歌单歌曲列表
        playModel:0, //播放模式
        //歌曲评论
        comment:[{

        }],
        //歌曲子评论
        sonCommentData:{

        },
        currentSongListId:0,//当前歌单ID
        lastSongListId:0,//上次歌单ID
        currentSongListId2:0,//当前歌单ID
        lastSongListId2:0,//上次歌单ID
        playListIndex:0,//默认音乐列表下标
        isPlaying:false,//当前是否播放歌曲（判断播放暂停按钮）
        detailShow:false,//是否展示歌曲详情页
        CommentShow:false,//是否展示评论区
        lyricList:{},//歌词
        currentTime:0,//当前播放时间
        duration:0,//歌曲总时长
        isLyricShow:false,//是否展示歌词
        searchHistory:JSON.parse(localStorage.getItem('searchHistory')) || [],//搜索历史
        isLogin:false,//当前是否登录
        isPlayerShow:true,//是否显示底部播放器
        isBottomNavShow:true,//是否显示底部导航栏
        isToolShow:true,//是否显示浮动工具
        token:'',//用户登录标识
        Cookies:localStorage.getItem('cookie')!==null?localStorage.getItem('cookie'):''//cookies
    },
    //同步操作，数据提交至 mutations ，可用于登录成功后读取用户信息写到缓存里
    mutations:{
        deleteFromUserFavoriteSongListById(state,value){
            for(let i = 0;i<state.userFavoriteSongList.length;i++){
                if(state.userFavoriteSongList[i].id===value.id) {
                    state.userFavoriteSongList.splice(i,1)
                    console.log("歌曲已取消收藏")
                    break
                }else {
                    console.log("歌曲未收藏，不必删除")
                }
            }
        },
        addMusicToUserFavoriteSongListHead(state,value){

            console.log(value)
            let needAdd = 0
            //查找是否在歌曲列表中
            for(let i = 0;i<state.userFavoriteSongList.length;i++){
                if(state.userFavoriteSongList[i].id===value.id) {
                    console.log("歌曲存在，不必重复添加")
                    break
                }else {
                    needAdd = needAdd + 1
                }
            }
            if(needAdd===state.userFavoriteSongList.length){
                console.log("歌曲不存在，添加到歌单")
                //头部添加
                state.userFavoriteSongList.push(value)
            }
        },
        updateUserFavoriteSongList:function (state,value) {
            state.userFavoriteSongList = value
            console.log(state.userFavoriteSongList)
        },
        deleteUserFavoriteSongList:function (state,value) {
            state.userFavoriteSongList = []
        },
        updateUserFavoriteMusicList:function (state,value) {
            state.userFavoriteMusicList = value
        },
        deleteUserFavoriteMusicList:function (state,value) {
            state.userFavoriteMusicList = {}
        },
        updateUserFavoriteMusicListId:function (state,value) {
            state.userFavoriteMusicListId = value
        },
        deleteUserFavoriteMusicListId:function (state,value) {
            state.userFavoriteMusicListId = 0
        },
        updateUserMusicList:function (state,value) {
            state.userMusicList = value
        },
        deleteUserMusicList:function (state,value) {
            state.userMusicList = []
        },
        updateUserInfos:function (state,value) {
            //对象合并
            let temp = Object.assign({},state.userInfos,value)
            state.userInfos = temp
        },
        updateCookies:function (state,value) {
            state.Cookies = value
            localStorage.setItem('cookie',state.Cookies)
            // console.log(state.Cookies)
        },
        deleteCookies:function (state,value) {
            state.Cookies = ''
            localStorage.removeItem("cookie")

        },
        updateCurrentSongListId:function (state,value) {
            // state.lastSongListId = state.currentSongListId
            state.currentSongListId = value
        },
        updateLastSongListId:function (state,value) {
            state.lastSongListId = value
        },
        updateCurrentSongListId2:function (state,value) {
            // state.lastSongListId = state.currentSongListId
            state.currentSongListId2 = value
        },
        updateLastSongListId2:function (state,value) {
            state.lastSongListId2 = value
        },
        deleteUserInfos:function (state) {
            state.userInfos = {
                id:0,
                nickname:'用户名称',
                gender:0,
                avatarUrl:'http://p1.music.126.net/Se0n1_p0z8_DUQXNLILOKQ==/109951167721662139.jpg',
                signature:'用户简历',
                backgroundUrl:'',
                follows: 999,
                followeds: 999,
                level:99,
            }
        },
        updateIsPlaying:function (state,value) {
            state.isPlaying = value
        },
        updateComment:function (state,value) {
          state.comment = value
        },
        addComment:function (state,value) {
            console.log("add",value)
            value.forEach(item => {
                state.comment.push(item)
            })
            console.log("finished",state.comment)
        },
        updateSonCommentData:function (state,value) {
            state.sonCommentData = value
        },
        updatePlayList:function(state,value){
            state.playList = value
            // console.log(state.playList)
        },
        updatePlayModel:function (state,value) {
            state.playModel = value
            console.log(value)
        },
        updatePlayListIndex:function(state,value){
            state.playListIndex = value
            // console.log(state.playListIndex)
        },
        updateDetailShow:function (state){
            state.detailShow = !state.detailShow
        },
        updateCommentShow:function (state) {
            state.CommentShow = !state.CommentShow
        },
        updateLyricList:function (state,value) {
            state.lyricList = value
        },
        updateCurrentTime(state,value){
            state.currentTime = value
        },
        updateDuration(state,value){
            state.duration = value
        },
        updateIsLyricShow(state,value){
            state.isLyricShow = value
        },
        addMusicToPlayListHead(state,value){
            console.log(value)
            let needAdd = 0
            //查找是否在歌曲列表中
            for(let i = 0;i<state.playList.length;i++){
                if(state.playList[i].id===value.id) {
                    console.log("歌曲存在，不必重复添加")
                    state.playListIndex = i
                    break
                }else {
                    needAdd = needAdd + 1
                }
            }
            if(needAdd===state.playList.length){
                console.log("歌曲不存在，添加到歌单")
                //头部添加
                state.playList.unshift(value)
                //添加歌曲后，当前播放下标转至最新歌曲
                state.playListIndex=0
            }
        },
        addMusicToPlayListTail(state,value){
            console.log(value)
            let needAdd = 0
            //查找是否在歌曲列表中
            for(let i = 0;i<state.playList.length;i++){
                if(state.playList[i].id===value.id) {
                    console.log("歌曲存在，不必重复添加")
                    state.playListIndex = i
                    break
                }else {
                    needAdd = needAdd + 1
                }
            }
            if(needAdd===state.playList.length){
                console.log("歌曲不存在，添加到歌单")
                //头部添加
                state.playList.push(value)
                //添加歌曲后，当前播放下标转至最新歌曲
                state.playListIndex=state.playList.length-1
            }
        },
        addMusicToPlayListNext(state,value){

            let needAdd = 0
            //查找是否在歌曲列表中
            for(let i = 0;i<state.playList.length;i++){
                if(state.playList[i].id===value.id) {
                    console.log("歌曲存在，不必重复添加")
                    state.playList.splice(i,1)
                    state.playList.splice(state.playListIndex+1,0,value)
                    break
                }else {
                    needAdd = needAdd + 1
                }
            }
            if(needAdd===state.playList.length){
                console.log("歌曲不存在，添加到歌单")
                //在播放器选中的这首歌后面添加歌曲
                state.playList.splice(state.playListIndex+1,0,value)
                // state.playList.push(value)
            }

        },
        updateSearchHistory(state,value){
            let needAdd = 0
            for (let i = 0;i < state.searchHistory.length;i++){
                if (state.searchHistory[i]===value){
                    console.log("搜索词存在，不必重复添加")
                    //搜索词再次被搜索，放置列表第一位
                    state.searchHistory.splice(i,1)
                    state.searchHistory.unshift(value)
                    break
                }
                else {
                    needAdd = needAdd + 1
                }
            }
            if (needAdd===state.searchHistory.length){
                console.log("搜索词不存在，添加")
                state.searchHistory.unshift(value)
            }
            //存入localStorage
            localStorage.setItem('searchHistory',JSON.stringify(state.searchHistory))
        },
        deleteAllSearchHistory(state){
            state.searchHistory = []
            localStorage.removeItem("searchHistory")
        },
        updateIsLogin(state,value){
            state.isLogin = value
        },
        deleteIsLogin(state){
            state.isLogin = false
        },
        updateIsPlayerShow(state,value){
            state.isPlayerShow = value
        },
        updateIsBottomNavShow(state,value){
            state.isBottomNavShow = value
        },
        updateIsToolShow(state,value){
            state.isToolShow = value
        },
        updateToken(state,value){
            state.token = value
            localStorage.setItem('token',state.token)
        },
        deleteToken(state){
            state.token = ''
            localStorage.removeItem("token")
        }
    },
    //dispatch：含有异步操作，数据提交至 actions ，可用于向后台提交数据
    actions:{
        //异步获得歌词数据
        getLyric:async function (context,value) {
            let res = await getMusicLyric(value)
            // console.log(res)
            context.commit("updateLyricList",res.data.lrc)
        },
        //异步获得评论数据
        getComment:async function (context,value){
            let res = await getMusicComment(value)
            if(res.data.data.comments.length>0){
                // console.log(res)
                if(value.isChange === true){
                    context.commit("updateComment",res.data.data.comments)
                    return res.data.data.totalCount
                }else {
                    await context.commit("addComment",res.data.data.comments)
                    return res.data.data.totalCount
                }
            }else{

                console.log("当前歌曲没有评论数据",res)
                return 0
            }

        },
        //异步获得子评论数据
        getSonComment:async function (context,value){
            let res = await getMusicSonComment(value)
            // console.log("123")
            // context.commit('updateSonCommentData',res.data.data)
            // console.log(res)
            return res
        },
        //异步登陆
        getLogin:async function (context,value){
            let res = await getPhoneLogin(value)
            await context.commit('updateCookies',res.data.cookie)
            //获取用户信息
            await context.dispatch('getUserInfos')
            //获取用户歌单信息
            await context.dispatch('getUserMusicList',res.data.account.id)
            //获得用户最喜爱歌单歌曲
            await context.dispatch('getFavoriteSongList')
            // console.log(res)
            return res
        },
        //异步获得个人信息
        getUserInfos:async function (context,value){
            let res = await getAccount(encodeURIComponent(localStorage.getItem('cookie')))
            let levelRes = await getLevel(encodeURIComponent(localStorage.getItem('cookie')))
            // console.log(res)
            // console.log(context.state.userInfos)
            if (res.data.profile !=null ||
                res.data.account !=null ||
                context.state.isLogin ||
                context.state.token ||
                localStorage.getItem('token')) {
                console.log("用户数据已更新")
                context.commit("updateUserInfos",res.data.profile)
                context.commit('updateUserInfos',levelRes.data.data)
                console.log(res,levelRes,context.state.userInfos)

            }else{
                console.log("当前没有获取到登陆状态")
            }

        },
        //异步获得个人歌单信息
        getUserMusicList:async function (context,value){
            let res = await getUserMusicList(value,encodeURIComponent(localStorage.getItem('cookie')))
            let tempArr = []
            for(let i = 1; i < res.data.playlist.length; i++){
                tempArr.push(res.data.playlist[i])
            }
            console.log(res)
            context.commit('updateUserFavoriteMusicList',res.data.playlist[0])
            context.commit('updateUserFavoriteMusicListId',res.data.playlist[0].id)
            context.commit('updateUserMusicList',tempArr)
        },
        //异步获得最喜爱歌单
        getFavoriteSongList:async function (context,value){
            let res = await getMusicListSongAll(
                context.state.userFavoriteMusicListId,
                localStorage.getItem('cookie'))
            context.commit('updateUserFavoriteSongList',res.data.songs)
        }

    },
    modules:{

    },
    //持久化vuex
    plugins: [createPersistedState({
        storage:window.sessionStorage  // 同localStorage相同，只是将vuex的所有值存储到sessionStorage中
    })]

})