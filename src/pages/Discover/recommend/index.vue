<template>
  <div class="recommendContainer">
    <div class="recommend">
      <!-- 轮播图 -->
      <div class="carousel">
        <el-carousel :interval="4000" type="card" height="230px" trigger="click">
          <el-carousel-item v-for="(item, index) in bannerImgs" :key="index">
            <img v-lazy="item" />
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 推荐歌单 -->
      <div class="recommendMusicList">
        <div class="title">推荐歌单<i class="iconfont icon-xiangyou"></i></div>
        <div class="content">
          <div class="item" v-for="m in musicLists" :key="m.id" @click="goMusicListDetail(m.id)">
            <div class="image">
              <img v-lazy="m.picUrl + '?param=400y400'" />
            </div>
            <p>{{m.name}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Recommend',
  data() {
    return {
      bannerImgs: [],
      musicLists: [],
    }
  },
  methods: {
    // 获取轮播图数据
    async getBannerData() {
      try {
        await this.$store.dispatch('getBannerData')
        this.bannerImgs = this.$store.state.discover.bannerImgs
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取推荐歌单数据
    async getRecommendMusicList() {
      try {
        await this.$store.dispatch('getRecommendMusicList', 10) // 10表示获取10个，最多30个
        this.musicLists = this.$store.state.discover.recommendMusicList
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转歌单详情页
    goMusicListDetail(id){
      this.$router.push({
        name:'musicListDetail',
        params:{
          musicListId:id
        }
      })
    }
  },
  mounted() {
    this.getBannerData() // 轮播图
    this.getRecommendMusicList() // 推荐歌单
  }
}
</script>

<style lang="less" scoped>
.recommendContainer {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .recommend {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 1200px;
    // 轮播图
    .carousel {
      .el-carousel {
        min-width: 1100px;
        .el-carousel__container {
          .el-carousel__item {
            border-radius: 10px;
            // 图片
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    // 推荐歌单
    .recommendMusicList {
      width: 100%;
      // 标题
      .title {
        font-size: 22px;
        font-weight: bold;
        line-height: 22px;
        color: #424242;
        margin-top: 20px;
        margin-bottom: 10px;
        i {
          font-size: 22px;
          line-height: 22px;
          cursor: pointer;
        }
      }
      // 推荐内容
      .content {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 18.4%;
          margin: 0 2% 20px 0;
          cursor: pointer;

          &:nth-child(5n) {
            margin-right: 0;
          }
          // 图片
          .image {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            position: relative;
            margin-bottom: 5px;
            overflow: hidden;
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
          p {
            font-size: 15px;
            line-height: 1.2;
            word-break: break-all; // 强制换行
            word-wrap: break-word; // 允许p标签换行
          }
        }
      }
    }
  }
}
</style>
