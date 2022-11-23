import { reqLyrics, reqSongComments, reqComment, reqCommentLike } from '@/api'

export default {
  actions: {
    // 获取歌词
    async getLyrics(context, value) {
      let result = await reqLyrics(value)
      if (result.code === 200) {
        context.commit('LYRICS', result)
        return 'ok'
      } else {
        throw '获取歌词失败！'
      }
    },

    // 歌曲评论
    async reqSongComments(context, { id, offset }) {
      context.state.nowMusicId = id
      let result = await reqSongComments(id, offset)
      if (result.code === 200) {
        context.commit('SONGCOMMENTS', result)
        return 'ok'
      } else if (result.code === 512) {
        throw result.message
      } else {
        throw '获取歌曲评论失败！'
      }
    },

    // 发表/回复 歌曲评论
    async songComment(context, { t, type, id, content, commentId }) {
      let result = await reqComment(t, type, id, content, commentId)
      if (result.code === 200) {
        return 'ok'
      } else if (result.code === 250) {
        throw result.data.dialog.subtitle
      } else if (result.code === 400) {
        throw result.msg
      } else {
        throw '发表失败!'
      }
    },

    // 点赞评论
    async songCommentLike(context, { id, cid, t, type }) {
      let result = await reqCommentLike(id, cid, t, type)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '点赞失败！'
      }
    },
  },
  mutations: {
    // 歌词
    LYRICS(state, value) {
      state.lyrics = [] // 避免不刷新
      state.lyrics = value.lrc.lyric.split('\n')
      state.lyrics.splice(-1, 1) // 删除最后一项 没用的
      state.lyrics = state.lyrics.map((item, index) => {
        let obj = {}
        obj.time = item.match(/\[(.+?)\]/)[1] // 提取中括号[] 内容
        obj.msg = item.slice(obj.time.length + 2)

        // 把时间加工成ms
        let m = obj.time.slice(0, 2) * 60
        let s = obj.time.slice(3)
        obj.time = Number(m) + Number(s)

        return obj
      })
    },

    // 歌曲评论
    SONGCOMMENTS(state, value) {
      state.commentTotal = ''
      state.hotComments = []
      state.comments = []

      state.commentTotal = value.total // 评论总数
      if (value.hotComments) {
        state.hotComments = value.hotComments // 热门评论
      }
      state.comments = value.comments // 最新评论
    },
  },
  state: {
    lyrics: [], // 歌词

    nowMusicId: '', // 当前评论的音乐id
    commentTotal: '', // 评论总数
    hotComments: [], // 热门评论
    comments: [], // 评论
  },
  getters: {
    // 二次加工 歌词 把空的去掉
    finalLyrics(state) {
      let obj = state.lyrics
      obj = obj.filter((item) => {
        return item.msg.trim()
      })
      return obj
    },
  },
}
