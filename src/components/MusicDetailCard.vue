<template>
  <!-- tabindex让该元素可以聚焦，vue的键盘事件一般都是绑定给能聚焦的元素。 -->
  <div
    class="musicDetailCard"
    :class="{ hide: !cardShow, glassCard: glassState }"
    ref="musicDetailCard"
    tabindex="-1"
    @keyup.esc="closeCard"
  >
    <!-- 关闭卡片 -->
    <div class="closeCard" @click="cardShow = false">
      <i class="iconfont icon-down1"></i>
    </div>

    <!-- 改变卡片背景 -->
    <div class="changeBackground" @click="glassSwitch">
      <i class="iconfont icon-background-l"></i>
    </div>

    <!-- 评论按钮 -->
    <div class="commentButton" @click="dialogSwitch" v-show="this.playSongId">
      <i class="iconfont icon-bianji"></i>
      <span>发表我的评论</span>
    </div>

    <el-dialog :visible.sync="dialogVisible" top="30vh" :modal="false" width="30%" @open="dialogOpen">
      <div class="title">歌曲:{{ songName }}</div>
      <el-input
        type="textarea"
        placeholder="留下你的评论"
        v-model="textarea"
        resize="none"
        maxlength="150"
        ref="textarea"
        v-loading="publishLoading"
      ></el-input>
      <div class="count">{{ textarea.length }}/150</div>

      <span slot="footer" class="dialog-footer">
        <div class="btnItem" @click="songComment">评论</div>
      </span>
    </el-dialog>

    <!-- 卡片内容 -->
    <div class="musicDetailCardContent" ref="content" v-show="this.playSongId">
      <!-- 播放歌曲 -->
      <div class="top">
        <!-- 旋转光碟 -->
        <div class="left">
          <!-- 指针 -->
          <div class="needle" :class="{ pause: !playState }">
            <img src="@/assets/needle.png" />
          </div>
          <!-- 光碟 -->
          <div class="disc" :class="{ pause: !playState, reset: discReset }">
            <img src="@/assets/disc.png" />
            <img v-lazy="album.picUrl + '?param=500y500'" class="musicCover" />
          </div>
        </div>
        <!-- 歌词 -->
        <div class="right">
          <!-- 歌名 -->
          <div class="songName">{{ songName }}</div>
          <!-- 专辑 -->
          <div class="albumName">{{ album.name }}</div>
          <!-- 歌手 -->
          <div class="singer">{{ singer }}</div>
          <!-- 歌词 -->
          <div
            class="lyrics"
            ref="lyrics"
            v-loading="lyricsLoading"
            element-loading-background="rgba(200 , 200, 200, 0.1)"
          >
            <div class="empty"></div>
            <template v-for="(item, index) in lyrics">
              <div class="lyricsItem" :class="{ active: index === curActive }">
                {{ item.msg }}
              </div>
            </template>
            <div class="empty"></div>
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <div class="bottom" v-loading="loading" element-loading-background="rgba(200 , 200, 200, 0.1)">
        <!-- 热门评论 -->
        <template v-if="hotComments.length">
          <div>
            <h3>热门评论</h3>
            <div class="commentItem" v-for="(item, index) in hotComments" :key="item.commentId">
              <!-- 用户头像 -->
              <div class="left">
                <img
                  v-lazy="item.user.avatarUrl + '?param=100y100'"
                  @click="goUserDetail(item.user.userId)"
                />
              </div>

              <!-- 评论内容 -->
              <div class="right">
                <!-- 内容 -->
                <div class="content">
                  <span class="userName" @click="goUserDetail(item.user.userId)"
                    >{{ item.user.nickname }}:
                  </span>
                  <span>{{ item.content }}</span>
                </div>

                <!-- 回复评论 -->
                <div class="replied" v-if="item.beReplied.length">
                  <div class="repliedItem">
                    <span class="repliedUser" @click="goUserDetail(item.beReplied[0].user.userId)">
                      @{{ item.beReplied[0].user.nickname }}:
                    </span>
                    <span class="repliedContent">{{ item.beReplied[0].content }}</span>
                  </div>
                </div>

                <div class="button">
                  <!-- 创建时间 -->
                  <div class="createdTime">{{ item.timeStr }}</div>

                  <div class="btns">
                    <div class="btn" :class="{ liked: item.liked }">
                      <i class="iconfont icon-tuijian" @click="likeComment(item.commentId, item.liked)"></i>
                      <div class="like">{{ item.likedCount }}</div>
                    </div>
                    <div class="btn">
                      <i class="iconfont icon-fenxiang1"></i>
                    </div>
                    <div class="btn">
                      <i class="iconfont icon-pinglun1" @click="repliedComment(item)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 最新评论 -->
        <h3 class="newComments">最新评论</h3>
        <div class="commentItem" v-for="(item, index) in comments" :key="item.commentId">
          <!-- 用户头像 -->
          <div class="left">
            <img v-lazy="item.user.avatarUrl + '?param=100y100'" @click="goUserDetail(item.user.userId)" />
          </div>

          <!-- 评论内容 -->
          <div class="right">
            <div class="content">
              <span class="userName" @click="goUserDetail(item.user.userId)">{{ item.user.nickname }}: </span>
              <span>{{ item.content }}</span>
            </div>

            <!-- 回复评论 -->
            <div class="replied" v-if="item.beReplied.length">
              <div class="repliedItem">
                <span class="repliedUser" @click="goUserDetail(item.beReplied[0].user.userId)">
                  @{{ item.beReplied[0].user.nickname }}:
                </span>
                <span class="repliedContent"> {{ item.beReplied[0].content }} </span>
              </div>
            </div>

            <div class="button">
              <!-- 创建时间 -->
              <div class="createdTime">{{ item.timeStr }}</div>

              <div class="btns">
                <div class="btn" :class="{ liked: item.liked }">
                  <i class="iconfont icon-tuijian" @click="likeComment(item.commentId, item.liked)"></i>
                  <div class="like">{{ item.likedCount }}</div>
                </div>
                <div class="btn">
                  <i class="iconfont icon-fenxiang1"></i>
                </div>
                <div class="btn">
                  <i class="iconfont icon-pinglun1" @click="repliedComment(item)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="page" v-if="comments.length">
        <el-pagination
          background
          layout="prev, pager, next"
          :current-page="currentPage"
          :page-size="20"
          :total="total"
          @current-change="changePage"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 暂无播放音乐 -->
    <div class="noPlaySongId" v-if="!this.playSongId">暂无播放音乐</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MusicDetailCard',
  data() {
    return {
      cardShow: false, // 卡片显示状态
      discReset: false, // 重置光碟
      glassState: false, // 玻璃效果

      // 歌曲信息
      songName: '',
      album: {},
      singer: '',
      duration: '', // 时长
      lyrics: [], // 歌词
      lyricsLoading: false, // 歌词 加载中状态
      currentTime: 0, // 当前时长
      curActive: 0, // 当前高亮歌词

      currentPage: 1, // 当前页
      total: 100, // 总共多少条数据
      offset: 0, // 分页 0 20 40 60
      hotComments: [], // 热门评论
      comments: [], // 最新评论

      repliedCommentId: '', // 回复评论id
      textarea: '', // 评论
      publishLoading: false, // 发表评论 加载中状态
      loading: false, // 评论 加载中状态
      dialogVisible: false, // 评论框
    }
  },
  computed: {
    // 映射music 和 card仓库
    ...mapState({
      music: (state) => state.music,
      card: (state) => state.card,
    }),

    // 歌曲ID
    playSongId() {
      return this.music.playSongId
    },
    // 播放状态
    playState() {
      return this.music.playState
    },
    // 播放列表
    playlist() {
      return this.music.playlist
    },
  },
  watch: {
    // 卡片显示
    cardShow(newVal, oldVal) {
      // 只要卡片显示就触发
      if (newVal) {
        // 如果当前评论id 不等于播放音乐id
        if (this.card.nowMusicId != this.playSongId) {
          this.getSongComments()
        }
      }
    },

    // 如果音乐id改变就获取歌词
    playSongId(newVal, oldVal) {
      this.getSongLyrics() // 获取歌词

      this.$refs.content.scrollTop = 0
      this.currentPage = 1 // 当前页 1
      this.offset = 0 // 回到第一页
      // 如果卡片显示了 && 如果当前所有评论对应的音乐id 不等于播放音乐id
      if (this.cardShow && this.card.nowMusicId != this.playSongId) {
        this.getSongComments()
      }
    },

    // 当前时间 高亮哪句歌词
    currentTime() {
      let index = this.curActive //当前高亮歌词索引
      // 最后一句
      if (index + 1 >= this.lyrics.length) {
        this.curActive = index
        return
      }
      if (this.currentTime >= this.lyrics[index + 1].time) {
        this.curActive = index + 1
        this.$refs.lyrics.scrollTop = this.curActive * 56
      }
    },
  },
  methods: {
    // 改变卡片状态
    cardState() {
      this.cardShow = !this.cardShow
      if (this.cardShow) {
        this.$refs.musicDetailCard.focus()
      }
    },

    // 关闭卡片
    closeCard() {
      this.cardShow = false
    },

    // 获取歌词
    async getSongLyrics() {
      try {
        this.lyricsLoading = true // 加载中

        clearInterval(this.timer) // 清除时间定时器
        this.curActive = 0 // 当前高亮歌词索引
        this.discReset = true // 重置光碟位置
        this.currentTime = 0 // 复位当前播放时间
        this.$refs.lyrics.scrollTop = 0 // 歌词回到顶部

        await this.$store.dispatch('getLyrics', this.playSongId)
        this.lyrics = this.$store.getters.finalLyrics

        this.lyricsLoading = false // 加载中状态关闭

        this.discReset = false // 重新开启光碟旋转动画

        console.log('查找当前歌曲信息')
        // 循环music仓库中的 播放列表 拿到 当前歌曲信息
        for (var i = 0; i < this.playlist.length; i++) {
          if (this.playlist[i].id == this.playSongId) {
            this.songName = this.playlist[i].name
            this.album = this.playlist[i].al
            this.singer = this.playlist[i].ar

            // 加工时长为 秒
            let dt = this.playlist[i].dt //歌曲时长
            this.duration = dt.slice(0, 2) * 60 + Number(dt.slice(3))

            this.music.playSongIndex = i // 保存索引
            break // 跳出循环
          }
        }

        // 开启定时器
        this.curTimer()
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        })
      }
    },

    // 播放时长 定时器
    curTimer() {
      this.timer = setInterval(() => {
        this.currentTime += 0.20
        // 如果当前时长 大于等于 总时长（播放完毕）
        if (this.currentTime >= this.duration) {
          this.currentTime = 0
          clearInterval(this.timer)
        }
      }, 200)
    },

    // 改变播放进度
    changeCurTime(time) {
      console.log('触发改变卡片播放进度事件')
      this.currentTime = time

      // 改变歌词高亮
      for (var i = 0; i < this.lyrics.length; i++) {
        if (this.currentTime >= this.lyrics[i].time && this.currentTime < this.lyrics[i + 1].time) {
          this.curActive = i
          this.$refs.lyrics.scrollTop = i * 56
        }
      }
    },

    // 播放
    play() {
      // console.log('卡片播放')
      this.curTimer() // 开启定时器
    },

    // 暂停
    pause() {
      // console.log('卡片暂停')
      clearInterval(this.timer) // 清除定时器
    },

    // 获取评论
    async getSongComments() {
      try {
        this.loading = true // 记载中....
        // 整理参数
        let obj = {}
        obj.id = this.playSongId
        obj.offset = this.offset * 20

        await this.$store.dispatch('reqSongComments', obj)
        this.total = this.card.commentTotal // 总数
        this.hotComments = this.card.hotComments // 热门评论
        this.comments = this.card.comments // 评论

        this.loading = false // 加载中消失
      } catch (error) {
        this.$message({
          type: 'error',
          message: error,
        })
      }
    },

    // 改变页数
    async changePage(page) {
      this.currentPage = page

      this.offset = page - 1
      this.$refs.content.scrollTop = 530
      await this.getSongComments()
    },

    // 发表评论
    async songComment() {
      try {
        this.publishLoading = true // 加载中...
        // 如果内容为空
        if (!this.textarea || !this.textarea.trim()) {
          this.$message({
            message: '评论不能为空',
            type: 'warning',
          })
          return
        }
        // 如果回复别人 没有输入内容
        if (this.repliedCommentId) {
          let index = this.textarea.indexOf(':')
          if (this.textarea.length <= index + 1) {
            this.$message({
              message: '评论不能为空',
              type: 'warning',
            })
            return
          }
        }

        // 整理参数
        let obj = {}
        obj.t = 1 // 评论
        obj.type = 0 // 歌曲
        obj.id = this.playSongId
        obj.content = this.textarea

        // 如果有回复评论id 则改变t的值
        if (this.repliedCommentId) {
          obj.t = 2 // 回复
          obj.commentId = this.repliedCommentId // 回复评论id
          obj.content = this.textarea.slice(this.textarea.indexOf(':') + 1) // 去除第一个:及其之前的内容
        }

        await this.$store.dispatch('songComment', obj)
        this.publishLoading = false // 关闭加载中...
        await this.getSongComments() // 重新获取评论

        this.textarea = '' // 清空输入框
        this.repliedCommentId = '' // 清空回复评论id
        this.dialogVisible = false // 关闭弹出框
      } catch (error) {
        this.textarea = '' // 清空输入框
        this.publishLoading = false // 关闭加载中...
        this.dialogVisible = false // 关闭弹出框
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 回复评论
    repliedComment(item) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
      this.textarea = '回复' + item.user.nickname + ':'
      this.repliedCommentId = item.commentId // 回复评论id
      this.dialogVisible = true // 显示弹出框

      // 监听textarea内容 如果用户按了删除键，就表示不想回复，则清除回复评论ID
      this.oldLength = this.textarea.length
      this.$watch('textarea', function (newVal, oldVal) {
        if (newVal.length < this.oldLength) {
          this.repliedCommentId = ''
        }
      })
    },

    // 点赞评论
    async likeComment(cid, likeOrNo) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
      try {
        // 整理参数
        let obj = {}
        obj.id = this.playSongId
        obj.cid = cid
        obj.t = Number(!likeOrNo)
        obj.type = 0 // 歌曲

        await this.$store.dispatch('songCommentLike', obj)
        await this.getSongComments()
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 弹出框显示按钮
    dialogSwitch() {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
      this.dialogVisible = true
      this.textarea = ''
      this.repliedCommentId = ''
    },

    // 弹出框打开时 使文本框获取焦点
    dialogOpen() {
      this.dialogVisible = true
      this.$nextTick(function () {
        this.$refs.textarea.focus()
      })
    },

    // 跳转用户详情页
    goUserDetail(id) {
      this.cardShow = false // 关闭卡片
      this.$router.push({
        name: 'user',
        params: {
          userId: id,
        },
      })
    },

    // 毛玻璃效果开关
    glassSwitch() {
      this.glassState = !this.glassState
    },
  },
  mounted() {
    // 给全局事件总线绑定 改变卡片状态事件
    this.$bus.$on('musicDetailCardState', this.cardState)
    this.$bus.$on('tellCardCurTime', this.changeCurTime) // 改变播放进度
    this.$bus.$on('tellCardPlay', this.play) // 播放
    this.$bus.$on('tellCardPause', this.pause) // 暂停
  },
}
</script>

