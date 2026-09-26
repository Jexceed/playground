# 方案
实际dev分支，2026-09-26，规格spec.md。沿用React/TypeScript/CSS与现有图集分帧，不增加技术依赖、状态或存储，也不需要研究代理。

ActivitySetGame.tsx保留现有选择按钮、dragHandlers和独立放大按钮；在选择按钮内增加单独的图片边框容器，名称在该框外但仍属于同一可点击按钮。styles.css将边框/选中外观应用到图片框，收窄图片内边距并按三/四卡宽度配置图幅；只调整必要局部间距以保持当前Mac单页。相邻帧、名称、辅助图与上下方操作均不得被截断。

Constitution前后检查通过：儿童可读性、图片真实含义、原进度保留、本地资源与实测门禁保持。验证现有90项相关回归、build、audit:curriculum/illustrations/voice-media和CUA点击/键盘/拖放；mac:install更新标准.app，原生锁屏时保留待办。更新docs/CHANGELOG.md、TODO.md及verification/。没有extensions.yml或update-agent-context脚本。

L06第7～9题补充：presentation.storySequence增加可选tokenIds，显式提供原始乱序的完整图卡ID。ActivitySetGame以这组顺序渲染候选和大图浏览，不再重复绘制参照列；课程审计校验ID集合完整唯一，使用审计按实际可见表面收集。仅为布局元数据，不改答题语义。
