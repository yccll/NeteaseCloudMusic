import { reqSearch, reqMultimatch } from '@/api/search'
import { reqMusicSongs } from '@/api'

export default {
  actions: {
    // 搜索单曲
    async getSearchSong(context, { type, keywords, offset }) {
      let result = await reqSearch(type, keywords, offset)
      if (result.code === 200) {
        context.commit('SEARCHSONG', result)
        return 'ok'
      } else {
        throw '搜索单曲失败！'
      }
    },

    // 单曲中的多重匹配搜索 (最佳匹配)
    async getMultimatch(context, keywords) {
      let result = await reqMultimatch(keywords)
      if (result.code === 200) {
        context.commit('SEARCHMULTIMATCH', result)
        return 'ok'
      } else {
        throw '搜索最佳匹配失败！'
      }
    },

    // 搜索歌手
    async getSearchSinger(context, { type, keywords, offset }) {
      let result = await reqSearch(type, keywords, offset)
      if (result.code === 200) {
        context.commit('SEARCHSINGER', result)
        return 'ok'
      } else {
        throw '搜索歌手失败！'
      }
    },

    // 搜索专辑
    async getSearchAlbum(context, { type, keywords, offset }) {
      let result = await reqSearch(type, keywords, offset)
      if (result.code === 200) {
        context.commit('SEARCHALBUM', result)
        return 'ok'
      } else {
        throw '搜索专辑失败！'
      }
    },

    // 搜索视频
    async getSearchVideo(context, { type, keywords, offset }) {
      let result = await reqSearch(type, keywords, offset)
      if (result.code === 200) {
        context.commit('SEARCHVIDEO', result)
        return 'ok'
      } else {
        throw '搜索视频失败！'
      }
    },

    // 搜索歌单
    async getSearchMusicList(context, { type, keywords, offset }) {
      let result = await reqSearch(type, keywords, offset)
      if (result.code === 200) {
        context.commit('SEARCHMUSICLIST', result)
        return 'ok'
      } else {
        throw '搜索歌单失败！'
      }
    },
  },
  mutations: {
    // 搜索单曲
    SEARCHSONG(state, value) {
      state.songCount = ''
      state.songs = [] // 以免用户不刷新页面，重新挂载组件再次发请求获取数据。导致数据叠加

      state.songCount = value.result.songCount // 保存结果总数

      value.result.songs.forEach((item) => {
        // 加工ar字段,歌手可能不止一个
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3) // 取消最后一个 ' / ' 占3位

        // 加工时间字段
        let ts = parseInt(item.dt / 1000) // 总秒数

        // 分钟
        let m = parseInt(ts / 60)
        m = m < 10 ? '0' + m : m
        // 秒数
        let s = ts % 60
        s = s < 10 ? '0' + s : s

        item.dt = m + ':' + s

        state.songs.push(item)
      })
    },

    // 最佳匹配
    SEARCHMULTIMATCH(state, value) {
      state.multimatchInfo = {}

      state.multimatchInfo = value.result.artist // 最佳匹配歌手
    },

    // 搜索歌手
    SEARCHSINGER(state, value) {
      state.singerCount = ''
      state.singers = [] // 以免用户不刷新重新挂载页面发请求

      state.singerCount = value.result.artistCount // 结果总数

      value.result.artists.forEach((item) => {
        state.singers.push(item)
      })
    },

    // 搜索专辑
    SEARCHALBUM(state, value) {
      state.albumCount = ''
      state.albums = []

      state.albumCount = value.result.albumCount // 结果总数

      value.result.albums.forEach((item) => {
        state.albums.push(item)
      })
    },

    // 搜索视频
    SEARCHVIDEO(state, value) {
      state.videoCount = ''
      state.videos = []

      state.videoCount = value.result.videoCount // 结果总数

      value.result.videos.forEach((item) => {
        // 加工时间
        let time = parseInt(item.durationms / 1000) // 总秒数
        let m = parseInt(time / 60) // 分钟
        m = m < 10 ? '0' + m : m
        let s = time % 60 // 秒
        s = s < 10 ? '0' + s : s
        item.duration = m + ':' + s

        // 加工播放次数
        if (item.playTime > 10000) {
          item.playTime = (item.playTime / 10000).toFixed(1) + '万'
        }

        // 保存结果
        state.videos.push(item)
      })
    },

    // 搜索歌单
    SEARCHMUSICLIST(state, value) {
      state.musicListCount = ''
      state.musicLists = []

      state.musicListCount = value.result.playlistCount // 保存搜索歌单结果总数

      value.result.playlists.forEach((item) => {
        state.musicLists.push(item)
      })
    },
  },
  state: {
    songCount: '', // 搜索单曲结果总数
    songs: [], // 单曲
    multimatchInfo: {}, // 最佳匹配信息

    singerCount: '', // 搜索歌手结果总数
    singers: [], // 歌手

    albumCount: '', // 搜索专辑结果总数
    albums: [], // 专辑

    videoCount: '', // 搜索视频结果总数
    videos: [], // 视频

    musicListCount: '', // 搜索歌单结果总数
    musicLists: [], // 歌单
  },
  getters: {},
}
