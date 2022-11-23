import { reqAlbumDetail, reqAlbumComments, reqSubscribeAlbum } from '@/api/album'
import { reqComment, reqCommentLike } from '@/api'
import dayjs from 'dayjs'

export default {
  actions: {
    // 获取专辑详细信息
    async getAlbumDetailInfo(context, value) {
      let result = await reqAlbumDetail(value)
      if (result.code === 200) {
        context.commit('ALBUMDETAIL', result)
        return 'ok'
      } else {
        throw '获取专辑详细信息失败！'
      }
    },

    // 获取专辑评论
    async getAlbumComment(context, { id, offset }) {
      let result = await reqAlbumComments(id, offset)
      if (result.code === 200) {
        context.commit('ALBUMCOMMENTS', result)
        return 'ok'
      } else {
        throw '获取专辑评论失败！'
      }
    },

    // 发表/回复 专辑评论
    async albumComment(context, { t, type, id, content, commentId }) {
      let result = await reqComment(t, type, id, content, commentId)
      if (result.code === 200) {
        return 'ok'
      } else if (result.code === 400) {
        throw result.msg
      } else {
        throw '发表失败!'
      }
    },

    // 点赞 专辑评论
    async albumCommentLike(context, { id, cid, t, type }) {
      let result = await reqCommentLike(id, cid, t, type)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '点赞失败！'
      }
    },

    // 收藏/取消收藏 专辑
    async subsctibeAlbum(context, { t, id }) {
      let result = await reqSubscribeAlbum(t, id)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '收藏专辑失败！'
      }
    },
  },
  mutations: {
    // 专辑详细
    ALBUMDETAIL(state, value) {
      state.albumInfo = {} // 清空上次的数据
      value.songs.forEach((item) => {
        let time = parseInt(item.dt / 1000) // 总共多少秒
        // 分钟 --- 小于10 前面加个0
        let m = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60)
        // 秒 --- 小于10 前面加个0
        let s = parseInt(time % 60) < 10 ? '0' + parseInt(time % 60) : parseInt(time % 60)

        item.dt = m + ':' + s // 至此,时间加工完毕

        // 加工ar字段,歌手可能不止一个
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3) // 取消最后一个 ' / ' 占3位
      })
      state.albumInfo.songs = value.songs // 歌曲列表
      state.albumInfo.picUrl = value.album.picUrl // 封面
      state.albumInfo.name = value.album.name // 名字
      state.albumInfo.artists = value.album.artists // 歌手
      state.albumInfo.publishTime = dayjs(value.album.publishTime).format('YYYY-MM-DD') // 发布时间
      state.albumInfo.description = value.album.description // 描述
    },

    // 专辑评论
    ALBUMCOMMENTS(state, value) {
      state.hotComments = []
      state.comments = []

      state.commentTotal = value.total
      if (value.hotComments) {
        // 如果有热门评论就保存
        state.hotComments = value.hotComments
      }
      state.comments = value.comments
    },
  },
  state: {
    // 专辑
    albumInfo: {
      songs: [], // 歌曲列表
      picUrl: '', // 封面
      name: '', // 专辑名
      artists: [], // 歌手
      publishTime: '', // 发布时间
      description: '', // 描述
    },

    commentTotal: '', // 评论总数
    hotComments: [], // 热门评论
    comments: [], // 评论
  },
  getters: {},
}
