<template>
  <div class="artistInfosArea" v-if="artistInfosData.flag===true">
    <div class="artistInfosArea_top">
      <div class="left">
        <!--      返回上一级路由-->
        <el-icon @click="$router.go(-1)"><Back /></el-icon>
        <span>歌单</span>
      </div>
      <div class="right">
        <el-icon class="MoreFilled"><MoreFilled /></el-icon>
      </div>
    </div>
    <div class="blur"></div>
    <div class="artistBgPic">
      <img :src="artistInfosData.data.artist.cover">
    </div>
    <div class="headerV" style="width: 100%; height: 10rem"></div>
    <div class="artistContent">
      <el-scrollbar>
          <div class="artistContent_layout">
            <div class="artistContent_top">
              <div class="artistName">{{artistInfosData.data.artist.name}}</div>
              <div class="artistFanCount">{{FanCount}}</div>
              <div class="artistTag">{{artistInfosData.data.identify.imageDesc}}</div>
            </div>
            <div class="artistInfosContent">
              <div class="artistInfosContent_title">
                <span>艺人百科</span>
              </div>
              <div class="artistInfosContent_body">
                <ul>
                  <li>{{'艺人名:'+artistDetailDate.name}}</li>
                  <li>{{'译名:'+artistDetailDate.transNames}}</li>
                  <li>{{'身份:'+artistDetailDate.identify}}</li>
                  <li>{{'生日:'+artistDetailDate.birthday}}</li>
                  <li>{{'国家地区:'+artistDetailDate.country}}</li>
                  <li>{{'学校:'+artistDetailDate.school}}</li>
                  <li class="briefDesc" @click="unfold">
                    {{'歌手简介:'+artistInfosData.data.artist.briefDesc}}
                  </li>
                </ul>
              </div>
            </div>
            <div class="artistSongListArea" id="artistSongListArea">

              <el-scrollbar @scroll="loadingSongsData" ref="scrollbar">
                <div class="artistSongListArea_title"><span>歌手歌曲</span></div>
                <div class="artistSongListLayout">
                  <div class="songsItem"
                       :id="'songsItem'+index"
                       v-for="(item,index) in songInfos"
                       :key="index">
                    <div class="songsInfos"
                         @click="selectMusic(item)"
                         @touchstart="songsItemTouchstart(index)"
                         @touchend="songsItemTouchend(index)">
                      <div class="name">{{item.name}}</div>
                      <div class="artists">
                        <span v-for="(item2,index2) in item.ar" :key="index2" class="artistsName">
                          {{item2.name}}
                        </span>
                      </div>
                    </div>
                    <div class="songsOption">
                      <el-icon v-if="item.mv>0" class="mv" @click="watchMv(item.mv)"><VideoCamera /></el-icon>
                      <el-icon class="moreOption" @click="moreButton(index)"><MoreFilled /></el-icon>
                    </div>
                  </div>
                  <div class="mvAreaLayout">
                    <el-drawer v-model="isMvShow"
                               ref="MvDrawer"
                               title="标题"
                               :with-header="false"
                               :direction="direction" size="100%" :destroy-on-close="true">
                      <div class="mvArea">
                        <video :src="MvUrl" controls preload="metadata" height="400" width="380"/>
                        <div class="mvArea_button" @click="closeMv"
                             @touchstart="mvAreaButtonTouchstart"
                             @touchend="mvAreaButtonTouchstart"><span>退出视频</span></div>
                      </div>
                    </el-drawer>
                  </div>
                  <el-drawer v-model="isMoreOptionShow"
                             ref="songsOptionDrawer"
                             title="标题"
                             :with-header="false"
                             :direction="direction" size="40%" :destroy-on-close="true">
                    <div class="songsOptionArea">
                      <ul>
                        <li id="songsOption1" @click="addNextSong"
                            @touchstart="songsOptionTouchstart(1)"
                            @touchend="songsOptionTouchend(1)"><el-icon><ArrowRight/></el-icon><span>下一首播放</span></li>
                        <li id="songsOption2" @click="isDownLoad = true"
                            @touchstart="songsOptionTouchstart(2)"
                            @touchend="songsOptionTouchend(2)"><el-icon><Download/></el-icon><span>下载</span></li>
                        <li id="songsOption3" v-show="!isLiked" @click="addMusicToMyFavorite"
                            @touchstart="songsOptionTouchstart(3)"
                            @touchend="songsOptionTouchend(3)"><el-icon><Star/></el-icon><span>收藏</span></li>
                        <li id="songsOption3" v-show="isLiked" @click="deleteFromMyFavorite"
                            @touchstart="songsOptionTouchstart(3)"
                            @touchend="songsOptionTouchend(3)"><el-icon><StarFilled/></el-icon><span>已收藏</span></li>
                        <li id="songsOption4" @click="addButton"
                            @touchstart="songsOptionTouchstart(4)"
                            @touchend="songsOptionTouchend(4)"><el-icon><CirclePlus/></el-icon><span>添加至歌单</span></li>
                        <li id="songsOption5"
                            @touchstart="songsOptionTouchstart(5)"
                            @touchend="songsOptionTouchend(5)"><el-icon><Share/></el-icon><span>分享</span></li>
                      </ul>
                    </div>
                  </el-drawer>
                  <el-drawer v-model="isDownLoad"
                             ref="isDownLoadDialog"
                             title="选择你的设备"
                             :with-header="false"
                             size="30%"
                             :direction="direction"
                             :destroy-on-close="true">
                    <div class="downloadMusicArea">
                      <div class="downloadMusicArea_title">
                        <span>请选择下载平台(认真!)</span>
                      </div>
                      <div class="downloadMusicArea_body">
                        <div class="PC" @click="downloadThisMusic">
                          <el-icon><Download /></el-icon>
                          <p>PC端</p>
                        </div>
                        <div class="Mobile" @click="downloadThisMusicMobile">
                          <el-icon><Download /></el-icon>
                          <p>移动端</p>
                        </div>
                      </div>
                    </div>
                  </el-drawer>
                  <el-drawer v-model="addMusic"
                             ref="addMusicDrawer"
                             title="标题"
                             :with-header="false"
                             :direction="direction" size="40%" :destroy-on-close="true">
                    <div class="addMusicArea" v-if="store.state.userMusicList.length > 0 && store.state.Cookies !== '' && store.state.Cookies !== undefined">
                      <el-scrollbar>
                        <div class="addMusicArea_layout">
                          <div class="addMusicList"
                               @click="addMusicListButton"
                               @touchstart="addMusicListTouchstart()"
                               @touchend="addMusicListTouchend()">
                            <div class="addMusicList_img">

                            </div>
                            <div class="addMusicAreaItem_text">
                              <p>新增歌单</p>
                            </div>
                          </div>
                          <div v-for="(item,index) in store.state.userMusicList" :key="index"
                               @click="addMusicToUserMusicList(item.id)"
                               @touchstart="addMusicTouchstart(index)"
                               @touchend="addMusicTouchend(index)"
                               :id="'addMusicAreaItem'+index"
                               class="addMusicAreaItem">
                            <div class="addMusicAreaItem_img">
                              <img :src="item.coverImgUrl" alt="?">
                            </div>
                            <div class="addMusicAreaItem_text">
                              <p>{{item.name}}</p>
                              <p>{{item.trackCount+'首'}}</p>
                            </div>
                          </div>
                        </div>
                      </el-scrollbar>
                    </div>
                    <div v-else class="addMusicArea_noData"><span>你都没有登陆诶，哪来的歌单</span></div>
                  </el-drawer>
                  <el-drawer v-model="addMusicList"
                             ref="addMusicListDrawer"
                             title="标题"
                             :with-header="false"
                             :direction="direction" size="25%" :destroy-on-close="true">
                    <div class="addMusicListAreaLayout">
                      <div class="addMusicListArea">
                        <el-form :model="form"
                                 size="large"
                                 :rules="rules"
                                 status-icon ref="formRef">
                          <el-form-item prop="name">
                            <input
                                type="text"
                                name="name"
                                class="name"
                                placeholder="请输入歌单名称" v-model="form.name">
                          </el-form-item>
                        </el-form>
                      </div>
                      <div class="btnArea">
                        <button class="btn" @click="createAddMusicList"><span>创建</span></button>
                      </div>
                    </div>
                  </el-drawer>
                </div>
              </el-scrollbar>
            </div>
          </div>
      </el-scrollbar>
    </div>
  </div>
  <div v-else v-loading="ref('')" ></div>
