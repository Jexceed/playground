# 验证流程
1. 从当前catalog生成并核对115章清单，按章节阅读全部1110题内容与表征；逐项记录证据，不能默认标通过。
2. 独立origin启动应用，经真实UI切换章节/题号；记录每种规则/表征的DOM字号、图片缩放、实际截图及操作反馈。以当前Mac窗口为验收目标，不扩展设备版式。
3. 已发现缺陷修正后重复对应场景，运行相关已有回归、pnpm build、pnpm audit:curriculum、pnpm audit:illustrations和pnpm audit:voice-media。
4. 若语音文本变化，export:voice-lines并用标准Edge命令生成，检查manifest一致与failures为空。
5. pnpm mac:install，验证安装/构建哈希与签名，解锁后实际运行代表交互与图片，保留并恢复用户最新位置。锁屏不能视为通过。
6. 检查每条spec验收和全部台账，没有待审/待改/待验证后才完成目标。

字号纠正后不再以所有字≥18px作为通过门槛。题号、题量和成长标签恢复原值；关键说明以具体图、动作和短句为主。
