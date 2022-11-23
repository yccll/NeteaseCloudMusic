<template>
  <div id="app">
    <Header />
    <Content />
    <Footer />
    <MusicDetailCard />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Content from './components/Content.vue'
import Footer from './components/Footer.vue'
import MusicDetailCard from './components/MusicDetailCard.vue'
export default {
  name: 'App',
  components: {
    Header,
    Content,
    Footer,
    MusicDetailCard,
  },
}
</script>

<style lang="less">
html {
  overflow-y: hidden;
}

/* 公共样式 */

* {
  user-select: none; // 不可选中
}

// 修饰滚动条
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #ccc;
}

// 清除浮动
.clearfix::before,
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}

// 最小宽度
.w {
  min-width: 960px;
}

/* 公共样式end */

/************Header***********/
// 弹出框元素与app同级，在任何带有scoped的style标签下修改都不奏效
// 热搜榜弹出框
.el-popover.el-popper.hotSearchPopover {
  transform: translateY(-8px);
  padding: 0; // 清除内边距
  height: 440px;
  overflow: auto;
}

// 热搜榜没有滚动条
.el-popover.el-popper.hotSearchPopover::-webkit-scrollbar {
  width: 0;
}

/************Content***********/
// 侧边栏
.el-menu {
  border: none !important;
  // 侧边栏样式 (发现音乐、视频、收藏、每日推荐)
  .el-menu-item {
    width: 210px !important;
    box-sizing: border-box;
    padding: 0 0 0 15px !important;
    margin: 5px 0 !important;
    height: 40px !important;
    line-height: 40px !important;
    font-size: 15px !important;
    background-color: #fff !important;
    &:hover {
      background-color: #f6f6f7 !important;
    }
  }
  // 侧边栏选中效果
  .is-active {
    background-color: #f6f6f7 !important;
    color: black !important;
    font-weight: bold;
  }

  // 收藏、创建的歌单
  .el-menu-item-group {
    // 标题
    .el-menu-item-group__title {
      padding: 15px 0 10px 25px !important;
      font-size: 15px !important;
    }
    // 每一项
  }
}

/************Footer***********/
// 底部进度条
.el-slider {
  .el-slider__runway {
    height: 5px;
    // 进度条
    .el-slider__bar {
      height: 5px;
      background-color: #fa5b5b;
      border-radius: 3px;
    }
    // 按钮
    .el-slider__button {
      border: 1px solid #ccc;
      width: 10px;
      height: 10px;
    }
  }
}

// 文字提示框（版权信息）
.el-tooltip__popper {
  z-index: 3001 !important;
  text-align: center;
}

