import {service} from './axios'

// 收藏的专辑列表
export const reqFavoriteAlbumList = (limit = 100) =>
  service({
    url: '/album/sublist',
    params: {
      limit,
      time: Date.now(),
    },
  })

// 收藏的歌手列表
export const reqFavoriteSingerList = (limit = 100) =>
  service({
    url: '/artist/sublist',
    params: {
      limit,
      time: Date.now(),
    },
  })

// 收藏的视频和MV列表
export const reqFavoriteVideoList = (limit = 100) =>
  service({
    url: '/mv/sublist',
    params: {
      limit,
      time: Date.now(),
    },
  })
