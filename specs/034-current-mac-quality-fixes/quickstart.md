# 验证指南
1. 跑新增语义回归，核对反例修复前失败、修复后通过。
2. generate:exploration-media、export:voice-lines、标准Edge生成/清理/voice-media；检查无失败和临时语音。
3. build、audit:curriculum、活动/进度/语音/图交互回归。
4. 当前Mac1280×820检查N04-9、N13-7..9、L05-4..6、G04-7..9、G07-4..9、G09-7..9、G15-4..9；检查长亲子、图集、提示/结果、保存和重开。
5. mac:install并验证标准Applications二进制和真实UI；版本证据保留。完成后提交dev，fetch/push并核对远端。