// 右边抽屉
.el-drawer.rtl.playList {
  width: 370px !important;
  // 抽屉标题
  .el-drawer__header {
    margin-bottom: 12px;
    .drawerTitle {
      color: #a9a9a9;
      font-size: 13px;
    }
  }
  // 抽屉内容
  section.el-drawer__body {
    flex: none;
    height: calc(100vh - 112px);

    // 清除滚动条
    &::-webkit-scrollbar {
      width: 0;
    }
    // 表格
    table > tbody > tr {
      cursor: pointer;
      // 高亮行
      &.el-table__row.current-row {
        td {
          background-color: #ddd;
        }
      }
      // 行hover
      &:hover > td {
        background-color: rgb(240, 240, 240);
      }
      &:nth-child(odd) {
        background-color: #f9f9f9;
      }
      td {
        padding: 7px 0px;
        div.cell {
          padding: 0 10px 0 20px;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:last-child {
          color: #a9a9a9;
        }
      }
    }
  }
}

/************发现音乐***********/
// 发现音乐 -> 个性推荐 轮播图
.recommend {
  .carousel {
    .el-carousel {
      .el-carousel__container {
        // 上一张、下一张 按钮
        button {
          i {
            font-weight: bold;
          }
        }
      }
      // 导航栏指示器
      ul.el-carousel__indicators {
        li {
          padding: 15px 5px;
          button {
            width: 40px;
            height: 3px;
          }
        }
      }
    }
  }
}

// 发现音乐 -> 歌单 分页器
.page {
  padding-bottom: 20px;
  .el-pagination {
    font-weight: normal;
    .el-pager {
      li:not(.disabled).active {
        background-color: #ec4141 !important;
        &:hover {
          color: #fff !important;
        }
      }
      li:not(.disabled):hover {
        color: #606266 !important;
        background-color: #dbdbdb;
      }
    }
  }
}

// 发现音乐 -> 歌单 所有分类弹出框
.el-popover.musicListAllCategory {
  height: 380px;
  overflow: auto;
  z-index: 0 !important;
  .navItemList {
    display: flex;
    flex-flow: row wrap;
    padding: 10px 5px;
    .item {
      width: 25%;
      text-align: center;
      padding: 5px 0;
      border-radius: 30px;
      margin-bottom: 10px;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
      &.active {
        color: #ec4141;
        background-color: rgba(255, 192, 203, 0.2);
      }
    }
  }
}

/************MusicListDetail歌单***********/
// el-tabs标题
.el-tabs__header {
  .el-tabs__nav-wrap {
    &::after {
      display: none;
    }
    .el-tabs__nav-scroll {
      .el-tabs__nav.is-top {
        .el-tabs__active-bar.is-top {
          background-color: #ec4141 !important;
        }
        .el-tabs__item {
          font-size: 15px;
          padding: 0 25px;
          &:nth-child(2) {
            padding-left: 0;
          }
        }
        .el-tabs__item.is-active {
          font-weight: bold;
          color: black;
        }
        .el-tabs__item:hover {
          color: #303133;
        }
      }
    }
  }
}

// el-tabs内容
.el-tabs__content {
  .el-tab-pane {
    // 表格
    .el-table {
      .el-table__header {
        thead {
          color: #666666;
          tr {
            font-size: 13px !important;
            th {
              border: 0;
            }
          }
        }
      }
      .el-table__body {
        tbody {
          color: #666666;
          tr {
            width: 100%;
            font-size: 13px !important;
            cursor: pointer;
            // 奇数行
            &:nth-child(odd) {
              background-color: #f9f9f9;
            }
            // 单击选中行
            &.current-row {
              td {
                background-color: #e0e0e0;
              }
            }

            &:hover {
              td {
                background-color: #f0f0f0;
              }
            }
            td {
              border: 0;
              padding: 4px 0;
              .cell {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              // 下载
              &:nth-child(2) {
                font-weight: 600;
                i {
                  font-size: 13px;
                }
              }
              // 歌名
              &:nth-child(3) {
                color: black;
              }
            }
          }
        }
      }
    }
  }

  // el-tabs最后一项
  > div:last-child {
    .desc {
      font-size: 15px;
      line-height: 1.5;
      color: #373737;
    }
  }
}

/************视频***********/
.el-popover.videoPopover {
  height: 400px;
  overflow: auto;
  z-index: 0 !important;
  .navItemList {
    display: flex;
    flex-flow: row wrap;
    padding: 10px 5px;
    .item {
      width: 25%;
      text-align: center;
      padding: 5px 0;
      border-radius: 30px;
      margin-bottom: 15px;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;
      &.active {
        color: #ec4141;
        background-color: rgba(255, 192, 203, 0.2);
      }
    }
  }
}

/************每日推荐歌单***********/
.dailySongsContainer {
  .musiclist {
    // 表格
    .el-table {
      .el-table__header {
        thead {
          color: #666666;
          tr {
            font-size: 13px !important;
            th {
              border: 0;
            }
          }
        }
      }
      .el-table__body {
        tbody {
          color: #666666;
          tr {
            width: 100%;
            font-size: 13px !important;
            cursor: pointer;
            // 奇数行
            &:nth-child(odd) {
              background-color: #f9f9f9;
            }
            // 选中行
            &.current-row {
              td {
                background-color: #e0e0e0;
              }
            }
            &:hover {
              td {
                background-color: #f0f0f0;
              }
            }
            td {
              border: 0;
              padding: 4px 0;
              .cell {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              // 下载
              &:nth-child(2) {
                font-weight: 600;
                i {
                  font-size: 13px;
                }
              }
              // 歌名
              &:nth-child(3) {
                color: black;
              }
            }
          }
        }
      }
    }
  }
}

/************搜索单曲表格***********/
.search {
  .main {
    // 表格
    .el-table {
      .el-table__header {
        thead {
          color: #666666;
          tr {
            font-size: 13px !important;
            th {
              border: 0;
            }
          }
        }
      }
      .el-table__body-wrapper {
        overflow: hidden;
        .el-table__body {
          tbody {
            color: #666666;
            tr {
              width: 100%;
              font-size: 13px !important;
              cursor: pointer;
              // 奇数行
              &:nth-child(odd) {
                background-color: #f9f9f9;
              }
              // 选中行
              &.current-row {
                td {
                  background-color: #e0e0e0;
                }
              }
              &:hover {
                td {
                  background-color: #f0f0f0;
                }
              }
              td {
                border: 0;
                padding: 4px 0;
                .cell {
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                // 序号、下载
                &:nth-child(-n + 2) {
                  font-weight: 600;
                }
                // 下载
                &:nth-child(2) {
                  i {
                    font-size: 13px;
                  }
                }
                // 歌名
                &:nth-child(3) {
                  color: black;
                }
              }
            }
          }
        }
      }
    }
  }
}

/************视频详情页评论框***********/
.comment {
  .el-textarea {
    .el-textarea__inner {
      font-size: 14px;
      line-height: 1.2;
      min-height: 80px !important;
      padding: 5px 8px;
      &:focus {
        border-color: #9b9b9b;
      }
    }
  }
}

// 加载loading颜色
.el-loading-mask {
  .el-loading-spinner {
    .circular {
      circle {
        stroke: #ec4141;
      }
    }
  }
}

/************音乐卡片***********/
.musicDetailCard {
  .el-dialog__wrapper {
    .el-dialog {
      border-radius: 15px;
      .el-dialog__header {
        .el-dialog__headerbtn {
          &:hover {
            i.el-dialog__close {
              color: #ec4141 !important;
            }
          }
        }
      }
      .el-dialog__body {
        padding: 10px 20px;
        position: relative;
        // 标题
        .title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          padding-bottom: 10px;
        }
        // 输入框
        .el-textarea {
          .el-textarea__inner {
            font-size: 14px;
            line-height: 1.2;
            min-height: 80px !important;
            padding: 5px 8px;
            height: 100px;
            &:focus {
              border-color: #9b9b9b;
            }
          }
        }
        // 字数统计
        .count {
          position: absolute;
          right: 25px;
          bottom: 12px;
        }
      }
      .el-dialog__footer {
        .btnItem {
          display: inline-block;
          font-size: 14px;
          padding: 9px 15px;
          border: 1px solid #ddd;
          border-radius: 30px;
          margin-right: 10px;
          color: #fff;
          background-color: #ec4141;
          cursor: pointer;
          i {
            margin-right: 3px;
          }
          &:hover {
            background-color: #e03b3b;
          }
        }
      }
    }
  }
}
</style>
