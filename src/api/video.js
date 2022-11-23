import {service} from './axios'

// 获取所有视频分类标签
export const reqVideoAllTags = () => {
  return service({
    url: '/video/group/list',
  })
}

// 获取常用视频分类标签
export const reqVideoTags = () => {
  return service({
    url: '/video/category/list',
  })
}

// 根据分类获取视频列表
export const reqVideoList = (id, offset) => {
  return service({
    url: '/video/group',
    params: {
      id,
      offset,
    },
  })
}

// 获取MV列表
export const reqMVList = (area, type, order, offset) => {
  return service({
    url: '/mv/all',
    params: {
      area,
      type,
      order,
      offset,
    },
  })
}

// 获取视频详情
export const reqVideoDetail = (id) =>
  service({
    url: '/video/detail',
    params: {
      id,
      time: Date.now(),
    },
  })

// 获取视频播放url
export const reqVideoUrl = (id) =>
  service({
    url: '/video/url',
    params: {
      id,
    },
  })

// 获取相关视频
export const reqRelatedVideo = (id) =>
  service({
    url: '/related/allvideo',
    params: {
      id,
    },
  })

// 视频评论
export const reqVideoComments = (id, offset = 0) =>
  service({
    url: '/comment/video',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

//

// 获取MV详情
export const reqMvDetail = (mvid) =>
  service({
    url: '/mv/detail',
    params: {
      mvid,
      time: Date.now(),
    },
  })

// 获取MV地址
export const reqMvUrl = (id) =>
  service({
    url: '/mv/url',
    params: {
      id,
    },
  })

// 获取相关MV
export const reqRelatedMv = (mvid) =>
  service({
    url: '/simi/mv',
    params: {
      mvid,
    },
  })

// MV评论
export const reqMvComments = (id, offset = 0) =>
  service({
    url: '/comment/mv',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

// 收藏/取消收藏 MV
export const reqSubscribeMv = (t, mvid) =>
  service({
    url: '/mv/sub',
    params: {
      t, // 1收藏 2取消收藏
      mvid, // mvid
      time: Date.now(),
    },
  })

// 收藏/取消收藏 视频
export const reqSubscribeVideo = (t, id) =>
  service({
    url: '/video/sub',
    params: {
      t,
      id,
      time: Date.now(),
    },
  })
