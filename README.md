# btVideo
小程序类抖音，火山小视频首页切换视频

20191101 同层渲染进度同步
为了解决小程序原生组件存在的一些使用限制，我们对原生组件引入了同层渲染。支持同层渲染的原生组件层级与非原生组件一致，可直接使用非原生组件（如 view、image）结合 z-index 对原生组件进行覆盖，而无需使用 cover-view 或 cover-image。此外，同层渲染的原生组件也可被放置在 scroll-view、swiper 或 movable-view 容器中。目前，以下组件已支持同层渲染：

支持同层渲染的原生组件	最低版本
video	v2.4.0
map	v2.7.0
canvas 2d（新接口）	v2.9.0
live-player	v2.9.1
live-pusher	v2.9.1
其他原生组件（textarea、camera、webgl 及 input）也会在近期逐步支持同层渲染。
