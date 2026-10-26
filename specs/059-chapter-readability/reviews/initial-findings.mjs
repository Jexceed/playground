import fs from'node:fs';
const root='specs/059-chapter-readability/';const file=root+'reviews/chapter-ledger.json';const ledger=JSON.parse(fs.readFileSync(file));
if(ledger.some(g=>g.status!=='pending'||g.contentReview.status!=='pending'))throw Error('Initial discovery must not overwrite later chapter review progress');
const issues=[
 ['legacy-balance-model',['logic-balance-swap'],'只用两个物品框与文字说等重，没有可见的水平天平或等重标记。','增加能看出两边平衡的模型，并保留未知物品数量。'],
 ['height-map-key',['logic-block-height-map','logic-three-view-blocks'],'楼层数字表没有立体积木与0空位的直接对应示例。','加入同尺度0/1/2层图例；逐题确认视角/数字不泄露答案。'],
 ['mirror-axis-model',['logic-mirror-fold'],'折线用独立格中的箭头代替连续折轴。','检查全章垂直/水平/顺序变体，呈现真实轴和折叠关系。'],
 ['partition-labels',['explore-number-partitions'],'分盒选项的左盒/右盒文字随PNG缩小，主图片标签比HTML小。','将盒名放在阅读大小的HTML中或扩大图卡，保留每个选项的数量和空盒状态。'],
 ['sharing-recipients',['explore-group-share'],'平均分题只展示待分物品，接收人数/每组单位仍仅在文字里。','针对等分与按组分各变体，补充已知接收对象或组模型，未知数留空。'],
 ['money-exchange-model',['explore-money-shopping'],'纸币兑换首阶段只显示抽象算式。','复核全部三阶段，加入面额清楚的金额/兑换对象，避免只靠文字解释物品。'],
 ['ruler-readability',['explore-measurement-boundaries'],'尺子刻度字在主要图片中仍明显偏小。','从精确刻度模型重排数字与对齐线，实际像素字号至少18。'],
 ['clock-bitmap-readability',['explore-time-elapsed'],'探索钟面数字随PNG缩小，双钟面还需检查。','保留精确时针/分针角度，独立处理钟面数字的实际字号。'],
 ['small-panel-labels',['explore-shape-set-operations','explore-symbolic-color-rules','explore-fine-motor-action'],'组合图片内的左图/右图、第一排/第二排、直线/折线等小字未被CSS字号修改覆盖。','分离可读标签与图片，逐变体确认位置一致。'],
 ['pyramid-reference',['explore-recursive-composition'],'主图的底层格子和问号过小。','扩大主模型，并检查后续互动金字塔的槽位号与图卡。'],
 ['movement-rule-picture',['explore-position-transform'],'走一格和回到最左的关键动作仍只在句子中。','补充方向与越界回绕的可视步骤/示例，不画出本题终点。'],
 ['color-code-key',['explore-symbolic-color-rules'],'颜色对应数值和满3减3完全依赖两条规则文字。','增加颜色—数量对照及独立操作示例，保留真正计算步骤。'],
 ['construction-piece-scale',['explore-shape-assembly'],'A/B部件按钮上的格子很小，难与目标格比较。','放大部件预览与按钮，验证旋转/放置/取回及后续形状。'],
 ['net-letters',['explore-cube-nets'],'盒子展开图的A–F字母明显过小。','按确切展开几何放大面与字母，保证相邻关系不变。'],
 ['copy-reference-scale',['explore-grid-copy-reconstruction'],'参照3×3图被压到很小，作答格反而大得多。','放大参照并对齐行列，完整核对各图案。'],
 ['generic-matching-caption',['explore-relations-analogies'],'左图1/左图2是制作编号，不帮助理解图卡关系。','复核全章关系变体，减少无意义可见编号并保持辅助朗读与连线身份。'],
 ['mirror-and-matrix-density',['logic-matrix-puzzle','logic-visual-match','logic-part-whole-puzzle'],'多图卡名称放大后出现多行拥挤。','检查后续密集变体，扩大卡片或仅保留必要一层说明。']
];
for(let index=0;index<ledger.length;index++){
 const g=ledger[index],d=JSON.parse(fs.readFileSync(root+'verification/first-pass/'+g.gameId+'.json')),m=JSON.parse(fs.readFileSync(root+'verification/mobile-first/'+g.gameId+'.json'));
 g.initialReview={status:'viewed',roundId:g.roundIds[0],desktopEvidence:'verification/first-pass/'+g.gameId+'.png',contactSheet:'verification/sheets/first-'+(Math.floor(index/6)+1)+'.png',scope:'Initial state only. Memory/listening/step/review phases and later round variants remain unreviewed.'};
 g.fontAudit.desktop={phase:'initial',htmlAndInlineSvgSmallCount:d.font.small.length,evidence:'verification/first-pass/'+g.gameId+'.json'};
 const actual=m.clips.filter(c=>!String(c.class).startsWith('activity-picture-frame'));
 g.fontAudit.mobile={phase:'initial',htmlAndInlineSvgSmallCount:m.font.small.length,clippedSurfaces:actual,evidence:'verification/mobile-first/'+g.gameId+'.json',intentionalAtlasCropCount:m.clips.length-actual.length};
 g.issues=issues.filter(i=>i[1].includes(g.gameId)).map(i=>({id:i[0],roundIds:[g.roundIds[0]],problem:i[2],plannedFix:i[3],status:'open',evidence:[g.initialReview.desktopEvidence]}));
 g.status='pending';
}
fs.writeFileSync(file,JSON.stringify(ledger,null,2)+'\n');
fs.writeFileSync(root+'reviews/initial-summary.json',JSON.stringify({date:'2026-10-25',desktopInitialScreens:115,mobileInitialScreens:115,all20DesktopContactSheetsViewed:true,contentReview:'pending all-round source review',fullChapterAcceptance:0,openIssueCategories:issues.length,affectedGroups:ledger.filter(g=>g.issues.length).length,scope:'This first pass is discovery and font/layout evidence, not full goal completion.'},null,2)+'\n');
console.log({groups:ledger.length,initialScreens:230,fullChapterAcceptance:0,openCategories:issues.length});
