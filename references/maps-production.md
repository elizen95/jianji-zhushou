# 历史地图与行军路线：解释机制，服从全片风格

当前个人项目先应用[个人制作约定](personal-production-profile.md)，其R7规则覆盖通用示例。
用于解释「在哪里、为何走这里、怎样推进、何时变化」，作为主片的局部镜头机制。统一的是本片 `style-lock.json` 定义的主题风格，不是固定某一个模板。86 风格库是重点学习对象，可从多库借鉴合适的构图与动作机制，最终颜色、字体、材质和动效语言必须协调。以下组件的默认颜色只是独立技术演示。生产时将主风格的纸色／底色、文字、边界、强调色和字体映射到 `scene.theme`；路线颜色、文字、斜纹、卡片和镜头缓动也遵循同一套 tokens。

## 先让地图回答一个问题

| 原文的解释任务 | 合适机制 | 必需证据 |
|---|---|---|
| 双方为什么会在这里交战 | 地形、交通节点、距离关系、局部放大 | 对应年代地名、地形资料及历史交通依据 |
| 一支军队怎样推进 | 途经点、路线渐显、沿线单位标记、日期 | 行动日期和有出处的途经点；不确定路线用虚线 |
| 多路合击／撤退／追击 | 稳定颜色与线型、分批进入、共同落点 | 各路行动者、先后关系；不将叙述时间当真实速度 |
| 补给为何受阻 | 通道、港口、河流、阻断点、结果对照 | 补给线路或路线示意的明确说明 |
| 控制范围怎样改变 | 同一投影下的分时段面图层 | 每一时段的控制依据；与法理国界、主张范围分开 |
| 战争的空间代价 | 前后区域／距离／人口或兵力图表 | 数量、日期、来源；不让装饰性线宽暗示兵力 |

每镜头先建立方向与空间关系，再引入当前被解释的行动。路线抵达后留出阅读时间，让叙述完成因果。无需每句都切地图，也不要持续缩放把地图变成背景运动。可复用「全域定位 → 战区 → 通道 → 落点 → 结果」的语义关系，但镜头数量与长度由内容决定。

## 已落地的离线实现

`assets/battle-map-kit/` 提供：

- `map-frame.mjs`：纯帧函数 `renderMapSvg(scene, frame, land)`；另有 `renderMapFrame` 返回 SVG 与地理／路线状态，方便核对。
- `RemotionMap.tsx`：Remotion 的 `useCurrentFrame()` 封装。将整个 kit 复制到本片工程的 `src` 下再引用，使 React/Remotion 使用本片已有依赖。
- `apply-style-lock.mjs`：`applyStyleLock(scene, styleLock, {presenter:true, subtitles:true})` 将主片 palette/type 映射为地图配色与字体，并提供避让右下Q版角色和底部字幕的默认地图区域；导演可用 `mapRect:[x,y,width,height]` 指定更适合该镜头的布局。
- `render-map-frame.mjs`：输入 JSON、输出 SVG 与 `.state.json` 的本地命令行。
- `examples/fictional-campaign.json`：两路推进、日期、镜头与控制范围的虚构演示；不得改个标题就当作真实历史素材。
- `map-scene.schema.json`：数据格式；`tests/map-frame.test.mjs` 检查时间、地理、路线一致性与失败条件。
- `runtime-vendor/`：已固定版本的 d3-geo、d3-array、internmap ESM 源码和 LICENSE；不需联网或 npm 安装即可输出 SVG。
- `data/land-110m.geojson`、`land-50m.geojson`：Natural Earth / world-atlas 的陆地海岸线；不含现代国家边界。浏览器打包时直接 import 同内容的 `data/land-110m.json`；默认 webpack 未配置 `.geojson` loader。

```text
node <skill>/assets/battle-map-kit/render-map-frame.mjs <project>/map-scene.json <project>/work/map-210.svg 210
node <skill>/assets/battle-map-kit/tests/map-frame.test.mjs
```

在 Remotion 注册 Composition 时，`width`、`height`、`fps`、`durationInFrames` 均读取 scene；传入已加载的本地 land GeoJSON 和 scene。CLI 可以读取相对路径的 `landFile` 和图层 `geojson`；浏览器组件需要事先加载这些数据，不能把文件路径字符串直接传入。片段开始时间通过外层 Sequence 控制，scene 中所有时间均相对于本片段；使用秒并在主时间轴上保持同一 fps。

