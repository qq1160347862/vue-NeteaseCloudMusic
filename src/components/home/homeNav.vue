<template>
  <div class="navMenu">
    <el-scrollbar height="100%">
      <div class="navMenuTop">
        <div class="userHead" @click="$router.push('/userInfo')">
          <img :src=store.state.userInfos.avatarUrl alt="用户头像">
          <div class="userName">{{store.state.userInfos.nickname}}</div>
          <div v-if="store.state.userInfos.gender===0" style="color: #f9f9f9">未设置性别</div>
          <div v-if="store.state.userInfos.gender===1" style="color: #f9f9f9">男</div>
          <div v-if="store.state.userInfos.gender===2" style="color: #f9f9f9">女</div>
        </div>
        <div class="userInfos">
          <span>{{store.state.userInfos.signature}}</span>
        </div>
      </div>
      <div class="navMenuCard1">
        <div class="cardTitle">
          <span>个人服务</span>
        </div>
        <div class="cardContent">
          <el-scrollbar height="17.5rem">
            <ul>
              <li><el-icon><Message /></el-icon><span>我的消息</span></li>
              <li><el-icon><MostlyCloudy /></el-icon><span>云中心</span></li>
              <li><el-icon><Avatar /></el-icon><span>创作者中心</span></li>
              <li><el-icon><ForkSpoon /></el-icon><span>饮食中心</span></li>
              <li><el-icon><ShoppingCart /></el-icon><span>商城</span></li>
              <li><el-icon><Pouring /></el-icon><span>天气</span></li>
              <li><el-icon><Setting /></el-icon><span>设置</span></li>
              <li><el-icon><Clock /></el-icon><span>定时关机</span></li>
              <li><el-icon><CircleClose /></el-icon><span>我的消息</span></li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <div class="navExit">
        <el-button class="navExitButton" @click="drawer = true">关闭侧栏/退出程序</el-button>
        <el-drawer ref="elDrawer" v-model="drawer"
                   title="关闭侧栏/退出程序"
                   :direction="direction">
          <div class="closeNav" tabindex = "0" @click="closeNav">
            <el-icon><Back /></el-icon>
            <span>关闭侧栏</span>
          </div>
          <div class="exit" tabindex = "0" @click="logout">
            <el-icon><CloseBold /></el-icon>
            <span>退出登录</span>
          </div>
        </el-drawer>
      </div>
<!--      <el-button class="Login" @click="Login">登录</el-button>-->
<!--      <el-button @click="look">查看登录信息</el-button>-->
    </el-scrollbar>

  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {useRouter} from 'vue-router'
import {Message,MostlyCloudy,Avatar,ForkSpoon,ShoppingCart,Pouring,Setting,Clock,CircleClose,CloseBold,Back} from '@element-plus/icons-vue'
const router = useRouter()
const drawer = ref(false)
const direction = ref('btt')

// const Login = () => {
//   let res = login()
//   console.log('登录信息:',res)
// }
// const look = () => {
//   let res =  getLoginStatus()
//   console.log('登录状态:',res)
// }

onMounted(async () => {
  // let res = await getLoginStatus()
  // console.log('登录状态:',res)
})
</script>


<script>
import store from "../../store/index.js";
import {getLogout} from "../../request/api/home.js";