</template>

<script setup>
import {Back,MoreFilled,ArrowRight,Download,Star,Share,VideoCamera,StarFilled,CirclePlus} from '@element-plus/icons-vue'
import {useRoute} from "vue-router";
import {getArtistFanCount, getArtistInfos, getArtistDetail, getArtistAllSong} from "../request/api/artistInfos.js";
import {onMounted,ref,reactive} from "vue";
import {ElLoading} from "element-plus";
import {getMusicSearched} from "../request/api/musicSearch.js";
import {downloadMusic, getMv} from "../request/api/musicList.js";
import axios from "axios";
import {addMusicToList, createMusicList} from "../request/api/userMusicList.js";
const route = useRoute()
let artistID = route.query.id
let artistInfosData = reactive({
  data:[],
  flag:false
})
let txtData = ref('')
let artistDetailDate = reactive({
  name:'',
  transNames:'',
  identify:'', //不用解析
  sex:'', //不用解析
  birthday:'',
  country:'',
  school:'',

})
let FanCount = ref(0)
let scrollbar = ref()
let isTop = ref(true)
let isLoadingComments = ref(false)
let blockInfer = ref(false)
let songInfos = ref([])
let MvUrl = ref('')
let isMvShow = ref(false)
let MvDrawer = ref()
const isMoreOptionShow = ref(false)
const direction = ref('btt')
let songListIndex = ref(0)
let songsOptionDrawer = ref()
let isDownLoad = ref(false)
let isDownLoadDialog = ref()
let songCount = ref(0)
let isLiked = ref(false)
let addMusic = ref(false)
let addMusicDrawer = ref()
let addMusicList = ref(false)
let addMusicListDrawer = ref()
let form = ref({})
let formRef = ref()
let rules = ref({
  name:[
    { required: true, message: '请输入歌单名', trigger:'blur'},
  ],
})
let requestData = {
  order:'',
  limit:20,
  offset:1,
  page:0
}

