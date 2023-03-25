<template>
  <div>
    <el-button>
      主页
      <el-icon><Edit /></el-icon>
      <el-icon><Avatar /></el-icon>
    </el-button>
  </div>
  <div>
    {{msg}}
    <el-button @click="ChangeMsg('消息变更')">点击</el-button>
  </div>
  <div>
    {{msg}}
    <el-button @click="Redirection">跳转</el-button>
  </div>
</template>

<script setup>

// ref 字符 reactive 对象
import {ref,reactive} from 'vue'
//引入图标
import {Avatar,Edit} from '@element-plus/icons-vue'
// 引入axios
import request from "../request.js";
// 引入路由
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()

const msg = ref("这是一条消息")
const ChangeMsg = (value) => {
  msg.value = value
}

const Redirection = () => {
  router.push('/home')
}
</script>

<style scoped>

</style>