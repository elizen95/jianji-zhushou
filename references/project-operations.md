# 项目操作

新项目：`python scripts/init_youtube_project.py <新目录> --topic "主题"`。仅创建可编辑草稿，不联网、不生成配音、不把示例称成片。已有项目不覆盖。默认scope=full_film，声明不露脸与按叙事使用Q版透明角色；模板镜头仅是待替换的短摘例，须按真实全片扩展。仅局部镜头制作才改scope=excerpt。legacy_15s_pip仅用于明确恢复旧模式。

补齐brief、claims、assets与真实分镜。新分镜使用`assets/templates/storyboard-youtube-v8.json`；schema 8新项目默认用 avatar_overlay，按实际出场登记角色。旧schema 4–7仍照其既有决定读取，改版时另存副本。

`python scripts/validate_youtube_project.py <项目> --stage plan`检查结构和ID。以实际内容替换示例、适配配音时码；每镜补claim_ids或明确factual=false，资产登记pending/ready及真实路径。

采用本片主题系统并形成真实代表镜头后（可综合多个参考），`python scripts/lock_style.py lock <项目>`。后续`check`检测配置漂移。锁文件记录配置指纹；已有代表镜头纳入集中审阅。

复制`assets/remotion-kit`到项目render目录，用锁文件`npm ci`。创建实际Master及场景组件；包里的演示Composition不等于本项目。地图另复制`assets/battle-map-kit`，按其说明加入源码和数据。本地仅安装当前镜头所需依赖，所有@remotion包同版本。

`--stage render`要求style已锁、示例已替换、事实与引用可追踪、就绪素材可访问；它不渲染视频。实际渲染后填写qa.json：每项status与evidence文件，列真实检查范围。`--stage delivery`额外核对证据文件和project.final_video是否存在。检查器不自动执行史实研究、图像分析或听感判断。

发布包/字幕/分轨按本次范围生成；成片后交接入口、命令、版本和待办。外部AI服务或私有模型并未随skill安装，遇到具体镜头需要时再按环境配置。