<style lang="less" scoped>
.musicDetailCard {
  position: fixed; // 以浏览器可视窗口作为参照点
  z-index: 1001; // 要盖住Header组件
  height: calc(100vh - 68px);
  width: 100%;
  bottom: 68px;
  transition: bottom 0.5s ease;
  background-image: linear-gradient(to bottom, #e3e2e3, #fff);

  &.hide {
    bottom: calc(-100vh + 68px); // 负整个高度
  }

  // 毛玻璃效果
  &.glassCard {
    // 有bug
    // backdrop-filter: blur(50px) brightness(90%) !important;
    // background-color: unset !important;
    // background-image: unset !important;

    // .musicDetailCardContent {
    //   .bottom {
    //     .commentItem {
    //       border-bottom: 1px solid #a1a1a1;
    //       .right {
    //         .content {
    //           color: #535353;
    //         }
    //         .replied {
    //           background-color: rgba(0, 0, 0, 0.1);
    //           .repliedItem {
    //             .repliedContent {
    //               color: #535353;
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  }

  // 清除聚焦后的黑边线
  &:focus-visible {
    outline: 0;
  }

  // 关闭卡片
  .closeCard {
    position: absolute;
    top: 20px;
    left: 50px;
    cursor: pointer;
    i {
      font-size: 32px;
      color: #535353;
      font-weight: bold;
    }
  }

  // 改变背景颜色
  .changeBackground {
    position: absolute;
    bottom: 15px;
    right: 20px;
    border: 1px solid #5f5f5f;
    border-radius: 3px;
    cursor: pointer;
    i {
      font-size: 16px;
      color: #5f5f5f;
    }
  }

  // 评论按钮
  .commentButton {
    position: absolute;
    z-index: 2;
    left: calc(50% - 65px);
    bottom: 20px;
    font-size: 15px;
    color: #535353;
    background-color: #dddddd;
    padding: 10px;
    border-radius: 30px;
    cursor: pointer;
    i {
      font-size: 15px;
      margin-right: 5px;
    }
  }

  // 卡片内容
  .musicDetailCardContent {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-y: overlay; //使垂直滚动条出现 且不影响布局

    .top {
      height: 500px;
      display: flex;
      justify-content: center;

      .left {
        margin-top: 80px;
        padding: 0 80px 0 0;
        position: relative;
        // 指针
        .needle {
          position: relative;
          z-index: 2;
          width: 100px;
          height: 80px;
          left: 126px;
          top: 10px;
          transform-origin: 5px 5px; // 旋转中心 左上角
          transform: rotate(20deg);
          transition: all 0.8s ease;

          &.pause {
            transform: rotate(0deg); // rotate 0 就暂停播放
          }

          img {
            width: 100%;
            height: 100%;
          }
        }

        // 圆盘
        .disc {
          position: relative;
          width: 260px;
          height: 260px;

          img {
            width: 100%;
            height: 100%;
          }
          // 音乐封面
          img.musicCover {
            position: absolute;
            z-index: -1;
            width: 180px;
            height: 180px;
            left: 40px;
            top: 40px;
          }

          animation: playDisc 26s linear 0.8s infinite forwards;

          // 重置
          &.reset {
            animation: none;
          }

          // 暂停
          &.pause {
            animation-play-state: paused; // 暂停动画
          }

          @keyframes playDisc {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        }
      }

      .right {
        width: 460px;
        margin-top: 40px;
        text-align: center;
        // 歌名
        .songName {
          font-size: 30px;
          line-height: 30px;
          margin-bottom: 10px;
          // 只显示1行，超过的省略
          word-break: break-all;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        // 专辑
        .albumName {
          line-height: 1;
          color: #8d8d8d;
          margin-bottom: 10px;
          // 只显示1行，超过的省略
          word-break: break-all;
          word-wrap: break-word;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        // 歌手
        .singer {
          color: #8d8d8d;
          padding-bottom: 20px;
        }
        // 歌词
        .lyrics {
          height: 300px;
          overflow-y: scroll;
          border-radius: 10px; // 让v-loading好看点
          &::-webkit-scrollbar {
            display: none; // 隐藏滚动条
          }

          .lyricsItem {
            color: #5a5a5a;
            padding: 20px 10px;
            transition: font-size 0.1s ease;
            &.active {
              font-size: 20px;
              font-weight: bold;
              color: #333;
            }
          }

          .empty {
            height: 122px;
          }
        }
      }
    }

    .bottom {
      width: 860px;
      margin: 0 auto;
      padding-top: 30px;
      border-radius: 10px; // 让v-loading好看点
      overflow: hidden; // 这个也是配合上面的属性让 v-loading好看点
      // background-color: #;
      h3 {
        font-size: 18px;
        font-weight: bold;
        margin: 10px 0 20px 0;
        &.newComments {
          margin: 30px 0 20px 0;
        }
      }
      .commentItem {
        display: flex;
        padding: 20px 0;
        border-bottom: 1px solid #ddd;
        .left {
          width: 50px;
          height: 100%;
          margin-right: 10px;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
          }
        }
        .right {
          flex-grow: 1;
          .content {
            font-size: 15px;
            line-height: 1.3;
            color: #888888;
            .userName {
              color: #608ebd;
              cursor: pointer;
            }
          }

          .replied {
            margin-top: 10px;
            background-color: rgb(233, 233, 233);
            padding: 10px 15px;
            border-radius: 5px;
            .repliedItem {
              font-size: 15px;
              line-height: 1.3;
              color: #888888;
              .repliedUser {
                color: #608ebd;
                cursor: pointer;
              }
              .repliedContent {
              }
            }
          }

          .button {
            margin-top: 20px;
            display: flex;
            width: 100%;
            justify-content: space-between;
            font-size: 15px;
            color: #888888;
            // 创建时间
            .createdTime {
            }

            .btns {
              display: flex;

              .btn {
                padding: 0 15px;
                display: flex;
                align-items: center;
                &.liked {
                  color: #ec4141;
                }
                i {
                  font-size: 18px;
                  cursor: pointer;
                }
                .like {
                  margin-left: 5px;
                }
              }
            }
          }
        }
      }
    }

    // 分页器
    .page {
      text-align: center;
      padding: 30px 0 70px 0;
    }
  }

  // 暂无播放音乐
  .noPlaySongId {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: calc(50% - 75px);
    font-size: 25px;
    font-weight: bold;
    color: #707070;
  }
}
</style>
