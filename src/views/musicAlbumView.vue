<template>
  <MusicAlbumTop :playlist="data.playlist" :id="data.id"/>
  <MusicAlbumContent :songList="data.songList" :id="data.id" :songCount="data.songCount"/>
</template>

<script setup>
import MusicAlbumTop from '../components/musicAlbum/musicAlbumTop.vue'
import MusicAlbumContent from "../components/musicAlbum/musicAlbumContent.vue";
import {onMounted,reactive} from "vue";
import {useRoute} from 'vue-router';
import {getAlbum} from "../request/api/home.js";
const data = reactive({
  playlist:{},  //歌单详情页数据
  songList:[],//歌单歌曲
  id:0,//歌单ID
  songCount:0//歌单歌曲数量
})

const MusicAlbumInfos = async (id) => {
  let res = await getAlbum(id)
  data.playlist = res.data.album
  data.songList = res.data.songs
  data.id = id
  data.songCount = res.data.songs.length
  console.log(res)
}

onMounted( ()=> {
  //拿到歌单ID号
  let id = useRoute().query.id

  console.log(id)
  MusicAlbumInfos(id)
  //获取歌单歌曲
  // MusicListSong(id)
  //防止页面刷新，数据丢失，将数据保存到session中
  // sessionStorage.setItem('itemDetail',JSON.stringify(data))
})
</script>
<script>
export default {
  name: "musicAlbumView"
}
</script>

<style scoped>

</style>