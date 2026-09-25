# 验证步骤
1. 使用项目Node/pnpm环境，运行node --test scripts/exploration-presentation.test.mjs。
2. 运行node scripts/audit-illustration-usage.mjs；期望11图组、44注册/使用帧、未使用0，并生成入口文档。
3. pnpm generate:exploration-media、pnpm export:voice-lines和标准Edge生成/清理；再运行pnpm build、pnpm audit:curriculum、pnpm audit:voice-media。
4. pnpm mac:install。标准.app内进入探索→逻辑屋→先后有讲究：第4/7题是完整小猫种植，第6/9题是完整水果沙拉；第1/3题是对应三步简化版。记忆小屋→故事留在脑海里第6题听完后用同组图片重排。
5. 核对最新应用与构建哈希、图片与语音文件覆盖，提交验收记录并推送dev。真实儿童实测和全量人工音质听审另记。
