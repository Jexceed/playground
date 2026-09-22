# 首个可玩增量验证

日期：2026-09-22。范围为框架与4组24题，不是全部对标课程。

## 已通过

- 统一目录44组513题，原40组489题内容哈希未变。
- 28项自动化测试通过，包括独立答案预期、穷举选择/排序、行列多解、空白/漏填、候选复用、撤销、记忆状态、批量事件不丢记录、存档幂等、未来schema保护，以及适用旧语音/导航/数字岛出口回归。
- 浏览器1280×720中逐题操作全部24题，全部进入正确完成状态。每题检查图片加载、横向溢出与提交按钮位置，均无问题。
- 实际验证错选→重试→正确反馈、鼠标拖放、按图卡和槽位点击放置。
- 多选与排序完成记录在页面刷新后保留；记忆最后一题按稳定ID恢复，显示累计尝试与6/6完成记录。
- 六道记忆题都检查了展示图卡与源数据一致，点击“我记好了”后撤下线索，再进入回填。
- 所有24题的实际语音来源均为本地MP3，无speechSynthesis回退。
- 标准Edge语音清单1,958项全部可解码且时长检查通过，failures为空，无macOS say或mixed local。
- pnpm build、pnpm audit:curriculum、pnpm audit:voice-media通过。
- pnpm mac:build及pnpm mac:install完成。安装路径为/Applications/小小思考屋.app；codesign --verify --deep --strict通过，安装与构建可执行文件SHA-256一致。

## 本轮补充通过

- 1024×700与375×812无横向溢出；手机尺寸已完成填格操作，图卡点击区最小约62×76。
- 修复窄窗口中题号栏被左侧固定导航遮挡的问题；点击题号后题面回到可见区域。
- 记忆计时会自动结束并进入回填，保持阶段图卡已撤下；重看次数累计正确，计时结束语音来自本地MP3。
- 更新后的Mac应用已再次通过mac:install、签名及二进制一致性检查。

## 原生验收补完与当前限制

- Mac锁屏已解除。真实应用的打开、双入口、点击放置、拖放、错误→正确反馈和退出重开续玩已补完。新增分区相关行为测试后共33项通过。详见[分区验收](section-navigation-qa.md)。
- 真实Mac窗口最小化会中断记忆观察，返回后显示“刚才暂停了”，需要主动重新开始。先前IAB工具页切换没有生成blur/visibility事件，未用它冒充原生验收。
- 原生听题按钮已操作；工具不捕获扬声器声音，未进行原生声学监听。1,958项资源可解码、标准音色与浏览器本地播放链路已有独立证据，本次未修改题目或音频。
- 6–8岁亲子难度校准属于后续完整内容建设，本批不宣称已经校准。

## 证据

- [机器摘要](pilot-validation.json)
- [24题界面结果](browser-pilot-results.json)
- [自动化结果](pilot-test-results.txt)
- [课程审计](pilot-curriculum-audit.json)
- [语音媒体审计](pilot-voice-audit.json)
- [Mac构建日志](mac-build.txt)
- [Mac安装日志](mac-install.txt)
- [题目来源和答案验算](../authoring/pilot.md)

代表截图保存在screenshots/。运行时资源未使用原题扫描图，几何图卡保留了确定性生成源。
旧安装包保存在工作目录的.tmp/pilot/previous-installed.app，未推送。

## 窄屏与记忆专项补充

见[browser-additional-qa.json](browser-additional-qa.json)、[分区补充记录](section-navigation-qa.md)与[最新安装日志](mac-install-sections.txt)。更新后应用已重新安装，签名、安装/构建二进制一致性及上述原生GUI项目通过。
