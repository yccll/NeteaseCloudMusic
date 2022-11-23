<template>
  <div class="albumWrapper" v-loading="pageShow">
    <div class="album">
      <!-- 标题 -->
      <div class="title">收藏的专辑({{ albumList.length }})</div>
      <!-- 专辑列表 -->
      <div class="albumList">
        <div class="albumItem" v-for="(item, index) in albumList" :key="item.id" @click="routerPush(item.id)">
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
  name: 'FavoriteAlbum',
  data() {
    return {
      albumList: [], // 收藏的专辑列表
      pageShow: true, // 页面loading状态
    }
  },
  methods: {
    // 获取收藏专辑列表
    async getFavoriteAlbumList() {
      try {
        await this.$store.dispatch('getFavoriteAlbumList')
        this.albumList = this.$store.state.favorites.albumList
        this.pageShow = false // 显示页面
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转专辑详细页
    routerPush(id) {
      this.$router.push({
        name: 'albumDetail',
        params: {
          albumId: id,
        },
      })
    },
  },
  mounted() {
    this.getFavoriteAlbumList() // 获取收藏的专辑
  },
}
</script>

<style lang="less" scoped>
.albumWrapper {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .album {
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

    // 专辑列表
    .albumList {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .albumItem {
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

        // 专辑名
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
