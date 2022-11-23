<template>
  <div class="searchSinger">
    <div class="singer" v-show="pageShow">
      <!-- 标题 -->
      <div class="title">找到 {{ dataCount }} 位歌手</div>

      <!-- 主体内容 -->
      <div class="main" ref="main">
        <div class="item" v-for="s in singers" :key="s.id" @click="routerPush(s.id)">
          <div class="image">
            <img v-lazy="s.picUrl + '?param=400y400'" />
          </div>
          <div class="name">{{ s.name }}</div>
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
  name: 'searchSinger',
  data() {
    return {
      pageShow: false, // 页面所有内容 显示/隐藏

      type: 100, // type：100（歌手）
      keywords: this.$route.params.keywords, // 关键字
      offset: 0, // 分页，一页30条数据 0 30 60 90....

      currentPage: 1, // 当前页数
      dataCount: 100, // 总共多少条数据，要给一个初始值不然报错，先随便给一个

      singers: [], // 歌手
    }
  },
  methods: {
    // 搜索歌手
    async getSearchSinger() {
      try {
        // 整理参数
        let obj = {}
        obj.type = this.type // 搜索类型
        obj.keywords = this.keywords // 关键字
        obj.offset = this.offset * 30 // 结果分页

        await this.$store.dispatch('getSearchSinger', obj)

        this.dataCount = this.$store.state.search.singerCount // 保存结果总数
        this.singers = this.$store.state.search.singers // 保存搜索结果

        this.pageShow = true // 显示页面
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 改变页数
    async changePage(page) {
      this.offset = page - 1 // offset默认0开始，这里页数-1
      this.pageShow = false // 隐藏页面内容
      this.$refs.main.scrollTop = 0 // 回到顶部
      await this.getSearchSinger()
    },

    // 跳转歌手详情页
    routerPush(id) {
      this.$router.push({
        name: 'singerDetail',
        params: {
          singerId: id,
        },
      })
    },
  },
  mounted() {
    this.getSearchSinger() // 获取搜索结果
  },
}
</script>

<style lang="less" scoped>
.searchSinger {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .singer {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1200px;

    // 找到xxx
    .title {
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    // 主体内容
    .main {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      margin-bottom: 30px;
      // 每个歌手
      .item {
        width: 18.4%;
        margin: 0 2% 20px 0;
        cursor: pointer;
        &:nth-child(5n) {
          margin-right: 0;
        }
        // 图片容器
        .image {
          position: relative;
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          margin-bottom: 5px;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
        }

        // 名字
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
