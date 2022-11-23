<template>
  <div class="videoListContainer" ref="videoListContainer">
    <div class="videoList">
      <!-- 分类导航 -->
      <div class="navBar">
        <!-- 弹出框 -->
        <el-popover
          placement="bottom-start"
          width="450"
          trigger="click"
          :visible-arrow="false"
          popper-class="videoPopover"
          v-model="showPopover"
        >
          <!-- 弹出框内容 -->
          <div class="navItemList">
            <div
              class="item"
              v-for="a in allTags"
              :key="a.id"
              :class="{ active: isActive === a.name }"
              @click="changeActive(a.name, a.id)"
            >
              {{ a.name }}
            </div>
          </div>
          <!-- 弹出框开关 -->
          <div class="left" slot="reference">{{ isActive }} <i class="iconfont icon-xiangyou"></i></div>
        </el-popover>

        <div class="right">
          <!-- 常用分类标签 -->
          <div
            class="navItem"
            v-for="b in tags"
            :key="b.id"
            :class="{ active: isActive === b.name }"
            @click="changeActive(b.name, b.id)"
          >
            {{ b.name }}
          </div>
        </div>
      </div>

      <!-- 视频列表 -->
      <div
        class="videoMain"
        :infinite-scroll-disabled="busy"
        v-infinite-scroll="loadMore"
        infinite-scroll-distance="480"
        infinite-scroll-immediate="false"
      >
        <div class="videoItem" v-for="(c, index) in videoList" :key="index" @click="routerPush(c.vid)">
          <div class="image">
            <img v-lazy="c.coverUrl" />
            <div class="playCount"><i class="iconfont icon-video"></i>{{ c.playCount }}</div>
            <div class="duration">{{ c.duration }}</div>
          </div>
          <div class="title">{{ c.title }}</div>
        </div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <BackTop element="videoListContainer" />
  </div>
</template>

<script>
import BackTop from '@/feature/backTop'

export default {
  name: 'VideoList',
  data() {
    return {
      showPopover: false, // 是否显示弹出框
      allTags: [], // 所有分类
      tags: [], // 常用分类
      isActive: '现场', // 当前选中标签名
      isActiveId: '', // 当前选中标签id
      offset: 0, // 视频列表分页 默认0 一页8个      0 8 16
      videoList: [], // 视频列表
      busy: false, // 无限滚动状态
    }
  },
  components: {
    BackTop,
  },
  methods: {
    // 获取所有分类标签
    async getAllTags() {
      try {
        await this.$store.dispatch('getVideoAllTags')
        this.allTags = this.$store.state.video.allTags
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },
    
    // 获取常用分类标签
    async getTags() {
      try {
        await this.$store.dispatch('getVideoTags')
        this.tags = this.$store.state.video.tags

        this.isActive = this.tags[0].name
        this.isActiveId = this.tags[0].id
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 切换分类
    changeActive(name, id) {
      this.offset = 0 // 页数归零
      this.isActive = name // 当前分类名
      this.isActiveId = id // 当前分类id
      this.showPopover = false // 关闭弹出框
      this.busy = false // 启用无限滚动

      this.$store.state.video.videoList = [] // 清空仓库中的视频数据

      this.getMoreVideos() // 获取24条视频
    },

    // 获取视频列表
    async getVideoList() {
      try {
        // 整理参数
        let obj = {}
        obj.id = this.isActiveId
        obj.offset = this.offset * 8

        await this.$store.dispatch('getVideoList', obj)

        this.videoList = this.$store.state.video.videoList
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取24条视频
    async getMoreVideos() {
      this.getVideoList() // 每次获取8条
      this.offset++
      this.getVideoList()
      this.offset++
      this.getVideoList()
    },

    // 无限滚动
    async loadMore() {
      this.busy = true // 禁用无限滚动
      this.offset++
      await this.getVideoList()
      this.offset++
      await this.getVideoList()
      this.busy = !this.$store.state.video.videoListHasMore // 根据后台返回hasmore字段判断是否禁用无限滚动
    },

    // 跳转视频详情页
    routerPush(id) {
      this.$router.push({
        name: 'videoDetail',
        params: {
          videoId: id,
        },
      })
    },
  },
  async mounted() {
    this.getAllTags() // 获取所有标签
    await this.getTags() // 获取常用标签
    await this.getMoreVideos() // 获取24条视频
  },
  beforeDestroy() {
    this.$store.state.video.videoList = [] // 清空仓库中的视频数据
  },
}
</script>

<style lang="less" scoped>
.videoListContainer {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 800px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .videoList {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    // 分类导航
    .navBar {
      margin: 15px 0 25px 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #5f5f5f;
      // 所有标签
      .left {
        border: 1px solid #ccc;
        border-radius: 30px;
        padding: 6px 10px;
        cursor: pointer;
      }
      // 部分标签
      .right {
        display: flex;
        .navItem {
          margin: 0 2px;
          border-radius: 30px;
          padding: 8px 10px;
          cursor: pointer;
          &.active {
            color: #ec4141;
            background-color: rgba(255, 192, 203, 0.2);
          }
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }

    // 视频
    .videoMain {
      display: flex;
      width: 100%;
      flex-wrap: wrap;

      // 每一项
      .videoItem {
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
        // 视频描述
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
}
</style>
