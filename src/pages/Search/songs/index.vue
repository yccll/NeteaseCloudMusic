<template>
  <div class="searchSongs">
    <div class="search" v-show="pageShow">
      <!-- 标题 -->
      <div class="title">找到 {{ dataCount }} 首单曲</div>

      <!-- 最佳匹配 -->
      <div class="good" v-show="multimatchInfo">
        <!-- 如果有则显示，没有就不显示 -->
        <p>最佳匹配</p>
        <div class="cards">
          <div class="card" v-for="item in multimatchInfo" :key="item.id" @click="goSingerDetail(item.id)">
            <div class="left">
              <img v-lazy="item.img1v1Url + '?param==200y200'" />
            </div>
            <div class="right">
              <div class="desc">歌手:{{ item.name }}</div>
              <i class="iconfont icon-xiangyou"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 主体内容 -->
      <div class="main" ref="main">
        <template>
          <el-table :data="songs" style="width: 100%" @row-dblclick="playThisSong">
            <el-table-column type="index" width="35"></el-table-column>
            <el-table-column width="50"><i class="iconfont icon-xiazai1"></i></el-table-column>
            <el-table-column label="音乐标题" prop="name" min-width="430"> </el-table-column>
            <el-table-column label="歌手" prop="ar" min-width="170"> </el-table-column>
            <el-table-column label="专辑" prop="al.name" min-width="175"> </el-table-column>
            <el-table-column label="时长" prop="dt" min-width="100"> </el-table-column>
          </el-table>
        </template>
      </div>

      <!-- 分页器 -->
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="30"
          :total="dataCount"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'searchSongs',
  data() {
    return {
      pageShow: false, // 页面数据显示/隐藏

      type: 1, // 1 专辑
      keywords: this.$route.params.keywords,
      offset: 0, // 用于分页，一页30条数据

      currentPage: 1, // 当前页
      dataCount: 100, // 总共多少条数据，需要给一个初始值不然报错

      songs: [], // 单曲
      multimatchInfo: [], // 最佳匹配歌手信息
    }
  },
  computed: {
    // 映射state.music
    ...mapState({
      music: (state) => {
        return state.music
      },
    }),
  },
  methods: {
    // 获取搜索结果
    async getSearchSong() {
      try {
        // 整理参数
        let obj = {}
        obj.type = this.type
        obj.keywords = this.keywords
        obj.offset = this.offset * 30

        await this.$store.dispatch('getSearchSong', obj)

        this.dataCount = this.$store.state.search.songCount // 搜索结果总数
        this.songs = this.$store.state.search.songs // 保存结果

        this.pageShow = true // 显示页面内容
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取最佳匹配
    async getSearchMultimatch() {
      try {
        await this.$store.dispatch('getMultimatch', this.keywords)
        this.multimatchInfo = this.$store.state.search.multimatchInfo // 保存最佳匹配信息
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 改变页面
    async changePage(page) {
      this.offset = page - 1 // offset默认0 开始
      this.pageShow = false // 隐藏页面内容
      this.$refs.main.scrollTop = 0 // 回到顶部
      await this.getSearchSong()
    },

    // 播放音乐
    playThisSong(row, column, even) {
      console.log(row)
      this.$bus.$emit('addSongInPlaylist', row)
    },

    // 最佳匹配 跳转歌手详情页
    goSingerDetail(id) {
      this.$router.push({
        name: 'singerDetail',
        params: {
          singerId: id,
        },
      })
    },
  },
  mounted() {
    this.getSearchSong() // 获取搜索单曲结果
    this.getSearchMultimatch() // 获取最佳匹配
  },
}
</script>

<style lang="less" scoped>
.searchSongs {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .search {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    // 标题
    .title {
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    // 最佳匹配
    .good {
      width: 100%;

      p {
        font-size: 15px;
        color: #535353;
        padding: 6px 0;
      }
      .cards {
        width: 100%;
        display: flex;

        .card {
          display: flex;
          width: 320px;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          background-color: #f4f4f4;
          color: #7c7c7c;
          margin-right: 20px;

          // 图片
          .left {
            width: 80px;
            height: 80px;

            img {
              width: 100%;
              height: 100%;
            }
          }
          // 信息
          .right {
            width: 240px;
            height: 80px;
            padding-left: 10px;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;

            .desc {
              line-height: 80px;
            }

            i {
              margin-top: 30px;
              font-size: 20px;
              margin-right: 18px;
            }
          }
        }
      }
    }

    .main {
      width: 100%;
      padding-top: 20px;
      margin-bottom: 30px;

      .el-table {
        width: 100%;

        .el-table__body {
          overflow: auto;
          overflow-x: hidden;
        }
      }
    }
  }
}
</style>
