<template>
  <div class="singerContainer" ref="singerContainer">
    <div class="singer">
      <!-- 选项 -->
      <div class="options">
        <!-- 语种 -->
        <div class="optionItem">
          <div class="title">语种:</div>
          <div class="content">
            <div
              class="contentItem"
              v-for="(a, index) in one"
              :key="index"
              :class="{ active: oneActive === a.val }"
              @click="changeOneActive(a.val)"
            >
              {{ a.name }}
            </div>
          </div>
        </div>
        <!-- 分类 -->
        <div class="optionItem">
          <div class="title">分类:</div>
          <div class="content">
            <div
              class="contentItem"
              v-for="(b, index) in two"
              :key="index"
              :class="{ active: twoActive === b.val }"
              @click="changeTwoActive(b.val)"
            >
              {{ b.name }}
            </div>
          </div>
        </div>
        <!-- 筛选 -->
        <div class="optionItem">
          <div class="title">筛选:</div>
          <div class="content">
            <div
              class="contentItem"
              v-for="(c, index) in three"
              :key="index"
              :class="{ active: threeActive === c.val }"
              @click="changeThreeActive(c.val)"
            >
              {{ c.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- 歌手 -->
      <div
        class="singerMain"
        v-infinite-scroll="loadMore"
        infinite-scroll-immediate="false"
        infinite-scroll-distance="360"
        :infinite-scroll-disabled="busy"
      >
        <div class="singerItem" v-for="(s, index) in singers" :key="index" @click="routerPush(s.id)">
          <div class="image">
            <img v-lazy="s.picUrl + '?param=400y400'" />
          </div>
          <p>{{ s.name }}</p>
        </div>
      </div>
    </div>

    <BackTop element="singerContainer" />
  </div>
</template>

<script>
import BackTop from '@/feature/backTop'

export default {
  name: 'Singer',
  data() {
    return {
      // 语种
      one: [
        { name: '全部', val: -1 },
        { name: '华语', val: 7 },
        { name: '欧美', val: 96 },
        { name: '日本', val: 8 },
        { name: '韩国', val: 16 },
        { name: '其他', val: 0 },
      ],
      oneActive: -1, // 语种当前选中
      // 分类
      two: [
        { name: '全部', val: -1 },
        { name: '男歌手', val: 1 },
        { name: '女歌手', val: 2 },
        { name: '乐队', val: 3 },
      ],
      twoActive: -1, // 分类当前选中
      // 筛选
      three: [
        { name: '热门', val: -1 },
        { name: 'A', val: 'a' },
        { name: 'B', val: 'b' },
        { name: 'C', val: 'c' },
        { name: 'D', val: 'd' },
        { name: 'E', val: 'e' },
        { name: 'F', val: 'f' },
        { name: 'G', val: 'g' },
        { name: 'H', val: 'h' },
        { name: 'I', val: 'i' },
        { name: 'J', val: 'j' },
        { name: 'K', val: 'k' },
        { name: 'L', val: 'l' },
        { name: 'M', val: 'm' },
        { name: 'N', val: 'n' },
        { name: 'O', val: 'o' },
        { name: 'P', val: 'p' },
        { name: 'Q', val: 'q' },
        { name: 'R', val: 'r' },
        { name: 'S', val: 's' },
        { name: 'T', val: 't' },
        { name: 'U', val: 'u' },
        { name: 'V', val: 'v' },
        { name: 'W', val: 'w' },
        { name: 'X', val: 'x' },
        { name: 'Y', val: 'y' },
        { name: 'Z', val: 'z' },
        { name: '#', val: 0 },
      ],
      threeActive: -1, // 筛选当前选中
      offset: 0, // 用于歌手分页 默认30个一页
      singers: [], // 歌手
      busy: false, // 无限滚动禁用
    }
  },
  components: {
    BackTop,
  },
  methods: {
    // 改变语种
    async changeOneActive(val) {
      this.oneActive = val
      this.offset = 0 // 第一页
      this.$store.state.discover.singerList = [] //清除仓库中歌手列表
      // 重新发请求
      await this.getSingerList()
    },
    // 改变分类
    async changeTwoActive(val) {
      this.twoActive = val
      this.offset = 0 // 第一页
      this.$store.state.discover.singerList = [] //清除仓库中歌手列表
      // 重新发请求
      await this.getSingerList()
    },
    // 改变筛选
    async changeThreeActive(val) {
      this.threeActive = val
      this.offset = 0 // 第一页
      this.$store.state.discover.singerList = [] //清除仓库中歌手列表
      // 重新发请求
      await this.getSingerList()
    },

    // 获取歌手列表
    async getSingerList() {
      try {
        // 整理数据
        let obj = {
          offset: this.offset * 30,
          area: this.oneActive,
          type: this.twoActive,
          initial: this.threeActive,
        }
        await this.$store.dispatch('getSingerList', obj) // 发请求
        this.singers = this.$store.state.discover.singerList // 保存数据
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 无限滚动
    async loadMore() {
      console.log('加载更多歌手...')
      this.busy = true // 禁用无限滚动
      this.offset++ // 加一页
      await this.getSingerList() // 重新请求
      /* 先禁用无限滚动 等请求完毕后 再启用,避免用户滚动过快,数据还没有返回,就再次触发该事件导致无限加载bug */
      this.busy = !this.$store.state.discover.singerListMore  // 根据后台返回的more字段判断是否再启用无线滚动
      // more为true !true为false （启用）  more为false !false为true (禁用)
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
    this.getSingerList() // 获取歌手列表
  },
  beforeDestroy() {
    this.$store.state.discover.singerList = [] //清除歌手列表
  },
}
</script>

<style lang="less" scoped>
.singerContainer {
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
    // 选项
    .options {
      width: 100%;
      // 三个选项容器
      .optionItem {
        display: flex;
        font-size: 14px;
        color: #707070;
        margin-bottom: 15px;
        // 筛选
        &:nth-child(3) {
          .content {
            .contentItem {
              margin-bottom: 10px;
            }
          }
        }
        // 选项标题
        .title {
          line-height: 30px;
          flex-shrink: 0;
          padding-right: 20px;
        }
        // 选项内容
        .content {
          flex-grow: 1;
          display: flex;
          flex-flow: row wrap;
          // 每一项
          .contentItem {
            padding: 8px 0px;
            width: 67px;
            text-align: center;
            border-radius: 30px;
            cursor: pointer;
            &.active {
              color: #ec4c4c;
              background-color: rgba(245, 204, 211, 0.2);
            }
          }
        }
      }
    }

    // 歌手
    .singerMain {
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

        p {
          word-break: break-all;
          word-wrap: break-word;
          font-size: 15px;
          line-height: 1.2;
        }
      }
    }
  }
}
</style>
