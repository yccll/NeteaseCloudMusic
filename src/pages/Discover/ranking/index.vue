<template>
  <div class="rankingContainer" ref="rankingContainer">
    <div class="ranking" v-loading="loading">
      <div class="title" v-show="officalList.length">官方榜</div>
      <!-- 官方榜 -->
      <div class="offical">
        <div class="officalItem" v-for="o in officalList" :key="o.id">
          <div class="left" @click="goMusiclistDetail(o.id)">
            <img v-lazy="o.coverImgUrl + '?param=400y400'" />
          </div>
          <div class="right">
            <!-- 小歌单表 -->
            <table>
              <tr
                v-for="(item, index) in o.fiveSongs"
                @dblclick="playMusic(item.id, o.tracks, o.id, o.trackIds)"
              >
                <td class="index">{{ index + 1 }}</td>
                <td class="musicName">{{ item.name }}</td>
                <td class="singer">{{ item.ar }}</td>
              </tr>
            </table>

            <!-- 查看全部 -->
            <div class="lookAll" @click="goMusiclistDetail(o.id)">
              查看全部<i class="iconfont icon-xiangyou"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- 全球榜 -->
      <div class="title" v-show="globalList.length">全球榜</div>
      <div class="global">
        <div class="globalItem" v-for="g in globalList" :key="g.id" @click="goMusiclistDetail(g.id)">
          <div class="image">
            <img v-lazy="g.coverImgUrl + '?param=400y400'" />
          </div>
          <p>{{ g.name }}</p>
        </div>
      </div>
    </div>

    <!-- 返回顶部功能组件 -->
    <BackTop element="rankingContainer" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BackTop from '@/feature/backTop'

export default {
  name: 'Ranking',
  data() {
    return {
      officalList: [], // 官方榜
      globalList: [], // 全球榜
      tableShow: false, // 是否显示 表格
      loading: false, // 加载状态
    }
  },
  components: {
    BackTop,
  },
  computed: {
    ...mapState({ discover: (state) => state.discover }),
  },
  methods: {
    // 获取榜单
    async getMusicListRanking() {
      try {
        await this.$store.dispatch('getMusicListRanking')

        /* 
          如果有v-for嵌套的数据一定要直接全部拿到再保存到自身。
          如果先拿到第一层v-for遍历的数据就保存到自身了，页面渲染完毕后，再去获取第二层v-for中的数据
          再保存到自身的话第二层是出不来的。
        */

        await this.getTopFiveMusic()
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 获取官方榜前五首歌
    async getTopFiveMusic() {
      try {
        let { officalList } = this.discover // vuex中的数据
        this.loading = true // 加载中...
        await Promise.all([
          this.$store.dispatch('getTopFiveMusic', officalList[0].id),
          this.$store.dispatch('getTopFiveMusic', officalList[1].id),
          this.$store.dispatch('getTopFiveMusic', officalList[2].id),
          this.$store.dispatch('getTopFiveMusic', officalList[3].id),
        ])
        this.loading = false // 加载完毕
        // 保存官方榜 和 全球榜数据到自身
        this.officalList = this.$store.state.discover.officalList
        this.globalList = this.$store.state.discover.globalList
      } catch (error) {
        this.$message({
          message: error,
          type: 'error',
        })
      }
    },

    // 跳转歌单详细页
    goMusiclistDetail(id) {
      this.$router.push({
        name: 'musicListDetail',
        params: {
          musicListId: id,
        },
      })
    },

    // 播放top5的音乐
    playMusic(songId, songs, songsId, allSongId) {
      // 参数: 音乐id 播放列表 播放列表id 播放列表所有歌曲id
      if (this.$store.state.music.playSongId === songId) return // 重复选择
      this.$store.state.music.playSongId = songId // 改变仓库中当前播放歌曲id

      if (songs.length < allSongId.length) {
        // 判断songs也就是tracks是否完整
        // 不完整，把歌单id 换成时间戳，每次播放这个歌单的歌曲都会更新播放列表
        this.$bus.$emit('changePlaylist', songs, Date.now())
      } else {
        // 完整，直接改变播放列表，带真实的歌单id过去，再播放这个歌曲不会更新播放列表
        this.$bus.$emit('changePlaylist', songs, songsId)
      }

      /* 
        怕哪一天，官方榜里的歌单的tracks也不完整了，就会影响播放列表
      */

      // 播放音乐
      this.$bus.$emit('playMusic')
    },
  },
  async mounted() {
    await this.getMusicListRanking() // 获取榜单 和 前五首歌
  },
}
</script>

<style lang="less" scoped>
.rankingContainer {
  width: 100%;
  height: calc(100vh - 197px);
  overflow: auto;
  overflow-x: hidden;
  min-width: 750px;
  padding: 0 30px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;

  .ranking {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1200px;

    // 标题
    .title {
      width: 100%;
      font-size: 20px;
      color: #636363;
      margin-bottom: 25px;
    }

    // 官方榜
    .offical {
      width: 100%;
      .officalItem {
        display: flex;
        padding-right: 20px;
        margin-bottom: 80px;
        .left {
          margin-right: 20px;
          cursor: pointer;
          img {
            width: 180px;
            height: 180px;
            border-radius: 10px;
            vertical-align: bottom;
          }
        }
        .right {
          flex-grow: 1;
          // 表格
          table {
            width: 100%;
            tr {
              display: flex;
              height: 36px;
              line-height: 36px;
              font-size: 14px;
              cursor: pointer;

              // 奇数行
              &:nth-child(odd) {
                background-color: #f5f5f5;
              }
              // hover行 这个还必须要写在奇数行后面奇数行才有效果... 晕
              &:hover {
                background-color: #e9e9e9;
              }
              // 第一行
              &:first-child {
                border-radius: 10px 10px 0 0;
              }
              // 最后一行
              &:last-child {
                border-radius: 0 0 10px 10px;
              }

              td {
                // 序号
                &.index {
                  width: 40px;
                  text-align: center;
                  color: #888888;
                }
                // 歌曲名
                &.musicName {
                  white-space: nowrap;
                  flex-grow: 1;
                  color: #222222;
                }
                // 歌手
                &.singer {
                  max-width: 285px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  padding: 0 10px;
                  color: #888888;
                }
              }
            }
          }
          // 查看全部
          .lookAll {
            display: inline-block;
            margin-top: 10px;
            font-size: 14px;
            color: #888888;
            cursor: pointer;
          }
        }
      }
    }

    // 全球榜
    .global {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      // 小歌单盒子
      .globalItem {
        width: 18.4%;
        margin: 0 2% 20px 0;
        cursor: pointer;
        &:nth-child(5n) {
          margin-right: 0;
        }
        // 图片盒子
        .image {
          position: relative;
          width: 100%;
          height: 0px;
          padding-bottom: 100%;
          // 图片
          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border-radius: 10px;
          }
        }
        // 歌单名
        p {
          margin-top: 5px;
          font-size: 15px;
          line-height: 1.2;
          word-break: break-all;
          word-wrap: break-word;
        }
      }
    }
  }
}
</style>
