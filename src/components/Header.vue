<template>
  <header class="header w clearfix">
    <div class="left">
      <img src="../assets/logo.png" />
    </div>
    <div class="center">
      <!-- 后退前进按钮 -->
      <div class="buttons">
        <i class="iconfont icon-xiangzuo" @click="back"></i>
        <i class="iconfont icon-xiangyou" @click="forward"></i>
      </div>
      <!-- 搜索框 -->
      <div class="search" @click="searchPopoverShow = true">
        <!-- 图标 -->
        <span id="icon" class="iconfont icon-sousuo"></span>
        <!-- 输入框 -->
        <el-popover
          placement="bottom"
          width="375"
          trigger="click"
          :visible-arrow="false"
          v-model="searchPopoverShow"
          popper-class="hotSearchPopover"
        >
          <!-- 触发popover的元素 -->
          <input
            id="inp"
            type="text"
            placeholder="请输入搜索内容"
            slot="reference"
            autocomplete="off"
            @keyup.enter="goSearchDetail(keyWord)"
            v-model="keyWord"
          />

          <!-- popover内容 排行榜-->
          <!-- 热搜榜 -->
          <div class="hotSearch" v-show="!suggestShow">
            <div class="hotSearchTitle">
              <span>热搜榜</span>
              <img src="../assets/hot.jpg" />
            </div>
            <div
              class="hotSearchItem"
              v-for="(item, index) in hotSearchList"
              :key="index"
              @click="goSearchDetail(item.searchWord, $event)"
            >
              <div class="hotSearchIndex" :class="{ topThree: index < 3 }">{{ index + 1 }}</div>
              <div class="hotSearchInfo">
                <div class="hotSearchWord">{{ item.searchWord }}</div>
                <div class="hotSearchContent">{{ item.content }}</div>
              </div>
            </div>
          </div>

          <!-- 搜索建议 -->
          <div class="searchSuggest" v-show="suggestShow">
            <div class="searchSuggestTitle">
              <span>搜索建议</span>
            </div>

            <!-- 单曲 -->
            <div class="songs">
              <!-- 标题 -->
              <div class="title"><i class="iconfont icon-music"></i>单曲</div>

              <!-- 推荐内容 -->
              <div
                class="item"
                v-for="song in searchSuggest.songs"
                :key="song.id"
                @click="playSearchMusic(song)"
              >
                {{ song.name }} — {{ song.artists[0].name }}
              </div>

              <!-- 暂无 -->
              <div class="nodata" v-if="!searchSuggest.songs">
                <span>暂无</span>
              </div>
            </div>

            <!-- 歌手 -->
            <div class="singer">
              <!-- 标题 -->
              <div class="title"><i class="iconfont icon-maikefeng"></i>歌手</div>
              <!-- 推荐内容 -->
              <div
                class="item"
                v-for="singer in searchSuggest.artists"
                :key="singer.id"
                @click="routerPush('singerDetail', { singerId: singer.id })"
              >
                {{ singer.name }}
              </div>

              <!-- 暂无 -->
              <div class="nodata" v-if="!searchSuggest.artists">
                <span>暂无</span>
              </div>
            </div>

            <!-- 专辑 -->
            <div class="album">
              <!-- 标题 -->
              <div class="title"><i class="iconfont icon-zhuanji"></i>专辑</div>
              <!-- 推荐内容 -->
              <div
                class="item"
                v-for="album in searchSuggest.albums"
                :key="album.id"
                @click="routerPush('albumDetail', { albumId: album.id })"
              >
                {{ album.name }} — {{ album.artist.name }}
              </div>

              <!-- 暂无 -->
              <div class="nodata" v-if="!searchSuggest.albums">
                <span>暂无</span>
              </div>
            </div>

            <!-- 歌单 -->
            <div class="musiclist">
              <!-- 标题 -->
              <div class="title"><i class="iconfont icon-gedan"></i>歌单</div>

              <!-- 推荐内容 -->
              <div
                class="item"
                v-for="musiclist in searchSuggest.playlists"
                :key="musiclist.id"
                @click="routerPush('musicListDetail', { musicListId: musiclist.id })"
              >
                {{ musiclist.name }}
              </div>

              <!-- 暂无 -->
              <div class="nodata" v-if="!searchSuggest.playlists">
                <span>暂无</span>
              </div>
            </div>
          </div>
        </el-popover>
      </div>
    </div>
    <div class="right">
      <div class="user">
        <!-- 头像 -->
        <div class="avatar">
          <!-- 头像 首次默认不显示 -->
          <img :src="avatar" v-if="!loginPopover" @click="userHome" />

          <!-- 登录弹出框 -->
          <el-popover placement="bottom" width="330" trigger="click" v-if="loginPopover">
            <!-- 触发popover弹出框的元素加上slot="reference" -->
            <img slot="reference" :src="avatar" />

            <!-- popover内容 -->
            <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
              <el-form-item label="手机号码：" required>
                <input class="loginInp" type="text" v-model="form.phone" />
              </el-form-item>
              <el-form-item label="密码：" required>
                <input class="loginInp" type="password" v-model="form.password" @keyup.enter="login" />
              </el-form-item>
              <div class="loginButton">
                <el-button type="danger" round @click="login">登录</el-button>
              </div>
            </el-form>
          </el-popover>
        </div>
        <div class="userName">{{ userName }}</div>
      </div>
    </div>
  </header>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'Header',
  data() {
    return {
      avatar: require('@/assets/avatar.jpg'),
      userName: '点击头像登录',
      keyWord: '', // 搜索关键字
      searchSuggest: {}, // 搜索建议
      form: {
        phone: '', // 手机号
        password: '', // 密码
      },
      // 如果本地存储了userId，那登录弹出框 不可用
      loginPopover: localStorage.getItem('userId') ? false : true,
      hotSearchList: [], // 热搜榜数据
      suggestShow: false, // 显示搜索建议
      searchPopoverShow: false, // 搜索弹出框状态
    }
  },
  watch: {
    keyWord(newValue) {
      if (newValue === '') {
        this.suggestShow = false // 当输入内容为空 不显示搜索建议
        return
      }
      this.getSearchSuggest()
    },
  },
  methods: {
    // 后退
    back() {
      this.$router.back()
    },
    // 前进
    forward() {
      this.$router.forward()
    },

    // 登录
    async login() {
      // 判断手机号 和 密码是否为空
      if (this.form.phone && this.form.password) {
        try {
          // 调用vuex中的方法 发请求
          await this.$store.dispatch('userLogin', this.form) // 登录

          // 获取vuex中保存的 用户头像 和 用户名
          this.userName = this.$store.state.user.userInfo.name
          this.avatar = this.$store.state.user.userInfo.avatar

          // 登录弹出框不可用
          this.loginPopover = false

          this.$bus.$emit('myMusicList') // 让Content组件，获取我的歌单
          // 告诉content组件登录成功了,显示我的歌单
          this.$bus.$emit('contentLogin')

          // 显示登录成功
          this.$message({
            message: '登录成功!',
            type: 'success',
          })
        } catch (error) {
          this.$message({
            message: error,
            type: 'error',
          })
        }
      } else {
        this.$message({
          showClose: true,
          message: '手机号或密码不能为空哦！',
          type: 'warning',
        })
      }
    },

    // 刷新后根据userid获取用户信息
    async userDetailById() {
      console.log('1')
      try {
        if (localStorage.getItem('userId')) {
          // 如果本地存储了userId
          let uid = localStorage.getItem('userId')
          // 获取用户信息
          await this.$store.dispatch('userDetailById', uid)

          // 获取vuex中保存的 用户头像 和 用户名
          this.userName = this.$store.state.user.userInfo.name
          this.avatar = this.$store.state.user.userInfo.avatar

          this.$bus.$emit('myMusicList') // 让Content组件获取我的歌单
        }
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取热搜榜数据
    async getHotSearch() {
      try {
        await this.$store.dispatch('getHotSearchList')
        // 把热搜榜数据存到自身
        this.hotSearchList = this.$store.state.user.hotSearchList
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转个人主页
    userHome() {
      this.$router.push({
        name: 'user',
        params: {
          userId: localStorage.getItem('userId'),
        },
      })
    },

    // user页面 退出登录按钮回调
    logout() {
      console.log('Header组件知道用户退出了')
      this.loginPopover = true
      // 把数据改成初始值 （未登录之前）
      this.avatar = require('@/assets/avatar.jpg')
      this.userName = '点击头像登录'
      this.form.phone = '' // 清空之前输入的手机号
      this.form.password = '' // 清空之前输入的密码
    },

    // 获取搜索建议(防抖)
    getSearchSuggest: _.debounce(async function () {
      try {
        if (!this.keyWord.trim()) return // 如果关键字为空 不发请求
        this.searchSuggest = {} // 清除上次的数据
        await this.$store.dispatch('getSearchSuggest', this.keyWord)
        this.searchSuggest = this.$store.state.user.searchSuggest
        this.suggestShow = true // 显示搜索建议
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 800),

    // 搜索建议跳转其他页面
    routerPush(name, params) {
      this.searchPopoverShow = false // 隐藏弹出框
      this.$router.push({
        name,
        params: {
          ...params,
          /* 
            这是为了兼容 歌手、专辑、歌单都可以用这个方法跳转，但是三个页面的参数名不一样
            传一个params对象过来在里面展开就行了
          */
        },
      })
    },

    // 播放搜索建议歌曲
    async playSearchMusic(song) {
      try {
        // 由于搜索建议给的单曲格式不符合加入播放列表，再次请求拿到完整格式
        await this.$store.dispatch('playSearchSong', song.id) // music仓库中
        let newSong = this.$store.state.music.searchSongInfo
        console.log(newSong)
        this.searchPopoverShow = false // 隐藏弹出框

        this.$bus.$emit('addSongInPlaylist', newSong) // 添加一首歌到播放列表
        
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转搜索详细页
    goSearchDetail(keywords, event) {
      this.keyWord = keywords
      // 热搜榜跳转到搜索详细页面要把弹出框隐藏
      this.$nextTick(() => {
        // 下次页面刷新之后再隐藏才有效果
        this.searchPopoverShow = false
      })

      // 跳转页面
      this.$router.push({
        path: `/search/songs/${keywords}`,
      })
    },
  },
  mounted() {
    // 获取热搜榜数据
    this.getHotSearch()

    // 根据localStorage里的userId获取用户信息
    this.userDetailById()

    // 全局事件总线 绑定用户退出登录 回调
    this.$bus.$on('headerLogout', this.logout)
    console.log('Hader挂载完毕')
  },
}
</script>

<style scoped lang="less">
// 头部
.header {
  width: 100%;
  height: 60px;
  background-color: #ec4141;
  position: relative;
  z-index: 1000;
  // logo
  .left {
    float: left;
    width: 220px;
    height: 60px;
    img {
      vertical-align: bottom;
      width: 140px;
      height: 40px;
      margin: 10px;
    }
  }
  // 搜索和前进后退按钮
  .center {
    float: left;
    display: flex;
    margin-top: 16px;
    // 前进后退按钮
    .buttons i {
      display: inline-block;
      text-align: center;
      line-height: 25px;
      height: 25px;
      width: 25px;
      border-radius: 50%;
      margin: 0 3px;
      color: #ebebeb;
      background-color: rgba(192, 192, 192, 0.2);
      cursor: pointer;
      &:hover {
        background-color: rgba(192, 192, 192, 0.5);
      }
    }
    // 搜索框
    .search {
      position: relative;
      overflow: hidden;
      margin-left: 10px;
      // 放大镜图标
      #icon {
        position: absolute;
        cursor: pointer;
        z-index: 1;
        font-size: 18px;
        padding: 6px 8px;
        color: #ebebeb;
      }
      // 输入框
      #inp {
        position: relative;
        z-index: 2; // 盖住搜索图标 拖拉全选，如果拖到icon上弹出框会消失，盖住则不会
        padding: 0 15px 0 32px;
        height: 32px;
        width: 132px;
        border: none;
        border-radius: 30px;
        background-color: rgba(192, 192, 192, 0.2);
        color: #fff;
        caret-color: #fff; // 光标颜色
        // 聚焦没有边线
        &:focus {
          outline: none;
        }
        // 提示文字颜色
        &::placeholder {
          color: #ebebeb;
        }
      }
    }
  }
  // 用户登录
  .right {
    float: right;
    width: 190px;
    height: 100%;
    margin-right: 30px;
    // 用户信息
    .user {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      // 头像
      .avatar {
        margin: 7px;
        height: 40px;
        width: 40px;
        img {
          vertical-align: bottom;
          cursor: pointer;
          border-radius: 50%;
          width: 100%;
          height: 100%;
        }
      }
      // 昵称
      .userName {
        width: 133px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.85);
        font-size: 15px;
      }
    }
  }
}

// 手机号 密码 输入框
.loginInp {
  border: 1px solid #999;
  border-radius: 7px;
  height: 30px;
  font-size: 18px;
  &:focus {
    outline: none;
  }
}

// 登录按钮
.loginButton {
  text-align: center;
  .el-button {
    background-color: rgb(255, 87, 87) !important;
  }
}

// 热搜榜
.hotSearch {
  // 大标题
  .hotSearchTitle {
    font-size: 16px;
    padding: 13px 0 10px 20px;
    img {
      width: 31px;
      transform: translateX(5px);
    }
  }
  // 内容
  .hotSearchItem {
    display: flex;
    align-items: center;
    padding: 6px 20px;
    cursor: pointer;
    &:hover {
      background-color: #ddd;
    }
    // 排行
    .hotSearchIndex {
      width: 40px;
      font-size: 17px;
    }
    // 前三
    .hotSearchIndex.topThree {
      color: #ec4141;
    }
    // 信息
    .hotSearchInfo {
      // 搜索词
      .hotSearchWord {
        font-weight: bold;
      }
      // 内容
      .hotSearchContent {
        width: 300px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

// 搜索建议
.searchSuggest {
  // 标题
  .searchSuggestTitle {
    font-size: 16px;
    padding: 13px 0 10px 20px;
  }

  .songs,
  .singer,
  .album,
  .musiclist {
    .title {
      padding: 5px 10px;
      font-size: 15px;
      background-color: #f5f5f5;
      i {
        font-size: 15px;
        margin-right: 5px;
      }
    }

    .item {
      padding: 5px 10px 5px 30px;
      cursor: pointer;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      &:hover {
        background-color: #f0f0f0;
      }
    }

    // 暂无
    .nodata {
      text-align: center;
      padding: 5px;
    }
  }
}
</style>
