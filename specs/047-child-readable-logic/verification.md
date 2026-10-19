# 047 儿童可理解画面修正验收

基线dev `adc06b78`。用户指出篮子增加解释负担、生活过河题太抽象、选项图小且重复文字；这些属于图义问题，046的技术检查不能证明儿童可理解性。

## 完成范围
- 分类机1–8题：去掉统一棕篮与贴纸，直接显示大色块/空心形状，题干、选择、反馈、家长提示中的篮子改为分组语言。目标图居中放大。9–11双条件图形保持原题。
- 生活桥6题：条件4/12、修正4/11、优先3/10。使用清楚的短板缺口情境及对应跨岸结果；数值措辞改为定性长度条件。木板选项复用无字本地材料图，长短使用固定显示尺寸；换同样短的仅用短板→短板，不再堆两个微型河图。
- 8道证据概念选择：故事2/3/6/7、条件8/11、修正8、优先12。删除同一动物图上不同文字牌；保留单层简短文字和现有选择朗读。真实动物/地点选择仍保留同源证据裁图。
- 专门搭桥8题保留原有河宽、长度、支点及正确关系；选项去多余页脚留白、增加角色和目标参照、放大数字；4道长文案缩短。共29题文案变更，逐项在[content-changes.json](content-changes.json)。
- 项目AGENTS新增儿童图义与单层短选项要求。不能以图像覆盖数量作为儿童理解证据。

## 图片与语音
基于旧 `bridge-wide-river.png` 画风，由gpt-6.1-sol代理调用内置image_gen生成短板缺口，再参考该图编辑长板搭岸版本。两张运行PNG均1200×675，原图与完整prompt、resize、SHA在[art-river.json](art-river.json)和同类source目录。主代理目视核对了缺口、两岸支撑、同一角色/视角与无图中文字；旧图未删除。

导出并增量生成标准Edge中文语音（Xiaoxiao、-12%、+2Hz）；最终4171条脚本与manifest一致，failures空、媒体审计0问题，无macOS say/mixed local。仅清理76个已不被manifest引用的旧媒体，清单见[voice-pruned.json](verification/voice-pruned.json)。未做全量人工听辨。

## 代码与边界
最终74项回归通过：[regressions-final.log](verification/regressions-final.log)。047新增保护证明只有登记的文案字段改变，全部ID、answer、choice.value及顺序、其他课程保持不变。较旧043/044/045/046的冻结快照不改；测试先断言047精确新文案，再逆转登记字段与旧基线比较，不放宽原答案保护。初次失败包含旧文案边界及catalog重复视图的快照比较，已保留初始日志。

生产构建、课程审计（115组1110项）、图库和语音媒体审计通过。分类审计按实际颜色/形状同时检查新显示标签和旧稳定答案值，仍检验语义，不仅检测选项存在。

## 浏览器
隔离端口5296，按Mac内容区1280×788检查6组62题：每题任务/错误/正确，43题另有场景入口，共229状态，缺图、选项越框、页面越界、底部按钮不可见均0。[browser-states.json](verification/browser-states.json)。初次默认1280×720有部分页面需纵向滚动，记录在before/browser-720.json；该较矮尺寸未被宣称无滚动。检查以截图中的实际Mac尺寸为准。

## 原生Mac
最终执行 `pnpm mac:install`，安装/构建可执行文件SHA相同，strict deep签名通过：[installed-app.json](verification/installed-app.json)、[最终安装日志](verification/mac-install-final.log)。重启真实tauri://localhost应用，20道代表题检查场景/选项，18道已有完成记录的题重做成功提交；未完成分类1/3题没有提交正确答案。所有快照完成数274/489，最后恢复方位小地图第1题。[native-rounds.json](verification/native-rounds.json)、[恢复状态](verification/native-restored.txt)。本次原生没有声称全量62题均重做。

原生关键画面：[分类](verification/native-logic-sorter-switch-1-task.png)、[过河材料选择](verification/native-logic-condition-detective-12-task.png)、[短句判断](verification/native-logic-condition-detective-8-task.png)。这些验证布局与交互及图面对应；亲子实际试玩理解度另列TODO。

## 交付
在现有dev分支提交并按本会话授权推送origin/dev；交付时核对远端SHA、ahead/behind、干净状态。main/NAS不在本轮目标中。
