<template>
  <div class="mvContainer" ref="mvContainer">
    <div class="mv">
      <!-- 分类选项 -->
      <!-- 原生这个选项会报错，服务器有问题 -->
      <div class="options">
        <!-- 地区 -->
        <div class="area">
          <div class="left">地区:</div>
          <div class="right">
            <div
              class="item"
              v-for="(a, index) in area"
              :key="index"
              :class="{ active: areaActive === a }"
              @click="changeArea(a)"
            >
              {{ a }}
            </div>
          </div>
        </div>
        <!-- 类型 -->
        <div class="type">
          <div class="left">类型:</div>
          <div class="right">
            <div
              class="item"
              v-for="(t, index) in type"
              :key="index"
              :class="{ active: typeActive === t }"
              @click="changeType(t)"
            >
              {{ t }}
            </div>
          </div>
        </div>
        <!-- 排序 -->
        <div class="order">
          <div class="left">排序:</div>
          <div class="right">
            <div
              class="item"
              v-for="(o, index) in order"
              :key="index"
              :class="{ active: orderActive === o }"
              @click="changeOrder(o)"
            >
              {{ o }}
            </div>
          </div>
        </div>
      </div>

      <!-- MV列表 -->
      <div
        class="mvMain"
        v-infinite-scroll="loadMore"
        :infinite-scroll-disabled="busy"
        infinite-scroll-immediate="false"
        infinite-scroll-distance="400"
      >
        <div class="mvItem" v-for="(mv, index) in mvList" :key="mv.id" @click="goMvDetail(mv.id)">
          <!-- 封面 -->
          <div class="image">
            <img v-lazy="mv.cover" />
            <!-- 播放次数 -->
            <div class="playCount"><i class="iconfont icon-video"></i>{{ mv.playCount }}</div>
            <!-- 时长 -->
            <div class="duration">{{ mv.duration }}</div>
          </div>
          <!-- 标题 -->
          <div class="title">{{ mv.name }}</div>
          <!-- 作者 -->
          <div class="author">{{ mv.artistName }}</div>
        </div>
      </div>
    </div>

    <!-- 回到顶部 -->
    <BackTop element="mvContainer" />
  </div>
</template>

<script>
import BackTop from '@/feature/backTop'

export default {
  name: 'MV',
  data() {
    return {
      area: ['全部', '内地', '港台', '欧美', '日本', '韩国'],
      type: ['全部', '官方版', '原生', '现场版', '网易出品'],
      order: ['上升最快', '最热', '最新'],
      areaActive: '全部', // 当前选择地区
      typeActive: '全部', // 当前选择类型
      orderActive: '上升最快', // 当前选择排序
      offset: 0, // 用于分页 默认30条MV一页 0 30 60 90...
      mvList: [], // MV列表
      busy: false, // 无限滚动状态
    }
  },
  components: {
    BackTop,
  },
  methods: {
    // 改变地区
    async changeArea(value) {
      this.areaActive = value
      // 初始化数据
      this.offset = 0
      this.mvList = []
      this.busy = false
      this.$store.state.video.mvList = [] // 清空仓库中的MV数据

      await this.getMVList()
    },

    // 改变类型
    async changeType(value) {
      this.typeActive = value
      // 初始化数据
      this.offset = 0
      this.mvList = []
      this.busy = false

      this.$store.state.video.mvList = [] // 清空仓库中的MV数据

      await this.getMVList()
    },

    // 改变排序
    async changeOrder(value) {
      this.orderActive = value
      // 初始化数据
      this.offset = 0
      this.mvList = []
      this.busy = false

      this.$store.state.video.mvList = [] // 清空仓库中的MV数据

      await this.getMVList()
    },

    // 获取MV列表
    async getMVList() {
      try {
        // 整理参数
        let obj = {}
        obj.area = this.areaActive
        obj.type = this.typeActive
        obj.order = this.orderActive
        obj.offset = this.offset * 30

        // 发请求
        await this.$store.dispatch('getMVList', obj)
        this.mvList = this.$store.state.video.mvList // 将加工过后的数据保存到自身
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 无限滚动
    async loadMore() {
      this.busy = true // 禁用无限滚动
      this.offset++ // 下一页 一页30条
      await this.getMVList()
      this.busy = !this.$store.state.video.mvListHasMore // 根据hasMore字段是否禁用无限滚动
    },

    // 跳转视频详情页
    goMvDetail(id) {
      this.$router.push({
        name: 'mvDetail',
        params: {
          mvid: id,
        },
      })
    },
  },
  mounted() {
    this.getMVList() // 获取MV列表
  },
  beforeDestroy() {
    this.$store.state.video.mvList = [] // 清空仓库中的MV数据
  },
}
</script>

<style lang="less" scoped>
.mvContainer {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 800px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .mv {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    // 选项
    .options {
      width: 100%;
      font-size: 14px;
      color: rgb(122, 122, 122);
      // 地区,类型,排序
      .area,
      .type,
      .order {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        // 标题
        .left {
          width: 50px;
          color: #535353;
        }
        // 选项
        .right {
          display: flex;
          .item {
            text-align: center;
            width: 60px;
            padding: 6px 10px;
            margin: 0 5px;
            border-radius: 30px;
            cursor: pointer;
            &.active {
              color: #ec4141;
              background-color: rgba(255, 192, 203, 0.2);
            }
          }
        }
      }
    }

    // MV列表
    .mvMain {
      margin-top: 15px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;

      .mvItem {
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

        // 标题
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
          margin-bottom: 2px;
        }

        // 作者
        .author {
          font-size: 14px;
          height: 15px;
          color: rgb(122, 122, 122);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
