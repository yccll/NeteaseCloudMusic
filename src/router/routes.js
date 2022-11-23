// 路由规则文件
export default [
  {
    // 重定向
    path: '/',
    redirect: '/discover/recommend',
  },
  // 发现页
  {
    path: '/discover',
    component: () => import('@/pages/Discover'),
    children: [
      {
        path: 'recommend',
        component: () => import('@/pages/Discover/recommend'),
        meta: { active: 1 },
      },
      {
        path: 'musiclist',
        component: () => import('@/pages/Discover/musicList'),
        meta: { active: 2 },
      },
      {
        path: 'ranking',
        component: () => import('@/pages/Discover/ranking'),
        meta: { active: 3 },
      },
      {
        path: 'singer',
        component: () => import('@/pages/Discover/singer'),
        meta: { active: 4 },
      },
    ],
  },
  // 视频页
  {
    path: '/video',
    component: () => import('@/pages/Video'),
    children: [
      {
        path: 'videolist',
        component: () => import('@/pages/Video/video'),
        meta: { active: 1 },
      },
      {
        path: 'mv',
        component: () => import('@/pages/Video/mv'),
        meta: { active: 2 },
      },
    ],
  },
  // 收藏页
  {
    path: '/favorites',
    component: () => import('@/pages/Favorites'),
    children: [
      {
        // 收藏专辑
        path: 'album',
        component: () => import('@/pages/Favorites/album'),
        meta: { active: 1 },
      },
      {
        // 收藏歌手
        path: 'singer',
        component: () => import('@/pages/Favorites/singer'),
        meta: { active: 2 },
      },
      {
        // 收藏视频
        path: 'video',
        component: () => import('@/pages/Favorites/video'),
        meta: { active: 3 },
      },
    ],
  },
  // 每日推荐
  {
    path: '/dailySongs',
    component: () => import('@/pages/DailySongs'),
  },
  // 用户信息页
  {
    path: '/user/:userId', // 占位接收params参数 userId--用户id
    name: 'user',
    component: () => import('@/pages/User'),
  },
  // 歌单详细页
  {
    path: '/musicListDetail/:musicListId',
    name: 'musicListDetail',
    props: true,
    component: () => import('@/pages/MusicListDetail'),
  },
  // 搜索详细页
  {
    path: '/search',
    component: () => import('@/pages/Search'),
    children: [
      {
        path: 'songs/:keywords',
        name: 'searchSongs',
        props: true,
        component: () => import('@/pages/Search/songs'),
        meta: { active: 1 },
      },
      {
        path: 'singer/:keywords',
        name: 'searchSinger',
        props: true,
        component: () => import('@/pages/Search/singer'),
        meta: { active: 2 },
      },
      {
        path: 'album/:keywords',
        name: 'searchAlbum',
        props: true,
        component: () => import('@/pages/Search/album'),
        meta: { active: 3 },
      },
      {
        path: 'video/:keywords',
        name: 'searchVideo',
        props: true,
        component: () => import('@/pages/Search/video'),
        meta: { active: 4 },
      },
      {
        path: 'musiclist/:keywords',
        name: 'searchMusiclist',
        props: true,
        component: () => import('@/pages/Search/musicList'),
        meta: { active: 5 },
      },
    ],
  },
  // 专辑详细页
  {
    path: '/albumDetail/:albumId',
    name: 'albumDetail',
    props: true,
    component: () => import('@/pages/AlbumDetail'),
  },
  // 歌手详细页
  {
    path: '/singerDetail/:singerId',
    name: 'singerDetail',
    props: true,
    component: () => import('@/pages/SingerDetail'),
  },
  // 视频详细页
  {
    path: '/videoDetail/:videoId',
    name: 'videoDetail',
    props: true,
    component: () => import('@/pages/VideoDetail'),
  },
  // MV详细页
  {
    path: '/mvDetail/:mvid',
    name: 'mvDetail',
    props: true,
    component: () => import('@/pages/MvDetail'),
  },
]
