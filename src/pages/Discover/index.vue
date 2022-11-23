<template>
  <div class="discoverContainer">
    <div class="navBarContainer">
      <ul class="navbar clearfix">
        <li class="item" :class="{ active: show == 1 }" @click="routerPush('/discover/recommend')">
          个性推荐
        </li>
        <li class="item" :class="{ active: show == 2 }" @click="routerPush('/discover/musiclist')">歌单</li>
        <li class="item" :class="{ active: show == 3 }" @click="routerPush('/discover/ranking')">排行榜</li>
        <li class="item" :class="{ active: show == 4 }" @click="routerPush('/discover/singer')">歌手</li>
      </ul>
    </div>

    <!-- 个性推荐、歌单、排行榜、歌手 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Discover',
  data() {
    return {
      show: this.$route.meta.active, // 当前路径meta中规定第几个高亮
    }
  },
  methods: {
    // 跳转页面
    routerPush(path) {
      this.$router.push({
        path,
      })
    },
  },
  mounted() {},
}
</script>

<style scoped lang="less">
// 导航栏容器
.navBarContainer {
  padding: 20px 40px;
  position: relative;
  z-index: 1;
  background-color: #fff;
  // 导航栏
  .navbar {
    // 导航
    .item {
      float: left;
      margin-right: 25px;
      padding-bottom: 8px;
      box-sizing: border-box;
      cursor: pointer;
    }
    // 导航 (选中)
    .active {
      font-size: 18px;
      font-weight: bold;
      border-bottom: 3px solid #ec4141;
      transform: translateY(-2px);
    }
  }
}
</style>
