# jianji-zhushou 1.0

以86风格库为主要成功范例，按内容融合镜头、素材与动效，制作主题一致的中文YouTube解说视频。调用名保持 `$jianji-zhushou`，从 [SKILL.md](SKILL.md) 进入。

全片不露脸。Q 版数字人由用户另行生成，可从开场出场，也可在关键解释段增加出场时间。新版按 1920×1080 参考画布右下 x1300、y530 的 640×360 透明容纳区起排，等比适配母版，避开关键证据、双语标签和字幕。新录口播每段至少 10 秒，按新任务写录制和回接 MD。用户要求重新安排时重新选段、写新要求，旧素材仅在用户明确采用时回接。 原视频保持完整画幅；史料大图按文案安排运动，使用醒目双语名称。默认 2560×1440、60fps。

## 使用与本地资料

> 使用 $jianji-zhushou，根据我的文案、原声和素材，完成本次需要的分镜、预览或成片。

完整流程涵盖研究证据、脚本时码、主题设计、分镜资产、地图行军路线、Remotion制作、实际验收和交付。详细操作见 [项目操作](references/project-operations.md)。

40份来源均有本地快照：14份常用来源位于 modules/upstream，26份备用来源位于技能目录外的 skill-reference-archive/jianji-zhushou，按需自主查用。86风格库完整含示例视频；其余来源的下载范围见各 source.json。第三方运行环境与账号按实际项目准备。

需要更新时运行 scripts/startup.py；--all 检查全部来源。定制主技能不被上游覆盖，冲突文件放技能外候选区。路径与命令见 [本地模块](references/local-modules.md)。

## 迁移与许可

离线包以Codex主目录为根组织 skills/ 与 skill-reference-archive/；迁移时保留此结构。当前机器已安装，无需再次覆盖。工程依赖按锁文件安装，苹方不随包分发，云服务账号不随包提供。

原创代码沿用 [MIT](LICENSE)。第三方材料保留原始许可，根MIT不覆盖这些材料；详见 [来源记录](THIRD_PARTY_NOTICES.md)。个人制作不新增商用审批环节。

制作规则见[个人约定](references/personal-production-profile.md)与[三维制作](references/three-blender-production.md)。完整执行包把全片构图 PDF 和对页校对 Word 同一次交付，统一镜头、页和文字 ID。按分镜批量抽取有效构图和必要动作阶段，集中展示；日常用结构与媒体检测，减少打开效果图、反复截屏和零散审阅。用户明确指定跳过 PDF／Word 时按当次范围。其他人读的交接文档用 Markdown。

安装与首次恢复见[参考库恢复](references/restore-libraries.md)。
