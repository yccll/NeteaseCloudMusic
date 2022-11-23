<template>
  <div class="albumDetail" ref="albumDetail">
    <!-- 专辑信息 -->
    <div class="albumInfo">
      <div class="left">
        <img v-lazy="albumInfo.picUrl + '?param=300y300'" />
      </div>
      <div class="right">
        <!-- 名字 -->
        <div class="albumName">
          <span class="nameTag">专辑</span>
          <div class="name">{{ albumInfo.name }}</div>
        </div>

        <!-- 按钮 -->
        <div class="buttons">
          <!-- 播放全部 -->
          <div class="btnItem" @click="bofangAll">
            <i class="iconfont icon-bofang"></i>
            <span>播放全部</span>
          </div>

          <!-- 收藏 -->
          <div class="btnItem" v-if="!isSub" @click="subscribe">
            <i class="iconfont icon-xihuan1"></i>
            <span>收藏</span>
          </div>

          <!-- 已收藏 -->
          <div class="btnItem" v-if="isSub" @click="unSubscribe">
            <i class="iconfont icon-xihuan red"></i>
            <span>已收藏</span>
          </div>

          <!-- 分享 -->
          <div class="btnItem">
            <i class="iconfont icon-fenxiang"></i>
            <span>分享</span>
          </div>
        </div>

        <!-- 歌手、发布时间 -->
        <div class="otherInfo">
          <!-- 歌手 -->
          <div class="singer"><span>歌手: </span>{{ albumInfo.artists[0].name }}</div>
          <!-- 发布时间 -->
          <div class="createTime"><span>发布时间: </span>{{ albumInfo.publishTime }}</div>
        </div>
      </div>
    </div>

    <!-- el-tabs -->
    <template>
      <el-tabs v-model="activeName">
        <!-- 歌曲列表 -->
        <el-tab-pane label="歌曲列表" name="first">
          <!-- el-table -->
          <template>
            <el-table
              :data="albumInfo.songs"
              highlight-current-row
              style="width: 100%"
              :cell-style="cellStyle"
              @row-dblclick="playCurrentMusic"
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
              <div class="btnItem" @click="albumComment">评论</div>
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
            <h3 class="newComments" v-show="comments.length">最新评论</h3>
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

        <!-- 专辑详情 -->
        <el-tab-pane label="专辑详情" name="third">
          <div class="desc">
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {{ albumInfo.description }}
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'AlbumDetail',
  props: ['albumId'],
  data() {
    return {
      albumList: [], // 收藏的专辑列表
      isSub: false, // 是否已经收藏

      activeName: 'first', // el-tabs默认选中
      albumInfo: {
        songs: [],
        picUrl: '', // 封面
        name: '',
        artists: [{}], // 歌手
        publishTime: '', // 发布时间
        description: '', // 描述
      },

      repliedCommentId: '', // 回复评论id
      textarea: '', // 评论内容
      loading: false, // 加载状态

      currentPage: 1, // 当前页
      total: 100, // 总共多少条数据
      offset: 0, // 分页 0 20 40 60
      hotComments: [],
      comments: [],
    }
  },
  computed: {
    // 映射music仓库
    ...mapState({
      music: (state) => state.music,
      album: (state) => state.album,
    }),
  },
  methods: {
    // 获取收藏的专辑列表
    async getFavoriteAlbumList() {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        return
      }
      try {
        // 如果收藏仓库中没有 专辑列表 就发请求
        if (this.$store.state.favorites.albumList.length == 0) {
          await this.$store.dispatch('getFavoriteAlbumList')
        }
        this.albumList = this.$store.state.favorites.albumList
        this.albumList.forEach((item) => {
          if (item.id == this.albumId) {
            this.isSub = true
            return
          }
        })
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取专辑详细
    async getAlbumDetail() {
      try {
        await this.$store.dispatch('getAlbumDetailInfo', this.albumId)
        this.albumInfo = this.$store.state.album.albumInfo
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 双击播放
    playCurrentMusic(row, column, event) {
      if (this.music.playSongId === row.id) return // 重复选择
      this.music.playSongId = row.id // 改变播放歌曲id
      this.$bus.$emit('changePlaylist', this.albumInfo.songs, Date.now()) // 改变播放列表
      /*
        这里的Date.now()代替歌单id 让每次播放专辑里的歌曲都改变一次播放列表
      */
      this.$bus.$emit('playMusic') // 播放音乐
    },

    // 选中样式
    cellStyle({ row }) {
      if (row.id === this.music.playSongId) {
        return {
          color: '#ec4141',
        }
      }
    },

    // 播放全部
    bofangAll() {
      this.playCurrentMusic(this.albumInfo.songs[0]) // 双击第一首歌
    },

    // 获取专辑评论
    async getAlbumComments() {
      try {
        this.loading = true
        // 整理参数
        let obj = {}
        obj.id = this.albumId
        obj.offset = this.offset * 20

        await this.$store.dispatch('getAlbumComment', obj)

        this.loading = false

        this.total = this.album.commentTotal
        this.hotComments = this.album.hotComments
        this.comments = this.album.comments
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 发表评论
    async albumComment() {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        this.$message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }
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
        obj.type = 3 // 专辑
        obj.id = this.albumId
        obj.content = this.textarea

        if (this.repliedCommentId) {
          obj.t = 2
          obj.commentId = this.repliedCommentId // 回复评论id
          obj.content = this.textarea.slice(this.textarea.indexOf(':') + 1) // 去除第一个:及其之前的内容
        }

        await this.$store.dispatch('albumComment', obj)
        await this.getAlbumComments() // 重新获取评论

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
      if (this.$refs.albumDetail.scrollTop > 283) {
        // 快速定位到评论框
        this.$refs.albumDetail.scrollTop = 283
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
        obj.id = this.albumId
        obj.cid = cid
        obj.t = Number(!likeOrNo)
        obj.type = 3

        await this.$store.dispatch('albumCommentLike', obj)
        await this.getAlbumComments() // 重新获取专辑评论
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
        let height = this.$refs.albumDetail.scrollTop
        this.$refs.albumDetail.scrollTop -= height / 10
        if (this.$refs.albumDetail.scrollTop <= 283) {
          this.$refs.albumDetail.scrollTop = 283
          clearInterval(timer)
        }
      }, 10)
      await this.getAlbumComments()
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

    // 收藏专辑
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
        obj.id = this.albumId

        this.$store.dispatch('subsctibeAlbum', obj)
        this.isSub = !this.isSub
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),

    // 取消收藏专辑
    unSubscribe: _.throttle(async function () {
      try {
        // 整理参数
        let obj = {}
        obj.t = 2 // 取消收藏
        obj.id = this.albumId

        this.$store.dispatch('subsctibeAlbum', obj)
        this.isSub = !this.isSub
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),
  },
  mounted() {
    // 获取收藏的专辑列表
    this.getFavoriteAlbumList()
    // 获取专辑详细
    this.getAlbumDetail()
    // 获取专辑评论
    this.getAlbumComments()
  },
}
</script>

<style lang="less" scoped>
.albumDetail {
  width: 100%;
  height: 100%;
  overflow: auto;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;

  // 专辑信息
  .albumInfo {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 30px 10px;
    box-sizing: border-box;
    .left {
      margin-right: 20px;
      img {
        width: 180px;
        height: 180px;
        border-radius: 10px;
      }
    }
    .right {
      width: calc(100% - 200px);
      // 专辑名
      .albumName {
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

        // 专辑名
        .name {
          color: #2c2c2c;
          font-size: 24px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      // 按钮
      .buttons {
        display: flex;
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
          // 第一个按钮 特殊点
          &:first-child {
            color: #fff;
            background-color: #ec4141;
          }
          &:first-child:hover {
            background-color: #e03b3b;
          }
          &:hover {
            background-color: rgb(248, 248, 248);
          }
        }
      }

      // 歌手、发布时间
      .otherInfo {
        margin-top: 10px;
        font-size: 14px;
        color: #5a5a5a;
        .singer {
          margin-bottom: 6px;
        }
      }
    }
  }

  .empty {
    height: 50px;
  }

  // 评论
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
}
</style>
