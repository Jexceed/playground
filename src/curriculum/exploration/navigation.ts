import type { CatalogGame } from "../../domain/activity";

export function explorationUnit(game: CatalogGame): string {
  const id = game.kind === "activitySet" ? game.rounds[0]?.primaryFamilyId : undefined;
  if (!id) return "动手热身";
  const n = Number(id.slice(1));
  switch (id[0]) {
    case 'N': return n <= 4 ? '数量与分组' : n <= 12 ? '数的关系' : '生活中的数学';
    case 'L': return n <= 4 ? '分类与线索' : n <= 8 ? '顺序与推理' : '变化与策略';
    case 'G': return n <= 8 ? '图形与规律' : n <= 15 ? '观察与空间' : '立体与方向';
    case 'A': return n <= 3 || n === 9 ? '看与记' : [4, 5, 8].includes(n) ? '听与记' : '专注与规则';
    case 'E': return n <= 4 || n === 8 ? '词语与故事' : n === 5 ? '汉字与字音' : '英语听与想';
    case 'P': return n <= 2 ? '生活与变化' : n <= 4 ? '动手探索' : '表达与行动';
    default: return '动手热身';
  }
}

export function groupExplorationGames(games: CatalogGame[]): { title: string; games: CatalogGame[] }[] {
  const groups = new Map<string, CatalogGame[]>();
  games.forEach(game => { const title = explorationUnit(game); groups.set(title, [...(groups.get(title) ?? []), game]); });
  return [...groups].map(([title, games]) => ({ title, games }));
}
