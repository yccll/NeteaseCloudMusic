<template>
  <div class="musiclistContainer" ref="musiclistContainer">
    <div class="musiclist">
      <!-- 海报 -->
      <div class="poster">
        <!-- 模糊背景 -->
        <img :src="goodMusicList.coverImgUrl + '?param=400y400'"  />
        <!-- 图片 -->
        <div class="left" @click="goMusicListDetail(goodMusicList.id)">
          <img :src="goodMusicList.coverImgUrl + '?param=400y400'" />
        </div>
        <!-- 文字 -->
        <div class="right">
          <!-- 精品歌单 -->
          <div class="good"><i class="iconfont icon-tuijian"></i> 精品歌单</div>
          <!-- 描述文字 -->
          <div class="desc">{{goodMusicList.name}}</div>
        </div>
      </div>

      <!-- 分类导航 -->
      <div class="musicListNavBar">
        <!-- 所有分类 弹出框 -->
        <el-popover
          placement="bottom-start"
          width="420"
          trigger="click"
          :visible-arrow="false"
          popper-class="musicListAllCategory"
          v-model="showPopover"
        >
          <!-- 弹出框内容 -->
          <div class="navItemList">
            <div
              class="item"
              :class="{ active: isActive === item.name }"
              v-for="(item, index) in allCategory"
              :key="index"
              @click="changeActive(item.name)"
            >
              {{ item.name }}
            </div>
          </div>
          <!-- 弹出框开关 -->
          <div class="left" slot="reference">{{ isActive }} <i class="iconfont icon-xiangyou"></i></div>
        </el-popover>

        <!-- 热门分类 -->
        <div class="right">
          <div
            class="navItem"
            :class="{ active: isActive === hot.name }"
            v-for="hot in hotCategory"
            :key="hot.id"
            @click="changeActive(hot.name)"
          >
            {{ hot.name }}
          </div>
        </div>
      </div>

      <!-- 歌单 -->
      <div class="musicListMain">
        <div class="musicListItem" v-for="m in musicList" :key="m.id" @click="goMusicListDetail(m.id)">
          <div class="image">
            <img v-lazy="m.coverImgUrl + '?param=400y400'" />
          </div>
          <p>{{ m.name }}</p>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="page" v-show="this.musicList.length">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="50"
          :total="listCount"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 回到顶部 -->
    <BackTop element="musiclistContainer" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BackTop from '@/feature/backTop'

export default {
  name: 'MusicList',
  data() {
    return {
      goodMusicList: {coverImgUrl:require('@/assets/lazy.jpg')}, // 一个精品歌单
      isActive: '华语', // 当前选中分类
      hotCategory: [], // 热门分类
      allCategory: [], // 所有分类
      showPopover: false, // 所有分类弹出框 是否可见
      currentPage: 1, // 当前页数
      listCount: 100, // 当前分类歌单总数
      musicList: [], // 当前分类，指定页数的歌单
    }
  },
  components: {
    BackTop,
  },
  computed: {
    // 映射仓库中的discover中的数据
    ...mapState({ discover: (state) => state.discover }),
  },
  methods: {
    // 获取一张精品歌单作为海报
    async getGoodMusicList() {
      try {
        await this.$store.dispatch('getGoodMusicList')
        this.goodMusicList = this.discover.goodMusicList
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取歌单热门分类
    async getHotCategory() {
      try {
        if (this.discover.hotCategory.length) {
          this.hotCategory = this.discover.hotCategory
          // 默认选中第一个热门分类
          this.isActive = this.hotCategory[0].name
          return //页面不刷新仓库中数据就没有清空，不用发请求
        } else {
          await this.$store.dispatch('getMusicListCategory')
          this.hotCategory = this.discover.hotCategory
        }
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
      // 默认选中第一个热门分类
      this.isActive = this.hotCategory[0].name
    },

    // 获取歌单所有分类
    async getAllCategory() {
      try {
        if (this.discover.allCategory.length) {
          this.allCategory = this.discover.allCategory // 将数据保存到自身
          return // 防止仓库中还有数据再发请求保存一次
        } else {
          await this.$store.dispatch('getMusicListAllCategory')
          this.allCategory = this.discover.allCategory
        }
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取某个分类歌单
    async getCategoryMusicList(cat, offset = 0) {
      try {
        await this.$store.dispatch('getCategotyMusicList', { cat, offset })
        this.musicList = this.discover.categoryMusicList
        this.listCount = this.discover.listCount
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 切换选中分类
    async changeActive(name) {
      this.showPopover = false // 隐藏弹出框
      if (name === this.isActive) return // 防止重复点击当前分类
      try {
        this.musicList = [] // 清空上一次的让页面看起来有加载效果
        this.isActive = name // 改变选中
        this.currentPage = 1 // 修改当前页
        this.$refs.musiclistContainer.scrollTop = 0 // 回到顶部
        await this.getCategoryMusicList(name) // 发请求
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 改变页数
    async changePage(n) {
      try {
        this.musicList = [] // 清空即将改变的歌单数据，新数据没回来之前空白，看起来有点加载效果
        this.currentPage = n // 改变当前页

        let cat = this.isActive
        let offset = (n - 1) * 50
        this.$refs.musiclistContainer.scrollTop = 0 // 回到顶部
        await this.getCategoryMusicList(cat, offset)
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转歌单详情页
    goMusicListDetail(id) {
      this.$router.push({
        name: 'musicListDetail',
        params: {
          musicListId: id,
        },
      })
    },
  },
  async mounted() {
    // 精品歌单
    this.getGoodMusicList()

    // 热门分类
    await this.getHotCategory()

    // 所有分类
    this.getAllCategory()

    // 分类歌单
    this.getCategoryMusicList(this.isActive)
  },
}
</script>

<style lang="less" scoped>
.musiclistContainer {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 800px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  overflow-y: overlay; //使垂直滚动条出现不影响布局

  .musiclist {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1200px;
    // 海报
    .poster {
      position: relative;
      height: 170px;
      min-height: 170px;
      flex-shrink: 0; // 因为父容器是垂直的flex布局
      width: 100%;
      border-radius: 10px;
      padding: 13px 12px;
      box-sizing: border-box;
      overflow: hidden;
      // 模糊背景
      > img {
        position: absolute;
        left: 0;
        top: 0;
        z-index: -1;
        width: 100%;
        transform: translateY(-80px);
        filter: blur(30px) brightness(70%);
      }
      // 左边图片
      .left {
        float: left;
        width: 144px;
        height: 144px;
        margin-right: 10px;
        cursor: pointer;
        // 图片
        img {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
      // 右边文字
      .right {
        float: left;
        // 精品歌单
        .good {
          display: inline-block; // 变为行内块元素
          border: 1px solid rgb(241, 178, 59);
          color: rgb(241, 178, 59);
          padding: 8px 10px;
          border-radius: 30px;
          margin-top: 10px;
          margin-left: 10px;
        }
        // 描述文字
        .desc {
          font-size: 18px;
          color: #fff;
          margin-top: 20px;
        }
      }
    }

    // 分类导航
    .musicListNavBar {
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

    // 歌单
    .musicListMain {
      width: 100%;
      flex-wrap: wrap;
      display: flex;
      margin-bottom: 25px;
      // 歌单盒子
      .musicListItem {
        width: 18.4%;
        margin: 0 2% 20px 0;
        cursor: pointer;
        &:nth-child(5n) {
          margin-right: 0;
        }
        // 图片 自适应大小
        .image {
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          position: relative;
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
          margin-top: 5px;
          font-size: 15px;
          line-height: 1.2;
          word-break: break-all;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>
