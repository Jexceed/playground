# 065 队伍头像比例与毛色验证

2026-11-16，main 本地交付，保留已有 062–064 工作区改动；未提交或推送。

## 修正

原来的头像按列宽缩小，但高亮附着在固定100px高的行元素上；放大版还使用固定120px。现在高亮、头像和阴影绑定同一个1:1 wrapper，行高由头像自然撑开。

新增6张透明PNG毛色变体，小猫/小狗/小熊各三种外观（包括原图），按同物种出现顺序分配。最大队伍10位朋友使用10张不同图片，小兔始终唯一。普通/放大均使用同一映射与预加载列表。

全题库1122条记录及语音脚本、manifest的摘要保持一致，见[内容指纹](verification/content-fingerprints.json)和[检查结果](verification/checks.json)。计数方向、位置、答案、提示、讲解和进度结构未变。

## 图片交付

使用**内置 imagegen**，以已有本地猫、狗、熊头像为编辑目标，每个变体单独调用。已逐张查看生成结果，检查物种、正面姿态、表情风格、毛色区分和透明边缘。运行文件保存在：

- `public/images/characters/queue-065/cat-silver.png`
- `public/images/characters/queue-065/cat-cream.png`
- `public/images/characters/queue-065/dog-chocolate.png`
- `public/images/characters/queue-065/dog-silver.png`
- `public/images/characters/queue-065/bear-black.png`
- `public/images/characters/queue-065/bear-ivory.png`

1254×1254生成原图均复制到同类目录的`source/`中，320×320运行图仅做整幅等比例缩小，alpha范围保持0–255。原头像没有覆盖。

[完整提示词集与生成路径](../../public/images/characters/queue-065/source/prompts.json)、[来源哈希/输出哈希/转换记录](../../public/images/characters/queue-065/source/manifest.json)、[新增图库键](gallery-additions.json)。历史快照比较先精确验证这6个新图库项再排除，旧图片和题目字段继续参加比较。

## 自动与浏览器验证

| 检查 | 结果 |
| --- | --- |
| 8个相关回归文件 | 57/57通过 |
| `pnpm build` | 通过；保留既有大于500kB产物提示 |
| `pnpm audit:curriculum` | 118组 / 1122题，0问题 |
| `pnpm audit:voice-media` | 4411条，0问题 |
| 新图片来源/运行文件哈希、尺寸、alpha | 6/6通过 |
| 九题浏览器普通视图 | 每位图片不同、仅一只小兔、全部图片加载且完整显示 |
| 6/8/10位浏览器放大视图 | 框与图片宽高比均为1:1，计数逐列对齐 |

12次浏览器测量中，框与图像布局盒宽高比误差为0，最大计数中心偏差约0.004px，无观察窗口内的横向溢出。[尺寸与图片逐项记录](verification/browser-fit.json)。这次没有新增仅匹配CSS声明的测试，采用实际布局测量，并更新已有资源唯一性回归。

中文语音仍为 Edge Xiaoxiao，英文仍为 Edge Jenny；脚本/manifest未更改，4411个ID、原文、locale和本地路径全部对齐，failures为空，无macOS say或mixed local。

## Mac 安装与原生验收

`pnpm mac:install` 成功更新 `/Applications/小小思考屋.app`，退出旧进程后重新打开。严格deep签名通过，安装与构建可执行文件哈希一致：

`7495e3f0e84e3a6aba1606b1ca36105619051a66709f49108d105188b9200f94`

[安装校验](verification/installed-bundle.json)。实际检查了三种人数的普通和放大视图：

| 人数 | 普通视图 | 放大视图 |
| --- | --- | --- |
| 6位 | [第1题](verification/native-round1.png) | [放大](verification/native-enlarged-round1.png) |
| 8位 | [第2题](verification/native-round2.png) | [放大](verification/native-enlarged-round2.png) |
| 10位 | [第9题](verification/native-round9.png) | [放大](verification/native-enlarged-round9.png) |

三种人数下小兔框均贴合头像大小，新毛色和小兔标识清晰；最大队伍没有原来的高空框。对照图见[更新前第9题](verification/native-before-round9.png)。最后恢复进入检查时的第9题，仍为0/9已做、0次尝试、0次提示，没有提交完成记录。[最终状态](verification/native-final.txt)。

本次验证限于队伍图的比例、资源、计数一致性和当前Mac体验；儿童是否更容易辨认朋友，继续由亲子试玩观察。
