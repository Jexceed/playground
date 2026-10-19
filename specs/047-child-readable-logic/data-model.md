# Data model
GameRound身份、answer、choice.value不变，仅指定文案字段变更。LogicPicture允许image/images/symbol/materials及空对象（表示无需图）；LogicLesson的choices仍覆盖全部value但渲染器必须仅在有实际图义时渲染图。场景/选择/解释不能共享会提前泄露结果的状态。材料图以同单位视觉尺度区分长短。保存运行PNG的来源、尺寸、生成工具和prompt。
