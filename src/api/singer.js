import {service} from './axios'

// 获取歌手详细
export const reqSingerDetail = (id) =>
  service({
    url: '/artist/detail',
    params: {
      id,
    },
  })

// 获取歌手热门50首歌
export const reqSingerHotFifty = (id) =>
  service({
    url: '/artist/top/song',
    params: {
      id,
    },
  })

// 获取歌手热门专辑
export const reqSingerHotAlbum = (id, limit = 20, offset = 0) =>
  service({
    url: '/artist/album',
    params: {
      id,
      limit,
      offset,
    },
  })

// 获取歌手MV列表
export const reqSingerMvList = (id, offset = 0, limit = 20) =>
  service({
    url: '/artist/mv',
    params: {
      id,
      limit,
      offset,
    },
  })

// 收藏/取消收藏 歌手
export const reqSubscribeSinger = (t, id) =>
  service({
    url: '/artist/sub',
    params: {
      t,
      id,
      time: Date.now(),
    },
  })
