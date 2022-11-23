<template>
  <footer>
    <div class="bottomControl w">
      <div class="left">
        <img class="avatar" v-lazy="left.imgUrl + '?param=55y55'" alt="无法显示" @click="changeCardState" />
        <div class="info">
          <div class="title">{{ left.name }}</div>
          <div class="singer">{{ left.singer }}</div>
        </div>
        <div class="download" v-show="left.name">
          <span class="iconfont icon-xiazai1"></span>
        </div>
      </div>

      <div class="center">
        <!-- 播放控件 -->
        <audio ref="audio" :src="playUrl" autoplay></audio>

        <div class="controlButtons">
          <!-- 顺序播放 -->
          <span class="iconfont icon-xunhuan" v-if="playOrder === 1"></span>
          <!-- 随机播放 -->
          <span class="iconfont icon-xunhuanbofang" v-if="playOrder === 2"></span>
          <!-- 单曲循环 -->
          <span class="iconfont icon-danquxunhuan" v-if="playOrder === 3"></span>

          <span class="iconfont icon-shangyishou" @click="prevMusic"></span>
          <span class="iconfont icon-bofang" v-if="!playState" @click="bofang"></span>
          <span class="iconfont icon-zanting" v-if="playState" @click="zanting"></span>
          <span class="iconfont icon-xiayishou" @click="nextMusic"></span>
          <!-- 喜欢歌曲 -->
          <span class="iconfont icon-xihuan red" v-if="isLikeSong" @click="disLike"></span>
          <span class="iconfont icon-xihuan1" v-if="!isLikeSong" @click="like"></span>
        </div>
        <div class="progressBarContainer">
          <span class="currentTime">{{ musicCurTime }}</span>
          <!-- 给滑块一个类class用来设置 宽度 -->
          <el-slider
            class="progressSlider"
            v-model="musicPercent"
            :show-tooltip="false"
            :disabled="sliderDisable"
            @change="changeMusicPercent"
          ></el-slider>
          <span class="totalTime">{{ musicTotalTime }}</span>
        </div>
      </div>

      <div class="right">
        <div class="volumeCotrol">
          <i class="iconfont icon-yinliang" @click="volumeOff"></i>

          <el-slider
            class="volumeSlider"
            v-model="volume"
            :max="1"
            :step="0.01"
            :min="0"
            :show-tooltip="false"
            @input="changeVolume"
          ></el-slider>
        </div>
        <div class="playList" @click="rightDrawer = !rightDrawer">
          <i class="iconfont icon-bofangliebiao"></i>
        </div>
        <el-tooltip placement="left-start">
          <div slot="content">个人邮箱:523300343@qq.com<br />本站为仿中仿网易云音乐学习项目</div>
          <a class="notice" href="javascript:;">仅供学习使用</a>
        </el-tooltip>
      </div>
    </div>

    <el-drawer
      :visible.sync="rightDrawer"
      :direction="rightDirection"
      custom-class="playList"
      :show-close="false"
    >
      <!-- 抽屉标题 -->
      <div class="drawerTitle" slot="title">共{{ playlist.length }}首</div>
      <!-- 抽屉内容 -->
      <template>
        <el-table
          :data="playlist"
          style="width: 100%"
          :show-header="false"
          highlight-current-row
          :row-style="rowStyle"
          @row-dblclick="playCurrentMusic"
        >
          <el-table-column prop="name" label="曲名" width="175"> </el-table-column>
          <el-table-column prop="ar" label="歌手" width="115"> </el-table-column>
          <el-table-column prop="dt" label="时长" width="80"> </el-table-column>
        </el-table>
      </template>
    </el-drawer>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'Footer',
  data() {
    return {
      s: 0, // 当前播放了多少秒
      ends: 0, // 总共多少秒
      musicCurTime: '00:00', // 当前播放了多长时间
      musicPercent: 0, // 音乐百分比进度
      musicTotalTime: '00:00', // 总共多长时间
      sliderDisable: true, // 进度条禁用状态

      playOrder: 1, // 播放顺序 1(顺序播放) 2(随机播放) 3(单曲循环)
      playState: false, // 播放状态 true 播放   false 暂停
      volume: 0.2, // 默认音量大小

      playlistId: '', // 播放列表ID,用于判断改不改播放列表
      playlist: [], // 播放列表
      playUrl: '', // 正在播放音乐的路径
      left: {
        imgUrl: require('@/assets/avatar.jpg'), // 封面
        name: '', // 歌名
        singer: '', // 歌手
      },
      rightDrawer: false, // 右边抽屉状态
      rightDirection: 'rtl', // 右边抽屉方向

      isLikeSong: false, // 是否为喜欢歌曲
    }
  },
  computed: {
    // 映射music仓库
    ...mapState({
      music: (state) => {
        return state.music
      },
    }),

    // 当前播放音乐id
    playSongId() {
      return this.music.playSongId
    },
  },
  methods: {
    // 双击行 选中，播放回调
    playCurrentMusic(row, cloumn) {
      // 如果有视频播放地址 则可能在播放视频 此处暂停视频
      if (this.$store.state.video.videoUrl) {
        console.log('暂停视频')
        this.$bus.$emit('pauseVideo')
      }

      // 如果有MV播放地址 则可能在播放MV 暂停MV
      if (this.$store.state.video.mvUrl) {
        // 监测到有MV路径
        console.log('暂停MV')
        this.$bus.$emit('pauseMv')
      }

      if (this.music.playSongId === row.id) return
      this.music.playSongId = row.id // 改变vuex中的当前播放音乐id
      this.$bus.$emit('playMusic') // 播放音乐
    },

    // 行样式
    rowStyle({ row, rowIndex }) {
      if (this.music.playSongId === row.id) {
        return {
          color: '#ec4141',
        }
      }
    },

    // 改变播放列表
    changePlaylisy(newPlaylist, playlistId) {
      // 如果传过来的播放列表id 与 之前的不同
      if (this.playlistId !== playlistId) {
        console.log('更改播放列表')
        this.playlistId = playlistId // 保存新的播放列表id
        /*
          不能直接把收到的播放列表直接赋值给this.playlist
          因为这里收到的newPlaylist保存的是地址值，如果要给播放列表里面添加一首歌的话，
          由于地址值是一样的，那传过来的这个newPlaylist指向的那个对象也会跟着改变
        */
        // 直接深拷贝一份，再赋值给playlist
        let cloneNewPlaylist = _.cloneDeep(newPlaylist)
        this.music.playlist = cloneNewPlaylist // 仓库中保存一份
        this.playlist = this.music.playlist
        // 注意仓库中的播放列表(music.playlist)与组件中的播放列表(playlist)地址值是一样的
      }
    },

    // 播放歌曲
    async playMusic() {
      try {
        this.sliderDisable = false // 启用进度条拖动
        this.playUrl = '' // 清空播放路径
        this.s = 0 // 秒数归零
        this.musicPercent = 0 // 进度归零
        this.musicCurTime = '00:00' // 时间归零
        clearInterval(this.nowTimer) // 清除上次的两个定时器
        clearInterval(this.percentTimer)

        await this.$store.dispatch('getMusicUrl') // 获取音乐url
        this.playUrl = this.music.playSongUrl // 改变播放控件url

        this.playState = true // 改变播放状态 为 播放

        // 到播放列表找到 这首歌的封面、歌名、歌手、歌曲时长
        for (var i = 0; i < this.music.playlist.length; i++) {
          let item = this.music.playlist[i]
          if (this.music.playSongId == item.id) {
            this.left.imgUrl = item.al.picUrl // 封面
            this.left.name = item.name // 歌名
            this.left.singer = item.ar // 歌手
            this.musicTotalTime = item.dt //歌曲时长
            this.music.playSongIndex = i // 保存索引
            break // 不用再循环
          }
        }

        // 保存总秒数
        this.ends = this.musicTotalTime.slice(0, 2) * 60 + Number(this.musicTotalTime.slice(3))

        // 如果不是免费歌曲
        if (this.music.playSongFreeInfo !== null) {
          let freeTime = this.music.playSongFreeInfo.end - this.music.playSongFreeInfo.start // 试听时长 s
          this.ends = freeTime // 保存免费时间时长
          let m = parseInt(freeTime / 60) // 加工格式 mm:ss
          m = m < 10 ? '0' + m : m
          let s = freeTime % 60
          s = s < 10 ? '0' + s : s
          this.musicTotalTime = m + ':' + s // 给页面渲染

          this.$message({
            type: 'warning',
            message: `这不是免费歌曲,试听时长: ${freeTime}s`,
          })

          // 开一个定时器监听播放时长，到达试听时长就 切换下一首
          this.noFree = setInterval(() => {
            if (this.s >= this.ends) {
              //这里不能用 >=freeTime 会形成闭包出问题
              clearInterval(this.noFree)
              this.music.playSongFreeInfo = null // 清除上首歌的免费时长信息
              this.nextMusic() // 下一首
            }
          }, 10)
        }

        // 没有权限听某首歌 后台不提供音频url
        if (!this.music.playSongUrl) {
          // 没有播放路径
          this.$message({
            type: 'warning',
            message: '您没有权限播放这首歌曲,即将播放下一首歌曲',
          })

          setTimeout(() => {
            let index = this.music.playSongIndex
            if (index + 1 == this.playlist.length) {
              // 如果播放的是最后一首歌
              index = -1 // 使下面的 -1 + 1 = 0
            }
            this.music.playSongId = this.playlist[index + 1].id // 改变音乐id
            this.$bus.$emit('playMusic') // 播放歌曲
          }, 1000)

          return
        }

        // 开启定时器
        this.musicTimers()
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 进度条定时器 和 播放时长定时器
    musicTimers() {
      // 开启当前播放时间定时器(nowTimer)
      this.nowTimer = setInterval(() => {
        this.s += 0.25
        let s = parseInt(this.s / 60)
        s = s < 10 ? '0' + s : s
        let m = parseInt(this.s % 60)
        m = m < 10 ? '0' + m : m

        this.musicCurTime = s + ':' + m

        if (this.s >= this.ends) {
          this.s = 0 // 清空s
          // 如果播放时长等于总时长
          clearInterval(this.nowTimer) // 清除定时器
        }
      }, 250)

      // 开启进度条定时器(percentTimer)
      this.percentTimer = setInterval(() => {
        this.musicPercent += 0.1

        if (this.musicPercent >= 100) {
          this.playState = false // 改变播放状态 为 暂停
          clearInterval(this.percentTimer) // 如果进度为100则清除定时器
          setTimeout(() => {
            console.log('播放下一首歌曲')
            this.music.playSongFreeInfo = null

            let index
            if (this.music.playSongIndex + 1 >= this.playlist.length) {
              // 播放的是歌单的最后一首歌
              index = 0
            } else {
              index = this.music.playSongIndex + 1
            }

            this.music.playSongId = this.playlist[index].id // 改变成下一首音乐的id
            this.$bus.$emit('playMusic') // 播放音乐
          }, 800)
        }
      }, (this.ends * 1000) / 1000) // (this.ends * 1000) / 100 / 10
    },

    // 改变播放进度
    changeMusicPercent(percent) {
      this.zanting() // 暂停

      // 先计算出1%是多少秒  percent百分比进度
      let step = this.ends / 100

      this.s = percent * step
      this.$refs.audio.currentTime = this.s // 改变播放控件的播放进度
      // 告诉卡片当前时间
      this.$bus.$emit('tellCardCurTime', this.s)

      let s = parseInt(this.s / 60)
      s = s < 10 ? '0' + s : s
      let m = parseInt(this.s % 60)
      m = m < 10 ? '0' + m : m
      this.musicCurTime = s + ':' + m // 显示拖动完毕后的时间

      this.bofang() // 播放
    },

    // 上一首
    prevMusic() {
      if (!this.playlist.length) return // 播放列表没有歌曲

      clearInterval(this.noFree) // 避免从不免费歌曲切换过来，定时器还在run
      this.zanting() // 暂停

      // 如果播放列表只有一首歌
      if (this.music.playlist.length == 1) {
        this.$message({
          type: 'warning',
          message: '没有上一首',
        })
        return
      }

      if (this.music.playSongIndex - 1 >= 0) {
        this.music.playSongIndex--
      } else {
        this.music.playSongIndex = this.playlist.length - 1
      }
      this.music.playSongId = this.playlist[this.music.playSongIndex].id

      this.$bus.$emit('playMusic') // 播放音乐
    },

    // 下一首
    nextMusic() {
      if (!this.playlist.length) return // 播放列表没有歌曲

      clearInterval(this.noFree) // 避免从不免费歌曲切换过来，定时器还在run
      this.zanting() // 暂停

      // 如果播放列表只有一首歌
      if (this.music.playlist.length == 1) {
        this.$message({
          type: 'warning',
          message: '没有下一首',
        })
        return
      }

      if (this.music.playSongIndex + 1 >= this.playlist.length) {
        this.music.playSongIndex = 0
      } else {
        this.music.playSongIndex++
      }
      this.music.playSongId = this.playlist[this.music.playSongIndex].id

      this.$bus.$emit('playMusic') // 播放音乐
    },

    // 播放
    bofang() {
      if (!this.playlist.length) return // 播放列表没有歌曲

      // 如果有视频播放地址 则可能在播放视频 此处暂停视频
      if (this.$store.state.video.videoUrl) {
        console.log('暂停视频')
        this.$bus.$emit('pauseVideo')
      }

      // 如果有MV播放地址 则可能在播放MV 暂停MV
      if (this.$store.state.video.mvUrl) {
        // 监测到有MV路径
        console.log('暂停MV')
        this.$bus.$emit('pauseMv')
      }

      if (this.musicPercent == 100) {
        // 避免播放完最后一首歌后 再点击播放进度条不还原
        this.musicPercent = 0
      }
      this.$refs.audio.play() // 使音频开始播放
      this.playState = true // 改变播放状态图标

      // 开启定时器
      this.musicTimers()

      // 告诉卡片开始播放
      this.$bus.$emit('tellCardPlay')
    },

    // 暂停
    zanting() {
      this.$refs.audio.pause() // 使音频暂停播放
      this.playState = false // 改变播放状态图标

      // 暂停定时器
      clearInterval(this.nowTimer)
      clearInterval(this.percentTimer)

      // 告诉卡片暂停播放
      this.$bus.$emit('tellCardPause')
    },

    // 音量
    changeVolume(volume) {
      // 0-1 步长0.01
      this.volume = volume // 修改音量大小
      this.$refs.audio.volume = this.volume
    },

    // 静音
    volumeOff() {
      if (this.volume) {
        // 如果有声音
        this.oldVolume = this.volume // 保存原来的音量
        this.volume = 0 // 静音
      } else {
        this.volume = this.oldVolume
      }
    },

    // 添加一首歌到播放列表 并播放这首歌 (搜索单曲点击播放时)
    addSong(song) {
      // 如果正在播放这首歌，不做任何事
      if (this.music.playSongId === song.id) {
        console.log('正在播放这首歌')
        return
      }

      // 可能搜索播放列表已经有的单曲，如果播放列表有就直接修改播放音乐id，不用再将搜索到的单曲加进播放列表
      let exist = false
      this.playlist.forEach((item) => {
        if (item.id == song.id) {
          exist = true
        }
      })

      console.log('存在状态:', exist)

      // exist --- 该歌曲是否存在于播放列表中
      if (exist) {
        console.log('播放列表有这首歌，自动定位到这首歌的位置。')
      } else {
        // 如果不存在就在当前播放位置 加一首歌进去
        let index = this.music.playSongIndex // 可能播放列表没有歌曲 就为0
        // this.playlist.splice(index + 1, 0, song) // 在当前播放的歌曲索引后面加一首歌
        this.music.playlist.splice(index + 1, 0, song) // 仓库中也要放一份
      }

      this.music.playSongId = song.id // 修改播放歌曲id
      this.$bus.$emit('playMusic') // 播放歌曲
    },

    // 改变音乐卡片状态
    changeCardState() {
      this.$bus.$emit('musicDetailCardState')
    },

    // 获取用户所有喜欢歌曲id列表
    async getUserLikeSongList() {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
      try {
        console.log('获取用户所有喜欢歌曲id列表')
        let uid = localStorage.getItem('userId')
        await this.$store.dispatch('reqLikeSongList', uid)
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        })
      }
    },

    // 添加喜欢音乐
    like: _.throttle(async function () {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
      try {
        // 整理参数
        let obj = {}
        obj.id = this.playSongId // 音乐id
        obj.like = true // 喜欢

        await this.$store.dispatch('likeSong', obj)
        this.isLikeSong = true // 图标变更
        await this.getUserLikeSongList() // 重新获取一下所有喜欢歌曲id列表

        this.$message({
          type: 'success',
          message: '已添加至我的喜欢歌单',
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        })
      }
    }, 1800),

    // 取消喜欢音乐
    disLike: _.throttle(async function () {
      try {
        // 整理参数
        let obj = {}
        obj.id = this.playSongId // 音乐id
        obj.like = false // 取消喜欢

        await this.$store.dispatch('likeSong', obj)
        this.isLikeSong = false // 图标变更
        await this.getUserLikeSongList() // 重新获取一下所有喜欢歌曲id列表
        this.$message({
          type: 'warning',
          message: '已取消喜欢歌曲',
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        })
      }
    }, 1800),
  },
  watch: {
    // 监听播放状态 保存在music仓库中
    playState(newVal, oldVal) {
      this.music.playState = newVal
    },

    // 监听播放音乐id 判断是否为喜欢的歌曲
    playSongId(newVal, oldVal) {
      console.log('判断是否为喜欢的歌曲')
      this.isLikeSong = false // 每次改变播放歌曲都变成默认值false(不为喜欢歌曲)
      this.music.likeSongList.forEach((item) => {
        if (item === newVal) {
          this.isLikeSong = true // 是喜欢歌曲
        }
      })
    },
  },
  mounted() {
    this.$bus.$on('changePlaylist', this.changePlaylisy) // 改变播放列表
    this.$bus.$on('playMusic', this.playMusic) // 播放歌曲
    this.$bus.$on('addSongInPlaylist', this.addSong) // 播放列表加一首歌（搜索单曲）
    this.$bus.$on('pauseMusic', this.zanting) // 暂停播放歌曲
    // 设置播放控件的默认音量
    this.$refs.audio.volume = this.volume

    // 获取用户所有喜欢歌曲id列表
    this.getUserLikeSongList()
  },
}
</script>

