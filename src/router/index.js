import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'
import store from '../store/index.js'


//路由对象
const routers = [
    {
        path:'/test',
        name:'test',
        component:() => import('../views/test.vue')
    },
    {
        path: '/',
        name:'login',
        //路由守卫
        beforeEnter:(to,from,next)=>{
            if(localStorage.getItem('cookie')){
                next('home')
            }else {
                next()
            }
        },
        component:() => import('../views/Login.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home.vue')
    },
    {
        path: '/songResults',
        name: 'songResults',
        component: () => import('../views/songResultsView.vue')
    },
    {
        path: '/musicList',
        name: 'musicList',
        component: () => import('../views/musicListView.vue')
    },
    {
        path: '/songArtists',
        name: 'songArtists',
        component: () => import('../views/songArtistsView.vue')
    },
    {
        path: '/artistInfos',
        name: 'artistInfos',
        component: () => import('../views/artistInfosView.vue')
    },
    {
        path: '/userInfo',
        name: 'userInfo',
        //路由守卫
        beforeEnter:(to,from,next)=>{
            if(store.state.isLogin || store.state.token || localStorage.getItem('token') || localStorage.getItem('cookie')){
                next()
            }else {
                let myAudio = document.getElementById('mp')
                myAudio.pause()
                store.commit('updateIsPlaying',false)
                next('/')
            }
        },
        component: () => import('../views/userInfoView.vue')
    },
    {
        path: '/local',
        name: 'local',
        component: () => import('../views/localView.vue')
    },
    {
        path: '/musicAlbum',
        name: 'musicAlbum',
        component: () => import('../views/musicAlbumView.vue')
    },
    {
        path: '/userMusicList',
        name: 'userMusicList',
        component: () => import('../views/userMusicListView.vue')
    },
    {
        path: '/userMusicListFavorite',
        name: 'userMusicListFavorite',
        component: () => import('../views/userMusicListFavoriteView.vue')
    },

]
const router = createRouter(
    {
        //路由模式为history 首页为"/"
        history:createWebHistory('/'),
        /*打包注意切换状态*/
        // history:createWebHashHistory('/'),
        //路由对象
        routes:routers,
    }
)
//全局路由守卫，判断全局组件的显示
router.beforeEach((to,from)=>{
    if (to.name==='login'){
        store.commit('updateIsPlayerShow',false)
        store.commit('updateIsToolShow',false)
    }else{
        store.commit('updateIsPlayerShow',true)
        store.commit('updateIsToolShow',true)
    }

    if (to.name==='home' || to.name==='local'){
        store.commit('updateIsBottomNavShow',true)
    }else {
        store.commit('updateIsBottomNavShow',false)
    }

})
export default router