//点击更多按钮
const moreButton = (index) => {
  isMoreOptionShow.value = true
  songListIndex.value = index
  isLikedFun()
}
const addButton = () => {
  isMoreOptionShow.value = false
  addMusic.value = true
}
const addMusicListButton = () => {
  addMusicList.value = true
}
//滚动获取数据
const loadingSongsData = async (scroll) => {
  let sightArea = $('.artistSongListArea')
  let contentArea = $('.artistSongListArea .el-scrollbar__view')
  let index = (contentArea.length-1)
  let scrollHeight = contentArea[index].scrollHeight
  let infer = (scrollHeight-scroll.scrollTop)-sightArea[0].scrollHeight
  //异步先初始好值
  let init = function () {
    sightArea = $('.artistSongListArea')
    contentArea = $('.artistSongListArea .el-scrollbar__view')
    index = (contentArea.length-1)
    scrollHeight = contentArea[index].scrollHeight
    infer = (scrollHeight-scroll.scrollTop)-sightArea[0].scrollHeight
  }
  await init()


  //更新滚动状态
  if (scroll.scrollTop>0){
    isTop.value = false
  }else{
    isTop.value = true
  }


  if (infer <= 0 && blockInfer.value===false){
    isLoadingComments.value = true
    blockInfer.value = true
  }
  if(infer <= 0 && isLoadingComments.value){
    isLoadingComments.value = false
    const loadingInstance = ElLoading.service({
      target:document.getElementById('artistSongListArea') ,
      text:"数据加载中",
      background:"rgba(52,52,52,0.3)",
    })
    requestData.page = requestData.page + 1
    requestData.offset = requestData.page * requestData.limit
    let res = await getArtistAllSong(artistID,'hot',requestData.limit,requestData.offset)
    console.log(res)
    if(res.data.total > requestData.offset){
      res.data.songs.forEach(item => {
        songInfos.value.push(item)
      })

    }else {
      alert("没有歌曲了")
    }
    blockInfer.value = false
    loadingInstance.close()
  }
}
//更新store中的播放列表
const playMusic = (newSong) => {
  store.commit('addMusicToPlayListHead',newSong)
  store.commit('updateIsPlaying',true)
}
//选择音乐并播放时
const selectMusic = async (e) => {
  if(e!=null){
    playMusic(e)
  }
}
//观看mv
const watchMv = async (id) => {
  let myAudio = document.getElementById('mp')
  myAudio.pause()
  isMvShow.value = true
  let res = await getMv(id)
  console.log(res)
  MvUrl.value = res.data.data.url
}
//关闭Mv
const closeMv = () => {
  let myAudio = document.getElementById('mp')
  if (store.state.isPlaying === true){
    myAudio.play()
  }
  MvDrawer.value.handleClose()
}
//添加至下一首播放
const addNextSong = () => {
  songInfos.value.forEach((item,index) =>{
    if(songListIndex.value === index){
      store.commit('addMusicToPlayListNext',item)
      songsOptionDrawer.value.handleClose()
    }
  })
}
//下载音乐
const downloadThisMusic = async () =>{
  isDownLoadDialog.value.handleClose()
  songsOptionDrawer.value.handleClose()
  let musicName = songInfos.value[songListIndex.value].name
  let musicArtist = songInfos.value[songListIndex.value].ar[0].name
  let res = await downloadMusic(songInfos.value[songListIndex.value].id)
  // await downloadMp3(res.data.data[0].url)
  let res2 = (await axios({method:'get',url:res.data.data[0].url,responseType:'blob'}))
  // console.log(res,res2)
  if (res2.headers["content-type"] === "audio/mpeg; charset=UTF-8" ||
      "audio/mpeg") {
    // const blob = new Blob([(res2.data)], {type: "audio/mpeg"})
    // console.log(res2.data)
    const blobUrl = URL.createObjectURL(res2.data)
    let link = document.createElement('a')
    document.body.appendChild(link)
    link.style.display = 'none'
    link.href = blobUrl
    // 设置a标签的下载属性，设置文件名及格式，后缀名最好让后端在数据格式中返回
    link.download = musicName.concat('-').concat(musicArtist).concat('.mp3')
    // 自触发click事件
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl);
    // saveAs(res.data.data[0].url,"music2.mp3")  //废弃的方法
  }
}
const downloadThisMusicMobile = async () => {
  isDownLoadDialog.value.handleClose()
  songsOptionDrawer.value.handleClose()
  let musicName = songInfos.value[songListIndex.value].name
  let musicArtist = songInfos.value[songListIndex.value].ar[0].name
  let res = await downloadMusic(songInfos.value[songListIndex.value].id)
  //资源地址
  let picurl = res.data.data[0].url
// 参数
  let data = {
    //自定义下载文件路径
    filename: "file://storage/emulated/0/X-MusicDownLoad/".concat(musicName).concat('-').concat(musicArtist).concat('.mp3'),
    //默认为GET请求。注意这里需大写“GET”、“POST”
    method: 'GET',
  }
  let dtask = plus.downloader.createDownload( picurl, data, (d, status)=>{
        // 下载完成
        if (status === 200) {
          // this.$toast( '导出成功' );
          // 将本地URL路径转换成平台绝对路径
          plus.io.convertLocalFileSystemURL(d.filename);
          plus.nativeUI.toast("下载成功",{duration:'short'})
        } else {
          dtask.clear(); //清除下载任务
          // this.$toast( '导出失败' );
          plus.nativeUI.toast("下载失败",{duration:'short'})
        }
      }
  );
// 开始下载
  dtask.start();
}
//初始判断该歌曲是否是喜欢歌曲
const isLikedFun = () => {
  if(localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined){
    isLiked.value = false
  }else {
    for (let i = 0; i < store.state.userFavoriteSongList.length; i++){
      if (store.state.userFavoriteSongList[i].id === songInfos.value[songListIndex.value].id){
        isLiked.value = true
        break
      }
      else {
        isLiked.value = false
      }
    }
  }
}
//添加至我喜欢的音乐
const addMusicToMyFavorite = async () => {
  if(localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined){
    console.log("请先登录")
    plus.nativeUI.toast("请先登录",{duration:'short'})
  }else {
    isLiked.value = true
    let res = await addMusicToList('add',
        store.state.userFavoriteMusicListId,
        songInfos.value[songListIndex.value].id,
        store.state.Cookies)
    console.log(res)
    await store.commit('addMusicToUserFavoriteSongListHead',songInfos.value[songListIndex.value])
    // store.commit('updateCookies',res.data.cookie)
    if(res.data.body.code === 200){
      console.log("添加成功")
      plus.nativeUI.toast("添加成功",{duration:'short'})
    }
    else {
      console.log("添加失败或者歌曲已存在")
      plus.nativeUI.toast("添加失败或者歌曲已存在",{duration:'short'})
    }
  }
}
//从我喜欢的音乐中删去
const deleteFromMyFavorite = async () => {
  if(localStorage.getItem('cookie') === null || store.state.Cookies === '' || store.state.Cookies === undefined){
    console.log("请先登录")
    plus.nativeUI.toast("请先登录",{duration:'short'})
  }else {
    isLiked.value = false
    let res = await addMusicToList('del',
        store.state.userFavoriteMusicListId,
        songInfos.value[songListIndex.value].id,
        store.state.Cookies)
    console.log(res)
    await store.commit('deleteFromUserFavoriteSongListById',songInfos.value[songListIndex.value])
    if(res.data.body.code === 200){
      console.log("删除成功")
      plus.nativeUI.toast("删除成功",{duration:'short'})
    }
    else {
      console.log("删除失败或者歌曲未存在")
      plus.nativeUI.toast("删除失败或者歌曲未存在",{duration:'short'})
    }
  }

}
//添加音乐至歌单
const addMusicToUserMusicList = async (id) => {
  let res = await addMusicToList('add',id,songInfos.value[songListIndex.value].id,store.state.Cookies)
  console.log(res)
  switch (res.data.body.code) {
    case 502:{
      console.log(res.data.body.message)
    }break;
    case 200:{
      console.log("已添加至本歌单")
      //更新用户歌单信息
      await store.dispatch('getUserMusicList',store.state.userInfos.id)
      addMusic.value = false
    }break;
  }
}


