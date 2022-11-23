import {
  reqMusicList,
  reqMusicSongs,
  reqDailySongs,
  reqMusicUrl,
  reqPlaylistComments,
  reqMusicListSubscribers,
  reqSubscribeMusicList,
  reqLikeSongList,
  reqLikeSong,
} from '@/api'
import { reqComment, reqCommentLike } from '@/api'
import { Message } from 'element-ui'
const Dayjs = require('dayjs') // 引入dayjs

export default {
  actions: {
    // 获取歌单详细信息
    async getMusicListDetail(context, value) {
      let result = await reqMusicList(value)
      if (result.code === 200) {
        context.commit('MUSICLISTDETAIL', result)
        return 'ok'
      } else {
        throw '获取歌单详细信息失败！'
      }
    },

    // 获取歌单所有歌曲
    async getMusicListSongs(context, value) {
      let result = await reqMusicSongs(value)
      if (result.code === 200) {
        context.commit('ALLSONG', result)
        return 'ok'
      } else {
        throw '获取歌单歌曲失败！'
      }
    },

    // 获取每日推荐歌单
    async getDailySongs(context) {
      let result = await reqDailySongs()
      if (result.code === 200) {
        context.commit('DAILYSONGS', result)
        return 'ok'
      } else {
        throw '获取每日推荐歌单失败！'
      }
    },

    // 获取音乐Url
    async getMusicUrl(context) {
      // 拿仓库中的数据发请求
      let result = await reqMusicUrl(context.state.playSongId)
      if (result.code === 200) {
        context.commit('MUSICURL', result)
        return 'ok'
      } else {
        throw '获取播放地址失败！'
      }
    },

    // 播放搜索单曲
    async playSearchSong(context, value) {
      let result = await reqMusicSongs([value])
      if (result.code === 200) {
        context.commit('PLAYSEARCHSONG', result)
        return 'ok'
      } else {
        throw '获取歌曲信息失败！'
      }
    },

    // 获取歌单评论
    async getMusicListComment(context, { id, offset }) {
      let result = await reqPlaylistComments(id, offset)
      if (result.code === 200) {
        context.commit('MUSICLISTCOMMENTS', result)
        return 'ok'
      } else {
        throw '获取专辑评论失败！'
      }
    },

    // 发表/回复 歌单评论
    async musicListComment(context, { t, type, id, content, commentId }) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        Message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }

      let result = await reqComment(t, type, id, content, commentId)
      if (result.code === 200) {
        return 'ok'
      } else if (result.code === 400) {
        throw result.msg
      } else {
        throw '发表失败!'
      }
    },

    // 点赞 歌单评论
    async musicListCommentLike(context, { id, cid, t, type }) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        Message({
          type: 'warning',
          message: '请先登录',
        })
        return
      }

      let result = await reqCommentLike(id, cid, t, type)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '点赞失败！'
      }
    },

    // 获取歌单收藏者
    async getMusicListSubscribers(context, { id, offset }) {
      let result = await reqMusicListSubscribers(id, offset)
      if (result.code === 200) {
        context.commit('MUSICLISTSUBSCRIBERS', result)
        return 'ok'
      } else {
        throw '获取歌单收藏者失败！'
      }
    },

    // 收藏/取消收藏歌单
    async subscribeMusicList(context, { t, id }) {
      let result = await reqSubscribeMusicList(t, id)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '收藏失败!'
      }
    },

    // 用户喜欢所有喜欢歌曲id列表
    async reqLikeSongList(context, value) {
      let result = await reqLikeSongList(value)
      if (result.code === 200) {
        context.commit('LIKESONGLIST', result)
        return 'ok'
      } else {
        throw '获取喜欢歌曲列表失败！'
      }
    },

    // 喜欢/不喜欢 歌曲
    async likeSong(context, { id, like }) {
      let result = await reqLikeSong(id, like)
      if (result.code === 200) {
        if (!like) {
          // like为false是取消喜欢
          return '取消喜欢歌曲成功！'
        }
        return '已添加至喜欢歌曲！'
      } else {
        if (!like) {
          return '取消喜欢歌曲失败！'
        }
        throw '添加喜欢歌曲失败！'
      }
    },
  },
  mutations: {
    // 歌单详细信息
    MUSICLISTDETAIL(state, { playlist }) {
      state.musicListInfo = {}

      state.musicListInfo.name = playlist.name // 歌单名字
      state.musicListInfo.coverImg = playlist.coverImgUrl // 歌单封面
      state.musicListInfo.creatorAvatar = playlist.creator.avatarUrl // 创建者头像
      state.musicListInfo.creatorName = playlist.creator.nickname // 创建者名字
      state.musicListInfo.creatorId = playlist.creator.userId // 创建者id
      state.musicListInfo.createTime = Dayjs(playlist.createTime).format('YYYY-MM-DD') // 创建时间
      state.musicListInfo.tags = playlist.tags // 歌单标签
      state.musicListInfo.songNums = playlist.trackIds.length // 歌曲数量
      playlist.tracks.forEach((item) => {
        // 加工时间
        let time = parseInt(item.dt / 1000) // 总秒数
        let m = parseInt(time / 60)
        m = m < 10 ? '0' + m : m
        let s = time % 60
        s = s < 10 ? '0' + s : s
        item.dt = m + ':' + s

        // 加工歌手字段
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3) // ' / ' 占三位 结果不包括-3这个索引值位置的元素
      })
      state.musicListInfo.tracks = playlist.tracks // 播放列表

      // 如果播放量过万
      if (playlist.playCount > 10000) {
        playlist.playCount = (playlist.playCount / 10000).toFixed(1) + '万'
      }
      state.musicListInfo.playCount = playlist.playCount // 播放量

      state.musicListInfo.description = playlist.description // 歌单简介
      state.musicListInfo.trackIds = playlist.trackIds // 这个可以拿到所有歌曲id，然后用id获取歌曲
      state.musicListInfo.subscribed = playlist.subscribed // 是否收藏
    },

    // 歌单所有歌曲
    ALLSONG(state, value) {
      // 数据加工
      value.songs.forEach((item) => {
        // 把dt持续时间(单位ms) 字段加工成 分钟
        let ts = parseInt(item.dt / 1000) // 总共多少秒 toTalSeconds

        // 分钟 --- 小于10 前面加个0
        let m = parseInt(ts / 60) < 10 ? '0' + parseInt(ts / 60) : parseInt(ts / 60)
        // 秒 --- 小于10 前面加个0
        let s = parseInt(ts % 60) < 10 ? '0' + parseInt(ts % 60) : parseInt(ts % 60)

        item.dt = m + ':' + s // 至此,时间加工完毕

        // 加工ar字段,歌手可能不止一个
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3) // 取消最后一个 ' / ' 占3位
      })

      state.songs = state.songs.concat(value.songs)
      // 我觉得这里可能是造成歌单之间切换过快歌曲重合的问题
    },

    // 每日推荐歌单
    DAILYSONGS(state, value) {
      state.dailySongs = [] // 清空上次缓存数据
      // 数据加工
      value.data.dailySongs.forEach((item) => {
        // 把dt持续时间(单位ms) 字段加工成 分钟
        let ts = parseInt(item.dt / 1000) // 总共多少秒 toTalSeconds

        // 分钟 --- 小于10 前面加个0
        let m = parseInt(ts / 60) < 10 ? '0' + parseInt(ts / 60) : parseInt(ts / 60)
        // 秒 --- 小于10 前面加个0
        let s = parseInt(ts % 60) < 10 ? '0' + parseInt(ts % 60) : parseInt(ts % 60)

        item.dt = m + ':' + s // 至此,时间加工完毕

        // 加工ar字段,歌手可能不止一个
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3) // 取消最后一个 ' / ' 占3位
      })

      state.dailySongs = state.dailySongs.concat(value.data.dailySongs)
    },

    // 播放URL
    MUSICURL(state, value) {
      state.playSongUrl = value.data[0].url // 保存音乐url
      state.playSongFreeInfo = value.data[0].freeTrialInfo
    },

    // 播放搜索歌曲
    PLAYSEARCHSONG(state, value) {
      state.searchSongInfo = {}

      let song = value.songs[0]
      // 加工歌手
      let authors = ''
      for (var i = 0; i < song.ar.length; i++) {
        authors += song.ar[i].name + ' / '
      }
      song.ar = authors.slice(0, -3)

      // 加工持续时间
      let time = parseInt(song.dt / 1000) // 总秒数
      let m = parseInt(time / 60) // 分钟
      m = m < 10 ? '0' + m : m
      let s = time % 60
      s = s < 10 ? '0' + s : s
      song.dt = m + ':' + s

      state.searchSongInfo = song
    },

    // 歌单评论
    MUSICLISTCOMMENTS(state, value) {
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

    // 歌单收藏者
    MUSICLISTSUBSCRIBERS(state, value) {
      state.subscribers = [] // 20个收藏者
      state.subscribersHasMore = '' // 还有更多吗
      state.subscribersTotal = '' // 收藏者总数

      state.subscribers = value.subscribers
      state.subscribersTotal = value.total
      state.subscribersHasMore = value.more
    },

    // 用户喜欢歌曲id列表
    LIKESONGLIST(state, value) {
      state.likeSongList = value.ids
    },
  },
  state: {
    // 歌单信息
    musicListInfo: {
      name: '', // 歌单名
      coverImg: '', // 歌单封面
      creatorAvatar: '', // 创建者头像
      creatorName: '', // 创建者名称
      creatorId: '', // 创建者id
      createTime: '', // 创建时间
      tags: '', // 标签
      songNums: '', // 歌曲数量
      playCount: '', // 播放量
      description: '', // 简介
      tracks: [], // 播放列表
      trackIds: '', // 所有歌曲id
      subscribed: '', // 是否收藏
    },
    songs: [], // 歌曲
    playlist: [], // 播放列表
    playSongId: '', // 播放歌曲id
    playSongUrl: '', // 播放歌曲url
    playSongIndex: 0, // 播放歌曲在播放列表中的位置
    playSongFreeInfo: {}, // 该歌曲免费特权信息
    playState: false, // 播放状态

    dailySongs: [], // 每日推荐歌曲

    searchSongInfo: {}, // 搜索建议 准备播放的歌曲信息

    commentTotal: '', // 评论总数
    hotComments: [], // 热门评论
    comments: [], // 评论

    subscribers: [], // 收藏者
    subscribersTotal: '', // 收藏者总数
    subscribersHasMore: '', // 收藏者还有更多数据吗

    likeSongList: [], // 用户所有喜欢歌曲id
  },
  getters: {},
}
