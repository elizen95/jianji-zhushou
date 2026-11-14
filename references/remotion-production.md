# Remotion制作与验收

当前个人项目先应用[个人制作约定](personal-production-profile.md)，其R7规则覆盖通用示例。
## 工程

新工程把 `assets/remotion-kit/` 复制到独立制作目录；有锁文件用 `npm ci`，已有工程直接适配组件。所有Remotion包保持同一版本，核对实际API后再采用上游代码。生产素材和字体建立本地映射并等待加载，渲染不依赖实时网络。

基础演示 `MotionStudy` 为1920×1080／60fps／16秒／无声；仅演示机制。真实项目须实现Master Composition、场景与独立媒体轨，并记录入口和参数。现有 `build_render_plan.py` 读取project.json及04_spec/video-spec.json，scene.start/end用连续母版秒数。

`npm run typecheck` 检查类型；`npm run studio` 预览；`npm run render:demo` 渲基础演示。只做文字任务时不安装或渲演示；新视觉组件用代表静帧／短试片验证，不重渲无关全片。

## 时间与媒体

frame/fps是唯一时钟。区分母版帧和Sequence局部帧；状态纯计算，固定随机种子。Canvas每帧复位并重建，累积模拟先预计算再采样。Three.js、Lottie 和 Motion读取同一时间。Motion采用可手动设置time的暂停动画或纯求值函数；不用实时ticker推进导出。Canvas每帧重画，SVG按帧插值。新引入有状态组件时检查乱序seek；已验证且未改的组件复用结果。

原声、AI视频、Q版角色、图片与文字独立轨；文字更替不重置媒体。项目策略读[默认值](production-defaults.md)。字幕安全区由实际布局避让，不能仅在JSON声明。

转场重叠只计算一次。TransitionSeries会缩短相邻序列的并集；固定母版预算也可用全局Sequence中的mask／共享对象转场。相邻媒体在淡化区间仍有可播放源帧；不能同时透明闪底。细节见[连续性](playback-continuity.md)。

## 从参考到可用组件

地图、数据、图解、手绘、口播同步、拼贴与标志动作按[语义模块](capability-map.md)路由；相应支持按[安装清单](installation-and-support.md)补齐。D3／Rough／Mermaid提供运算或SVG，不引入独立播放时钟。

保留参考机制的关键形态／速度关系，并按本句阅读量改编。Canvas／WebGL上游实现移植后验证乱序采样；依赖、纹理与字体同步到制作工程。复用代码保留上游许可和改动说明。

基础组件：SharedElement、MediaCard、TracePath、TornMatte、MonochromeLight、Dust、RevealText。配方中的水墨、真实3D、图表等需按项目补实现。CSS blur只能标近似；真实运动模糊按当前Remotion版本验证，避免快门采样跨硬切污染。

配套提供`src/style-directions.tsx`：ArchiveImage完整大图与双语名称、morphContour等拓扑轮廓插值，以及三个原创方向样片。Composition为ArchiveDirection、MorphDirection、DepthDirection（各6秒）或StyleDirections（三段合计18秒），1920×1080／30fps／无声。示范的港口、航线和文案均非历史证据；这是机制起点，不是所有影片的固定模板。

`npx remotion render src/index.tsx StyleDirections out/style-directions.mp4 --codec=h264 --muted --color-space=bt709`。追溯与实测范围见工程的`style-directions-usage.json`。

## 输出

结构和运行检查合并做一次：JSON可读、源文件可访问、时间窗合法、TypeScript/渲染能运行、输出时长和音轨符合项目。没有实际故障或新增变更不重复检查。按quality-gates.md检查代表帧与关键短片，回修只复查变化范围；本用户文档按个人约定做结构核验，不额外截图或逐页复查。

`verify_master_media.py`可按项目规格做必要技术检查；它不证明内容或审美。重滤镜与3D根据真实渲染负载调整并发，正常任务直接交结果。输出实际文件、源码／锁文件、分镜MD及未完成项，续跑按输入指纹只更新受影响片段。

## 4.3主题、全屏视频与角色合成

ThemeFrame.tsx接收全片共享tokens，使用苹方/Noto Sans SC字体；把assets/fonts/NotoSansSC-VF.ttf放入工程public/fonts。新项目将抠像后的透明角色媒体作为母版独立前景轨，按原窗口容纳区域等比合成并以全局时码调度，按实际源长截取。已有 PresenterLayer.tsx 是旧项目的真人收窗组件。地图从 assets/battle-map-kit 复制，按 applyStyleLock 映射主题，避让实际角色轮廓与字幕。

FullBleedVideo.tsx保留完整原画幅。调用方用真实视频流长度限定Sequence和入出点，不让媒体越过源尾触发播放器末帧保持；跨镜保留播放实例。ArchiveImage.tsx是完整大图及双语名称，替代旧局部放大副窗。MediaCard仅供信息卡与程序图形，不用它套历史照片。
