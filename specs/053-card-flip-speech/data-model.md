# 数据模型
保留CardFlipEvidence.initial及steps；steps为0起始牌索引，重复索引有意义。cardFlipStepSpeech(target,index)输出1起始步号及牌号；cardFlipSpeech按数组顺序连接，不去重。题库字段、答案及用户存储零变化。语音导出以新完整朗读文本生成本地条目。