<style scoped lang="less">
// 底部大盒子
footer {
  width: 100%;
  height: 68px;
  // 底部播放控件
  .bottomControl {
    width: 100%;
    position: fixed; // 固定定位
    left: 0;
    bottom: 0;
    z-index: 3000; // 比抽屉高
    // 设置弹性盒子
    display: flex;
    align-items: stretch; // 元素侧轴拉伸占满容器
    justify-content: space-between;
    width: 100%;
    height: 68px;
    padding: 6px 10px;
    box-sizing: border-box; // 边框内边距也包含在 宽 高中
    border-top: 1px solid #ddd;
    background-color: #fff;
    // 歌名 作者
    .left {
      width: 188px;
      display: flex;
      // 海报图片
      .avatar {
        cursor: pointer;
        width: 55px;
        height: 55px;
        border-radius: 10px;
      }
      // 详细信息
      .info {
        width: 95px;
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        color: #333;
        // 歌名
        .title {
          white-space: nowrap; // 强制不换行
          overflow: hidden; // 溢出内容隐藏
          text-overflow: ellipsis; // 文字溢出显示省略号
        }
        // 歌手
        .singer {
          font-size: 14px;
          line-height: 15px;
          white-space: nowrap; // 强制不换行
          overflow: hidden; // 溢出内容隐藏
          text-overflow: ellipsis; // 文字溢出显示省略号
        }
      }
      // 下载按钮
      .download {
        padding-top: 33px;
        margin-left: 10px;
        span {
          color: rgb(145, 145, 145);
          cursor: pointer;
          font-size: 18px;
        }
      }
    }
    // 播放器容器
    .center {
      width: 500px;
      // background-color: lightblue;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      // 控制按钮
      .controlButtons {
        width: 365px;
        display: flex;
        justify-content: space-around;
        span {
          color: #555353;
          font-size: 23px;
          cursor: pointer;
          &.red {
            color: #ec4141;
          }
        }
      }
      // 进度条容器
      .progressBarContainer {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        // 当前时间 , 总时间
        .currentTime,
        .totalTime {
          width: 34px;
          color: #919191;
          font-size: 13px;
        }
        // 进度条
        .progressSlider {
          width: 408px;
        }
      }
    }
    // 音量大小 播放列表
    .right {
      padding-left: 48px;
      /* 
        左内边距48px 加上 原本的宽度 140px 刚好 188px
        这样right盒子就与left盒子宽度相同，这样才能使center盒子居中显示
      */
      position: relative;
      width: 140px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #555353;
      // 音量控制
      .volumeCotrol {
        display: flex;
        align-items: center;
        width: 120px;
        // 喇叭图标
        i {
          position: relative;
          z-index: 1002;
          font-size: 22px;
          margin-right: 7px;
          cursor: pointer;
        }
        // 音量大小滑块
        .volumeSlider {
          width: 70px;
        }
      }
      // 播放列表
      .playList {
        // 图标
        i {
          cursor: pointer;
          font-size: 22px;
          margin-right: 10px;
        }
      }
      // 版权信息
      a.notice {
        position: absolute;
        left: 76px;
        bottom: -3px;
        font-size: 12px;
        color: grey;
        text-decoration: none;
        height: 15px;
        box-sizing: border-box;

        &:hover {
          color: #9b9b9b;
          border-bottom: 2px solid #9b9b9b;
        }
      }
    }
  }
}
</style>
