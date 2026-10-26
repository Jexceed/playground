import type { GameRound } from '../types';

export const BIRD_DEPARTURE_COPY = {
  branch: '树上',
  away: '飞走了',
  replay: '回到开始，再看一次',
  countRemaining: '数数树上还剩几只。',
} as const;

export function birdDepartureModel(round: Pick<GameRound, 'visualGroups'>) {
  const start = round.visualGroups?.find(group => group.label === '原来')?.items.length ?? 0;
  const gone = round.visualGroups?.find(group => group.label === '飞走')?.items.length ?? 0;
  return {
    start, gone,
    birds: Array.from({ length: start }, (_, i) => {
      const departingIndex = i - (start - gone);
      return {
        x: 13 + (i % 5) * 13,
        y: start <= 5 ? 66 : i < 5 ? 51 : 82,
        leaves: departingIndex >= 0,
        toX: 88 + (departingIndex % 2) * 3,
        toY: 30 + departingIndex * 16,
      };
    }),
  };
}

export function birdFlightSpeech(model: { gone: number }) {
  return `飞走 ${model.gone} 只，看看树上还剩几只。`;
}
