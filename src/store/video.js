import {
  reqVideoAllTags,
  reqVideoTags,
  reqVideoList,
  reqMVList,
  reqVideoDetail,
  reqVideoUrl,
  reqRelatedVideo,
  reqVideoComments,
  reqMvDetail,
  reqMvUrl,
  reqRelatedMv,
  reqMvComments,
  reqSubscribeMv,
  reqSubscribeVideo,
} from '@/api/video'
import { reqCommentLike, reqComment } from '@/api'

import dayjs from 'dayjs'

export default {
  actions: {
    // 获取所有标签
    async getVideoAllTags(context) {
      let result = await reqVideoAllTags()
      if (result.code === 200) {
        context.commit('VIDEOALLTAGS', result)
        return 'ok'
      } else {
        throw '获取所有视频分类标签失败！'
      }
    },

    // 获取常用标签
    async getVideoTags(context) {
      let result = await reqVideoTags()
      if (result.code === 200) {
        context.commit('VIDEOTAGS', result)
        return 'ok'
      } else {
        throw '获取常用视频分类标签失败！'
      }
    },

    // 根据分类获取视频列表
    async getVideoList(context, { id, offset }) {
      let result = await reqVideoList(id, offset)
      if (result.code === 200) {
        context.commit('VIDEOLIST', result)
        return 'ok'
      } else {
        throw '获取视频列表失败!'
      }
    },

    // 获取MV列表
    async getMVList(context, { area, type, order, offset }) {
      let result = await reqMVList(area, type, order, offset)
      if (result.code === 200) {
        context.commit('MVLIST', result)
        return 'ok'
      } else {
        throw '获取MV列表失败！'
      }
    },

    /********************* 视频详情页 ******************/
    // 获取视频详情
    async getVideoDetail(context, value) {
      let result = await reqVideoDetail(value)
      if (result.code === 200) {
        context.commit('VIDEODETAIL', result)
        return 'ok'
      } else {
        throw '获取视频详情失败!'
      }
    },

    // 获取视频播放地址
    async getVideoUrl(context, value) {
      let result = await reqVideoUrl(value)
      if (result.code === 200) {
        context.commit('VIDEOURL', result)
        return 'ok'
      } else {
        throw '获取视频播放地址失败!'
      }
    },

    // 获取相关视频
    async getRelatedVideo(context, value) {
      let result = await reqRelatedVideo(value)
      if (result.code === 200) {
        context.commit('RELATEDVIDEO', result)
        return 'ok'
      } else {
        throw '获取相关视频失败！'
      }
    },

    // 获取视频评论
    async getVideoComments(context, { id, offset }) {
      let result = await reqVideoComments(id, offset)
      if (result.code === 200) {
        context.commit('VIDEOCOMMENTS', result)
        return 'ok'
      } else {
        throw '获取视频评论失败！'
      }
    },

    // 点赞 视频评论
    async videoCommentLike(context, { id, cid, t, type }) {
      let result = await reqCommentLike(id, cid, t, type)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '点赞失败！'
      }
    },

    // 发表/回复 视频评论
    async videoComment(context, { t, type, id, content, commentId }) {
      let result = await reqComment(t, type, id, content, commentId)
      if (result.code === 200) {
        return 'ok'
      } else if (result.code === 400) {
        throw result.msg
      } else {
        throw '发表失败!'
      }
    },

    /********************* MV详情页 ******************/
    // 获取mv详情
    async getMvDetail(context, value) {
      let result = await reqMvDetail(value)
      if (result.code === 200) {
        context.commit('MVDETAIL', result)
        return 'ok'
      } else {
        throw '获取MV详情失败!'
      }
    },

    // 获取MV播放地址
    async getMvUrl(context, value) {
      let result = await reqMvUrl(value)
      if (result.code === 200) {
        context.commit('MVURL', result)
        return 'ok'
      } else {
        throw '获取MV播放地址失败!'
      }
    },

    // 获取相关MV
    async getRelatedMv(context, value) {
      let result = await reqRelatedMv(value)
      if (result.code === 200) {
        context.commit('RELATEDMV', result)
        return 'ok'
      } else {
        throw '获取相关MV失败！'
      }
    },

    // 获取MV评论
    async getMvComments(context, { id, offset }) {
      let result = await reqMvComments(id, offset)
      if (result.code === 200) {
        context.commit('MVCOMMENTS', result)
        return 'ok'
      } else {
        throw '获取MV评论失败！'
      }
    },

    // 发表/回复 MV评论
    async mvComment(context, { t, type, id, content, commentId }) {
      let result = await reqComment(t, type, id, content, commentId)
      if (result.code === 200) {
        return 'ok'
      } else if (result.code === 400) {
        throw result.msg
      } else {
        throw '发表失败!'
      }
    },

    // 点赞 MV评论
    async mvCommentLike(context, { id, cid, t, type }) {
      let result = await reqCommentLike(id, cid, t, type)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '点赞失败！'
      }
    },

    // 收藏/取消收藏 mv
    async subscribeMv(context, { t, mvid }) {
      let result = await reqSubscribeMv(t, mvid)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '收藏失败！'
      }
    },

    // 收藏/取消收藏 视频
    async subscribeVideo(context, { t, id }) {
      let result = await reqSubscribeVideo(t, id)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '收藏视频失败！'
      }
    },
  },
  mutations: {
    // 所有标签
    VIDEOALLTAGS(state, value) {
      state.allTags = []
      value.data.forEach((item) => {
        state.allTags.push(item)
      })
    },
    // 常用标签
    VIDEOTAGS(state, value) {
      state.tags = []
      value.data.forEach((item) => {
        state.tags.push(item)
      })
    },
    // 视频列表
    VIDEOLIST(state, value) {
      state.videoListHasMore = value.hasmore
      value.datas.forEach((item) => {
        // 加工数据
        // 时长
        let duration = parseInt((item.data.durationms || item.data.duration) / 1000) // 总秒数
        let m = parseInt(duration / 60)
        m = m < 10 ? '0' + m : m
        let s = duration % 60
        s = s < 10 ? '0' + s : s
        item.data.durationms = m + ':' + s

        // 播放次数
        if (item.data.playTime > 10000) {
          item.data.playTime = (item.data.playTime / 10000).toFixed(1) + '万'
        }

        // 整合需要的数据
        let obj = {}
        obj.vid = item.data.vid
        obj.title = item.data.title
        obj.coverUrl = item.data.coverUrl
        obj.duration = item.data.durationms
        obj.playCount = item.data.playTime

        // 存放到state中
        state.videoList.push(obj)
      })
    },

    // MV列表
    MVLIST(state, value) {
      state.mvListHasMore = value.hasMore
      value.data.forEach((item) => {
        // 加工播放量
        if (item.playCount > 10000) {
          item.playCount = (item.playCount / 10000).toFixed(1) + '万'
        }

        // 加工时长
        let time = parseInt(item.duration / 1000) // 总秒数

        let m = parseInt(time / 60) // 分钟
        m = m < 10 ? '0' + m : m // 如果小于10 也就是一位数 前面加个零

        let s = time % 60 // 秒数
        s = s < 10 ? '0' + s : s // 一位数前面加个 0

        item.duration = m + ':' + s

        state.mvList.push(item)
      })
    },

    // 视频详情
    VIDEODETAIL(state, value) {
      state.videoDetail = {} // 清空上次缓存的数据
      state.videoDetail.creator = value.data.creator
      state.videoDetail.coverUrl = value.data.coverUrl
      state.videoDetail.title = value.data.title
      // 播放次数
      if (value.data.playTime > 10000) {
        value.data.playTime = (value.data.playTime / 10000).toFixed(1) + '万'
      }
      state.videoDetail.playCount = value.data.playTime

      state.videoDetail.publishTime = dayjs(value.data.publistTime).format('YYYY-MM-DD')
    },

    // 视频URL
    VIDEOURL(state, value) {
      state.videoUrl = ''
      state.videoUrl = value.urls[0].url
    },

    // 相关视频
    RELATEDVIDEO(state, value) {
      state.relatedVideo = []
      // 加工数据
      value.data.forEach((item) => {
        // 时间
        let time = parseInt(item.durationms / 1000) // 总秒数
        let m = parseInt(time / 60)
        m = m < 10 ? '0' + m : m
        let s = time % 60
        s = s < 10 ? '0' + s : s

        item.duration = m + ':' + s

        // 播放次数
        if (item.playTime > 10000) {
          item.playCount = (item.playTime / 10000).toFixed(1) + '万'
        } else {
          item.playCount = item.playTime
        }
      })
      // 保存数据
      state.relatedVideo = value.data
    },

    // 视频评论
    VIDEOCOMMENTS(state, value) {
      state.hotComments = []
      state.comments = []
      state.commentTotal = ''

      /* 
        如果有热门评论就保存，只有第一页offset=0的时候才有热门评论
      */
      if (value.hotComments) {
        state.hotComments = value.hotComments
      }
      state.commentTotal = value.total
      state.comments = value.comments
    },

    // MV详情
    MVDETAIL(state, value) {
      state.mvDetail = {} // 清空上次缓存的数据
      state.mvDetail.singer = value.data.artists[0]
      state.mvDetail.coverUrl = value.data.cover
      state.mvDetail.title = value.data.name
      // 播放次数
      if (value.data.playCount > 10000) {
        value.data.playCount = (value.data.playCount / 10000).toFixed(1) + '万'
      }
      state.mvDetail.playCount = value.data.playCount

      state.mvDetail.publishTime = value.data.publishTime
      state.mvDetail.subed = value.subed
    },

    // MVURL
    MVURL(state, value) {
      state.mvUrl = ''
      state.mvUrl = value.data.url
    },

    // 相关MV
    RELATEDMV(state, value) {
      state.relatedMv = []
      // 加工数据
      value.mvs.forEach((item) => {
        // 时间
        let time = parseInt(item.duration / 1000) // 总秒数
        let m = parseInt(time / 60)
        m = m < 10 ? '0' + m : m
        let s = time % 60
        s = s < 10 ? '0' + s : s

        item.duration = m + ':' + s

        // 播放次数
        if (item.playCount > 10000) {
          item.playCount = (item.playCount / 10000).toFixed(1) + '万'
        }
      })
      // 保存数据
      state.relatedMv = value.mvs
    },

    // MV评论
    MVCOMMENTS(state, value) {
      state.hotComments = []
      state.comments = []
      state.commentTotal = ''

      /* 
        如果有热门评论就保存，只有第一页offset=0的时候才有热门评论
      */
      if (value.hotComments) {
        state.hotComments = value.hotComments
      }
      state.commentTotal = value.total
      state.comments = value.comments
    },
  },
  state: {
    allTags: [], // 所有标签
    tags: [], // 常用标签
    videoList: [], // 视频列表
    videoListHasMore: '', // 视频列表是否有更多数据

    mvList: [], // MV列表
    mvListHasMore: '', // MV列表是否有更多数据

    // 视频信息
    videoDetail: {
      creator: {}, // 创建者
      coverUrl: '', // 视频封面
      title: '', // 标题
      playCount: '', // 播放次数
      publishTime: '', // 发布时间
    },
    videoUrl: '', // 视频播放地址
    relatedVideo: [], // 相关视频

    commentTotal: '', // 评论总数
    hotComments: [], // 热门评论
    comments: [], // 评论

    // MV信息
    mvDetail: {
      singer: {}, //歌手
      coverUrl: '', // 视频封面
      title: '', // mv标题
      playCount: '', // 播放次数
      publishTime: '', // 发布时间
      subed: '', // 是否收藏
    },
    mvUrl: '', // mv播放地址
    relatedMv: [], // 相关MV
  },
  getters: {},
}
