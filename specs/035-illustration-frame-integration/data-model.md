# 数据与兼容
GalleryImage保留src/alt/frame(columns,rows,index)，不改变存储schema。新增审计记录AtlasUsage包含src、registeredFrameIndices、usedFrameIndices、unusedFrameIndices及每帧activityId/groupTitle/world/round/kind引用。只收集会渲染的图片分支，textOnly图卡不算图片引用。

L06种植变式活动ID、step ID及排序位置保留，revision由1升2；旧@1事实保留不移作新完成。A05素材更正不改故事、答案或revision。其它活动均保持现状。
