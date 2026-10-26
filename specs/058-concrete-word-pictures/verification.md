# 058 词义图片重绘验证

2026-10-25，main。保留既有053–057工作，本轮未提交或推送。

## 交付

使用内置 image_gen 生成四对8张图片：高低为同一棵树与孩子旁的红风筝，上下为同一只小猫在桌上/桌下，长短为同起点同粗细的铅笔，多少为同盘同大小的6/2个草莓。原始1254×1254 PNG、实际提示词、派生参照和哈希保存在 public/images/items/vocabulary-058/source/manifest.json；运行时640×640只作等比缩小，不裁边、不把短铅笔单独放大。全部注册imageGallery。

替换E01前6题22处图片；8处清楚的开关盒子保留。仅E01匹配图片放大为桌面132px/375px屏幕108px，每卡保留单层词语。既有导航、页面框架和绿色确认按钮保持原样。

## 类似问题审查

全库相对词语图卡精确命中32处：E01配对30处、E05大字卡2处。处理分别为22处替换、8处保留盒子、2处保留字形证据。E01后3题仍是亲子实物观察。相关E07明确的长条数量比较、L03未知身高排序推理保留模型，避免画出答案。此轮不是全1110题的儿童理解验收。逐项记录见 verification/word-usage-before.json、art-review.json、review.md。

## 技术验证

- 75项相关回归加7项受历史归一化影响的bridge回归，82/82通过。前者包含4项新图片契约回归及057轮廓/053–056功能回归。日志：verification/tests.log、bridge-regression.log。
- 全1110题在精确还原22处图片后hash与本轮起点完全一致：词语、朗读文本、答案、稳定ID、revision和亲子观察内容保持。历史归一化只接受登记的新图片，不会隐藏未知图片、答案、词语或revision修改。
- 8张原图/运行时哈希、尺寸、参照文件验证通过，逐像素复核仅等比resize，无裁切。
- pnpm build通过（既有主包大于500kB提示仍在）；audit:curriculum为115组/1110题、0问题。
- audit:illustrations为18图集/74帧，0问题；独立新图的注册及文件完整性另外由word-pictures测试覆盖。
- 重新export:voice-lines后4259条无新增/修改，恢复原时间字段；audit:voice-media 4259/4259、0问题；manifest failures为空，无macOS say或mixed local。
- git diff --check通过。

## 图片与实际页面

原图与verification/art-contact-sheet.png逐对查看。独立5309测试origin逐题执行错误配对/提交、正确配对/提交，前6题全部通过。第1题另验证重新连线、撤销、清空、放大返回。查看第7题仍为实物动作/记录流程。截图browser-round-1.png至6.png及browser-cases.json已保存。浏览器error日志为空。

375×812测试第1、6题，页面宽375无水平溢出，所有图片108×108、同一对不改变缩放尺度。见mobile.png、mobile-high-low.png、mobile.json。测试origin与用户5298页面分离，结束关闭测试页、还原视口并停止5309服务。

## Mac安装与限制

pnpm mac:install成功，/Applications/小小思考屋.app已更新，构建/安装可执行文件SHA相同，strict/deep签名通过：

6ceab9ba9baf1da3b83a983508abdcade275b5e6a3b275f64a2d218212ce7d8f

安装后cua.getApp复核仍报告Mac锁屏，已请求手动解锁，未能完成新版原生窗口操作。058图片与057轮廓的最后原生检查保留待办；不把浏览器检查算作原生通过。本轮未改动原生答题进度。解锁后先读取最新用户位置，保留新活动，再进行查看/连线/撤销/清空及恢复；不机械覆盖057保存的旧位置。

## 体验观察

成人逐图和技术验证已完成；孩子是否无需额外解释就能说出比较关系，仍需亲子试玩观察，已记录TODO。

## 2026-10-26 原生待办完成

已打开重新安装的/Applications/小小思考屋.app。057八题轮廓及选择已查看；058六题词卡及高低连线、大图、断开、撤销、清空已操作验证，未提交或删除成绩。证据在../059-chapter-readability/verification/native-resumed/。启蒙完成数仍为280/489，按用户期间最新位置恢复到探索/语言花园/词语有朋友第1题。成人/工程验收不替代儿童试玩。
