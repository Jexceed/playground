# 053 验证记录

2026-10-23，main，基线014a56a3。修复未提交或推送。

## 诊断与修改

原第3题主提示是12.288秒的整段说明，具体“第1步，翻第3张。”在末尾；单步已有2.712秒的独立本地声音。没有把这个问题误判为缺文件或全局播放器截断。

现在进入翻牌题、顶部听题都直接按当前模型朗读操作步骤。第3题只说“第1步，翻第3张。”。三步题仍完整读出重复的目标，例如第7题1→2→1。主朗读、步骤按钮、clues生成及语音导出复用同一格式函数。图片、显示文案、规则、答案、修订号和存储不变。

## 验证

- `node --test scripts/card-flip-speech.test.mjs scripts/rule-play.test.mjs scripts/speech.test.mjs scripts/round-speech-navigation.test.mjs`：19/19通过。
- 新增6项回归包括全部9题准确顺序、第三题立即读关键动作、导出主与单步语音、移除冗余clues后仍依结构化模型生成、其他题朗读保持一致，以及1110题完整catalog与014a56a3哈希一致。
- `pnpm export:voice-lines`、标准Edge `zh-CN-XiaoxiaoNeural -12% +2Hz`：4224条完整对应，生成9条新的提示文件并移除9条本轮替代的旧提示。仅删除经旧manifest核对的孤立文件。一个合成子进程挂起后定向结束并正常重试成功。
- `audit:voice-media`：4224/4224，0问题；manifest failures为空，没有macOS say或mixed local。见 [音频对齐](verification/audio-alignment.json)。
- `pnpm build`通过（仍有既有主包大于500kB提示）；`audit:curriculum`115组/1110题、0问题；`git diff --check`通过。

## 真实音频播放检查

独立5304 origin的 [诊断页面](voice-check.html) 加载同一应用代码，包装真实Audio构造器以暴露playing/ended/pause/error事件，不替代播放、不修改生产代码。

[13次播放记录](verification/browser-voice-cases.json)覆盖全部9题入题、切回第3题、顶部听题、单步小喇叭，以及中断第9题切回第3题。每次目标本地音频都收到ended，无TTS回退。第3题实际命中独立“第1步，翻第3张。”MP3，不再播放原12秒通用说明。初次等待第4题时工具的选择器等待期限先到，复查音频已ended；随后对较长音频使用分次等待并逐条完成检查。这不是播放器错误。

上述证明正确本地音频被播放并结束，不等同于人工逐字听审或声卡输出转录。

## Mac交付

`pnpm mac:install`成功，已更新并打开`/Applications/小小思考屋.app`。构建和安装二进制相同、严格深度签名通过，SHA-256：

`d8d899b90adcff60557bf751452a52637396e386f8b1b42752b1aa22e7ea5ee2`

原生检查翻牌第3题的入题、顶部听题及单步入口，保留第3题和2/9完成数；没有提交或使用提示。结束后恢复安装前“小岛连桥”第1题、1/9完成数及未提交桥数A–B=2、B–C=1、C–D=1、D–A=2。见 [原生记录](verification/native-cases.json)、[安装证明](verification/installation.json)、[第3题截图](verification/native-third.png)。

## 流程与范围

main上完成053 spec、plan、research、data-model、UI契约、quickstart及6项任务。setup-plan/setup-tasks成功，无扩展钩子；本仓库无update-agent-context.sh，现有AGENTS保持原样。独立诊断与回归由子代理处理，正式实现、语音及安装串行完成。

本次未重做界面或其他题型。实际儿童能否仅凭步骤语音完成操作仍待亲子观察，已列入TODO。