//歌手歌曲获取
const artistSong = async () => {
  let res = await getArtistAllSong(artistID,'hot',20,0)
  songCount.value = res.data.total
  songInfos.value = res.data.songs
  console.log(res)
}
//歌手简介信息文本解析
const txtParse = () => {
  let temp = txtData.value.split('\n')
  console.log(temp)
  temp.forEach(item => {
    let temp2 = item.split('：')
    let name = new RegExp("中文名")
    let transNames = new RegExp('外文名')
    let birthday = new RegExp('出生日期')
    let country = new RegExp('出生地')
    let school = new RegExp('毕业院校')
    if (name.test(temp2[0])){
      // console.log(temp2[1])
      artistDetailDate.name = temp2[1]
    }
    if (transNames.test(temp2[0])){
      // console.log(temp2[1])
      artistDetailDate.transNames = temp2[1]
    }
    if (birthday.test(temp2[0])){
      // console.log(temp2[1])
      artistDetailDate.birthday = temp2[1]
    }
    if (country.test(temp2[0])){
      // console.log(temp2[1])
      artistDetailDate.country = temp2[1]
    }
    if (school.test(temp2[0])){
      // console.log(temp2[1])
      artistDetailDate.school = temp2[1]
    }
  })
  artistDetailDate.identify = artistInfosData.data.identify.imageDesc
}
const ArtistDetail = async ()=>{
  let res = await getArtistDetail(artistID)
  if (res.data.introduction[0].txt !==null){
    console.log(res)
    txtData.value = res.data.introduction[0].txt
    txtParse()
  }
}
//歌手粉丝数量
const artistFanCount = async () => {
  let res = await getArtistFanCount(artistID)
  console.log(res)
  FanCount.value = changeCount(res.data.data.fansCnt)
}
//歌手信息
const artistInfos = async () => {
  let res = await getArtistInfos(artistID)
  artistInfosData.data = res.data.data
  artistInfosData.flag = true
  console.log(res)
}
//展开歌手简介
const unfold = () => {
  $('.briefDesc').toggleClass('active_briefDesc')
}
//修改播放量
const changeCount = (num) => {
  if(num >= 100000000){
    return (num/100000000).toFixed(1) + '亿'
  }else if(num >= 10000){
    return (num/10000).toFixed(1) + '万'
  }else {
    return num
  }
}
const createAddMusicList= async function (){
  await formRef.value.validate(async (valid) => {
    console.log(valid)
    if (valid){
      const loadingInstance = ElLoading.service({
        target:document.getElementById('myMusicList') ,
        text:"正在创建歌单",
        background:"rgba(231,231,231,0.35)",
      })
      let res = await createMusicList(form.value.name,store.state.Cookies)
      console.log(res)
      if(res.data.code===200){  //登录成功
        //获取用户歌单信息
        await store.dispatch('getUserMusicList',store.state.userInfos.id)
        loadingInstance.close()
        addMusicListDrawer.value.handleClose()
      }else {
        // alert("要么是网络拥挤，要么是密码错了")
        loadingInstance.close()
      }
    }else {
      console.log("不合法输入！")
    }
  })
}
onMounted(async ()=>{
  await artistInfos()
  await artistFanCount()
  // await ArtistDetail()  //接口就是一坨屎！！！
  await artistSong()
})
</script>
<script>
import $ from "jquery";
import {ElLoading} from "element-plus";
import {createMusicList} from "../request/api/userMusicList.js";
import store from "../store/index.js";

