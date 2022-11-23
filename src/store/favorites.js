import { reqFavoriteAlbumList, reqFavoriteSingerList, reqFavoriteVideoList } from '@/api/favorites'

export default {
  actions: {
    // 收藏的专辑
    async getFavoriteAlbumList(context) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        return
      }
      let result = await reqFavoriteAlbumList()
      if (result.code === 200) {
        context.commit('FAVORITEALBUM', result)
        return 'ok'
      } else {
        throw '获取收藏专辑失败！'
      }
    },

    // 收藏的歌手
    async getFavoriteSingerList(context) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        return
      }
      let result = await reqFavoriteSingerList()
      if (result.code === 200) {
        context.commit('FAVORITESINGER', result)
        return 'ok'
      } else {
        return '获取收藏歌手失败！'
      }
    },

    // 收藏的视频
    async getFavoriteVideoList(context) {
      // 如果未登录
      if (!localStorage.getItem('userId')) {
        return
      }
      let result = await reqFavoriteVideoList()
      if (result.code === 200) {
        context.commit('FACORITEVIDEO', result)
        return 'ok'
      } else {
        throw '获取收藏视频失败！'
      }
    },
  },
  mutations: {
    // 收藏的专辑列表
    FAVORITEALBUM(state, value) {
      state.albumList = [] // 清空上次缓存的数据

      value.data.forEach((item) => {
        state.albumList.push(item)
      })
    },

    // 收藏的歌手列表
    FAVORITESINGER(state, value) {
      state.singerList = []

      value.data.forEach((item) => {
        state.singerList.push(item)
      })
    },

    // 收藏的视频列表
    FACORITEVIDEO(state, value) {
      state.videoList = []

      value.data.forEach((item) => {
        // 加工时间
        let time = parseInt(item.durationms / 1000) // 总秒数
        let m = parseInt(time / 60)
        m = m < 10 ? '0' + m : m
        let s = time % 60
        s = s < 10 ? '0' + s : s
        item.durationms = m + ':' + s

        // 加工播放次数
        if (item.playTime > 10000) {
          item.playTime = (item.playTime / 10000).toFixed(1) + '万'
        }

        state.videoList.push(item)
      })
    },
  },
  state: {
    albumList: [], // 收藏的专辑列表
    singerList: [], // 收藏的歌手列表
    videoList: [], // 收藏的视频列表
  },
  getters: {},
}
