<template>
  <div class="searchWrapper">
    <div class="navBarContainer">
      <ul class="navbar clearfix">
        <li class="item" :class="{ active: show == 1 }" @click="routerPush('searchSongs')">单曲</li>
        <li class="item" :class="{ active: show == 2 }" @click="routerPush('searchSinger')">歌手</li>
        <li class="item" :class="{ active: show == 3 }" @click="routerPush('searchAlbum')">专辑</li>
        <li class="item" :class="{ active: show == 4 }" @click="routerPush('searchVideo')">视频</li>
        <li class="item" :class="{ active: show == 5 }" @click="routerPush('searchMusiclist')">歌单</li>
      </ul>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      show: this.$route.meta.active,
      keywords: this.$route.params.keywords,
    }
  },
  methods: {
    routerPush(name) {
      this.$router.push({
        name,
      })
    },
  },
}
</script>

<style lang="less" scoped>
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
