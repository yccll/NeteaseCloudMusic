<template>
  <div>
    <div class="navBarContainer">
      <ul class="navbar clearfix">
        <li class="item" :class="{ active: show == 1 }" @click="routerPush('/video/videolist')">视频</li>
        <li class="item" :class="{ active: show == 2 }" @click="routerPush('/video/mv')">MV</li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Video',
  data() {
    return {
      show: this.$route.meta.active, // 当前路径meta中规定第几个高亮
    }
  },
  methods: {
    routerPush(path) {
      this.$router.push({
        path,
      })
    },
  },
}
</script>

<style scoped lang="less">
// 导航栏容器
.navBarContainer {
  padding: 20px 40px;
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
