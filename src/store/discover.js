import {
  reqBannerData,
  reqRecommendMusicList,
  reqMusicListCategory,
  reqMusicListAllCategory,
  reqCategoryMusicList,
  reqGoodMusicList,
  reqMusicListRanking,
  reqSingerList,
} from '@/api/discover'

import { reqMusicList } from '@/api/index'

export default {
  actions: {
    /************个性推荐***********/
    // 获取轮播图数据
    async getBannerData(context) {
      let result = await reqBannerData()
      if (result.code === 200) {
        context.commit('BANNERDATA', result)
        return 'ok'
      } else {
        throw '获取轮播图数据失败！'
      }
    },

    // 获取推荐歌单
    async getRecommendMusicList(context, value) {
      let result = await reqRecommendMusicList(value)
      if (result.code === 200) {
        context.commit('RECOMMENDMUSICLIST', result)
        return 'ok'
      } else {
        throw '获取推荐歌单失败！'
      }
    },

    /************歌单***********/
    // 获取一张精品歌单
    async getGoodMusicList(context) {
      let result = await reqGoodMusicList(1)
      if (result.code === 200) {
        context.commit('GOODMUSICLIST', result)
        return 'ok'
      } else {
        throw '精品歌单获取失败'
      }
    },

    // 获取歌单热门分类
    async getMusicListCategory(context) {
      let result = await reqMusicListCategory()
      if (result.code === 200) {
        context.commit('MUISCLISTCATEGORY', result)
        return 'ok'
      } else {
        throw '获取热门歌单分类失败！'
      }
    },

    // 获取歌单所有分类
    async getMusicListAllCategory(context) {
      let result = await reqMusicListAllCategory()
      if (result.code === 200) {
        context.commit('ALLMUSICLISTCATEGORY', result)
        return 'ok'
      } else {
        throw '获取歌单所有分类失败！'
      }
    },

    // 获取某个分类歌单
    async getCategotyMusicList(context, { cat, offset }) {
      let result = await reqCategoryMusicList(cat, offset)
      if (result.code === 200) {
        context.commit('CATEGORYMUSICLIST', result)
        return 'ok'
      } else {
        throw `获取${cat}歌单失败！`
      }
    },

    /************排行榜***********/
    // 获取歌单榜单
    async getMusicListRanking(context) {
      let result = await reqMusicListRanking()
      if (result.code === 200) {
        context.commit('MUSICLISTRANKING', result)
        return 'ok'
      } else {
        throw '获取歌单榜单失败！'
      }
    },

    // 获取官方榜前五首歌曲
    async getTopFiveMusic(context, id) {
      let result = await reqMusicList(id)
      if (result.code === 200) {
        context.commit('TOPFIVEMUSIC', result)
        return 'ok'
      } else {
        throw '获取前五首歌曲失败！'
      }
    },

    /************歌手***********/
    // 获取歌手列表
    async getSingerList(context, { offset, area, type, initial }) {
      let result = await reqSingerList(offset, area, type, initial)
      if (result.code === 200) {
        context.commit('SINGERLIST', result)
        return 'ok'
      } else {
        throw '获取歌手列表失败!'
      }
    },
  },
  mutations: {
    /************个性推荐***********/
    // 轮播图
    BANNERDATA(state, value) {
      /* 可能页面不刷新重新挂载recommend组件就会再发请求，页面不刷新vuex中的数据就不会清空。
      再次挂载发请求就会一直push*/
      state.bannerImgs = [] // 清空上次的缓存
      value.banners.forEach((item) => {
        state.bannerImgs.push(item.imageUrl)
      })
    },

    // 推荐歌单
    RECOMMENDMUSICLIST(state, value) {
      state.recommendMusicList = [] // 清空上次的缓存
      value.result.forEach((item) => {
        state.recommendMusicList.push(item)
      })
    },

    /************歌单***********/
    // 精品歌单
    GOODMUSICLIST(state, value) {
      state.goodMusicList.id = value.playlists[0].id
      state.goodMusicList.name = value.playlists[0].name
      state.goodMusicList.coverImgUrl = value.playlists[0].coverImgUrl
    },

    // 热门分类
    MUISCLISTCATEGORY(state, value) {
      // state.hotCategory = [] // 以免不刷新页面重新挂载 歌单页 再次发请求
      value.tags.forEach((item) => {
        state.hotCategory.push(item)
      })
    },

    // 所有分类
    ALLMUSICLISTCATEGORY(state, value) {
      value.sub.forEach((item) => {
        state.allCategory.push(item)
      })
    },

    // 分类歌单
    CATEGORYMUSICLIST(state, value) {
      state.categoryMusicList = [] // 清除上一次请求的歌单数据
      state.listCount = value.total // 保存该分类的歌单总数
      value.playlists.forEach((item) => {
        let obj = {}
        obj.id = item.id
        obj.name = item.name
        obj.coverImgUrl = item.coverImgUrl

        state.categoryMusicList.push(obj)
      })
    },

    /************排行榜***********/
    // 歌单榜单
    MUSICLISTRANKING(state, value) {
      state.officalList = [] // 清空上次缓存，避免页面不刷新（仓库中数据还在），重新挂载（再次发请求保存数据）。
      state.globalList = []
      value.list.forEach((item, index) => {
        if (index < 4) {
          // 前四个是官方榜
          let obj = {}
          obj.id = item.id
          obj.name = item.name
          obj.coverImgUrl = item.coverImgUrl

          state.officalList.push(obj)
        } else {
          let obj2 = {}
          obj2.id = item.id
          obj2.name = item.name
          obj2.coverImgUrl = item.coverImgUrl

          state.globalList.push(obj2)
        }
      })
    },

    // 前五首歌
    TOPFIVEMUSIC(state, value) {
      console.log('排行榜前五首歌')
      // 加工一下播放列表
      value.playlist.tracks.forEach((item) => {
        // 加工歌手
        let authors = ''
        for (var i = 0; i < item.ar.length; i++) {
          authors = authors + item.ar[i].name + ' / '
        }
        item.ar = authors.slice(0, -3)

        // 加工时长
        let time = parseInt(item.dt / 1000) // 总秒数
        let m = parseInt(time / 60)
        m = m < 10 ? '0' + m : m
        let s = time % 60
        s = s < 10 ? '0' + s : s

        item.dt = m + ':' + s
      })

      let fiveSongs = [] // 保存前五首歌
      value.playlist.tracks.forEach((item, index) => {
        if (index < 5) {
          fiveSongs.push(item)
        }
      })

      // 遍历官方榜
      state.officalList.forEach((item) => {
        // 如果id对的上，就把五首歌 和 播放列表 放进去
        if (value.playlist.id == item.id) {
          item.tracks = value.playlist.tracks // 保存播放列表
          item.trackIds = value.playlist.trackIds // 保存所有歌曲id 用于判断tracks是否完整
          item.fiveSongs = fiveSongs
        }
      })
    },

    /************歌手***********/
    SINGERLIST(state, value) {
      state.singerListMore = value.more
      state.singerList = state.singerList.concat(value.artists)
    },
  },
  state: {
    bannerImgs: [], // 轮播图图片
    recommendMusicList: [], // 推荐歌单

    goodMusicList: {}, // 一张精品歌单
    hotCategory: [], // 热门分类
    allCategory: [], // 所有分类
    categoryMusicList: [], // 分类歌单
    listCount: '', // 该分类的歌单总数

    officalList: [], // 官方榜
    globalList: [], // 全球榜

    singerList: [], // 歌手列表
    singerListMore: '', // 歌手列表还有更多吗? true有 false没有
  },
  getters: {},
}
