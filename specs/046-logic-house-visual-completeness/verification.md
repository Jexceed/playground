# 046 逻辑屋全组视觉完整性验证

日期：2026-10-19。基线dev `05ab1206`，工作区 `/Users/chiang/.codex/worktrees/curriculum-benchmark/playground`。用户明确授权完成后提交并推送；目标为现有dev分支。

## 审查与变更边界

覆盖启蒙逻辑屋26组319题，126题的图面/交互调整，193题保留已有充分证据。[逐题台账](verification/review-ledger.json)、[覆盖统计](verification/coverage.json)。不是仅修改代表题，也不把正常的数字、网格、方向和几何符号全部改为装饰场景。

- 26道生活条件/错误修正/优先级题：初始情境、当前事实、三个选择和正确结果分别定义。泥手吃东西、红灯想走、混装玩具在错误流程中出现，成功演示使用修正后的步骤；判断长度失败等题以“依据”呈现而不是推荐错误行为。
- 17道证据题：保留真实场景，用同一图片裁切区域/角色；弱猫场景中原来摆在前景盘里的完整蛋糕块被移除。清醒门口狗不再被替换成睡狗。未生成原场景没有的脚印或碰撞痕迹。
- 14道装书包规则题增加任务条件；3道类比题补出缺失的新目标或正确需求；6道动作规则题给出本轮色卡→动作对应图。
- 数量/高度/位置/篮子/搭桥候选有相应图片或精确图形。桥的河宽、木板和库存都在同一单位、同一SVG视口中。三图样板不换行或越框；两列矩阵不保留多余第三列；镜像题展示真实镜轴与右侧位置。
- 另修正先做什么第10/16题：明确盛盘后才吃的任务，现在后续图片真正把饼干放进盘子并从盘中取食。旧045图像文件保留。

冻结的[baseline.json](verification/baseline.json)与回归证明全部原题ID、prompt、instruction、sequence、choices、answer及其他课程字段逐项不变；新视觉层按稳定ID附加。原图库的既有条目也保持原值。新增图库条目不作为题库变化误判。

## 图片生产与资源

用户指定的gpt-6.1-sol绘图代理通过内置image_gen完成所需故事插画/编辑：

- [daily](art-daily.json)：15张需求、物体、规则动作和盛盘状态图。
- [life](art-life.json)：4张初始场景、4张额外动作图。
- [evidence](art-evidence.json)：1张精确编辑的弱猫场景，23张既有场景的确定性裁切卡。

共5张新场景PNG（1200×675）、42张新运行卡（600×600），注册在`logicHouseAssets.ts`/`imageGallery.ts`。生成源图、完整prompt、实际原尺寸、裁切与覆盖关系在同类`source/`中。[92个资产/来源文件的路径与SHA-256](verification/image-assets.json)。600×600为运行规范尺寸，不冒称atlas单格原生分辨率。

数值和几何候选使用已有代码图形体系扩展，保持真实格长/支点/数量；没有用生成图估算数字关系。[独立源审查](review-abstract.json)、[生活规则审查](review-daily.json)、[证据审查](review-evidence.json)、[集成独立复核](review-integration.json)。集成复核发现的库存缩放、同短板重叠、缺少盛盘动作和不必要盘子步骤均已修正。

## 自动检查

- 70项回归通过，包括新的视觉合同、全题库不变性、11项精确候选/真实SSR输出测试、既有040/043/044/045、导航与语音切题回归。[日志](verification/regressions.log)。
- 生产构建通过；最终mac:install再次生产构建。[构建](verification/build.log)、[安装](verification/mac-install.log)。
- `audit:curriculum`、`audit:illustrations`、`audit:voice-media`通过。课程仍为115组1110项，其中逻辑屋26组319题。[课程](verification/curriculum.log)、[图集](verification/illustrations.log)、[语音媒体](verification/voice-media.log)。
- 4182条语音脚本与manifest对应，无缺失/文字不匹配/failures/失效文件。中文Edge Xiaoxiao（-12%、+2Hz），英语沿用Jenny，无macOS say或mixed local。[完整性](verification/voice-integrity.json)、[失效文件清单](verification/voice-orphans.json)。
- 初次新增不变性测试把允许新增的imageGallery也作为整体相等对象，已改为全课程字段深度相等＋原有图库条目不变；没有改旧冻结快照或放宽题目字段。

