<template>
<!-- 回到顶部 -->
  <div class="backTop" ref="backTop" @click="goTop">
    <i class="iconfont icon-control101"></i>
  </div>
</template>

<script>
export default {
  name: 'BackTop',
  props:['element'], // 这个element是回到顶部按钮的父元素
  methods: {
    // 返回顶部滚动事件（window身上）
    scrollToTop() {
      if (this.$parent.$refs[this.element].scrollTop >= 1000) {
        this.$refs.backTop.className = 'backTop showBtn'
      } else {
        let className = this.$refs.backTop.className.replace('showBtn','hideBtn')
        this.$refs.backTop.className = className
      }
    },

    // 去顶部
    goTop(){
      // 开个定时器 回到顶部带有动画（可以用）
      // let timer = setInterval(()=>{
      //   let height = this.$parent.$refs[this.element].scrollTop
      //   this.$parent.$refs[this.element].scrollTop -= height / 9 // 每次减整个高度除10
      //   if(this.$parent.$refs[this.element].scrollTop <= 0){
      //     this.$parent.$refs[this.element].scrollTop = 0
      //     clearInterval(timer)
      //   }
      // },10)

      this.$parent.$refs[this.element].scrollTop = 0 // 简单又迅速的方法
    }
  },
  mounted() {
    window.addEventListener('scroll', this.scrollToTop, true) // 绑定滚动事件
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollToTop, true) // 解绑滚动事件
  },
}
</script>

<style lang="less" scoped>
// 返回顶部
.backTop {
  display: none;
  position: fixed;
  z-index: 2;
  bottom: 100px;
  right: 40px;
  width: 55px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  border-radius: 50%;
  background-color: #f3f3f3;
  box-shadow: 0 0 5px rgb(122, 122, 122);
  cursor: pointer;
  i {
    font-size: 35px;
  }
}

@keyframes showBtn {
  from {
    bottom: 0px;
  }
  70% {
    bottom: 130px;
  }
  to {
    bottom: 100px;
  }
}

.showBtn {
  display: block;
  animation: showBtn 0.6s ease forwards;
}

@keyframes hideBtn {
  from {
    bottom: 100px;
  }
  to {
    bottom: 0px;
    display: none;
  }
}

.hideBtn {
  display: block;
  animation: hideBtn 0.4s ease forwards;
}
</style>
