# 数据
亲子图使用局部previewIndex:number|null；排序图使用source(choices/board)+当前token/slot ID，再计算查看索引。输入仍是GalleryImage数组。候选图按屏幕候选顺序，已摆图按实际摆放顺序，不能借用正确答案排序。图片注册、活动ID/revision、回答与进度存储schema均不变。

open(index)显示对应单帧；next/previous限制在图片数组内；close/cancel、离开题目或记忆阶段改变清空索引。图片浏览不写入ActivityResponse或ActivityProgress。
