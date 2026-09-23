# Audit model
FamilyAssessment: id、domain、status(core-covered/partial/absent/unverified/reference-only)、actualKinds、sourceEvidence、missingBranches、qualityIssues。core-covered仅表示当前纳入目标的核心任务已实现，不等于整本或所有源题逐题覆盖。
SourceAssessment: sourceId、hashStatus、canonicalGroup、direct/indirect refs、priorReview、newReview、coverageLimitations。
Finding: id、severity、affectedActivityIds、reproduction、source/code references、state(open/fixed/needsChildPlay/needsSourceAudio)。
Report必须分别列数量覆盖、规则/交互覆盖、听辨与适龄验证。Layer visibility helper仅改变从给定画面能推出的before关系，不显示隐藏答案。
