// 引入axios
import axios from 'axios'

// 创建实例
const service = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject('faile')
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data // 返回一个成功的promise对象  值:response.data
  },
  (error) => {
    return Promise.reject('请求出错了') // 返回一个失败的promise对象
  }
)

// 取消请求
const controller = new AbortController()

// 暴露
export { service, controller }
