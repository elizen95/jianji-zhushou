# Video Talkcraft 主工作流与镜头切换

来源：[video-talkcraft](https://github.com/Vincentwei1021/video-talkcraft)。108张卡的ID、名称、输入、语义、能量和源码路径见[talkcraft-motions.json](talkcraft-motions.json)；卡片正文与TSX在`modules/upstream/video-talkcraft/`。

先从文案反推：这句在比较、解释机制、列举、强调、引用、展示过程，还是切换章节；再按已有图片／截图／人物／数据过滤。卡是候选动作，构图、配色、时长、字幕和组合仍由本片导演决定。

```text
python scripts/query_motion_library.py --talkcraft "对比 图片" --input 图 --limit 6
python scripts/query_motion_library.py --talkcraft "机制" --energy 中
```

选中卡后读取其本地MD与TSX，替换写死内容、按项目tokens改皮、对齐语义cue并保持媒体原点。模块本身的独立组件可能依赖共享文件，使用前沿import补齐；不把下载完称为108项均已集成运行。

分类为字幕花字、强调标注、数据信息图、素材呈现、转场结构、人物互动、运镜。用它们解决信息任务，不按分类轮播。固定“每句必须动”“只能某类转场”“每片限某数量”“Apple默认皮肤”等规则由模型按文案取舍；全片以不露脸方式制作，Q版透明角色按内容安排出现时段。动作读当前style-lock，不使用Talkcraft自带皮肤。

上游为PolyForm Noncommercial 1.0.0，商业使用需作者授权。本用户为个人制作，不新增商用审批；未来明确商业项目时按当时许可选择可用模块或原创动作实现；索引可以帮助发现功能类型，不把限制性源码改名后用于商业成片。

当前个人规则优先：素材卡的视频输入改为完整原画幅，不沿用局部裁切与相框；人物卡改为右下透明数字人轮廓；放大镜/同源细节副窗不在本用户方案中采用。卡片只提供可改编机制，不直接作为母版。

## 嵌入每一章的制作流程

1. 用原声、已有 SRT 和语义节拍做 SHOTBOOK 分层分镜，写明主体、证据层、前后景、动作落点和出入镜关系。词锚需更精确时才补字级时间戳。
2. 在开场、章卡衔接、主体段落及结尾广泛采用 Talkcraft。每章逐个检查主要切点，优先选择有叙事动机的承接。原片完整播放、硬切更清晰或动效会遮证据时，登记采用的切法与理由。
3. 优先查 `references/cards/`、`template/cards/` 和 `template/motion-systems/transitions.tsx`。证据深入用推穿，延续横向动作可用同向甩镜，叙事降温可后拉，物件接力可用粒子溶接，明确段落转折可考虑过曝翻页或黑震切。按语义变换空间路径、承接对象与揭示结果。
4. 在镜头表登记出入镜 ID、卡片／源码、叙事原因、前后相机方向、母版区间及 `motion_id`。使用母版帧钟合成，过渡不得吞字幕、裁原视频或破坏 2 秒章卡；仍执行 300 秒去重及唯一章卡标志例外。转场随布局预演集中进入 PDF／Word。
