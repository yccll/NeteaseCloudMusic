<template>
  <div class="singerWrapper" v-loading="pageShow">
    <div class="singer">
      <!-- 标题 -->
      <div class="title">收藏的歌手({{ singerList.length }})</div>
      <!-- 歌手列表 -->
      <div class="singerList">
        <div
          class="singerItem"
          v-for="(item, index) in singerList"
          :key="item.id"
          @click="routerPush(item.id)"
        >
          <div class="image">
            <img v-lazy="item.picUrl + '?param=400y400'" />
          </div>
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoriteSinger',
  data() {
    return {
      singerList: [], // 收藏的歌手列表
      pageShow: true, // 页面loading状态
    }
  },
  methods: {
    // 获取收藏歌手列表
    async getFavoriteSingerList() {
      try {
        await this.$store.dispatch('getFavoriteSingerList')
        this.singerList = this.$store.state.favorites.singerList
        this.pageShow = false // 页面loading状态
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
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
    this.getFavoriteSingerList() // 获取收藏的歌手
  },
}
</script>

<style lang="less" scoped>
.singerWrapper {
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

    // 标题
    .title {
      width: 100%;
      font-size: 15px;
      margin-bottom: 10px;
    }

    // 歌手列表
    .singerList {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .singerItem {
        width: 18.4%;
        margin: 0 2% 20px 0;
        cursor: pointer;
        &:nth-child(5n) {
          margin-right: 0;
        }

        .image {
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          position: relative;
          margin-bottom: 5px;
          overflow: hidden;
          border-radius: 10px;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }

        // 歌手名
        .name {
          font-size: 15px;
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
}
</style>
