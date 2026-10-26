# Implementation Plan: 058 生活情境词义图卡
Date:2026-10-25 | Branch:main | Spec:[spec.md](spec.md)

## Technical Context
React/TypeScript/Vite/Tauri、既有matching交互、内置image_gen。无新运行依赖和存储字段。

## Constitution Check
先检查对象/动作/差别，采用同参照的配对图片；保留一层词语及原语音。精确数量6/2逐图核对，不用重复图配不同文字。保持共享框架。所有生成资产落地、注册并留source。保留053–057工作，main继续。

## Design
每对先生成一张，再以本地源图编辑相反状态；高低固定树/儿童/地平线，改变风筝高度；上下固定桌子/猫的尺度，改变猫的位置；长短固定画幅和笔的粗细，只缩短笔身；多少固定盘/果的尺度，只改变数量。运行副本仅等比缩小，不自动裁主体。imageGallery增加8个词义图卡，presentation.ts的E01映射替换8词，保留旧绘图注册供历史审计。E01独立CSS放大图片和词语，其他matching不变。

## Files and Verification
public/images/items/vocabulary-058；imageGallery.ts；exploration/presentation.ts；interactions/word-pictures.css及MatchingInteraction.tsx导入。词义审查台账、6题22图引用精确变化normalizer、相关回归。图片共参照/差异/数量/裁边目视复核；6题配对错误/正确、重连/撤销/清空、375px；全1110题非图片字段不变。build/audit及Mac安装，仍锁屏的原生项目保留待办。
