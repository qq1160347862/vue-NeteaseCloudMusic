<template>
  <div class="main">
    <!--  头部-->
    <Header/>
    <div class="headerV"></div>
    <!--  轮播区域-->
    <BannerArea/>
    <!--  推荐歌单-->
    <MusicList/>
  </div>


</template>

<script setup>
import Header from "../components/Header.vue";
import BannerArea from '../components/home/bannerArea.vue'
import MusicList from '../components/home/musicList.vue'
import {ref} from 'vue'

</script>
<script>
export default {
  data(){
    return{

    }
  }
}
</script>
<style scoped>
.headerV {
  width: 100%;
  height: 3rem;
}
</style>