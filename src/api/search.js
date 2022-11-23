import {service} from './axios'

// 搜索 单曲、歌手、专辑、视频、歌单
export const reqSearch = (type, keywords, offset, limit = 30) =>
  service({
    url: '/cloudsearch',
    params: {
      type, // 搜索类型
      keywords, // 关键字
      offset, // 默认 0
      limit, // 每页显示多少条数据
    },
  })

// 多重匹配搜索（最佳匹配）
export const reqMultimatch = (keywords) =>
  service({
    url: '/search/multimatch',
    params:{
      keywords
    }
  })
