import { service } from './axios'

// 获取专辑详细
export const reqAlbumDetail = (id) =>
  service({
    url: '/album',
    params: {
      id,
    },
  })

// 获取专辑评论
export const reqAlbumComments = (id, offset = 0) =>
  service({
    url: '/comment/album',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

// 收藏/取消收藏 专辑
export const reqSubscribeAlbum = (t, id) =>
  service({
    url: '/album/sub',
    params: {
      t,
      id,
      time: Date.now(),
    },
  })
