<template>
  <div class="user">
    <!-- 用户信息 -->
    <div class="userinfo">
      <!-- 头像 -->
      <div class="left">
        <img v-lazy="user.avatar" />
      </div>
      <!-- 信息 -->
      <div class="right">
        <div class="rightTop">
          <div class="username">
            <div class="name">{{ user.name }}</div>
            <div class="logout" @click="logout" v-if="showLogout">
              <i class="iconfont icon-tuichu-"></i>
              <span>退出登录</span>
            </div>
          </div>
          <div class="level">Lv{{ user.level }}</div>
        </div>
        <div class="rightBottom">
          <div class="numsData clearfix">
            <div class="numItem">
              <p class="top">{{ userEventSize }}</p>
              <p class="bottom">动态</p>
            </div>
            <div class="numItem">
              <p class="top">{{ userFollowSize }}</p>
              <p class="bottom">关注</p>
            </div>
            <div class="numItem">
              <p class="top">{{ userFansSize }}</p>
              <p class="bottom">粉丝</p>
            </div>
          </div>
          <div class="otherData">
            <div class="otherItem">
              <span class="title">用户ID：</span>
              <span class="text">{{ $route.params.userId }}</span>
            </div>
            <div class="otherItem">
              <span class="title">所在地区：</span>
              <span class="text">{{ user.address }}</span>
            </div>
            <div class="otherItem">
              <span class="title">个人介绍：</span>
              <span class="text jieshao">{{ user.signature || '这个人很懒，没有写个人介绍' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 歌单 -->
    <div class="musicList">
      <!-- 标题 -->
      <div class="musicTitle">{{ user.name }}创建的歌单({{ createList.length }})</div>
      <!-- 歌单内容 -->
      <div class="musicContent">
        <div class="musicItem" v-for="c in createList" :key="c.id" @click="goMusicListDetail(c.id)">
          <div class="image">
            <!-- ?param=400y400 限制图片的宽高 -->
            <img v-lazy="c.coverImgUrl + '?param=400y400'" />
          </div>
          <p>{{ c.name }}</p>
        </div>
      </div>

      <div class="musicTitle">{{ user.name }}收藏的歌单({{ subscribedList.length }})</div>
      <div class="musicContent">
        <div class="musicItem" v-for="s in subscribedList" :key="s.id" @click="goMusicListDetail(s.id)">
          <div class="image">
            <img v-lazy="s.coverImgUrl + '?param=400y400'" />
          </div>
          <p>{{ s.name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'User',
  data() {
    return {
      user: {
        avatar: require('@/assets/avatar.jpg'), // 头像
        name: '', // 昵称
        level: '?', // 等级
        address: '', // 所在地区
        signature: '', // 个人介绍
      },
      createList: [], // 创建的歌单
      subscribedList: [], // 收藏的歌单
      userEventSize: 0, // 动态数
      userFollowSize: 0, // 关注数
      userFansSize: 0, // 粉丝数
    }
  },
  computed: {
    // 显示/隐藏 退出登录按钮
    showLogout() {
      let curUid = this.$route.params.userId // 当前路径uid
      let myUid = localStorage.getItem('userId') // 我的uid
      if (curUid !== myUid) {
        return false
      } else {
        return true
      }
    },

    // 获取当前页面的userId
    myUid() {
      return this.$route.params.userId
    },

    // 获取vuex中保存的用户数据
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    // 退出登录
    logout() {
      // 清除localStorage里保存的userId
      localStorage.removeItem('userId')

      this.$message({
        message: '退出成功',
        type: 'success',
      })

      this.$bus.$emit('headerLogout') // 告诉Header组件 我点了退出登录按钮
      this.$bus.$emit('contentLogout') // 告诉Content组件 我点了退出登录按钮

      // 跳转首页
      this.$router.replace({
        path: '/',
      })
    },

    // 获取用户基本数据
    async getBasicUserData() {
      // 获取路径中的userId
      let uid = this.$route.params.userId // 字符串
      try {
        await this.$store.dispatch('userDetailById', uid) // 发请求
        // 将仓库中 用户数据 保存到自身
        let userData = this.$store.state.user.userInfo
        this.user.name = userData.name // 名
        this.user.avatar = userData.avatar // 头像
        this.user.level = userData.level // 等级
        this.user.address = userData.address[0] + ' ' + userData.address[1] // 所在地
        this.user.signature = userData.signature // 个人介绍
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取歌单
    async getMusicList() {
      try {
        // 获取当前路径上的userId
        let uid = this.$route.params.userId // 字符串
        await this.$store.dispatch('getMusicList', uid)
        this.createList = this.$store.state.user.createList // 创建的歌单
        this.subscribedList = this.$store.state.user.subscribedList // 收藏的歌单
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取用户动态数量
    async getUserEventNums() {
      try {
        // 注意这里的this.myUid是计算属性 方便拿到当前页的 userId
        await this.$store.dispatch('getUserEventNums', this.myUid)
        // 将数据存到自身
        this.userEventSize = this.$store.state.user.userEventNums
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取用户关注数量
    async getUserFollowNums() {
      try {
        await this.$store.dispatch('getUserFollowNums', this.myUid)
        // 将数据保存到组件身上
        this.userFollowSize = this.$store.state.user.userFollowNums
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取用户粉丝数量
    async getUserFanNums() {
      try {
        await this.$store.dispatch('getUserFanNums', this.myUid)
        // 将数据保存到自身
        this.userFansSize = this.$store.state.user.userFanNums
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 去歌单详细页
    goMusicListDetail(musicListId) {
      this.$router.push({
        name: 'musicListDetail',
        params: {
          musicListId,
        },
      })
    },
  },
  async mounted() {
    // 获取基本用户数据
    await this.getBasicUserData()
    // 获取歌单
    this.getMusicList()
    // 获取用户 动态数、关注数、粉丝数
    this.getUserEventNums()
    this.getUserFollowNums()
    this.getUserFanNums()
    console.log('User挂载完毕')
  },
}
</script>

<style scoped lang="less">
.user {
  height: 100%;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  padding: 0 30px;
  // 用户信息
  .userinfo {
    width: 100%;
    margin: 30px 0px;
    display: flex;
    // 头像
    .left {
      height: 180px;
      margin-right: 20px;
      img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
      }
    }
    // 详细信息
    .right {
      flex: 1;
      // 上边布局
      .rightTop {
        width: 100%;
        border-bottom: 1px solid #ddd;
        // 用户昵称 退出登录按钮 盒子
        .username {
          display: flex;
          justify-content: space-between;
          height: 34px;
          // 昵称
          .name {
            color: rgb(66, 66, 66);
            font-size: 26px;
            font-weight: bold;
          }
          // 退出登录按钮
          .logout {
            width: 100px;
            line-height: 30px;
            border: 1px solid #ddd;
            border-radius: 30px;
            text-align: center;
            color: #555353;
            cursor: pointer;
            // 按钮hover
            &:hover {
              background-color: #f9f9f9;
            }
            // 图标
            i {
              font-size: 13px;
              font-weight: bold;
              margin-right: 5px;
            }
            // 字
            span {
              font-size: 14px;
            }
          }
        }
        // 等级
        .level {
          width: 33px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          font-size: 12px;
          border-radius: 30px;
          color: rgb(102, 100, 100);
          background-color: #ddd;
          margin: 10px 0;
        }
      }
      // 下边布局
      .rightBottom {
        margin-top: 10px;
        width: 100%;
        // 动态 关注 粉丝
        .numsData {
          margin-bottom: 15px;
          .numItem {
            padding: 0 28px;
            float: left;
            text-align: center;
            cursor: pointer;
            // 第一个Item
            &:first-child {
              padding: 0 28px 0 5px;
            }
            // 除了第一个Item 都加上右边框
            &:not(:last-child) {
              border-right: 1px solid #eee;
            }
            // 数字
            .top {
              margin-bottom: 5px;
              color: #4d4b4b;
              font-size: 22px;
            }
            // 文字
            .bottom {
              font-size: 12px;
              color: rgb(124, 123, 123);
            }
          }
        }
        // 其他数据
        .otherData {
          // 个人介绍太长了不好看,让这个盒子最宽1000px
          max-width: 1000px;
          .otherItem {
            font-size: 13.5px;
            margin: 8px 0;
            user-select: text;
            .title {
              color: #424242;
            }
            .text {
              color: #727272;
            }
            // 个人介绍
            .jieshao {
              line-height: 1.2;
            }
          }
        }
      }
    }
  }
  // 歌单
  .musicList {
    max-width: 1400px;
    margin: 0 auto;
    padding-bottom: 30px;
    // 标题
    .musicTitle {
      color: #424242;
      font-size: 18px;
      font-weight: bold;
      padding-bottom: 15px;
    }
    // 内容
    .musicContent {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      // 小歌单盒子
      .musicItem {
        width: 18.4%;
        margin: 0 2% 20px 0;
        cursor: pointer;
        &:nth-child(5n) {
          // 选5的倍数
          margin-right: 0;
        }
        // 歌单封面
        .image {
          position: relative;
          height: 0; // 高度为0px
          width: 100%;
          padding-bottom: 100%; // 通过下内边距100%设置为 width 一样数值（这就响应式宽高了）
          margin-bottom: 5px;
          overflow: hidden;

          img {
            background-size: contain;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            border-radius: 10px;
          }
        }
        // 歌单名
        p {
          font-size: 15px;
          line-height: 1.2;
        }
      }
    }
  }
}
</style>
