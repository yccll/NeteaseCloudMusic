<template>
  <div class="singerDetail" ref="singerDetail">
    <!-- 歌手信息 -->
    <div class="singerInfo">
      <!-- 歌手图片 -->
      <div class="left">
        <img v-lazy="singerInfo.cover + '?param=300y300'" />
      </div>

      <!-- 歌手信息 -->
      <div class="right">
        <div class="name">{{ singerInfo.name }}</div>

        <div class="buttons">
          <!-- 收藏 -->
          <div class="btnItem" v-if="!isSub" @click="subscribe">
            <i class="iconfont icon-xihuan1"></i>
            <span>收藏</span>
          </div>
          <!-- 已收藏 -->
          <div class="btnItem" v-if="isSub" @click="unSubscribe">
            <i class="iconfont icon-xihuan red"></i>
            <span>已收藏</span>
          </div>
          <!-- 分享 -->
          <div class="btnItem">
            <i class="iconfont icon-fenxiang"></i>
            <span>分享</span>
          </div>
        </div>

        <div class="other">
          <span>单曲数: {{ singerInfo.musicSize }}</span>
          <span>专辑数: {{ singerInfo.albumSize }}</span>
          <span>MV数: {{ singerInfo.mvSize }}</span>
        </div>
      </div>
    </div>

    <!-- el-tabs -->
    <template>
      <el-tabs v-model="activeName" @tab-click="toggleTab">
        <!-- 专辑 -->
        <el-tab-pane label="专辑" name="first">
          <!-- 热门50首 -->
          <div class="albumItem" v-show="hotSongs.length">
            <div class="left">
              <img v-lazy="require('@/assets/top50Songs.png')" />
            </div>
            <div class="right">
              <div class="title">热门50首</div>

              <table>
                <tr
                  v-for="(item, index) in hotSongs"
                  :key="item.id"
                  @dblclick="playCurrentMusic(item.id, singer.hotSongs)"
                >
                  <td class="index">{{ index + 1 }}</td>
                  <td class="musicName">{{ item.name }}</td>
                  <td class="singer">{{ item.ar }}</td>
                </tr>
              </table>

              <div class="lookAll" @click="showAllHotSong">
                查看全部
                <i class="iconfont icon-xiangyou"></i>
              </div>
            </div>
          </div>

          <!-- 热门专辑 -->
          <div class="albumItem" v-for="album in hotAlbums" :key="album.id">
            <div class="left">
              <img v-lazy="album.picUrl + '?param=300y300'" @click="goAlbumDetail(album.id)" />
            </div>

            <div class="right">
              <div class="title">{{ album.name }}</div>

              <table>
                <tr
                  v-for="(song, index) in album.songs"
                  :key="song.id"
                  @dblclick="playCurrentMusic(song.id, album.songs)"
                >
                  <td class="index">{{ index + 1 }}</td>
                  <td class="musicName">{{ song.name }}</td>
                  <td class="singer">{{ song.ar }}</td>
                </tr>
              </table>

              <div class="lookAll" @click="goAlbumDetail(album.id)">
                查看全部
                <i class="iconfont icon-xiangyou"></i>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- MV -->
        <el-tab-pane label="MV" name="second">
          <div
            class="singerMvlist"
            v-infinite-scroll="loadMore"
            :infinite-scroll-disabled="busy"
            infinite-scroll-immediate="false"
            infinite-scroll-distance="300"
          >
            <div class="mvItem" v-for="(item, index) in mvList" :key="index" @click="goMvDetail(item.id)">
              <div class="image">
                <img v-lazy="item.imgurl + '?param=680y400'" />
                <div class="playCount"><i class="iconfont icon-video"></i>{{ item.playCount }}</div>
                <div class="duration">{{ item.duration }}</div>
              </div>
              <div class="title">{{ item.name }}</div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 歌手详情 -->
        <el-tab-pane label="歌手详情" name="third">
          <div class="desc">
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {{ singerInfo.desc }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>

    <!-- 回到顶部 -->
    <BackTop element="singerDetail" />
  </div>
</template>

<script>
import BackTop from '@/feature/backTop'
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'SingerDetail',
  props: ['singerId'],
  data() {
    return {
      singerList: [], // 收藏的歌手列表
      isSub: false, // 是否已经收藏

      activeName: 'first', // el-tabs默认选中
      singerInfo: {}, // 歌手详细信息
      hotSongs: [], // 热门50首
      hotAlbums: [], // 热门专辑

      mvList: [], // mv列表
      mvOffset: 0, // mv列表分页 0 20 40 60...
      busy: true, // 无限滚动禁用开关
    }
  },
  computed: {
    // 映射singer、music仓库
    ...mapState({
      singer: (state) => state.singer,
      music: (state) => state.music,
    }),
  },
  components: {
    BackTop,
  },
  methods: {
    // 获取收藏的歌手列表
    async getFavoriteSingerList() {
      try {
        // 如果收藏仓库没有收藏的歌手列表
        if (this.$store.state.favorites.singerList.length == 0) {
          await this.$store.dispatch('getFavoriteSingerList')
        }
        this.singerList = this.$store.state.favorites.singerList
        this.singerList.forEach((item) => {
          if (item.id === this.singerId) {
            this.isSub = true
            return
          }
        })
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取歌手详细信息
    async getSingerDetail() {
      try {
        await this.$store.dispatch('getSingerDetail', this.singerId)
        this.singerInfo = this.singer.singerInfo
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取热门50首
    async getSingerHotFifty() {
      try {
        await this.$store.dispatch('getSingerHotFifty', this.singerId)
        this.hotSongs = this.singer.hotSongs.slice(0, 10) // 先拿前10个渲染页面
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 查看全部热门歌曲
    showAllHotSong() {
      this.hotSongs = this.$store.state.singer.hotSongs
    },

    // 获取热门专辑 只拿20张专辑
    async getSingerHotAlbum() {
      try {
        await this.$store.dispatch('getSingerHotAlbum', this.singerId)
        // 获取每张专辑里的歌曲
        this.singer.hotAlbums.forEach((item) => {
          this.getHotAlbumSongs(item.id)
        })
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取热门专辑里的歌曲
    async getHotAlbumSongs(id) {
      try {
        await this.$store.dispatch('getHotAlbumSongs', id)
        // 在这里每次获取了一张专辑的歌曲之后再把这张专辑的数据用push存放到组件自身要遍历的数据
        // 但是现在只能拿到专辑id，要用专辑id找到那个数据然后再push
        this.singer.hotAlbums.forEach((item) => {
          if (item.id === id) {
            if (item.songs.length >= 10) {
              item.songs = item.songs.slice(0, 10) // 如果专辑里的歌曲大于10则只渲染前十首歌
            }
            this.hotAlbums.push(item)
            return // 一找到就结束循环
          }
        })
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 播放选中的歌曲
    playCurrentMusic(id, playlist) {
      // 参数：播放音乐id  播放列表
      if (this.music.playSongId === id) return // 重复选中
      this.music.playSongId = id // 改变播放音乐id
      this.$bus.$emit('changePlaylist', playlist, Date.now()) // 改变播放列表
      this.$bus.$emit('playMusic') // 播放歌曲
    },

    // 跳转专辑详细页
    goAlbumDetail(id) {
      this.$router.push({
        name: 'albumDetail',
        params: {
          albumId: id,
        },
      })
    },

    // 切换标签
    async toggleTab(tab) {
      if (tab.label == 'MV') {
        if (this.mvList.length < this.singerInfo.mvSize) {
          // 如果还没有加载完
          this.busy = false // 开启无限滚动
        }
      } else {
        // 点击的不是MV按钮
        this.busy = true // 禁用无限滚动
      }
    },

    // 获取MV列表
    async getSingerMvList() {
      try {
        // 整理参数
        let obj = {}
        obj.id = this.singerId // 歌手id
        obj.offset = this.mvOffset * 20 // 分页 0 20 40 60

        await this.$store.dispatch('getSingerMvList', obj)
        this.mvList = this.$store.state.singer.mvList
      } catch (error) {}
    },

    // MV列表无限滚动
    async loadMore() {
      console.log('加载更多MV')
      this.busy = true // 禁用无限滚动
      this.mvOffset++ // 页数+1
      await this.getSingerMvList() // 发请求
      this.busy = !this.$store.state.singer.mvListHasMore // 根据hasmore字段决定是否禁用无限滚动
    },

    // 跳转mv详情页
    goMvDetail(id) {
      this.$router.push({
        name: 'mvDetail',
        params: {
          mvid: id,
        },
      })
    },

    // 收藏歌手
    subscribe: _.throttle(async function () {
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
        obj.t = 1 // 收藏
        obj.id = this.singerId

        await this.$store.dispatch('subscribeSinger', obj)
        this.isSub = !this.isSub
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),

    // 取消收藏歌手
    unSubscribe: _.throttle(async function () {
      try {
        // 整理参数
        let obj = {}
        obj.t = 2 // 取消收藏
        obj.id = this.singerId

        await this.$store.dispatch('subscribeSinger', obj)
        this.isSub = !this.isSub
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),
  },
  mounted() {
    // 获取收藏的歌手列表
    this.getFavoriteSingerList()
    // 获取歌手详细信息
    this.getSingerDetail()
    // 获取热门50首
    this.getSingerHotFifty()
    // 获取热门专辑
    this.getSingerHotAlbum()
    // 获取歌手MV列表
    this.getSingerMvList()
  },
  beforeDestroy() {
    this.$store.state.singer.mvList = [] // 清空MV列表
  },
}
</script>

<style lang="less" scoped>
.singerDetail {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;

  // 歌手信息
  .singerInfo {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 30px 10px;
    box-sizing: border-box;

    // 歌手图片
    .left {
      margin-right: 20px;
      img {
        width: 180px;
        height: 180px;
        border-radius: 10px;
      }
    }

    // 歌手信息
    .right {
      // 歌手名
      .name {
        color: #2c2c2c;
        font-size: 24px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 20px;
      }

      // 按钮
      .buttons {
        display: flex;
        margin-bottom: 20px;
        .btnItem {
          font-size: 14px;
          padding: 9px 15px;
          border: 1px solid #ddd;
          border-radius: 30px;
          margin-right: 10px;
          cursor: pointer;
          i {
            margin-right: 3px;
            &.red {
              color: #ec4141;
            }
          }
          &:hover {
            background-color: rgb(248, 248, 248);
          }
        }
      }

      // 数量
      .other {
        font-size: 14px;
        color: #666;
        span {
          margin-right: 20px;
        }
      }
    }
  }

  // 专辑
  .albumItem {
    display: flex;
    margin-bottom: 80px;
    &:first-child {
      // 热门50首封面不能跳转
      .left {
        cursor: auto; // 默认值
      }
    }
    .left {
      margin-right: 20px;
      cursor: pointer;
      img {
        width: 180px;
        height: 180px;
        border-radius: 10px;
        vertical-align: bottom;
      }
    }
    .right {
      // 专辑标题
      .title {
        font-size: 20px;
        font-weight: bold;
        color: #3f3f3f;
        margin-bottom: 10px;
      }
      flex-grow: 1;
      padding-right: 20px;
      // 表格
      table {
        width: 100%;
        tr {
          display: flex;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          cursor: pointer;

          // 奇数行
          &:nth-child(odd) {
            background-color: #f5f5f5;
          }
          // hover行 这个还必须要写在奇数行后面奇数行才有效果... 晕
          &:hover {
            background-color: #e9e9e9;
          }
          // 第一行
          &:first-child {
            border-radius: 10px 10px 0 0;
          }
          // 最后一行
          &:last-child {
            border-radius: 0 0 10px 10px;
          }

          td {
            // 序号
            &.index {
              width: 40px;
              text-align: center;
              color: #888888;
            }
            // 歌曲名
            &.musicName {
              white-space: nowrap;
              flex-grow: 1;
              color: #222222;
            }
            // 歌手
            &.singer {
              max-width: 285px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 0 10px;
              color: #888888;
            }
          }
        }
      }
      // 查看全部
      .lookAll {
        display: inline-block;
        margin-top: 10px;
        font-size: 14px;
        color: #888888;
        cursor: pointer;
      }
    }
  }

  // MV列表
  .singerMvlist {
    display: flex;
    width: 100%;
    flex-wrap: wrap;

    // 每一项
    .mvItem {
      width: 25%;
      max-width: 328px; // 全屏状态下一行显示5个
      padding: 0 0.5%;
      box-sizing: border-box;
      margin-bottom: 20px;
      cursor: pointer;

      // 图片盒子
      .image {
        position: relative;
        width: 100%;
        height: 0px;
        padding-bottom: (88% - 28px);
        margin-bottom: 5px;
        // 图片
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
        // 播放次数
        .playCount {
          font-size: 14px;
          color: #fff;
          position: absolute;
          top: 3px;
          right: 8px;
          i {
            font-size: 14px;
            margin-right: 3px;
          }
        }
        // 时长
        .duration {
          font-size: 14px;
          color: #fff;
          position: absolute;
          bottom: 3px;
          right: 5px;
        }
      }

      // MV标题
      .title {
        font-size: 14px;
        line-height: 1.1;
        word-break: break-all;
        word-wrap: break-word;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
