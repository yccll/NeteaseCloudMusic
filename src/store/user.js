import {
  reqUserLogin,
  reqUserDetailById,
  reqHotSearchList,
  reqPlayList,
  reqUserEvents,
  reqUserFollows,
  reqUserFans,
  reqSearchSuggest,
} from '@/api'

export default {
  actions: {
    // 根据手机号 密码 登录
    async userLogin(context, value) {
      let { phone, password } = value // 解构出手机号和密码
      let result = await reqUserLogin(phone, password)
      if (result.code === 200) {
        context.commit('USERLOGIN', result)
        return 'ok'
      } else {
        throw '账号或密码有误！'
      }
    },

    // 根据用户id 查找用户信息
    async userDetailById(context, value) {
      console.log('获取用户信息', value)
      let result = await reqUserDetailById(value)
      if (result.code === 200) {
        context.commit('USERINFO', result)
        return 'ok'
      } else {
        return Promise.reject('获取用户信息失败！')
      }
    },

    // 获取热搜榜数据
    async getHotSearchList(context) {
      console.log('vuex中调用了获取热搜榜方法')
      let result = await reqHotSearchList()
      if (result.code === 200) {
        context.commit('HOTSEARCHDATA', result.data)
        return 'ok'
      } else {
        return Promise.reject('falie')
      }
    },

    // 获取搜索建议
    async getSearchSuggest(context, value) {
      let result = await reqSearchSuggest(value)
      if(result.code === 200){
        context.commit('SEARCHSUGGEST',result)
        return 'ok'
      }else{
        throw '获取搜索建议失败！'
      }
    },

    // 获取我的歌单
    async getMyMusicList(context, value) {
      console.log('获取我的歌单')
      let result = await reqPlayList(value)
      if (result.code === 200) {
        context.commit('MYMUSICLIST', result)
        return 'okk'
      } else {
        throw '获取我的歌单失败！'
      }
    },

    // 获取歌单
    async getMusicList(context, value) {
      console.log('获取用户歌单', value)
      let result = await reqPlayList(value)
      if (result.code === 200) {
        context.commit('MUSICLIST', result)
        return 'ok'
      } else {
        throw '获取歌单失败！'
      }
    },

    // 获取用户动态数量
    async getUserEventNums(context, value) {
      let result = await reqUserEvents(value)
      if (result.code === 200) {
        context.commit('USEREVENTNUMS', result)
        return 'ok'
      } else {
        throw '获取用户动态数量失败！'
      }
    },

    // 获取用户关注数量
    async getUserFollowNums(context, value) {
      let result = await reqUserFollows(value)
      if (result.code === 200) {
        context.commit('USERFOLLOWNUMS', result)
        return 'ok'
      } else {
        throw '获取用户关注数量失败！'
      }
    },

    // 获取用户粉丝数量
    async getUserFanNums(context, value) {
      let result = await reqUserFans(value)
      if (result.code === 200) {
        context.commit('USERFANNUMS', result)
        return 'ok'
      } else {
        throw '获取用户粉丝数量失败！'
      }
    },
  },
  mutations: {
    // 用户登录
    USERLOGIN(state, { profile }) {
      // 保存用户id、用户名、用户头像
      state.userInfo.id = profile.userId
      state.userInfo.name = profile.nickname
      state.userInfo.avatar = profile.avatarUrl
      // 本地存储用户ID
      localStorage.setItem('userId', state.userInfo.id)
    },

    // 用户信息
    USERINFO(state, { level, profile }) {
      // 保存用户id、用户名、用户头像 、所在地、个人介绍、等级
      state.userInfo.id = profile.userId
      state.userInfo.name = profile.nickname
      state.userInfo.avatar = profile.avatarUrl
      state.userInfo.address = [profile.province, profile.city]
      state.userInfo.signature = profile.signature
      state.userInfo.level = level
    },

    // 热搜榜
    HOTSEARCHDATA(state, value) {
      state.hotSearchList = value
    },

    // 搜索建议
    SEARCHSUGGEST(state,value){
      state.searchSuggest = {} // 清除上次缓存
      for(let i in value.result){
        state.searchSuggest[i] = value.result[i]
      }
    },

    // 我的歌单
    MYMUSICLIST(state, value) {
      state.myCreateList = [] // 清空之前保存的数据
      state.mySubscribedList = []
      // 可能退出之后没有刷新页面，vuex数据还在，然后再次登录自动发请求会一直push
      value.playlist.forEach((item) => {
        if (item.userId == localStorage.getItem('userId')) {
          // 创建的歌单
          state.myCreateList.push(item)
        } else {
          // 收藏的歌单
          state.mySubscribedList.push(item)
        }
      })
    },

    // 歌单
    MUSICLIST(state, value) {
      state.createList = [] // 清空
      state.subscribedList = []
      // 有时候不刷新 切回user页面 会一直push
      value.playlist.forEach((item) => {
        if (item.userId == state.userInfo.id) {
          // 如果歌单中的userId字段与当前用户的id相同那么就是 创建的歌
          state.createList.push(item)
        } else {
          // 收藏的歌单
          state.subscribedList.push(item)
        }
      })
    },

    // 保存用户动态数量
    USEREVENTNUMS(state, value) {
      // 要考虑到没有动态的情况
      if (value.size) {
        state.userEventNums = value.size
      } else {
        state.userEventNums = 0
      }
    },

    // 保存用户关注数量
    USERFOLLOWNUMS(state, value) {
      // 要考虑到没有关注的情况
      if (value.follow.length) {
        state.userFollowNums = value.follow.length
      } else {
        state.userFollowNums = 0
      }
    },

    // 保存用户粉丝数量
    USERFANNUMS(state, value) {
      // 要考虑到没有粉丝的情况
      if (value.size) {
        state.userFanNums = value.size
      } else {
        state.userFanNums = 0
      }
    },
  },
  state: {
    hotSearchList: [], // 热搜榜
    searchSuggest:{}, // 搜索建议
    userInfo: {}, // 用户信息
    myCreateList: [], // 我创建的歌单
    mySubscribedList: [], // 我收藏的歌单
    createList: [], // 创建的歌单
    subscribedList: [], // 收藏的歌单
    userEventNums: '', // 用户动态数量
    userFollowNums: '', // 用户关注数量
    userFanNums: '', // 用户粉丝数量
  },
  getters: {},
}
