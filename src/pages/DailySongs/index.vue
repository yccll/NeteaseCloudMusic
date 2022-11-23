<template>
  <div class="dailySongsContainer" v-loading="pageShow">
    <!-- 信息 -->
    <div class="info">
      <!-- 介绍 -->
      <div class="top clearfix">
        <div class="left">
          <img src="http://www.codeman.ink/img/recommendMusic.dadb06d2.png" />
        </div>
        <div class="right">
          <h3>每日歌曲推荐</h3>
          <p>根据你的音乐口味生成，每天6:00更新</p>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="buttons">
        <div class="btnItem" @click="bofangAll">
          <i class="iconfont icon-bofang"></i>
          <span>播放全部</span>
        </div>
        <div class="btnItem">
          <i class="iconfont icon-fenxiang"></i>
          <span>分享</span>
        </div>
      </div>
    </div>

    <!-- 歌单 -->
    <div class="musiclist">
      <el-table
        :data="songs"
        highlight-current-row
        style="width: 100%"
        :cell-style="cellStyle"
        class="w"
        @row-dblclick="playCurrentMusic"
      >
        <el-table-column type="index" width="35">
          <template slot-scope="row">
            <span>{{ row.$index + 1 < 10 ? '0' + (row.$index + 1) : row.$index + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column width="50"><i class="iconfont icon-xiazai1"></i></el-table-column>
        <el-table-column prop="name" label="音乐标题" min-width="430"> </el-table-column>
        <el-table-column prop="ar" label="歌手" min-width="170"> </el-table-column>
        <el-table-column prop="al.name" label="专辑" min-width="175"> </el-table-column>
        <el-table-column prop="dt" label="时长" min-width="100"> </el-table-column>
      </el-table>
    </div>

    <!-- 底部空白 -->
    <div class="empty"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DailySongs',
  data() {
    return {
      songs: [],
      pageShow: true, // 页面loading
    }
  },
  computed: {
    // 映射music仓库
    ...mapState({
      music: (state) => {
        return state.music
      },
    }),
  },
  methods: {
    // 获取每日推荐歌曲
    async getDailySongs() {
      try {
        await this.$store.dispatch('getDailySongs')
        this.songs = this.$store.state.music.dailySongs
        this.pageShow = false // 页面loading图标 消失
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 双击歌曲播放
    playCurrentMusic(row, column, even) {
      if (this.music.playSongId === row.id) return // 避免重复选择
      this.music.playSongId = row.id // 改变当前播放的音乐id
      this.$bus.$emit('playMusic', this.music.playSongId) // 播放

      this.$bus.$emit('changePlaylist', this.songs, 'dailySongs') // 改变播放列表
    },

    // 选中状态
    cellStyle({ row, rowIndex }) {
      if (this.music.playSongId === row.id) {
        return {
          color: '#ec4141',
        }
      }
    },

    // 播放全部
    bofangAll() {
      this.playCurrentMusic(this.songs[0]) // 也就是从第一首歌开始播放
    },
  },
  mounted() {
    this.getDailySongs() // 获取歌曲列表
  },
}
</script>

<style lang="less" scoped>
.dailySongsContainer {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;

  // 信息
  .info {
    padding: 20px 10px 10px 10px;
    // 上边布局
    .top {
      .left {
        float: left;
        img {
          width: 110px;
          height: 95px;
        }
      }
      .right {
        float: left;
        margin-left: 15px;
        h3 {
          font-size: 23px;
          font-weight: bold;
          margin: 23px 0 5px 0;
        }
        p {
          font-size: 15px;
          color: rgb(105, 105, 105);
        }
      }
    }
    // 按钮
    .buttons {
      display: flex;
      padding: 10px 10px;
      .btnItem {
        font-size: 14px;
        padding: 9px 15px;
        border: 1px solid #ddd;
        border-radius: 30px;
        margin-right: 10px;
        cursor: pointer;
        i {
          margin-right: 3px;
        }
        // 第一个按钮 特殊点
        &:first-child {
          color: #fff;
          background-color: #ec4141;
        }
        &:first-child:hover {
          background-color: #e03b3b;
        }
        &:hover {
          background-color: rgb(248, 248, 248);
        }
      }
    }
  }

  // 歌单
  .musiclist {
    overflow: hidden;
  }

  // 底部空白
  .empty {
    height: 50px;
  }
}
</style>
