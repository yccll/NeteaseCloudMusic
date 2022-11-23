import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user from './user' // 用户相关
import music from './music' // 歌单相关
import discover from './discover' // 发现页
import video from './video' // 视频页
import favorites from './favorites' // 收藏页
import search from './search' // 搜索页
import album from './album' // 专辑
import singer from './singer' // 歌手
import card from './card' // 卡片

export default new Vuex.Store({
  modules: {
    user,
    music,
    discover,
    video,
    favorites,
    search,
    album,
    singer,
    card,
  },
})
