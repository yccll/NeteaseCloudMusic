import { service, controller } from './axios'

// 用户登录
export const reqUserLogin = (phone, password) => {
  return service({
    url: '/login/cellphone',
    params: {
      phone,
      password,
    },
  })
}

// 根据 用户id 查找用户信息
export const reqUserDetailById = (uid) =>
  service({
    url: '/user/detail',
    params: {
      uid,
      time: Date.now(),
    },
  })

// 获取热搜榜数据
export const reqHotSearchList = () =>
  service({
    url: '/search/hot/detail',
  })

// 获取搜索建议
export const reqSearchSuggest = (keywords) =>
  service({
    url: '/search/suggest',
    params: {
      keywords,
    },
  })

// 获取用户歌单
export const reqPlayList = (uid) =>
  service({
    url: '/user/playlist',
    params: {
      uid: uid,
      time: Date.now(),
    },
  })

// 获取用户动态列表
export const reqUserEvents = (uid) =>
  service({
    url: '/user/event',
    params: {
      uid,
    },
  })

// 获取用户关注列表
export const reqUserFollows = (uid) =>
  service({
    url: '/user/follows',
    params: {
      uid,
    },
  })

// 获取用户粉丝列表
export const reqUserFans = (uid) =>
  service({
    url: '/user/followeds',
    params: {
      uid,
    },
  })

// 获取歌单详细信息
export const reqMusicList = (id) =>
  service({
    url: '/playlist/detail',
    params: {
      id,
      time: Date.now(),
    },
  })

// 获取歌单所有歌曲
export const reqMusicSongs = (ids) =>
  service({
    url: '/song/detail',
    params: {
      ids: ids.join(','),
      time: Date.now(),
      signal: controller.signal,
    },
  })

// 获取歌单收藏者
export const reqMusicListSubscribers = (id, offset = 0) =>
  service({
    url: '/playlist/subscribers',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

// 获取每日推荐歌单
export const reqDailySongs = () =>
  service({
    url: '/recommend/songs',
  })

// 播放歌曲
export const reqMusicUrl = (id, level = 'exhigh') =>
  service({
    url: '/song/url/v1',
    params: {
      id,
      level,
    },
  })

// 发表评论
export const reqComment = (t, type, id, content, commentId) =>
  service({
    url: '/comment',
    params: {
      t, // 1发送 2回复
      type, // 资源类型
      id, // 对应资源
      content, // 要发送的内容
      commentId, // 回复评论的id
      time: Date.now(),
    },
  })

// 给评论点赞
export const reqCommentLike = (id, cid, t, type) =>
  service({
    url: '/comment/like',
    params: {
      id, // 资源id
      cid, // 评论id
      t, // 1为点赞 0为取消
      type, // 歌曲-0 MV-1 歌单-2 专辑-3 电台节目-4 视频-5 动态-6 电台-7
      time: Date.now(),
    },
  })

// 获取歌单评论
export const reqPlaylistComments = (id, offset = 0) =>
  service({
    url: '/comment/playlist',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

// 收藏/取消收藏歌单
export const reqSubscribeMusicList = (t, id) =>
  service({
    url: '/playlist/subscribe',
    params: {
      t, // 1收藏 2取消收藏
      id, // 歌单id
      time: Date.now(),
    },
  })

// 资源点赞
export const reqResourceLike = (t, type, id) =>
  service({
    url: '/resource/like',
    params: {
      t,
      type,
      id,
      time: Date.now(),
    },
  })

// 获取歌词
export const reqLyrics = (id) =>
  service({
    url: '/lyric',
    params: {
      id,
    },
  })

// 歌曲评论
export const reqSongComments = (id, offset) =>
  service({
    url: '/comment/music',
    params: {
      id,
      offset,
      time: Date.now(),
    },
  })

// 喜欢的音乐列表
export const reqLikeSongList = (uid) =>
  service({
    url: '/likelist',
    params: {
      uid,
      time: Date.now(),
    },
  })

// 喜欢/不喜欢 音乐
export const reqLikeSong = (id, like = true) =>
  service({
    url: '/like',
    params: {
      id,
      like,
      time: Date.now(),
    },
  })
