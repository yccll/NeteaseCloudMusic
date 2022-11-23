<template>
  <div class="videoWrapper" v-loading="pageShow">
    <div class="video">
      <!-- 标题 -->
      <div class="title">收藏的视频和MV({{ videoList.length }})</div>
      <!-- 歌手列表 -->
      <div class="videoList">
        <div
          class="videoItem"
          v-for="(item, index) in videoList"
          :key="item.vid"
          @click="goDetailPage(item.type, item.vid)"
        >
          <div class="image">
            <img v-lazy="item.coverUrl + '?param=500y500'" />
            <div class="playCount"><i class="iconfont icon-video"></i>{{ item.playTime }}</div>
            <div class="duration">{{ item.durationms }}</div>
          </div>
          <div class="name">{{ item.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FavoriteVideo',
  data() {
    return {
      videoList: [], // 收藏的视频列表
      pageShow: true, // 页面loading状态
    }
  },
  methods: {
    // 获取收藏视频列表
    async getFavoriteVideoList() {
      try {
        await this.$store.dispatch('getFavoriteVideoList')
        this.videoList = this.$store.state.favorites.videoList
        this.pageShow = false // 页面loading状态
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转详情页
    goDetailPage(type, id) {
      if (type === 0) {
        // MV
        this.$router.push({
          name: 'mvDetail',
          params: {
            mvid: id,
          },
        })
      } else {
        // 视频
        this.$router.push({
          name: 'videoDetail',
          params: {
            videoId: id,
          },
        })
      }
    },
  },
  mounted() {
    this.getFavoriteVideoList() // 获取收藏的视频列表
  },
}
</script>

<style lang="less" scoped>
.videoWrapper {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .video {
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

    // 视频列表
    .videoList {
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .videoItem {
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
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
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
