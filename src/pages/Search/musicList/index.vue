<template>
  <div class="searchMusicList">
    <div class="musicList" v-show="pageShow">
      <!-- 标题 -->
      <div class="title">找到 {{ dataCount }} 个歌单</div>

      <!-- 主体内容 -->
      <div class="main" ref="main">
        <div class="item" v-for="item in musicLists" :key="item.id" @click="routerPush(item.id)">
          <div class="image">
            <img v-lazy="item.coverImgUrl + '?param=400y400'" />
          </div>
          <div class="name">{{ item.name }}</div>
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
  name: 'searchMusicList',
  data() {
    return {
      pageShow: false, // 页面内容显示/隐藏

      type: 1000, // type:1000(歌单)
      keywords: this.$route.params.keywords, // 关键字
      offset: 0, // 分页 0 30 60 90....

      currentPage: 1, // 当前页数
      dataCount: 100, // 数据总数

      musicLists: [], // 歌单
    }
  },
  methods: {
    // 搜索歌单
    async getSearchMusicList() {
      try {
        // 整理参数
        let obj = {}
        obj.type = this.type
        obj.keywords = this.keywords
        obj.offset = this.offset * 30

        await this.$store.dispatch('getSearchMusicList', obj)

        this.dataCount = this.$store.state.search.musicListCount // 保存 搜索结果总数
        this.musicLists = this.$store.state.search.musicLists // 保存 搜索结果

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
      this.offset = page - 1
      this.$refs.main.scrollTop = 0 // 回到顶部
      this.pageShow = false // 隐藏页面内容
      await this.getSearchMusicList() // 发请求
    },

    // 跳转歌单详细页 id:歌单id
    routerPush(id) {
      this.$router.push({
        name: 'musicListDetail',
        params: {
          musicListId: id,
        },
      })
    },
  },
  mounted() {
    this.getSearchMusicList()
  },
}
</script>

<style lang="less" scoped>
.searchMusicList {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .musicList {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1200px;

    // 标题
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
      // 每个歌单
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

        // 歌单名
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
