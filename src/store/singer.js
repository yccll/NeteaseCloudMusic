import {
  reqSingerDetail,
  reqSingerHotFifty,
  reqSingerHotAlbum,
  reqSingerMvList,
  reqSubscribeSinger,
} from '@/api/singer'
import { reqAlbumDetail } from '@/api/album'

export default {
  actions: {
    // 获取歌手详细信息
    async getSingerDetail(context, value) {
      let result = await reqSingerDetail(value)
      if (result.code === 200) {
        context.commit('SINGERDETAIL', result)
        return 'ok'
      } else {
        throw '获取歌手详细失败！'
      }
    },

    // 获取歌手热门50首歌曲
    async getSingerHotFifty(context, value) {
      let result = await reqSingerHotFifty(value)
      if (result.code === 200) {
        context.commit('SINGERHOTFIFTY', result)
        return 'ok'
      } else {
        throw '获取歌手热门50首歌曲失败！'
      }
    },

    // 获取歌手热门专辑
    async getSingerHotAlbum(context, value) {
      let result = await reqSingerHotAlbum(value)
      if (result.code === 200) {
        context.commit('SINGERHOTALBUM', result)
        return 'ok'
      } else {
        throw '获取热门专辑失败！'
      }
    },

    // 获取热门专辑歌曲
    async getHotAlbumSongs(context, value) {
      let result = await reqAlbumDetail(value)
      if (result.code === 200) {
        context.commit('HOTALBUMSONGS', result)
        return 'ok'
      } else {
        throw '获取热门专辑单曲失败！'
      }
    },

    // 获取歌手MV
    async getSingerMvList(context, { id, offset }) {
      let result = await reqSingerMvList(id, offset)
      if (result.code === 200) {
        context.commit('SINGERMVLIST', result)
        return 'ok'
      } else {
        throw '获取歌手MV列表失败！'
      }
    },

    // 收藏/取消收藏歌手
    async subscribeSinger(context, { t, id }) {
      let result = await reqSubscribeSinger(t, id)
      if (result.code === 200) {
        return 'ok'
      } else {
        throw '收藏歌手失败！'
      }
    },
  },
  mutations: {
    // 歌手详细
    SINGERDETAIL(state, value) {
      state.singerInfo = {} // 清空上次的数据
      state.singerInfo.cover = value.data.artist.cover
      state.singerInfo.name = value.data.artist.name
      state.singerInfo.albumSize = value.data.artist.albumSize
      state.singerInfo.musicSize = value.data.artist.musicSize
      state.singerInfo.mvSize = value.data.artist.mvSize
      state.singerInfo.desc = value.data.artist.briefDesc
    },

    // 热门50首
    SINGERHOTFIFTY(state, value) {
      state.hotSongs = []
      value.songs.forEach((item) => {
        // 加工歌手字段
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3)

        // 加工事件字段
        let time = parseInt(item.dt / 1000) // 总秒数
        let m = parseInt(time / 60) // 分钟
        m = m < 10 ? '0' + m : m // 分钟<10 加0
        let s = time % 60 // 秒
        s = s < 10 ? '0' + s : s // 秒数<10 加0

        item.dt = m + ':' + s // 保存加工完的字段
      })
      state.hotSongs = value.songs
    },

    // 热门专辑
    SINGERHOTALBUM(state, value) {
      state.hotAlbums = []
      value.hotAlbums.forEach((item) => {
        // 整理需要的参数
        let obj = {}
        obj.id = item.id // 专辑id
        obj.name = item.name // 专辑名
        obj.picUrl = item.picUrl // 专辑封面

        state.hotAlbums.push(obj) // 保存数据
      })
    },

    // 热门专辑单曲
    HOTALBUMSONGS(state, value) {
      value.songs.forEach((item) => {
        // 加工一下歌手字段
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors += item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3)

        // 加工事件字段
        let time = parseInt(item.dt / 1000) // 总秒数
        let m = parseInt(time / 60) // 分钟
        m = m < 10 ? '0' + m : m // 分钟<10 加0
        let s = time % 60 // 秒
        s = s < 10 ? '0' + s : s // 秒数<10 加0

        item.dt = m + ':' + s // 保存加工完的字段
      })

      state.hotAlbums.forEach((item) => {
        if (item.id === value.album.id) {
          // 找到对应专辑存放位置
          item.songs = value.songs
        }
      })
    },

    // 歌手MV列表
    SINGERMVLIST(state, value) {
      state.mvListHasMore = value.hasMore
      value.mvs.forEach((item) => {
        // 加工时间字段
        let time = parseInt(item.duration / 1000) // 总秒数
        let m = parseInt(time / 60) // 分钟
        m = m < 10 ? '0' + m : m // 分钟<10 加个0
        let s = time % 60 // 秒
        s = s < 10 ? '0' + s : s // 秒<10 加个0

        item.duration = m + ':' + s

        // 加工播放量字段
        if (item.playCount > 10000) {
          item.playCount = (item.playCount / 10000).toFixed(1) + '万'
        }

        state.mvList.push(item)
      })
    },
  },
  state: {
    // 歌手信息
    singerInfo: {
      cover: '', // 封面
      name: '', // 名字
      albumSize: '', // 专辑数
      musicSize: '', // 单曲数
      mvSize: '', // MV数
      desc: '', // 歌手描述
    },
    hotSongs: [], // 热门50首歌曲
    hotAlbums: [], // 热门专辑

    mvList: [], // MV列表
    mvListHasMore: '', // MV列表是否有更多数据
  },
  getters: {},
}
