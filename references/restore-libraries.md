# 参考库恢复

GitHub 轻量版首次调用由技能入口读取恢复状态并询问用户。直接在终端执行 `python scripts/restore_libraries.py` 也会询问。接受后可选以下路径。

- 已下载完整版 ZIP 时，运行 `python scripts/restore_libraries.py --from-zip <完整版ZIP路径>`。从匹配的 1.0 完整包恢复 Git 快照、备用来源、图表索引及演示素材。
- 联网时运行 `python scripts/restore_libraries.py --online`。按注册表中的固定提交拉取 40 个 Git 来源，重建 Prompt Motion 网页索引；需要 Git 和网络。私人数字人示例仅随完整版 ZIP 提供。报告如实列出缺失、Git LFS 或网络错误，修复后可重跑。
- 选择暂不恢复时运行 `python scripts/restore_libraries.py --later`。可随时手动运行上面任一恢复命令。

首次提示在技能实际调用时触发。Codex 安装或解压本身只写入文件。轻量包自带制作规则、模板、地图运行组件与必要的开放字体。
