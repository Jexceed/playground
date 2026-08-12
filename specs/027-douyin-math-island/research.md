# Research: 抖音小游戏数字岛首发版

## Decision 1: Cocos Creator 3.8 LTS + TypeScript

**Decision**: 选择 Cocos Creator 3.8 LTS 的普通小游戏构建目标，界面使用 2D UI，业务脚本使用 TypeScript。

**Rationale**: Cocos 3.8 是 LTS，官方构建面板原生支持抖音小游戏、AppID、竖屏、开放数据域和小游戏分包。项目现有题库是 TypeScript，迁移数据模型和逻辑的认知成本低；2D UI 对数字图卡、触摸选项和语音题目足够轻量。

**Alternatives considered**:

- Unity：运行时、wasm、内存和首包成本对当前 2D 教育游戏过重。
- Laya/Egret/Godot：可行，但现有维护生态、官方抖音发布说明和团队熟悉度不如 Cocos 路线稳妥。
- 直接移植 React/Vite：抖音小游戏 JavaScript VM 没有 DOM/BOM，不能运行现有组件树。

## Decision 2: 共享源数据，生成小游戏快照

**Decision**: `src/data/games.ts` 保持唯一正式课程源；导出脚本生成 `doyingame/assets/resources/math-island/data/catalog.json`。

**Rationale**: 直接在 Cocos 内手抄 122 题会产生答案、反馈和语音漂移。确定性快照允许 Cocos 在运行时读取普通 JSON，同时能在 CI 中比较游戏数、题数、ID、答案和哈希。

**Alternatives considered**:

- 将整个 Web 数据模块直接打入 Cocos：会携带逻辑屋/图形工坊数据和 Web 依赖，扩大包体并模糊边界。
- 把 JSON 改为主源：会迫使现有 React 题库重构，增加本期风险；可在后续平台统一规格中再评估。

## Decision 3: 精确裁剪图片与语音

**Decision**: 导出时从过滤后的数字岛题目计算资产闭包，仅复制运行时图片与语音，并生成包含来源、目标、字节数与哈希的 manifest。

**Rationale**: 当前 `public/` 约 244MB，而抖音开发者工具当前对未分包小游戏按 16MB 校验、分包主包约 4MB。数字岛不应携带源图、其他岛屿场景或 1801 条全量语音。

**Alternatives considered**:

- 全量复制后依赖压缩：远超体积预算，也无法证明资源范围。
- 远程 CDN：增加域名配置、联网依赖与低龄产品故障面，不适合作为核心内容首发默认。
- 浏览器/系统 TTS：音色和可用性不可控，违反本地可审计语音原则。

## Decision 4: 本地 Asset Bundle/平台分包候选

**Decision**: 将主场景、首页和必要 UI 保留在主包，将数字岛音频/场景按游戏或资源类型组织成可被 Cocos 构建器和抖音分包处理的本地 bundle；首个构建后根据 IDE 实际体积调整。

**Rationale**: 资源规模主要来自音频。首发将抖音副本转为经完整帧与时长检查的 32kbps 单声道 MP3，并保留 1200×675 场景 PNG；当前正式包为 12.00MB，无需为体积提前引入分包加载状态。若后续增长，分包配置应以 Cocos 实际构建产物和抖音 IDE 校验为准。

**Alternatives considered**:

- 所有资产主包：启动慢且很可能超过 4MB。
- 全部远程 bundle：破坏离线核心体验。

## Decision 5: 平台适配器与早期 onShow 监听

**Decision**: Cocos 业务仅调用 `PlatformAdapter`。抖音实现包装 `tt` 存储、safe area、生命周期、侧边栏；构建模板在 `game.js` 最早阶段同步监听 `tt.onShow` 并把最新启动参数缓存到 `GameGlobal`。

**Rationale**: 官方侧边栏复访指南要求在 `game.js` 运行时机同步监听 `tt.onShow`，否则热启动来源可能丢失。适配器让编辑器/Web 预览不依赖 `tt`，也便于单元测试。

**Alternatives considered**:

- 在首页组件加载后监听：可能错过首次或热启动回调。
- 在所有脚本里直接访问 `tt`：难以测试，平台差异泄漏到课程 UI。

## Decision 6: 免费无广告首发

**Decision**: 本期不集成登录、支付、广告、排行榜、云存档和用户输入。

**Rationale**: 先验证家庭能否发现、进入并完成数字思维互动，避免商业化和儿童合规扩大首发范围；这也意味着无需客服支付必接能力和敏感词接口。

**Alternatives considered**:

- 激励广告：与低龄亲子产品定位冲突，且会干扰证据观察与解释节奏。
- 一次性付费解锁：需要服务端订单、客服能力和更完整的商品设计，另立规格更安全。

## Decision 7: 验证分层

**Decision**: 数据与资源可在 Node 中完全自动审计；画面用 Cocos Web 预览和三种竖屏尺寸检查；平台能力和最终包必须在抖音 IDE/真机验证。

**Rationale**: 单一测试手段无法覆盖内容一致性、Cocos 序列化、小游戏包体、safe area 和真实 `tt` API。分层验证能让每个结论有对应证据。

**Alternatives considered**:

- 只看浏览器预览：不能证明抖音环境和包体。
- 只做真机抽查：不能穷举 122 题和数百条资产引用。
