<template>
  <div>
    <div class="navBarContainer">
      <ul class="navbar clearfix">
        <li class="item" :class="{ active: show == 1 }" @click="routerPush('/favorites/album')">专辑</li>
        <li class="item" :class="{ active: show == 2 }" @click="routerPush('/favorites/singer')">歌手</li>
        <li class="item" :class="{ active: show == 3 }" @click="routerPush('/favorites/video')">视频</li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Favorites',
  data() {
    return {
      show: this.$route.meta.active,
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