## 全量浏览器验证

隔离origin `127.0.0.1:5296`，1280×788。全部319题初始作答画面，67个场景入口，以及126道改动题各一次错误和正确提交，共638状态。[逐题结果](verification/browser-all-states.json)。最终所有状态：图片缺失0、页面纵横溢出0、图卡/标签越框0、底部操作不可见0。

初次检查发现错误反馈、较长候选、三图样板、比较卡片和三视图表头的布局问题。保留[初始失败记录](verification/before/browser-all-states.json)和before截图；修正后只复查受影响题组，最终台账采用每题最后的结果。三视图只压缩对象格的留白，未把表头同步加高；图片和题目数据未缩减。

另核对镜像两列矩阵与普通三列矩阵的真实DOM轨道/行位置：[matrix-layout.json](verification/matrix-layout.json)。搭桥放大模型可打开并返回题目，不提交答案：[放大截图](verification/bridge-model-enlarged.png)。分组的初始/成功样本保存为`ui-<gameId>-<number>-*.png`；不把抽样截图数冒称为完整逐题人工像素审查。

## Mac 安装与原生验收

标准安装已完成，安装与构建可执行文件SHA-256相同，strict deep签名通过：[installed-app.json](verification/installed-app.json)。

用户解锁后，重启真实 `/Applications/小小思考屋.app`（`tauri://localhost`），完成15组49道不同代表题的原生检查，其中28道已完成题重做正确提交、2道核对错误反馈。未完成题保留未完成状态。覆盖情境入口、证据/动作卡、规则变化、类比、数量、搭桥、镜像、比较和三视图；播放会停在末步，暂停/逐步/回看情境有效，搭桥模型放大返回保留成功状态。记录：[native-acceptance.json](verification/native-acceptance.json)。这不是319题全部原生作答。

原生截图复核发现“一模一样在哪里”的三张样板卡相互遮挡：卡片增宽后外层仍采用五列网格。已同步修正网格列宽，保留[失败截图](verification/before/native-logic-visual-match-12-task.png)，并补查12题的浏览器同级卡片交叠（此前页面/标签越界检查不覆盖同级遮挡）：[browser-comparison-overlap.json](verification/browser-comparison-overlap.json)。再次执行 `mac:install`（包含生产构建）和课程审计，12题在最终安装版全部重新打开：[原生复查](verification/native-comparison-followup.json)、[第12题最终截图](verification/native-final-visual-match-12.png)、[安装日志](verification/mac-layout-install.log)。两处CSS布局修改没有改变题库、图像或语音。

验收前后启蒙完成数均273/489；最后恢复“先做什么”第2题的场景入口，并验证退出重启后恢复。重做已有搭桥题刷新了一个现行能力标签，标签溢出计数从97变为98，未新增题目完成数；不声称用户存储逐字节不变。[最终状态](verification/native-final-restored.txt)。最终安装二进制与构建产物一致，strict deep签名通过。

## 交付状态与边界

运行时主修复已保存为dev `d5484575`，原生补验发现的比较卡布局修复与验收记录另存一个提交。按用户授权将这些提交及此前3个dev修复提交一起正常推送 `origin/dev`；交付时核对远端SHA、ahead/behind和工作区状态。main和NAS不在本次交付目标内。

本轮覆盖启蒙逻辑屋；探索逻辑及其他主题没有被宣称全部重做。未做儿童适龄试玩、全语音人工听辨或其他设备原生验收。
