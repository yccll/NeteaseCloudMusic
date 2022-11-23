<template>
  <div class="mvDetail" ref="mvDetail">
    <div class="mv">
      <!-- MV详情、相关推荐 -->
      <div class="top">
        <!-- MV详情 -->
        <div class="left">
          <h3>MV详情</h3>
          <!-- MV盒子 -->
          <div class="mvBox">
            <!-- video元素上的poster属性 是 封面 -->
            <video :src="mvUrl" :poster="mvInfo.coverUrl" controls ref="video"></video>
          </div>
          <!-- 视频信息 -->
          <div class="mvInfo">
            <!-- 创建用户 -->
            <div class="createUser">
              <div class="image" @click="goSingerDetail(mvInfo.singer.id)">
                <img :src="mvInfo.singer.img1v1Url + '?param=100y100'" />
              </div>
              <div class="name" @click="goSingerDetail(mvInfo.singer.id)">
                {{ mvInfo.singer.name }}
              </div>
            </div>
            <!-- 视频标题 -->
            <div class="title">
              <div class="mvTitle">{{ mvInfo.title }}</div>
              <div class="otherInfo">
                发布时间:{{ mvInfo.publishTime }}
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                播放:{{ mvInfo.playCount }}
              </div>
            </div>
            <!-- 按钮 -->
            <div class="buttons">
              <div class="btnItem">
                <i class="iconfont icon-tuijian"></i>
                <span>点赞</span>
              </div>

              <!-- 已收藏 -->
              <div class="btnItem" v-if="mvInfo.subed" @click="unSubscribe">
                <i class="iconfont icon-xihuan red"></i>
                <span>已收藏</span>
              </div>

              <!-- 收藏 -->
              <div class="btnItem" v-else @click="subscribe">
                <i class="iconfont icon-xihuan1"></i>
                <span>收藏</span>
              </div>

              <div class="btnItem">
                <i class="iconfont icon-fenxiang"></i>
                <span>分享</span>
              </div>
            </div>
          </div>
          <!-- 评论 -->
          <div class="comment" v-loading="loading">
            <h3>评论</h3>
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
              <div class="btnItem" @click="mvComment">评论</div>
            </div>
          </div>
        </div>

        <!-- 相关推荐 -->
        <div class="right">
          <h3>相关推荐</h3>
          <div class="aboutItem" v-for="item in relatedMv" :key="item.id" @click="goMvDetail(item.id)">
            <div class="image">
              <img v-lazy="item.cover + '?param=180y110'" />
              <div class="playCount"><i class="iconfont icon-video"></i>{{ item.playCount }}</div>
              <div class="duration">{{ item.duration }}</div>
            </div>
            <div class="info">
              <div class="title">{{ item.name }}</div>
              <div class="author">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论 -->
      <div class="bottom" v-loading="loading">
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
            <!-- 内容 -->
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

      <!-- 分页器 -->
      <div class="page" v-show="comments.length">
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
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  name: 'MvDetail',
  props: ['mvid'],
  data() {
    return {
      mvInfo: {
        singer: {
          img1v1Url: require('@/assets/lazy.jpg'),
        },
      }, // mv信息
      mvUrl: '', // mvUrl
      relatedMv: [], // 相关mv

      repliedCommentId: '', // 回复评论id
      textarea: '', // 评论框内容
      loading: false, // 加载状态

      currentPage: 1, //当前页
      total: 100, // 总共多少条数据
      offset: 0, // 分页 0 20 40 60
      hotComments: [],
      comments: [],
    }
  },
  computed: {
    // 映射video仓库
    ...mapState({
      video: (state) => {
        return state.video
      },
    }),
  },
  methods: {
    // 获取MV详情
    async getMvDetail() {
      try {
        await this.$store.dispatch('getMvDetail', this.mvid)
        this.mvInfo = this.video.mvDetail // 保存数据
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取mv播放地址
    async getMvUrl() {
      try {
        await this.$store.dispatch('getMvUrl', this.mvid)
        this.mvUrl = this.video.mvUrl
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取相关MV
    async getRelatedMv() {
      try {
        await this.$store.dispatch('getRelatedMv', this.mvid)
        this.relatedMv = this.video.relatedMv
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转歌手详情页
    goSingerDetail(id) {
      this.$router.push({
        name: 'singerDetail',
        params: {
          singerId: id,
        },
      })
    },

    // 相关MV 跳转 mv详情页
    goMvDetail(id) {
      this.$router.push({
        name: 'mvDetail',
        params: {
          mvid: id,
        },
      })
    },

    // 暂停播放
    pauseMv() {
      /*
        直接暂停的话控制台会报错，这个方法会执行两次。
        $ref第一次拿到undefined，第二次才拿到元素，加上判断拿到元素再暂停。
      */
      if (this.$refs.video) {
        this.$refs.video.pause()
      }
    },

    // 获取评论
    async getMvComments() {
      try {
        this.loading = true
        // 整理参数
        let obj = {}
        obj.id = this.mvid
        obj.offset = this.offset * 20

        await this.$store.dispatch('getMvComments', obj)
        this.hotComments = this.video.hotComments
        this.comments = this.video.comments
        this.total = this.video.commentTotal

        this.loading = false
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 发表评论
    async mvComment() {
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
        if (!this.textarea) {
          this.$message({
            message: '评论不能为空',
            type: 'warning',
          })
          return
        }
        // 如果回复别人 没有输入内容
        if (this.repliedCommentId) {
          if (this.textarea.length <= this.textarea.indexOf(':') + 1) {
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
        obj.type = 1 // MV
        obj.id = this.mvid
        obj.content = this.textarea

        if (this.repliedCommentId) {
          obj.t = 2
          obj.commentId = this.repliedCommentId // 回复评论id
          obj.content = this.textarea.slice(this.textarea.indexOf(':') + 1) // 去除第一个:及其之前的内容
        }

        await this.$store.dispatch('mvComment', obj)
        await this.getMvComments() // 重新获取评论

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
      if (this.$refs.mvDetail.scrollTop > 660) {
        // 快速定位到评论框
        this.$refs.mvDetail.scrollTop = 660
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
        obj.id = this.mvid
        obj.cid = cid
        obj.t = Number(!likeOrNo)
        obj.type = 1 // mv

        await this.$store.dispatch('mvCommentLike', obj)
        await this.getMvComments() // 重新获取评论
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
      let timer = setInterval(() => {
        let height = this.$refs.mvDetail.scrollTop
        this.$refs.mvDetail.scrollTop -= height / 10
        if (this.$refs.mvDetail.scrollTop <= 660) {
          this.$refs.mvDetail.scrollTop = 660
          clearInterval(timer)
        }
      }, 10)
      await this.getMvComments() // 重新获取评论
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

    // 取消收藏MV（节流）
    unSubscribe: _.throttle(async function () {
      try {
        let obj = {}
        obj.t = 2 // 取消收藏
        obj.mvid = this.mvid

        await this.$store.dispatch('subscribeMv', obj)
        await this.getMvDetail() // 重新获取mv详情信息
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),

    // 收藏mv（节流）
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
        let obj = {}
        obj.t = 1 // 收藏
        obj.mvid = this.mvid

        await this.$store.dispatch('subscribeMv', obj)
        await this.getMvDetail() // 重新获取mv详情信息
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    }, 2200),
  },
  mounted() {
    // 获取视频详情
    this.getMvDetail()
    // 获取mv播放地址
    this.getMvUrl()
    // 获取相关MV
    this.getRelatedMv()
    // 获取MV评论
    this.getMvComments()

    this.$refs.video.volume = 0.5 // 首次加载默认音量
    // 如果视频开始播放，则暂停音乐
    this.$refs.video.addEventListener('play', () => {
      this.$bus.$emit('pauseMusic')
    })

    this.$bus.$on('pauseMv', this.pauseMv) // 暂停视频
  },
  beforeDestroy() {
    this.$store.state.video.videoUrl = '' // 清除播放地址
  },
}
</script>

<style lang="less" scoped>
.mvDetail {
  width: 100%;
  height: calc(100vh - 128px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .mv {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1080px;
    height: 100%;

    // 上半部分 mv详情、相关推荐
    .top {
      width: 100%;
      display: flex;
      margin-bottom: 10px;
      // mv详情
      .left {
        width: 690px;
        // 标题
        h3 {
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
        }
        // 视频容器
        .mvBox {
          width: 100%;
          height: 390px;
          margin-bottom: 12px;
          video {
            width: 100%;
            height: 100%;
          }
        }
        // mv信息
        .mvInfo {
          // 创建用户
          .createUser {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            .image {
              height: 50px;
              width: 50px;
              border-radius: 50%;
              overflow: hidden;
              cursor: pointer;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .name {
              margin-left: 18px;
              font-size: 15px;
              cursor: pointer;
            }
          }
          // mv标题
          .title {
            margin-bottom: 30px;
            .mvTitle {
              font-size: 25px;
              font-weight: bold;
              margin-bottom: 20px;
              // 只显示两行，超过的省略
              word-break: break-all;
              word-wrap: break-word;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .otherInfo {
              font-size: 14px;
              color: rgb(163, 163, 163);
            }
          }
          // 按钮
          .buttons {
            padding-bottom: 10px;
            display: flex;
            .btnItem {
              font-size: 14px;
              padding: 9px 20px;
              border: 1px solid #ddd;
              border-radius: 30px;
              margin-right: 10px;
              cursor: pointer;
              i {
                margin-right: 3px;
                &.red{
                  color: #ec4141;
                }
              }
              &:hover {
                background-color: rgb(248, 248, 248);
              }
            }
          }
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
      }
      // 相关推荐
      .right {
        width: 390px;
        padding-left: 30px;
        box-sizing: border-box;
        h3 {
          font-size: 20px;
          font-weight: bold;
          margin: 15px 0;
        }

        .aboutItem {
          width: 100%;
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          cursor: pointer;

          .image {
            position: relative;
            vertical-align: bottom;
            width: 180px;
            height: 110px;
            img {
              width: 180px;
              height: 110px;
              border-radius: 10px;
            }
            // 播放次数
            .playCount {
              font-size: 14px;
              color: #fff;
              position: absolute;
              top: 3px;
              right: 8px;
              i {
                font-size: 14px;
                margin-right: 3px;
              }
            }
            // 时长
            .duration {
              font-size: 14px;
              color: #fff;
              position: absolute;
              bottom: 3px;
              right: 5px;
            }
          }

          .info {
            padding-left: 15px;
            .title {
              font-size: 15px;
              line-height: 1.2;
              color: #424242;
              margin-bottom: 20px;
              // 只显示两行，超过的省略
              word-break: break-all;
              word-wrap: break-word;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .author {
              font-size: 14px;
              color: rgb(160, 160, 160);
            }
          }
        }
      }
    }

    // 下半部分 评论、热门评论
    .bottom {
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
      padding-top: 30px;
    }
  }
}
</style>
