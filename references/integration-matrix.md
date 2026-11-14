# 视频制作资源整合矩阵

统一主题风格，86为主要成功范例；允许多库借鉴且自由构图/动效。默认活跃只是维护与发现精简，归档库仍可自主按需使用。全片不露脸，按叙事叠加Q版透明角色；字体优先苹方或免费商用字体。

本次读取本地README、现有ADAPTER、相关SKILL入口与许可。以下是生产角色判断，不把宣传效果、远程视频和源码下载说成本机已复现。许可仅保留客观来源，按用户个人用途整理，不额外设置商用确认。

## 默认活跃集合

默认保留14库减少自动发现和更新噪音；每次制作仍只读当下需要的部分。其余完整来源保存在技能目录外的本地参考档案，可按镜头需要自主查用，并非禁止使用。

| ID | 不可替代的职责 |
|---|---|
| `opus-5-5-86-styles-in-motion` | 主要成功视觉范例和可观察源码；帮助形成统一主题而非硬锁唯一模板。 |
| `remotion-official` | 母版API、字幕、渲染、地图与升级的官方技术依据。 |
| `video-talkcraft` | 主分镜、逐章选卡、运动承接转场与局部回修。 |
| `awesome-opus-5-5-video-prompts` | 常用视频提示词参考 |
| `awesome-opus5-5-videos` | 常用视频案例与源码参考 |
| `iart-map-animation` | 地理范围、路线、pins/label/镜头的动画机制。 |
| `mapshaper` | GeoJSON/TopoJSON预处理、投影和拓扑简化。 |
| `iart-data-animation` | 真实数据图表、排序/数值变化及信息图。 |
| `iart-explainer-video` | 因果/流程/层次关系和逐步解释的镜头机制。 |
| `img2threejs` | 需三维时的结构/物体程序建模。 |
| `roughjs` | 轻量手绘注释/箭头/草图几何。 |
| `morphicons` | 受控进度的SVG状态变形。 |
| `ffmpeg-python` | 媒体滤镜图与交付处理。 |
| `claude-motion` | 确定性模拟及程序声音/统一cue。 |

## 来源用途与本地入口

表中入口为库内相对路径。默认活跃库根为 `<skill>/modules/upstream/<id>`；其余已归档根为 `<Codex home>/skill-reference-archive/jianji-zhushou/<id>`。物理归档已完成；JSON同时保留来源与审阅入口。

