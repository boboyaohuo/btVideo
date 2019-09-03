//index.js
//获取应用实例
import * as event from '../../utils/event.js';
const app = getApp();
const windowHeight = wx.getSystemInfoSync().windowHeight;

Page({
  data: {
    percent: 1,
    controls: false,
    playState: true,
    animationShow: false,
    currentTranslateY: 0,
    touchStartingY: 0,
    videos: [
      {
        videoUrl: "https://video.beitaichufang.com/journal/201909/lesha.mp4",
        poster: "https://app-file.beitaichufang.com/img/421B47FFD946CA083B65CD668C6B17E6/20190827/CNSFi3P7i3.jpg"
      },
      {
        videoUrl: "https://video.beitaichufang.com/journal/201909/labanchengziwang.mp4",
        poster: "https://app-file.beitaichufang.com/img/421B47FFD946CA083B65CD668C6B17E6/20190827/Be488y8atz.jpg"
      },
      {
        videoUrl: "https://video.beitaichufang.com/journal/201909/jiuzuihexia.mp4",
        poster: "https://app-file.beitaichufang.com/img/421B47FFD946CA083B65CD668C6B17E6/20190827/hyjdZDGNT2.jpg"
      },
      {
        videoUrl: "https://video.beitaichufang.com/journal/201909/jiucaixiaomilachaoshanbei.mp4",
        poster: "https://app-file.beitaichufang.com/img/421B47FFD946CA083B65CD668C6B17E6/20190827/Ha7274CYWd.jpg"
      }
    ],
    videoIndex: 0
  },

  onLoad: function () {
    // 初始第一个视频播放
    wx.createVideoContext("btVideo" + this.data.videoIndex).play();
    // 滑动
    this.videoChange = throttle(this.touchEndHandler, 200);
    // 绑定updateVideoIndex事件，更新当前播放视频index
    event.on('updateVideoIndex', this, function (index) {
      setTimeout(() => {
        this.setData({
          animationShow: false,
          playState: true
        }, ()=> {
          // 切换后，video不能立即播放，settimeout一下
          setTimeout(()=> {
            wx.createVideoContext("btVideo" + this.data.videoIndex).play()
          },100)
        });
      }, 500);
    });
  },
  
  // 视频开始播放事件
  bindplay() {
  },

  // 视频播放错误事件
  binderror(err) {
  },

  // 视频进度更新事件
  bindtimeupdate(e) {
    // 计算进度条长度百分比
    let percent = (e.detail.currentTime / e.detail.duration)*100;
    this.setData({
      percent: percent.toFixed(2)
    });
  },

  onReady: function () {
    // 初始化真题动画
    this.animation = wx.createAnimation({
      duration: 500,
      transformOrigin: '0 0 0'
    });
  },

  // 改变视频状态事件
  changePlayStatus() {
    // 判断改变后状态
    let playState = !this.data.playState;
    if (playState) {
      wx.createVideoContext("btVideo" + this.data.videoIndex).play();
    } else {
      wx.createVideoContext("btVideo" + this.data.videoIndex).pause();
    };

    // 重新赋值
    this.setData({
      playState: playState
    });
  },

  // 开始移动事件
  touchStart(e) {
    // 设置开始Y点
    this.setData({
      touchStartingY: e.touches[0].clientY
    });
  },

  // 移动中事件
  touchMove(e) {
    // this.videoChange(e)
  },

  // 移动结束操作器
  touchEndHandler(e) {
    // 计算Y轴移动距离
    let deltaY = e.changedTouches[0].clientY - this.data.touchStartingY;
    // 取当前video index
    let index = this.data.videoIndex;
    // 判断上移，并且是非第一个视频
    if (deltaY > 100 && index !== 0) {
      // 当前视频暂停
      wx.createVideoContext("btVideo" + this.data.videoIndex).pause();

      // 设置 animationShow 隐藏一些icon
      this.setData({
        animationShow: true
      }, () => {
        // -1 向上滑动 进行切换动画
        this.createAnimation(-1, index).then((res) => {
          // 动画切换完毕， res为切换完的视频index和变换Y值
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index);
          });
        });
      });
    // 判断下移，并且是非最后一个视频
    } else if (deltaY < -100 && index !== (this.data.videos.length - 1)) {
      // 当前视频暂停
      wx.createVideoContext("btVideo" + this.data.videoIndex).pause();

      // 设置 animationShow 隐藏一些icon
      this.setData({
        animationShow: true
      }, () => {
        // +1 向上滑动 进行切换动画
        this.createAnimation(1, index).then((res) => {
          this.setData({
            animation: this.animation.export(),
            videoIndex: res.index,
            currentTranslateY: res.currentTranslateY,
            percent: 1
          }, () => {
            event.emit('updateVideoIndex', res.index);
          });
        });
      });
    }
  },

  // 移动结束事件
  touchEnd(e) {
    // 开始动画，进行视频更换
    this.videoChange(e)
  },

  // 取消事件
  touchCancel(e) {
  },

  // 创建动画
  createAnimation(direction, index) {
    // direction为-1，向上滑动，animationImage1为(index)的poster，animationImage2为(index+1)的poster
    // direction为1，向下滑动，animationImage1为(index-1)的poster，animationImage2为(index)的poster
    let videos = this.data.videos;
    let currentTranslateY = this.data.currentTranslateY;
    
    // 更新 videoIndex
    index += direction;

    // 计算移动距离
    currentTranslateY += -direction*windowHeight;

    // 进行移动动画
    this.animation.translateY(currentTranslateY).step();
    
    // 返回新的index和距离
    return Promise.resolve({
      index: index,
      currentTranslateY: currentTranslateY
    })
  }
})

// 滑动事件
function throttle (fn, delay) {
  var timer = null;
  return function () {
    var context = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}
