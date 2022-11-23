import {service} from './axios'

// 获取轮播图数据
export const reqBannerData = () =>
  service({
    url: '/banner',
  })

// 获取推荐歌单  n获取数量
export const reqRecommendMusicList = (n) =>
  service({
    url: '/personalized',
    params: {
      limit: n,
    },
  })

// 获取一张精品歌单
export const reqGoodMusicList = (limit) =>
  service({
    url:'/top/playlist/highquality',
    params:{
      limit
    }
  })

// 获取热门歌单分类
export const reqMusicListCategory = () =>
  service({
    url: '/playlist/hot',
  })

// 获取歌单所有分类
export const reqMusicListAllCategory = () =>
  service({
    url: '/playlist/catlist',
  })

// 获取某个分类歌单
export const reqCategoryMusicList = (cat, offset) =>
  service({
    url: '/top/playlist',
    params: {
      cat,
      offset,
    },
  })

// 获取歌单榜单
export const reqMusicListRanking = () =>
  service({
    url:'/toplist'
  })

// 根据分类 获取 歌手列表
export const reqSingerList = (offset,area,type,initial) =>
service({
  url:'/artist/list',
  params:{
    type,
    area,
    initial,
    offset
  }
})