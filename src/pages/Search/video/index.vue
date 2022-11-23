<template>
  <div class="searchVideo">
    <div class="search" v-show="pageShow">
      <!-- 标题 -->
      <div class="title">找到 {{ dataCount }} 个视频</div>

      <!-- 主体内容 -->
      <div class="main" ref="main">
        <div class="item" v-for="item in videos" :key="item.vid" @click="goDetailPage(item)">
          <!-- 图片 -->
          <div class="image">
            <img v-lazy="item.coverUrl + '?param=1260y800'" />

            <!-- 播放次数 -->
            <div class="playCount"><i class="iconfont icon-video"></i>{{ item.playTime }}</div>
            <!-- 时长 -->
            <div class="duration">{{ item.duration }}</div>
          </div>

          <div class="name">{{ item.title }}</div>
        </div>
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
export default {
  name: 'searchVideo',
  data() {
    return {
      pageShow: false, // 页面内容显示/隐藏

      type: 1014, // type:1014(视频)
      keywords: this.$route.params.keywords, // 关键字
      offset: 0, // 分页，一页30条数据 0 30 60 90....

      currentPage: 1, // 当前页数
      dataCount: 100, // 总共多少条数据，要给一个初始值不然报错，先随便给一个

      videos: [], // 视频
    }
  },
  methods: {
    // 搜索视频
    async getSearchVideo() {
      try {
        // 整理参数
        let obj = {}
        obj.type = this.type
        obj.keywords = this.keywords
        obj.offset = this.offset * 30

        await this.$store.dispatch('getSearchVideo', obj)

        this.dataCount = this.$store.state.search.videoCount // 保存 搜索结果总数
        this.videos = this.$store.state.search.videos // 保存 搜索结果

        this.pageShow = true // 显示页面内容
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 改变页数
    async changePage(page) {
      this.offset = page - 1 // offset默认从0开始，这里 页数 - 1
      this.pageShow = false // 隐藏页面内容
      this.$refs.main.scrollTop = 0 // 回到顶部
      await this.getSearchVideo() // 发请求
    },

    // 跳转详情页
    goDetailPage(item) {
      // 先判断该资源item是 mv 还是 视频
      if (item.type === 0) {
        // MV
        this.$router.push({
          name: 'mvDetail',
          params: {
            mvid: item.vid,
          },
        })
      } else {
        // 视频
        this.$router.push({
          name: 'videoDetail',
          params: {
            videoId: item.vid,
          },
        })
      }
    },
  },
  mounted() {
    this.getSearchVideo()
  },
}
</script>

<style lang="less" scoped>
.searchVideo {
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
      margin-bottom: 10px;
    }

    // 主体内容
    .main {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 30px;

      .item {
        width: 25%;
        max-width: 328px; // 全屏状态下一行显示5个
        padding: 0 0.5%;
        box-sizing: border-box;
        margin-bottom: 20px;
        cursor: pointer;

        .image {
          width: 100%;
          position: relative;
          height: 0px;
          padding-bottom: 60%;
          margin-bottom: 5px;
          img {
            position: absolute;
            left: 0;
            top: 0;
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
            bottom: 5px;
            right: 8px;
          }
        }

        // 视频名
        .name {
          font-size: 15px;
          line-height: 1.2;
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
}
</style>
