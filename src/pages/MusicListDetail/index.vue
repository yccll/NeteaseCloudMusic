<template>
  <div class="musicListDetail" ref="musicListDetail" v-loading="pageShow">
    <!-- 歌单信息 -->
    <div class="listInfo clearfix">
      <div class="left">
        <img v-lazy="musicListInfo.coverImg" />
      </div>
      <div class="right">
        <div class="rightTop">
          <div class="listName">
            <span class="nameTag">歌单</span>
            <div class="name">{{ musicListInfo.name }}</div>
          </div>
          <!-- 创作者 -->
          <div class="creater">
            <!-- 头像 -->
            <div class="createAvatar">
              <img v-lazy="musicListInfo.creatorAvatar" />
            </div>
            <!-- 名字 -->
            <div class="createName">
              <router-link :to="`/user/${musicListInfo.creatorId}`">{{
                musicListInfo.creatorName
              }}</router-link>
            </div>
            <!-- 创建时间 -->
            <div class="createTime">{{ musicListInfo.createTime }}创建</div>
          </div>
          <!-- 按钮 -->
          <div class="buttons">
            <div class="btnItem playAll" @click="bofangAll">
              <i class="iconfont icon-bofang"></i>
              <span>播放全部</span>
            </div>
            <!-- 收藏按钮 -->
            <div class="subscribe" v-if="musicListInfo.creatorId != myUserId">
              <!-- 如果创建者id不等于本地存储的id也就是用户id 就显示 收藏按钮 -->
              <div class="btnItem" v-if="musicListInfo.subscribed" @click="unSubscribe">
                <i class="iconfont icon-xihuan red"></i>
                <span>已收藏</span>
              </div>
              <div class="btnItem" v-else @click="subscribe">
                <i class="iconfont icon-xihuan1"></i>
                <span>收藏</span>
              </div>
            </div>
            <div class="btnItem">
              <i class="iconfont icon-fenxiang"></i>
              <span>分享</span>
            </div>
          </div>
        </div>
        <div class="rightBottom">
          <div class="tags">
            标签：<span v-for="(t, index) in musicListInfo.tags" :key="index">{{ t }}</span>
            <span v-show="!musicListInfo.tags.length" style="color: #5a5a5a">暂无标签</span>
          </div>
          <div class="otherInfo">
            歌曲：{{ musicListInfo.songNums }} &nbsp;&nbsp;&nbsp;&nbsp; 播放: {{ musicListInfo.playCount }}
          </div>
          <div class="desc">简介：{{ musicListInfo.description || '暂无简介' }}</div>
        </div>
      </div>
    </div>

    <!-- el-tabs -->
    <template>
      <el-tabs v-model="activeName" @tab-click="toggleTab">
        <!-- 歌曲列表 -->
        <el-tab-pane label="歌曲列表" name="first">
          <!-- 无限滚动 + el-table -->
          <template>
            <el-table
              :data="songs"
              highlight-current-row
              style="width: 100%"
              :cell-style="cellStyle"
              @row-dblclick="playCurrentMusic"
              infinite-scroll-immediate="false"
              v-infinite-scroll="loadMore"
              infinite-scroll-distance="1600"
              infinite-scroll-disabled="busy"
              class="w"
            >
              <el-table-column type="index" width="50">
                <template slot-scope="row">
                  <span>{{ row.$index + 1 < 10 ? '0' + (row.$index + 1) : row.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column width="55"><i class="iconfont icon-xiazai1"></i></el-table-column>
              <el-table-column prop="name" label="音乐标题" min-width="430"> </el-table-column>
              <el-table-column prop="ar" label="歌手" min-width="150"> </el-table-column>
              <el-table-column prop="al.name" label="专辑" min-width="175"></el-table-column>
              <el-table-column prop="dt" label="时长" min-width="100"> </el-table-column>
            </el-table>
          </template>

          <div class="empty"></div>
        </el-tab-pane>

        <!-- 评论 -->
        <el-tab-pane label="评论" name="second">
          <!-- 评论框 -->
          <div class="comment" v-loading="loading">
            <el-input
              type="textarea"
              placeholder="留下你的评论"
              v-model="textarea"
              resize="none"
              maxlength="150"
              ref="textarea"
            >
            </el-input>
            <div class="count">{{ textarea.length }}/150</div>
            <div class="submit">
              <div class="btnItem" @click="musicListComment">评论</div>
            </div>
          </div>

          <!-- 评论内容 -->
          <div class="commentContent" v-loading="loading">
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
                        <span class="repliedContent"> {{ item.beReplied[0].content }} </span>
                      </div>
                    </div>

                    <div class="button">
                      <!-- 创建时间 -->
                      <div class="createdTime">{{ item.timeStr }}</div>

                      <div class="btns">
                        <div class="btn" :class="{ liked: item.liked }">
                          <i
                            class="iconfont icon-tuijian"
                            @click="likeComment(item.commentId, item.liked)"
                          ></i>
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
                <img
                  v-lazy="item.user.avatarUrl + '?param=100y100'"
                  @click="goUserDetail(item.user.userId)"
                />
              </div>

              <!-- 评论内容 -->
              <div class="right">
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
        </el-tab-pane>

        <!-- 收藏者 -->
        <el-tab-pane label="收藏者" name="third">
          <div
            class="userItemContainer"
            infinite-scroll-immediate="false"
            v-infinite-scroll="loadMoreSubscribers"
            infinite-scroll-distance="300"
            infinite-scroll-disabled="subscribersBusy"
          >
            <div
              class="userItem"
              v-for="(item, index) in subscribers"
              :key="item.userId"
              @click="goUserDetail(item.userId)"
            >
              <div class="left">
                <div class="image">
                  <img v-lazy="item.avatarUrl + '?param=100y100'" />
                </div>
              </div>
              <div class="right">
                <div class="nickname">{{ item.nickname }}</div>
                <div class="signature">{{ item.signature }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>

    <!-- element 是要回到哪个元素的顶部，这个字符串是当前组件$refs里的属性 -->
    <BackTop element="musicListDetail" />
  </div>
</template>

<script>
import _ from 'lodash'
import BackTop from '@/feature/backTop' // 引入回到顶部组件
import { mapState } from 'vuex'
import { controller } from '@/api/axios.js'

export default {
  name: 'MusicListDetail',
  props: ['musicListId'],
  data() {
    return {
      myUserId: localStorage.getItem('userId'), // 我的用户id
      pageShow: true, // 页面loading
      activeName: 'first', // el-tabs默认选中
      musicListInfo: {
        tags: [], // 标签
      }, // 歌单信息
      songIds: [], // 所有歌曲id
      songs: [], // 所有显示歌曲
      busy: false, // 无限滚动禁用

      repliedCommentId: '', // 回复评论id
      textarea: '', // 评论内容
      loading: false, // 加载状态

      currentPage: 1, // 当前页
      total: 100, // 总共多少条数据
      offset: 0, // 分页 0 20 40 60
      hotComments: [],
      comments: [],

      subscribers: [], // 收藏者
      subscribersTotal: '', // 收藏者总数
      subscriberOffset: 0, // 收藏者分页 0 20 40 ...
      subscribersBusy: true, // 收藏者无限滚动禁用
    }
  },
  components: {
    BackTop, // 注册回到顶部组件
  },
  computed: {
    ...mapState({
      music: (state) => {
        return state.music
      },
    }),
  },
  methods: {
    // 无限滚动加载
    async loadMore() {
      console.log('加载更多歌曲...')
      let { songIds, songs } = this // 解构出songIds
      /* 先禁用无限滚动,等带请求完毕后再启用,以免用户滚动过快,数据还没有返回就再次触发该事件,导致无限加载bug出现 */
      this.busy = true // 禁用-无限滚动
      if (songs.length + 100 <= songIds.length) {
        console.log('加载一部分...')
        await this.$store.dispatch('getMusicListSongs', songIds.slice(songs.length, songs.length + 100))
        this.songs = this.$store.state.music.songs
        this.busy = false // 取消禁用-无限滚动
      } else {
        /* 可能歌曲很少 <=100  首次就加载完了，后面再就不用执行二次加载 */
        if (songs.length === songIds.length) return
        console.log('加载最后一部分...')
        await this.$store.dispatch('getMusicListSongs', songIds.slice(songs.length, songIds.length))
        this.songs = this.$store.state.music.songs
      }
    },

    // 获取歌单详细信息
    async getMusicListDetail() {
      console.log('获取歌单信息')
      try {
        await this.$store.dispatch('getMusicListDetail', this.musicListId)
        // 保存歌单信息
        this.musicListInfo = this.$store.state.music.musicListInfo

        // 保存所有歌曲id
        this.musicListInfo.trackIds.forEach((item) => {
          this.songIds.push(item.id)
        })
        this.pageShow = false // 页面loading
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取歌单歌曲
    async getSongs() {
      console.log('获取歌单歌曲')
      let { songIds } = this // 解构出songIds
      try {
        // 先拿前100首
        if (songIds.length <= 100) {
          await this.$store.dispatch('getMusicListSongs', songIds)
        } else {
          await this.$store.dispatch('getMusicListSongs', songIds.slice(0, 100))
        }
        this.songs = this.$store.state.music.songs // 将所有歌曲保存到自身
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 播放选中歌曲(双击)
    playCurrentMusic(row, cloumn, event) {
      if (this.music.playSongId === row.id) return // 重复选择
      this.music.playSongId = row.id // 改变选中当前歌曲id
      /*
        this.music.playSongId 是保存在仓库中的播放歌曲id
      */

      // 改变播放列表
      if (this.musicListInfo.tracks.length < this.musicListInfo.trackIds.length) {
        // 如果tracks不完整
        this.$bus.$emit('changePlaylist', this.songs, Date.now()) // 就把显示的歌曲传到播放列表
        /*
          如果tracks不完整，就把playlistId设置成时间戳，每次在歌单详细页点击播放歌单的歌曲都会更改播放列表
        */
      } else {
        /*
          如果tracks完整，就把真实的歌单id带过去，下次在这个歌单详细页点击播放歌曲不会再次更改播放列表
        */
        this.$bus.$emit('changePlaylist', this.musicListInfo.tracks, this.musicListId) // 否则就说明tracks完整，则直接把tracks传到播放列表
      }

      this.$bus.$emit('playMusic') // 播放音乐
    },

    // 选中行样式
    cellStyle({ row }) {
      if (row.id === this.music.playSongId) {
        return {
          color: '#ec4141',
        }
      }
    },

    // 播放全部
    bofangAll() {
      this.playCurrentMusic(this.songs[0]) // 也就是点击第一首歌曲播放而已
    },

    // 收藏歌单(节流)
    subscribe: _.throttle(async function () {
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
        obj.t = 1 // 收藏
        obj.id = this.musicListId

        await this.$store.dispatch('subscribeMusicList', obj)
        console.log('收藏歌单成功')
        await this.getMusicListDetail()
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),

    // 取消收藏歌单(节流)
    unSubscribe: _.throttle(async function () {
      try {
        // 整理参数
        let obj = {}
        obj.t = 2 // 取消收藏
        obj.id = this.musicListId

        await this.$store.dispatch('subscribeMusicList', obj)
        console.log('取消收藏歌单成功')
        await this.getMusicListDetail()
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),

    // 获取歌单评论
    async getMusicListComments() {
      try {
        this.loading = true
        // 整理参数
        let obj = {}
        obj.id = this.musicListId
        obj.offset = this.offset * 20

        await this.$store.dispatch('getMusicListComment', obj)

        this.loading = false

        this.total = this.music.commentTotal
        this.hotComments = this.music.hotComments
        this.comments = this.music.comments
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 切换标签
    async toggleTab(tab) {
      if (tab.label == '歌曲列表') {
        if (this.songs.length < this.songIds.length) {
          // 如果还没有加载完
          this.busy = false // 开启无限滚动
        }
        this.subscribersBusy = true // 禁用收藏者无限滚动
      } else if (tab.label == '收藏者') {
        if (this.subscribers.length < this.subscribersTotal) {
          this.subscribersBusy = false // 开启收藏者无限滚动
        }
        this.busy = true // 禁用无限滚动
      } else {
        this.busy = true // 禁用无限滚动
        this.subscribersBusy = true // 禁用收藏者无限滚动
      }
    },

    // 发表评论
    async musicListComment() {
      try {
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
        obj.t = 1
        obj.type = 2 // 歌单
        obj.id = this.musicListId
        obj.content = this.textarea

        if (this.repliedCommentId) {
          obj.t = 2
          obj.commentId = this.repliedCommentId // 回复评论id
          obj.content = this.textarea.slice(this.textarea.indexOf(':') + 1) // 去除第一个:及其之前的内容
        }

        await this.$store.dispatch('musicListComment', obj)
        await this.getMusicListComments() // 重新获取评论

        this.textarea = '' // 清空输入框
        this.repliedCommentId = '' // 清空回复评论id
      } catch (error) {
        this.textarea = '' // 清空输入框

        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 回复评论
    repliedComment(item) {
      this.textarea = '回复' + item.user.nickname + ':'
      this.repliedCommentId = item.commentId // 回复评论id
      if (this.$refs.musicListDetail.scrollTop > 283) {
        // 快速定位到评论框
        this.$refs.musicListDetail.scrollTop = 283
      }
      this.$refs.textarea.focus() // 自动获取焦点

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
        obj.id = this.musicListId
        obj.cid = cid
        obj.t = Number(!likeOrNo)
        obj.type = 2

        await this.$store.dispatch('musicListCommentLike', obj)
        await this.getMusicListComments() // 重新获取专辑评论
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 改变页数
    async changePage(page) {
      this.offset = page - 1
      // 优化回到顶部动画
      let timer = setInterval(() => {
        let height = this.$refs.musicListDetail.scrollTop
        this.$refs.musicListDetail.scrollTop -= height / 10
        if (this.$refs.musicListDetail.scrollTop <= 283) {
          this.$refs.musicListDetail.scrollTop = 283
          clearInterval(timer)
        }
      }, 10)
      await this.getMusicListComments()
    },

    // 跳转用户详情页
    goUserDetail(id) {
      this.$router.push({
        name: 'user',
        params: {
          userId: id,
        },
      })
    },

    // 获取歌单收藏者
    async getMusicListSubscribers() {
      try {
        // 整理参数
        let obj = {}
        obj.id = this.musicListId
        obj.offset = this.subscriberOffset * 20

        await this.$store.dispatch('getMusicListSubscribers', obj)
        this.subscribersTotal = this.music.subscribersTotal // 保存收藏者总数
        this.subscribers = this.subscribers.concat(this.music.subscribers) // 添加收藏者
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 收藏者无限滚动事件
    async loadMoreSubscribers() {
      console.log('加载更多收藏者...')
      this.subscribersBusy = true // 禁用无限滚动
      this.subscriberOffset++ // 下一页
      await this.getMusicListSubscribers()
      this.subscribersBusy = !this.music.subscribersHasMore // 根据hasmore字段判断是否开启无限滚动
    },
  },
  async mounted() {
    await this.getMusicListDetail() // 获取歌单详细信息
    await this.getSongs() // 获取歌单歌曲

    // 获取歌单评论
    this.getMusicListComments()

    // 获取歌单收藏者
    this.getMusicListSubscribers()
  },
  beforeDestroy() {
    console.log('清除仓库中的歌曲')
    this.$store.state.music.songs = [] // 清除仓库中保存的歌曲
    // 取消未完成的请求
    controller.abort()
  },
}
</script>

<style scoped lang="less">
.musicListDetail {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;

  /************ first ************/
  // 歌单信息
  .listInfo {
    width: 100%;
    padding: 30px 10px;
    box-sizing: border-box;
    .left {
      float: left;
      margin-right: 20px;
      img {
        width: 180px;
        height: 180px;
        border-radius: 10px;
      }
    }
    .right {
      float: left;
      width: calc(100% - 200px);
      .rightTop {
        // 歌单名容器
        .listName {
          display: flex;
          padding: 0 5px;
          margin-bottom: 12px;

          // 小标签
          .nameTag {
            flex-shrink: 0;
            font-size: 12px;
            padding: 3.5px 2px;
            color: #ec4141;
            border: 1px solid #ec4141;
            border-radius: 3px;
            margin-right: 10px;
            margin-top: 3px;
          }
          // 歌单名
          .name {
            color: #2c2c2c;
            font-size: 24px;
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        // 创建者容器
        .creater {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          // 头像
          .createAvatar {
            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
            }
          }
          // 名字
          .createName {
            margin: 0 10px;
            a {
              font-size: 15px;
              color: #608ebd;
              text-decoration: none;
            }
          }
          .createTime {
            color: #6a6a6a;
            font-size: 13px;
          }
        }
        // 按钮
        .buttons {
          display: flex;
          .subscribe {
            display: flex;
          }
          .btnItem {
            font-size: 14px;
            padding: 9px 15px;
            border: 1px solid #ddd;
            border-radius: 30px;
            margin-right: 10px;
            cursor: pointer;
            i {
              margin-right: 3px;
              &.red {
                color: #ec4141;
              }
            }
            // 播放全部
            &.playAll {
              color: #fff;
              background-color: #ec4141;
            }
            &.playAll:hover {
              background-color: #e03b3b;
            }
            &:hover {
              background-color: rgb(248, 248, 248);
            }
          }
        }
      }
      .rightBottom {
        margin-top: 10px;
        font-size: 14px;
        color: #5a5a5a;
        // 标签
        .tags {
          span {
            margin: 0 3px;
            color: #608ebd;
            &:first-child {
              margin: 0 3px 0 0;
            }
          }
        }
        // 歌曲 播放
        .otherInfo {
          margin: 8px 0;
        }
        // 简介
        .desc {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  // 底部空白
  .empty {
    height: 50px;
  }

  /************ second ************/
  // 评论框
  .comment {
    position: relative;
    width: 100%;
    h3 {
      font-size: 18px;
      font-weight: bold;
      margin: 10px 0;
    }
    .count {
      position: absolute;
      bottom: 56px;
      right: 3px;
      font-size: 15px;
      color: #ccc;
    }
    .submit {
      padding: 10px 0;
      text-align: end;
      .btnItem {
        display: inline-block;
        font-size: 14px;
        padding: 9px 20px;
        border: 1px solid #ddd;
        border-radius: 30px;
        cursor: pointer;
        &:hover {
          background-color: rgb(248, 248, 248);
        }
      }
    }
  }

  // 评论内容
  .commentContent {
    width: 100%;
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
    padding-top: 30px;
  }

  /************ third ************/
  // 收藏者
  .userItemContainer {
    display: flex;
    flex-wrap: wrap;
    padding: 0 60px;

    .userItem {
      display: flex;
      width: 400px;
      margin: 0 auto;
      border-radius: 10px;
      cursor: pointer;
      margin-bottom: 20px;

      &:hover {
        background-color: rgb(245, 245, 245);
      }
      .left {
        width: 100px;
        height: 110px;
        padding: 10px 0 0 10px;
        box-sizing: border-box;
        .image {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          img {
            height: 100%;
            width: 100%;
          }
        }
      }
      .right {
        padding: 15px 10px 0 10px;
        box-sizing: border-box;
        flex-grow: 1;
        .nickname {
          color: #535353;
          margin-bottom: 5px;
        }
        .signature {
          width: 100%;
          color: rgb(161, 161, 161);
          font-size: 15px;
          line-height: 1.1;
          word-wrap: break-word;
          word-break: break-all;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
