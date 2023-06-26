<template>
  <div class="loginContainer" id="loginContainer">
    <div class="loginArea" v-if="SwitchLoginMethod === 'phone'">
      <div class="Logo"></div>
      <div class="loginTitle"><span>欢迎使用</span></div>
      <el-form :model="form"
               size="large"
               :rules="rules"
               status-icon ref="form">
        <el-form-item prop="phone">
          <input
              type="text"
              name="phone"
              class="phone"
              placeholder="请输入手机号" v-model="form.phone">
        </el-form-item>
        <el-form-item prop="password">
          <input type="password"
                 name="password"
                 class="password"
                 placeholder="请输入密码" v-model="form.password">
        </el-form-item>
      </el-form>

      <div class="btnArea">
        <button class="btn" @click="Login">登录</button>
        <button @click="$router.push('/home')">立即体验</button>
      </div>
      <div class="btnArea">
        <button class="btn" @click="qrLogin">获取二维码</button>
      </div>
      <div class="loadingIcon">
        <svg class="loading recting" width="40" height="40" viewbox="0 0 40 40">
          <polygon points="0 0 0 40 40 40 40 0" class="polygon" />
        </svg>
      </div>
    </div>
    <div class="loginArea" v-else-if="SwitchLoginMethod === 'qr'">
      <div class="Logo"></div>
      <div class="loginTitle"><span>欢迎使用</span></div>
      <img id="qrimg">
      <div id="qrStatus">二维码状态</div>
      <div class="btnArea">
        <button class="btn" @click="changeToPhoneLogin">切换登录</button>
      </div>
      <div class="loadingIcon">
        <svg class="loading recting" width="40" height="40" viewbox="0 0 40 40">
          <polygon points="0 0 0 40 40 40 40 0" class="polygon" />
        </svg>
      </div>
    </div>

  </div>
</template>

<script setup>

import {useRouter} from "vue-router/dist/vue-router";
import {checkQr, getLoginStatus, getQr, getQrKey} from "../request/api/home.js";
import {ref} from "vue";
let qrkey
let timer
let SwitchLoginMethod = ref('phone')
const router = useRouter()
const qrLogin = async () => {
  SwitchLoginMethod.value = 'qr'
  let res = await getQrKey()
  qrkey = res.data.data.unikey
  let res2 = await getQr(qrkey)
  document.querySelector('#qrimg').src = res2.data.data.qrimg
  timer = setInterval(async () => {
    let qrStatus = await checkQr(qrkey)
    if (qrStatus.data.code === 800){
      // message:"二维码不存在或已过期"
      clearInterval(timer)
    }
    else if (qrStatus.data.code === 801){
      document.querySelector('#qrStatus').innerText = '等待扫码'
    }
    else if (qrStatus.data.code === 802){
      // message:"授权中"
      // nickname:"XXX"
      document.querySelector('#qrStatus').innerText = '等待确定'
    }
    else if (qrStatus.data.code === 803){
      // message :"授权登陆成功"
      clearInterval(timer)
      document.querySelector('#qrStatus').innerText = '登陆成功'
      store.commit('updateCookies',qrStatus.data.cookie)
      store.commit('updateIsLogin',true)
      let info = await getLoginStatus(qrStatus.data.cookie)
      store.commit('updateUserInfos',info.data.data.profile)
      // console.log(info)
      // console.log(info.data.data.profile)
      await router.push('/home')
    }
  }, 3000)
}
const changeToPhoneLogin = () => {
  SwitchLoginMethod.value = 'phone'
  clearInterval(timer)
}
</script>
<script>
import store from '../store/index.js'
import {ElLoading} from "element-plus";
export default {
  data(){
    return{
      phone:'',
      password:'',
      form:{},
      rules:{
        phone:[
          { required: true, message: '请输入账号', trigger:'blur'},
        ],
        password:[
          { required: true, message: '请输入密码', trigger:'blur'},
        ]
      }
    }
  },
  methods:{
    Login:async function (){
      await this.$refs['form'].validate(async (valid) => {
        if (valid){
          const loadingInstance = ElLoading.service({
            target:document.getElementById('loginContainer') ,
            text:"登录中",
            background:"rgba(52,52,52,0.8)",
          })
          let res = await store.dispatch('getLogin',{phone:this.form.phone,password:this.form.password})
          console.log(res)
          if(res.data.code===200){  //登录成功
            store.commit('updateToken',res.data.token)
            store.commit('updateIsLogin',true)
            store.commit('updateUserInfos',res.data.profile)
            this.$router.push('/home')
            loadingInstance.close()
          }else {
            alert("要么是网络拥挤，要么是密码错了")
            loadingInstance.close()
          }
        }else {
          console.log("不合法输入")
        }
      })

    }
  }
}
</script>
<style scoped>
.loginContainer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 100%;
  height: 100%;
  /*background-color: #2c2c2c;*/
  background: url("../assets/img/plane-7236193.png") no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loginArea {
  position: relative;
  width: 88%;
  height: 50%;
  background-color: #fdfdfd;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1.6rem;
  /*box-shadow: #2c2c2c 0 0 2px;*/
}
.loginArea .Logo{
  position: absolute;
  width: 6rem;
  height: 6rem;
  border-radius: 3rem;
  /*box-shadow: #2c2c2c 0 0 1px;*/
  top: 4%;
  left: 1%;
  background: url("../assets/img/Logo.png") no-repeat;
  background-size: cover;
}
.loginTitle {
  font-size: 2rem;
  color: #2c2c2c;
  font-weight: bold;
  text-indent: 8px;
  margin-top: 3rem;
  margin-bottom: 2rem;
}
.loginArea input {
  width: 18rem;
  height: 3rem;
  text-indent: 8px;
  border: none;
  outline: none;
  border-bottom: #ddd solid 1px;
  border-radius: 1rem;
  margin: .2rem 0;
}
.loginArea button {
  width: 5rem;
  height: 2rem;
  border:none;
  border-radius: 1rem;
  background-color: #f56c6c;
  color: #f9f9f9;
  font-weight: bold;
  margin: 0 1rem;
}
.loginArea>>>.el-form-item__error{
  font-weight: bold;
}

.btnArea {
  margin-top: 16px;
}

.loadingIcon {
  position: absolute;
  top: 11.9%;
  right: 16%;
}

/* recting loading START */
.recting .polygon {
  fill: none;
  stroke-width: 8px;
  stroke: #2c2c2c;
  stroke-dasharray: 40;
  stroke-dashoffset: 50%;
  animation: recting 1.5s forwards infinite;
}

@keyframes recting {
  to {
    stroke-dashoffset: 250%;
  }
}
/* recting loading END */
</style>