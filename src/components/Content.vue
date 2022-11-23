<template>
  <section class="w">
    <aside>
      <el-menu :router="true" :default-active="defaultActive">
        <el-menu-item index="/discover/recommend">
          <i class="iconfont icon-music"></i>
          <span slot="title">发现音乐</span>
        </el-menu-item>
        <el-menu-item index="/video/videolist">
          <i class="iconfont icon-video"></i>
          <span slot="title">视频</span>
        </el-menu-item>
        <el-menu-item index="/favorites/album">
          <i class="iconfont icon-favoritesicon"></i>
          <span slot="title">收藏</span>
        </el-menu-item>
        <el-menu-item index="/dailySongs">
          <i class="iconfont icon-tuijian"></i>
          <span slot="title">每日推荐</span>
        </el-menu-item>
        <el-menu-item-group v-if="isShow">
          <template slot="title">创建的歌单</template>
          <el-menu-item :index="`/musicListDetail/${c.id}`" v-for="(c, index) in createMusicList" :key="c.id">
            <i class="iconfont icon-gedan"></i>
            <span v-if="index === 0">我喜欢的音乐</span>
            <span v-if="index !== 0">{{ c.name }}</span>
          </el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group v-if="isShow">
          <template slot="title">收藏的歌单</template>
          <el-menu-item :index="`/musicListDetail/${s.id}`" v-for="s in subsctibedMusicList" :key="s.id">
            <i class="iconfont icon-gedan"></i>
            <span>{{ s.name }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </aside>
    <main>
      <router-view :key="$route.fullPath"></router-view>
      <!-- :key="$route.fullPath" 解决跳转相同页面，参数不同，不会刷新页面的问题(两个歌单之前切换)-->
    </main>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Content',
  data() {
    return {
      defaultActive: this.pathActive(),
      isShow: false, // 创建/收藏歌单是否显示
    }
  },
  computed: {
    ...mapState({
      createMusicList: (state) => state.user.myCreateList, // 我创建的歌单
      subsctibedMusicList: (state) => state.user.mySubscribedList, // 我收藏的歌单
    }),

    path() {
      return this.$route.path
    },
  },
  watch: {
    // 监视路径变化 让默认激活的路径随之变化
    path(newVal, oldVal) {
      this.defaultActive = newVal
    },
  },
  methods: {
    // 获取歌单
    async getMyMusicList() {
      console.log('2')
      try {
        // 获取本地存储的userId
        let uid = localStorage.getItem('userId')
        await this.$store.dispatch('getMyMusicList', uid)
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 用户登录后回调
    userLogin() {
      console.log('Content组件知道用户登录了')
      this.isShow = true
    },

    // 用户退出后回调
    userLogout() {
      console.log('Content组件知道用户退出了')
      this.isShow = false
    },

    pathActive() {
      if (
        this.path == '/discover/recommend' ||
        '/discover/musiclist' ||
        '/discover/ranking' ||
        '/discover/singer'
      ) {
        return '/discover/recommend'
      } else if (this.path == '/video/videolist' || '/video/mv') {
        return '/video/videolist'
      } else if (this.path == '/favorites/favoritealbum' || '/favorites/singer' || '/favorites/video') {
        return '/favorites/favoritealbum'
      } else {
        return this.path
      }
    },
  },
  mounted() {
    if (localStorage.getItem('userId')) {
      this.isShow = true
    } else {
      this.isShow = false
    }
    this.$bus.$on('myMusicList', this.getMyMusicList) // 获取我的歌单
    this.$bus.$on('contentLogin', this.userLogin) // 用户登录 doSomething...
    this.$bus.$on('contentLogout', this.userLogout) // 用户退出登录 doSomething...
    /* 
      全局事件总线：多个组件可以给同一个方法绑定回调，但是后绑定的那个回调会执行两次，
      有点晕...还是一个全局事件 对应 一个回调比较好。不要重名！
    */
  },
}
</script>

<style scoped lang="less">
section {
  width: 100%;
  height: calc(100vh - 128px); // vh视口高度(view-hight)
  display: flex;
  // 歌单
  aside {
    width: 210px;
    min-width: 210px;
    height: 100%;
    border-right: 1px solid #ddd;
    box-sizing: border-box;
    overflow: auto;
    overflow-x: hidden; // 水平滚动条不显示
    i {
      font-size: 17px;
    }
    span {
      font-size: 14.5px;
      display: inline-block;
      width: 162px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      padding-left: 10px;
    }
  }

  // 内容
  main {
    width: calc(100vw - 210px);
    min-width: 750px;
    height: 100%; // calc(100vh - 128px)
  }
}
</style>