export default {
  name: "homeNav",
  methods:{
    //用于点击侧栏选项时，同步关闭侧栏的功能！勿删！
    closeNav() {
      //给外层抽屉发送关闭请求信息
      this.$emit('navMsg',true)
      this.$refs.elDrawer.handleClose()
    },
    logout:async function () {
      store.commit('deleteIsLogin')
      store.commit('deleteToken')
      store.commit('deleteUserInfos')
      store.commit('deleteUserMusicList')
      store.commit('deleteCookies')
      store.commit('deleteUserFavoriteMusicList')
      store.commit('deleteUserFavoriteMusicListId')
      store.commit('deleteUserFavoriteSongList')
      let res = await getLogout()
      this.closeNav()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
/*element 一定是疯了 z-index干嘛设置到10*/
.navMenu>>>.el-scrollbar__bar.is-horizontal{
  height: 0;
}
.navMenu>>>.el-scrollbar__bar.is-vertical{
  width: 0;
}
.navMenu {
  z-index: 100;
  position: absolute;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  /*box-shadow: #545454 .1rem 0 .5rem;*/
  width: 20rem;
  height: 100%;
  background-color: #f3f4f6;
  left: 0;
  transition: .5s;
}
.active.navMenu {
  opacity: 1;
  z-index: 12;
  left: 0;
}
.navMenu .navMenuTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem auto;
  width: 90%;
  height: 10rem;
  border-radius: 1.5rem;
  box-shadow: #fdfdfd 0 0 .2rem;
  background-color: #fdfdfd;
}
.navMenu .navMenuTop .userHead {
  text-align: center;
  padding-top: 1.6rem;
  height: 100%;
  width: 8rem;
  /*background-color: #646cff;*/
}
.navMenu .navMenuTop .userHead img {
  margin: 0 auto;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
}
.navMenu .navMenuTop .userHead .userName {
  margin-top: .5rem;
  color: #2c2c2c;
  font-weight: bold;
  font-size: .8rem;
}
 .navMenu .navMenuTop .userInfos {
   display: flex;
   justify-content: center;
   align-items: center;
   width: 12rem;
   height: 100%;
   color: #2c2c2c;
   font-size: .8rem;
   /*background-color: #c45656;*/
 }






 /******************************服务卡片样式************************************/
.navMenu .navMenuCard1,
.navMenu .navMenuCard2 {
  margin: 1rem auto;

  width: 90%;
  height: 20rem;
  border-radius: 1.5rem;
  box-shadow: #fdfdfd 0 0 .8rem;
  background-color: #fdfdfd;
}

.navMenu .navMenuCard1 .cardTitle,
.navMenu .navMenuCard2 .cardTitle{
  padding-left: .8rem;
  width: 100%;
  height: 2.5rem;
  line-height: 2.5rem;
  border-bottom: rgba(114, 105, 105, 0.3) solid 1px;
  font-size: .7rem;
  color: #2c2c2c;
}

.navMenu .navMenuCard1 .cardContent,
.navMenu .navMenuCard2 .cardContent{
   width: 100%;
   height: 17.5rem;
   color: #2c2c2c;
 }

.navMenu .navMenuCard1 .cardContent ul,
.navMenu .navMenuCard2 .cardContent ul{

}

.navMenu .navMenuCard1 .cardContent li,
.navMenu .navMenuCard2 .cardContent li{
  display: flex;
  align-items: center;
  margin-top: .8rem;
  padding-left: .8rem;
  width: 100%;
  height: 2.5rem;
  transition: background-color .3s;
}

.navMenu .navMenuCard1 .cardContent li:nth-child(1),
.navMenu .navMenuCard2 .cardContent li:nth-child(1){
  margin-top: 0;
}

.navMenu .navMenuCard1 .cardContent li:last-child,
.navMenu .navMenuCard2 .cardContent li:last-child{
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}

.navMenu .navMenuCard1 .cardContent li>>>.el-icon,
.navMenu .navMenuCard2 .cardContent li>>>.el-icon{
   font-size: 1.5rem;
 }

.navMenu .navMenuCard1 .cardContent li span,
.navMenu .navMenuCard2 .cardContent li span{
  padding-left: .8rem;
  font-size: .8rem;
}

.navMenu .navMenuCard1 .cardContent li:hover,
.navMenu .navMenuCard2 .cardContent li:hover{
  /*background-color: #1c1c1c;*/
  color: #f56c6c;
}


/**************************底部抽屉按钮样式**********************/
.navMenu .navExit {
  margin: 0 auto;
  width: 50%;
  height: 3rem;
}
.navMenu .navExit .navExitButton.el-button {
   background-color: #f56c6c;
   color: #f9f9f9;
   border: #f9f9f9 solid 0;
   border-radius: 1rem;
   height: 2.5rem;
 }
.navMenu .navExit .navExitButton.el-button:hover {
  background-color: #1c1c1c;
}
.navMenu .navExit>>>.el-drawer {
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  border-bottom-right-radius:0;
  color: #2c2c2c;
  background-color: #FDFDFDFF;
}
.navMenu .navExit>>>.el-drawer__header {
  height: 3.5rem;
  margin: 0;
  padding-bottom: 1rem;
  color: #2c2c2c;
  border-bottom: rgba(249, 249, 249, 1) solid 1px;
}
 .navMenu .navExit>>>.el-drawer__title {
   font-size: .8rem;
 }
.navMenu .navExit>>>.el-drawer__close-btn {
  font-size: 1rem;
}
.navMenu .navExit>>>.el-drawer__body {
  padding: 0;
}
.navMenu .closeNav,
.navMenu .exit{
  display: flex;
  align-items: center;
  padding: 1rem 1.2rem;
  width: 100%;
  height: 5rem;
  line-height: 3rem;
  transition: background-color .3s;
  font-size: 1.5rem;
}
.navMenu .closeNav span,
.navMenu .exit span {
  margin-left: .8rem;
  font-size: 1.2rem;
}
.navMenu .closeNav:hover,
.navMenu .exit:hover{
  background-color: #e0e0e0;
}
.navMenu .exit:hover>>>.el-icon{
  color: red;
}

</style>