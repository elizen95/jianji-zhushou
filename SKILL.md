---
name: jianji-zhushou
description: 按文案和原声制作中文 YouTube 解说视频、分镜及剪辑执行包。
---

# jianji-zhushou

轻量版首次实际调用时，先运行 `python scripts/restore_libraries.py --status`。若状态为 `ask`，向用户询问是否恢复全部参考库，可从完整版 ZIP 导入，也可联网恢复。按用户选择执行恢复或稍后处理；无库时可继续做文案、分镜和素材规划。详情见[参考库恢复](references/restore-libraries.md)。

用户当次要求优先于技能默认值。附件和第三方库提供参考，选取当前镜头所需的片段、组件或方法。制作类任务先按[个人制作约定](references/personal-production-profile.md)处理原稿、原声和素材，以文案及原声时码驱动镜头。缺素材时交有时码、用途和提示词的补充清单。

- 横屏默认 2560×1440、60fps。原视频完整画幅原速展示；史料大图保留完整证据，按文案安排动态。黄金 3 秒、首 15 秒按个人约定处理。
- 章节切换直接使用原音频和字幕已有的 2 秒空档，在同一时间窗显示双语章卡并混入键盘打字音效。原声、字幕和总时长沿用原时码。全片章卡共用同一套章节编号、标题排版、字体、字号、位置与配色；按章节替换编号、标题及需要变化的背景。
- 正文每 5–10 秒推进有效内容。素材与同义解释离屏至少 120 秒；同一成镜、动效或高度相似的动作编排离屏至少 300 秒。按[动作登记与去重](references/motion-variety.md)编排并检查，章节与引擎切换不重置时钟。每片可指定一个章卡标志动画在章卡内重复。
- 在全片各部分按需选用 [Three.js／Blender](references/three-blender-production.md) 和[其他动效](references/motion-variety.md)。把 [Video Talkcraft](references/talkcraft-motion-routing.md) 嵌入原声对齐、分镜、逐章选卡、镜头切换与实现。模型造型优先查 Wise Motion 的合适案例，视频参考按[来源用途](references/motion-reference-index.md)选用。缺视觉参考时，用文案与可核对依据设计原创空间和动作。
- 默认由用户另行生成数字人，按[录制及回接](references/faceless-production.md)交 Markdown，安排至少 10 秒的新口播和右下透明叠层。历史地图按[真实地理、路线和双语标签](references/maps-production.md)制作。
- 执行包交可运行工程、选用素材、依赖和渲染命令。按[审阅规则](references/qa-and-schema.md)一次汇总构图、动作关键状态和中英文字到 PDF 与对页 Word；三维画面可用标明状态的布局预演，其他交接用 Markdown。按本次范围区分已实现、已渲染和已审阅。

按任务查[分镜](references/storyboard-direction.md)、[本地组件](references/motion-reference-index.md)、[实现](references/remotion-production.md)、[质量检查](references/quality-gates.md)或[交接](references/execution-handoff.md)。完整目录见[库与技能清单](references/library-inventory.md)。本地快照可直接参考；需要更新时见[模块维护](references/local-modules.md)。