export default {
  methods:{
    songsItemTouchstart(index){
      $('#songsItem'+index).toggleClass('activeSongsItem')
    },
    songsItemTouchend(index){
      $('#songsItem'+index).toggleClass('activeSongsItem')
    },
    mvAreaButtonTouchstart(){
      $('.mvArea_button').toggleClass('activeMvArea_button')
    },
    mvAreaButtonTouchend(){
      $('.mvArea_button').toggleClass('activeMvArea_button')
    },
    songsOptionTouchstart(index){
      $('#songsOption'+index).toggleClass('activeSongsOption')
    },
    songsOptionTouchend(index){
      $('#songsOption'+index).toggleClass('activeSongsOption')
    },
    addMusicTouchstart(index){
      $('#addMusicAreaItem'+index).toggleClass('activeMusicAreaItem')
    },
    addMusicTouchend(index){
      $('#addMusicAreaItem'+index).toggleClass('activeMusicAreaItem')
    },
    addMusicListTouchstart(){
      $('.addMusicList').toggleClass('activeAddMusicList')
    },
    addMusicListTouchend(){
      $('.addMusicList').toggleClass('activeAddMusicList')
    }
  }
}
</script>
<style scoped>

.artistContent>>>.el-scrollbar__bar.is-horizontal{
  height: 0;
}
.artistContent>>>.el-scrollbar__bar.is-vertical{
  width: 0;
}
.artistBgPic {
  z-index: -2;
  position: absolute;
  top: -6rem;
  left: 0;
}
.artistBgPic img {
  width: 100%;
  height: 100%;
  /*border-radius: 1.5rem;*/
}
.blur {
  z-index: -1;
  position: absolute;
  top: -6rem;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.15);
}
.artistInfosArea_top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3rem;
  color: #f9f9f9;
  /*background-color: #f56c6c;*/

}
.artistInfosArea_top .el-icon{
  font-size: 1.8rem;
}
.artistInfosArea_top .left {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left:.5rem;
}
.artistInfosArea_top .left span {
  margin-left:.5rem;
}
.artistInfosArea_top .right {
  margin-right: .5rem;
}
.artistInfosArea{
  position: relative;
  width: 100%;
  height: calc(100vh - 2rem);
  /*!*color: #2c2c2c;*!*/
}
.artistInfosArea>>>.el-scrollbar{
  height: calc(100vh - 20rem);
  background-color: #f3f4f6;
  border-radius: 1rem;
}
.artistContent {
  /*margin-top: 5rem;*/
  /*padding-top: 5rem;*/
  width: 100%;
  /*background-color: #535bf2;*/
  overflow: hidden;
}
.artistContent_layout {
  display: flex;
  flex-direction: column;
}
.artistContent_top{
  width: 90%;
  height: 6rem;
  margin:  auto;
  background-color: #fdfdfd;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}
.artistContent_top .artistName {
  font-weight: bold;
  font-size: 1.2rem;
}
.artistContent_top .artistFanCount {
  color: #6c6c6c;
  font-size: .8rem;
}
.artistContent_top .artistTag {
  color: #6c6c6c;
  font-size: .8rem;
}
.artistInfosContent{
  width: 90%;
  /*height: 20rem;*/
  /*height: auto;*/
  margin: 1rem auto;
  background-color: #fdfdfd;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  /*justify-content: space-around;*/
}
.artistInfosContent_title {
  font-size: 1rem;
  font-weight: bold;
  margin-left: 1rem;
  margin-top: .5rem;
}
.artistInfosContent_body{
  margin-left: 1rem;
  margin-right: 1rem;
}
.artistInfosContent_body ul{
  /*overflow: hidden;*/
  /*clear: both;*/
}
.artistInfosContent_body li {
  margin: .8rem 0;
  color: #6c6c6c;
  font-size: .7rem;
}
.artistInfosContent_body .briefDesc{
  width: 100%;
  height: 5rem;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: .7rem;
}
.active_briefDesc{
  height: auto !important;
  display: block !important;
  overflow: visible !important;
}


.artistSongListArea {
  width: 90%;
  height: 20rem;
  /*height: auto;*/
  margin: 1rem auto;
  /*background-color: #fdfdfd;*/
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
}
.artistSongListArea_title{
  width: 100%;
  height: 2rem;
  background-color: #fdfdfd;
  line-height: 2rem;
}
.artistSongListArea_title span{
  margin-left: 1rem;
  margin-top: .5rem;
  font-size: 1rem;
  font-weight: bold;
}
.artistSongListArea .artistSongListLayout{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /*border-radius: 1rem;*/
  background-color: #fdfdfd;
}
.activeSongsItem {
  background-color: #e0e0e0;
}
.artistSongListArea .artistSongListLayout .songsItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5rem;
  /*background-color: #79bbff;*/
  /*border-top: rgba(44, 44, 44, 0.15) 1px solid;*/
  /*padding: 0 .5rem;*/
}
.artistSongListArea .artistSongListLayout .songsItem:first-child{
  border-top: #2c2c2c 0 solid;
}
.artistSongListArea .artistSongListLayout .songsItem .songsInfos{
  width: 70%;
  color: #2c2c2c;
}
.artistSongListArea .artistSongListLayout .songsItem .songsInfos .name{
  font-size: .8rem;
  font-weight: bold;
  padding: .2rem 1rem 0;
}
.artistSongListArea .artistSongListLayout .songsItem .songsInfos .artists{
  padding: .6rem 1rem 0;
  font-size: .6rem;
}
.artistSongListArea .artistSongListLayout .songsItem .songsInfos .artists .artistsName{
  margin-right: .5rem;
}
.artistSongListArea .artistSongListLayout .songsItem .songsOption{
  color: #2c2c2c;
}
.artistSongListArea .artistSongListLayout .songsItem .songsOption .mv,
.artistSongListArea .artistSongListLayout .songsItem .songsOption .moreOption{
  font-size: 1.5rem;
  margin-right: .5rem;
}
.artistSongListLayout>>>.el-drawer.btt, .el-drawer.ttb{
  width: 90%;
  left: 50%;
  top:60%;
  transform: translate(-50%,-50%);
  border-radius: 1rem;
}
.artistSongListLayout>>>.el-drawer{
  background-color: rgba(44, 44, 44, 0.85) !important;
}
.artistSongListLayout>>>.el-drawer__body{
  padding: 0 !important;
  background-color: #f3f4f6;
}
.artistSongListLayout>>>.el-scrollbar__bar.is-horizontal{
  height: 0;
}
.artistSongListLayout>>>.el-scrollbar__bar.is-vertical{
  width: 0;
}
.songsOptionArea {
  width: 100%;
  height: 100%;
  /*background-color: #eebe77;*/
}
.songsOptionArea ul{

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.songsOptionArea ul li{
  display: flex;
  /*justify-content: center;*/
  align-items: center;
  width: 100%;
  height: 4.2rem;
  font-size: 1rem;
  color: #2c2c2c;
  /*background-color: #343434;*/
}
.songsOptionArea ul li:last-child{
  height: 4.2rem;
}
.songsOptionArea ul li .el-icon{
  margin-left: 1rem;
  margin-right: 1rem;
  font-size: 1.5rem;
}
.activeSongsOption{
  background-color: #dadada;
}
.downloadMusicArea{
  width: 100%;
  height: 100%;
  background-color: #343434;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  color: #f9f9f9;
}
.downloadMusicArea .downloadMusicArea_title {
  width: 100%;
  height: 3rem;
  line-height: 3rem;
  padding-left: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
.downloadMusicArea .downloadMusicArea_body {
  width: 100%;
  padding-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.PC {
  text-align: center;
  margin-right: 3rem;
}
.Mobile {
  text-align: center;
  margin-left: 3rem;
}
.PC p,
.Mobile p{
  font-size: 1rem;
}

.mvAreaLayout>>>.el-drawer.btt, .el-drawer.ttb{
  width: 100%;
  left: 0;
  top:0;
  transform: translate(0,0);
  border-radius: 1rem;
}
.mvAreaLayout>>>.el-drawer{
  background-color: rgba(44, 44, 44, 0) !important;
}
.mvAreaLayout>>>.el-drawer__body{
  padding: 0 !important;
}
.mvAreaLayout{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mvArea{
  position: relative;
  width: 100%;
  height:100%;
  display: flex;
  justify-content: center;
  padding-top: 4rem;
  /*background-color: #eebe77;*/
}
.mvArea_button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: 4rem;
  height: 3rem;
  border-radius: 1rem;
  color: #f9f9f9;
  font-size: .8rem;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #2c2c2c;
}
.activeMvArea_button{
  background-color: #6c6c6c;
}


.addMusicArea>>>.el-scrollbar{
  height: 100%;
  background-color: #f3f4f6;
}
.addMusicArea {
  width: 100%;
  height: 100%;
}
.addMusicArea_layout {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.addMusicAreaItem {
  width: 100%;
  height: 3.6rem;
  display: flex;
  align-items: center;
  margin: .2rem 0;
}
.addMusicAreaItem:first-child {
  margin-top: .5rem;
}
.addMusicAreaItem_img img{
  height: 3rem;
  width: 3rem;
  margin-left: .5rem;
  border-radius: 1rem;
}
.addMusicAreaItem_text {
  margin-left: 1rem;
  color: #2c2c2c;
  font-size: .8rem;
}
.activeMusicAreaItem{
  background-color: #dcdcdc;
}


.addMusicList {
  width: 100%;
  height: 3.6rem;
  display: flex;
  align-items: center;
  margin: .2rem 0;
}
.addMusicList_img{
  height: 3rem;
  width: 3rem;
  margin-left: .5rem;
  border-radius: 1rem;
  background-image: url("./src/assets/img/addButton.jpeg");
  background-repeat: no-repeat;
  background-size: cover;
}
.addMusicAreaItem {
  width: 100%;
  height: 3.6rem;
  display: flex;
  align-items: center;
  margin: .2rem 0;
}
.addMusicAreaItem:first-child {
  margin-top: .5rem;
}
.addMusicAreaItem_img img{
  height: 3rem;
  width: 3rem;
  margin-left: .5rem;
  border-radius: 1rem;
}
.addMusicAreaItem_text {
  margin-left: 1rem;
  color: #2c2c2c;
  font-size: .8rem;
}
.activeMusicAreaItem{
  background-color: #dcdcdc;
}


.addMusicListAreaLayout {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.addMusicListArea input {
  width: 18rem;
  height: 3rem;
  text-indent: 1rem;
  border: none;
  outline: none;
  border-bottom: #ddd solid 1px;
  border-radius: 1rem;
  margin: .2rem 0;
}
.addMusicListArea>>>.el-form-item__error{
  left: 1rem;
}

.btnArea button {
  width: 5rem;
  height: 2rem;
  border:none;
  border-radius: 1rem;
  background-color: #f56c6c;
  color: #f9f9f9;
  font-weight: bold;
  margin: 0 1rem;
}
</style>