全部画面由 frame 驱动，没有计时器、随机数、实时地图服务或 CSS 时间动画。海岸、区域、路线、单位、地名共用投影和相机。沿路线移动按已提供的经纬度途经点做球面插值，不会自动推断道路、跨河点或实际行军路径。路线的 `start/end` 是剪辑时间，不能解释为军队实际速度。`cues` 的日期是显示文字，需根据史料与旁白设置。

## 数据与风格约定

1. 经纬度顺序固定为 `[longitude, latitude]`。本组件支持不跨日期变更线、纬度在 ±85° 内的区域 Mercator 地图；超出时拆镜头或采用合适投影，不硬套。大区域面积比较不能直接以 Mercator 可见面积作为证据。
2. `sources` 登记出处、定位信息与许可。每条路线、每层历史区域带 `date` 与 `sourceId`；`evidence` 区分 `documented`、`approximate`、`schematic`。无法核实的精确路线降为途经点和方向示意。
3. 历史国界、军事控制、主张范围、范围示意分层。不同拓扑边界只按真实时间点切换，不通过几何形变制造不存在的中间疆界。争议／不确定范围用斜纹或虚线及文字说明。
4. 现代国界不作历史边界；若为观众定位而确需展示，独立 `modern-reference` 层，显式标注「现代边界参照」。地形／海岸也要考虑史期变化。随包 110m / 50m 是比例尺等级，不是 110 米／50 米定位精度。
5. 不同军队通过主风格许可的强调色、线型和标签稳定区分。图例、字幕和主体有独立安全区；不要让右下角Q版角色遮住终点、日期或署名。路线默认同宽，只有有依据且有图例时才编码兵力。
6. `scene.theme` 覆盖 background、land、ocean、coast、ink、muted、accent、secondary、paper、fontFamily。真实生产还应将各 route.color 从主片的语义色表分配；不要直接保留示例的红蓝颜色。字体优先使用已具备合法使用条件的苹方，否则使用本地 Noto Sans SC；不要回落为微软雅黑。若主风格是单色，以线型／标记形状区分行动者。
7. 纹理和剪纸效果可在地图组件外套用主片共享容器；地理位置和线条仍来自同一投影。不得为「更像风格」手动画错位置、遮没图例或让文字不可读。12 fps 阶梯感仅在主风格明确需要时设 `overlayFps`；相机默认平滑，不把某库的12 fps要求变成全片规定。
8. Q版角色按叙事在右下叠加；地图出现在角色出场时，依据角色实际轮廓与字幕位置调整 `mapRect`；检查路线终点、地名、图例、日期和来源文字均不被遮住。主片 Composition 负责叠加抠像后的 Q 版角色。

## 地理资源的选择

默认离线海岸线来自 [world-atlas](https://github.com/topojson/world-atlas) 与 [Natural Earth](https://www.naturalearthdata.com/)，完整原始包与许可随库保存。它们解决底图和投影，不提供历史边界、古代道路、河流或高程。中国历史地理可核对 [CHGIS](https://chgis.fas.harvard.edu/)、学术地图或档案；选择具体数据集后检查其许可和年代。扫描古地图需配准时使用 QGIS 并保存控制点和误差；需要地形三维镜头时才调用现有 Remotion Cesium 技术文档。它们是按项目需要的补充来源／工具，不称为本次已安装的桌面软件或已下载的全部历史数据。

已有 `assets/map-kit/draw-map.mjs` 和 Mapshaper 可继续用于静态准备、裁切、简化。新组件负责确定性动画。已有 `iart-map-animation` 提供叙事机制参考，`remotion-maps` 提供 MapLibre / Cesium 等可选路径；这些库的默认皮肤、12 fps、After Effects 或在线瓦片流程均不覆盖本片 style.lock。只有确需在线卫星／三维时才用额外服务，并把署名、下载状态和费用纳入项目记录。

## 验收与交付

先检查数据：地名／年代／坐标／途经点／边界含义与史料一致。再在真实使用的 frame 0、动作开始、路线转折、日期切换前后、终点停留等代表帧渲染，检查地名、标记、线条与同一投影对齐；字体、比例和色彩与全片一致。镜头移动时检查标签漂移、边缘裁切和阅读时间。修改地理或时间数据后重验受影响帧，未改动部分不重复渲染。

本次独立组件验证包括可复现 SVG、关键帧 PNG 和 Remotion 冒烟片；最终生产仍须用实际素材、主风格和旁白运行全片检查。交付 MP4 时附 map-scene.json、来源清单、相关 GeoJSON 与可改源码；不能用一个成功渲染的示例替代具体战役的史实审查。
