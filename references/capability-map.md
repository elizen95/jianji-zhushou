# 从句意选择机制

先判断观众需要新理解什么，再选少量方法，统一到本项目主题。表中给常用入口；归档库在更适合内容时也可使用。

| 解释任务 | 首选入口 | 按需补充 |
|---|---|---|
| 形成全片主题与稳定美感 | 86风格库真实poster/动态/源码，style-lock.md | Huashu、Lemo、Klik等成功案例的具体机制 |
| 原声与语义动作 | video-talkcraft的配方卡与时码 | claude-motion的cue/声音；不继承另一套皮肤 |
| 战争位置、行军、战线 | battle-map-kit + iart-map-animation；历史依据见historical-maps.md | Mapshaper处理数据，按题材补史料；复杂地理可查Remotion maps |
| 数字、趋势、规模 | iart-data-animation，真实数据与单位 | 86库图表样例的构图语言 |
| 因果、流程、层级 | iart-explainer-video | 手绘圈注Rough.js、共享对象、遮罩 |
| 对象状态变化 | morphicons受控progress或原创形变 | Motion/Lottie需统一帧时钟 |
| 物体结构/三维解释 | Three.js、img2threejs 或 Blender Python，按镜头选 | 先完成模型、材质、相机、灯光、时轴与复现命令，后续制作渲染 |
| Q版绿幕与素材抠像 | 归档motion-graphics的object-separation | 现有真实素材优先；记录实际处理结果 |
| 手绘角色/材质 | Rough.js 或原创线稿 | 以全片主题约束线条和颜色，不另起画风 |
| 媒体/音轨/合成 | Remotion官方知识、FFmpeg/ffmpeg-python | 图形与音轨独立、同一媒体跨镜不重启 |
| 原创模拟/程序声音 | claude-motion的纯render(t)与cue | 固定种子、可乱序seek，验证真正结果 |

`python scripts/query_motion_library.py --knowledge "本句需要解释的内容"`可检索已有知识卡；结果标记活跃/归档来源及真实路径。知识卡是建议，不是已实现或必须使用的组件。

Q版透明角色按叙事安排；图表、地图、字幕避让实际角色轮廓。字体优先苹方，备选随包Noto Sans SC。全片主题一致，构图与动作自由服务内容。