| # | 项目和真实类型 | 处理 | 融入点 | 限制与本地入口 |
|---|---|---|---|---|
| 1 | [claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)<br>技能＋制作工作区 | 本地归档，按需自主查用<br>专项备用 | 人声/音乐/视觉生成的阶段接口，真实产品UI重建和可复用模板。 | 云GPU、存储和模型服务需独立配置；不随资料下载自动启动其setup或改变本项目时间线。<br>入口：`claude-code-video-toolkit/skills/openclaw-video-toolkit/SKILL.md` |
| 2 | [OpenMontage](https://github.com/9018/openmontage)<br>完整制片应用＋技能集合 | 本地归档，按需自主查用<br>专项备用 | 研究→脚本→资产→剪辑→合成的计划结构，参考视频拆解及真实动态素材检索。 | README指向calesthio生态；双引擎/服务配置属于整套应用，不与剪辑助手同时争夺导演流程。<br>入口：`openmontage/.agents/skills/create-video/SKILL.md` |
| 3 | [Vox Director](https://github.com/Alisa0808/vox-director)<br>技能＋生成流水线 | 本地归档，按需自主查用<br>专项备用 | beats.json贯穿脚本、画面和声音；拼贴层拆分、口播/静照/主持人输入形态。 | 默认Atlas Cloud多模型与ffmpeg成片；仅借其素材/动作机制时继承本片主题，不能自动套另一套拼贴皮肤。<br>入口：`vox-director/SKILL.md` |
| 5 | [video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft)<br>技能＋组件＋工作台 | 默认活跃<br>核心方法 | 中文原声词级时间戳、SHOTBOOK层关系、108张动效卡、分段渲染与局部回修。 | 借动作、时码和分层；不继承默认Apple皮肤、每句必动、固定边框和额外审批。素材到位后才能声称精准同步。<br>入口：`video-talkcraft/SKILL.md` |
| 7 | [JIZURA](https://github.com/852wa/JIZURA)<br>浏览器应用 | 本地归档，按需自主查用<br>专项备用 | 歌词逐行时码、beat吸附、局部技法锁定、文字排版和透明前后景导出。 | 以歌词PV为目标；随机变体和满屏文字不是长解说默认，Google Fonts/浏览器AAC有环境差异。<br>入口：`jizura/README.en.md` |
| 8 | [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)<br>技能＋风格与案例库 | 本地归档，按需自主查用<br>参考备用 | 按需研究真实档案、文件、数据的纪实镜头和代码画法；可拆具体视觉机制。 | 参考画风应转译成本片主题；README的模型推荐不是硬依赖；示范媒体和软件许可分别记录。<br>入口：`lemo-opuscar/tools/directory/SKILL.md` |
| 9 | [claude-motion](https://github.com/whaleyxbt/claude-motion)<br>技能＋模拟/声音引擎 | 默认活跃<br>核心方法 | 统一timeline.json，纯render(t)模拟，程序音效合成与cue表；实现因果模拟和确定性镜头。 | 移植具体机制，不继承单强调色等默认外观；音量仍须检查实际混音而非只信自动目标。<br>入口：`claude-motion/.claude/skills/web-sims/SKILL.md` |
| 10 | [claude-remotion-skill](https://github.com/haidrrrry/claude-remotion-skill)<br>技能＋组件参考 | 本地归档，按需自主查用<br>重复归档 | 17类Remotion组件与render→inspect思路可按需查用。 | 和官方技能、Talkcraft及主质量规则重叠；强制三属性进场、每图Ken Burns、持续渐变不适合作全局规则。<br>入口：`claude-remotion-skill/remotion-motion-graphics/SKILL.md` |
| 13 | [iart-ai/motion-skills](https://github.com/iart-ai/motion-skills)<br>技能包总索引 | 本地归档，按需自主查用<br>重复归档 | 用于定位iart各专项包；地图/数据/解说已分别保留。 | 根仓库是19包目录索引，没有独立SKILL；收录索引不代表19包全部已装。<br>入口：`motion-skills/README.md` |
| 14 | [motion-graphics-skills](https://github.com/charlie947/motion-graphics-skills)<br>15技能集合 | 本地归档，按需自主查用<br>专项备用 | 真实品牌采集、reference-to-motion、动态图表、Vox短解释与镜头brief方法。 | 默认短广告/LinkedIn循环及HyperFrames；不继承作者品牌、指定Opus或30秒长度。<br>入口：`motion-graphics-skills/skills/reference-to-motion/SKILL.md` |
| 17 | [claude-motion-design](https://github.com/howseen-ai/claude-motion-design)<br>技能＋渲染脚本 | 本地归档，按需自主查用<br>重复归档 | seek(t)、切点不过度混帧、音乐真实drop分析、音效按峰值落点；作为疑难渲染参考。 | 与claude-motion确定性/声音方法重叠；不默认启动1:1复刻、指定模型或固定四张图审批。<br>入口：`claude-motion-design/skill/motion-design/SKILL.md` |
| 19 | [wise-motion（用户给的链接）](https://github.com/nexu-io/motion-anything)<br>本地应用＋配方/技能库 | 本地归档，按需自主查用<br>专项备用 | 组件级运动配方、shader/Canvas机制、网页设计令牌提取。 | 链接实际是motion-anything，区别于现有WiseWong6/wise-motion；交互动画需frame驱动，不能沿用实时计时器。<br>入口：`motion-anything/skills/motion-anything/SKILL.md` |
| 20 | [motionmaxxing](https://github.com/Tejashmakwana/motionmaxxing)<br>技能＋HTML运行时/测量 | 本地归档，按需自主查用<br>参考备用 | 品牌意图转成对象世界、量化ease、重复版式诊断、真实渲染测量。 | early release；主要为产品/品牌短片，评级和硬性反卡片模式不覆盖适合证据展示的静止画面。<br>入口：`motionmaxxing/SKILL.md` |
| 22 | [motion-design-skill](https://github.com/LottieFiles/motion-design-skill)<br>通用设计方法技能 | 本地归档，按需自主查用<br>重复归档 | 动机→情绪→时间/缓动/编排，复杂状态反馈时查用。 | 主体是UI微交互；其毫秒级节奏不能直接覆盖长解说阅读时间，也不是Lottie播放器。<br>入口：`lottiefiles-motion-design/skills/motion-design/SKILL.md` |
| 23 | [motion-design-skills](https://github.com/iart-ai/motion-design-skills)<br>九技能基础包 | 本地归档，按需自主查用<br>参考备用 | 构图安全区、OKLCH/Lab颜色过渡、镜头设计、动作原则与节奏。 | 基础规则已融入主技能；按问题查某一节，避免每次加载9个技能和品牌背景皮肤。<br>入口：`motion-design-skills/skills/motion-art-direction/SKILL.md` |
| 24 | [lottie / lottie-web](https://github.com/airbnb/lottie-web)<br>JavaScript播放库 | 本地归档，按需自主查用<br>底层按需 | 播放已有Bodymovin/Lottie JSON，用goToAndStop受控帧在母版内合成。 | 不是制作导演技能；某些AE效果不被支持，动画文件/字体/图片仍须齐全。<br>入口：`lottie-web/README.md` |
| 25 | [Motion](https://github.com/motiondivision/motion)<br>JavaScript/React/Vue动画库 | 本地归档，按需自主查用<br>底层按需 | 弹簧、插值与状态变换用于交互/局部组件。 | 默认animate依赖真实时间；视频须手动求值/seek；仓库源码存在不等于npm运行依赖安装。<br>入口：`motion/README.md` |
| 26 | [morphicons](https://github.com/guillermolg00/morphicons)<br>SVG形变库 | 默认活跃<br>底层组件 | 进度受控from/to/progress模式，表达对象状态转变，frame→progress可复现。 | 不直接靠自动spring播放；图标形变要保留识别度，不把含义不同的图标随意互换。<br>入口：`morphicons/README.md` |
| 27 | [Img2threejs](https://github.com/img2threejs/img2threejs)<br>技能＋程序建模管线 | 默认活跃<br>镜头专项 | 从参考拆物体结构、生成THREE.Group并保留pivot/socket；做器械结构/产品/地形概念剖面。 | 程序重建不是测绘或摄影测量；背面和隐蔽结构缺依据时标示意，三维外观仍服从主题。<br>入口：`img2threejs/SKILL.md` |
| 28 | [ffmpeg-python](https://github.com/kkroening/ffmpeg-python)<br>Python库 | 默认活跃<br>底层组件 | 复杂音视频滤镜图、裁剪拼接、音轨映射和转码的可复用编排。 | 只包装FFmpeg调用，须单独存在ffmpeg/ffprobe；脚本需核对时基和音画终点。<br>入口：`ffmpeg-python/README.md` |
| 29 | [awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos)<br>案例/提示词索引 | 常用来源 | 按主题/机制检索作者公开案例与提示词，帮助解决陌生镜头。 | 多数是外部视频链接，不能把目录计数等同本地成片或已复现效果。<br>入口：`awesome-opus5-5-videos/README.md` |
| 30 | [opus-video-prompts](https://github.com/LeaddeOpenLab/awesome-opus-5-5-video-prompts)<br>提示词索引＋少量模板 | 常用来源 | 来源关联的提示词、设置说明和15秒产品UI模板，可抽取结构机制。 | README明确社区提示词未逐条独立复现；模板不代表全部提示词都有可运行源。<br>入口：`awesome-opus-5-5-video-prompts/README.md` |
| 32 | [motion-shelf](https://github.com/ChrisXHL/motion-shelf)<br>静态案例检索网站 | 本地归档，按需自主查用<br>参考备用 | 按类型搜索/筛选动效并追溯原视频和制作说明，用于需要额外机制时研究。 | 仓库只含网页与远程视频清单；README明示未逐条复现或完整观看，不是1700个离线视频。<br>入口：`motion-shelf/README.md` |
| 33 | [Rough.js](https://github.com/rough-stuff/rough)<br>Canvas/SVG绘图库 | 默认活跃<br>底层组件 | 手绘箭头、圈注、轮廓、网纹填充与草图注释；固定seed便于重复渲染。 | 它负责静态几何笔触，逐笔出现、时间线和相机需由母版实现；粗糙度按主题控制。<br>入口：`roughjs/README.md` |
| 34 | [opus-5-5-86-styles-in-motion](https://github.com/GODGOD126/opus-5-5-86-styles-in-motion)<br>Codex技能＋源码/案例库 | 默认活跃<br>核心视觉参考 | 主要成功范例来源：从真实poster、style/解释片、提示词和源码提炼主题的形态、材质和时间语言。 | 不是86套现成Remotion模板；允许多库机制借鉴和自由构图，统一主题，不强制唯一style_id，也不随机换肤。<br>入口：`opus-5-5-86-styles-in-motion/SKILL.md` |

## 许可与来源记录

| ID | 本地许可记录 |
|---|---|
| `claude-code-video-toolkit` | MIT |
| `openmontage` | AGPL-3.0 |
| `vox-director` | MIT |
| `video-talkcraft` | PolyForm Noncommercial 1.0.0 |
| `jizura` | MIT |
| `lemo-opuscar` | 代码MIT；README另列媒体CC BY 4.0 |
| `claude-motion` | MIT |
| `claude-remotion-skill` | MIT |
| `motion-skills` | MIT |
| `motion-graphics-skills` | MIT |
| `product-launch-motion` | MIT |
| `claude-motion-design` | MIT；外部素材各自许可 |
| `motion-anything` | Apache-2.0 |
| `motionmaxxing` | Apache-2.0 |
| `lottiefiles-motion-design` | MIT |
| `motion-design-skills` | MIT |
| `lottie-web` | MIT |
| `motion` | MIT |
| `morphicons` | MIT |
| `img2threejs` | Apache-2.0 |
| `ffmpeg-python` | Apache-2.0 |
| `awesome-opus5-5-videos` | MIT；原案例媒体权利另属作者 |
| `awesome-opus-5-5-video-prompts` | 根目录未见LICENSE |
| `motion-shelf` | 根目录未见LICENSE；原媒体归作者 |
| `roughjs` | MIT |
| `opus-5-5-86-styles-in-motion` | 保留仓库THIRD_PARTY_NOTICES及原样来源 |

## 精简后的具体调用方式

1. 先读本项目主题、原稿、配音及决定；从86库的成功范例提炼适合内容的色彩、字体、材质与动作特性。允许借鉴多个案例，最终只形成一套连贯主题，不要求每次只绑定一个风格ID。
2. 句意需要数字关系查data，因果关系查explainer，地理空间查map，口播对齐查Talkcraft；有三维物体才查img2threejs。每个模块提供解释机制，不带进自己的默认整片外观。
3. 核心集合不能解决镜头时直接查归档索引：例如抠像查motion-graphics，程序角色查doodle-anim，真实产品交互查product-launch-motion，特殊材质查huashu/lemo，复杂运动查Klik。找到后只吸收相关规则/组件，不重启另一整套访谈、审批、模型选择或工程。
4. 字体、色彩角色、明暗、材质和信息层级保持全片一致；景别、构图、对象、关系与动效随论证自由变化。开场直接进入证据或问题；Q版透明角色按叙事短时出现，为证据、地图和字幕留空间。
5. 保留已提供稿件的事实和论证；需要改词/删句先区分错字修正、屏显概括与旁白修订。没有史料路线就标示意或登记待查，不能编造精确行军路径。
6. 字体优先本机已授权可用的苹方；否则选Noto Sans/Serif SC、思源等免费商用字体并随工程记录实际字体。外部库英文大标题不构成中文适配成功。

## 去重时必须保留

- 所有库的README、许可、source.json、源码与随仓库资产；归档后仍可用清单定位。
- 所有已经在项目中使用的源文件、版本、适配器与锁定依赖；不能因参考库归档使现有工程断链。
- `wise-motion` 两个不同来源身份；用户链接对应nexu-io/motion-anything，旧库对应WiseWong6/wise-motion。
- 运行库与技能参考的区别：参考库调整不意味着要卸载当前工程的npm依赖。
- 资源真实状态：Motion Shelf/awesome目录包含远程链接，不能标成所有参考视频均已离线下载。
