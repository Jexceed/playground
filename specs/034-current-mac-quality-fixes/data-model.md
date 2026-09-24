# 数据与兼容
- Activity.presentation.pyramid: baseTokenIds、rowSizes、choiceIds；实际填格均对应真实可编辑格，使用existing cells/evaluation.exact。
- presentation.evidence.rectangleSearch: rows/columns；手工标记只辅助计数，数学答案仍明确独立。
- EvaluationResult可附slotId（错误格定位）、checkedPartial（部分正确检查）；未填完整永远不返回correct。
- Session及ActivityEvidence增加可选checks支持计数；旧存储无此字段视为0，保留旧字段与其他版本记录。中途检查不写firstCompletedAt。
- difficulty保留既有维度，补basis、calibration=design-estimate、具体前置条件。按family及真实台阶/亲子方案映射，后续真人数据另记。
- N13-7..9、L05-4..6、G04-7..9、G07-4..9、G09-7..9、G15-4..9提高revision=2。共24项，保持ID、旧版本证据和其他题库不变。
