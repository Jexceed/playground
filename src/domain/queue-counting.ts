import type { Activity } from './activity';

export type QueueEvidence = Extract<NonNullable<NonNullable<Activity['presentation']>['evidence']>,
  { kind: 'queuePositionAndTail' | 'overlapQueue' }>;

const otherFriends = ['cat', 'dog', 'bear'] as const;
const friendNames = { cat: '小猫', dog: '小狗', bear: '小熊', rabbit: '小兔' };
const friendImageKeys = {
  cat: ['cat', 'queueCatSilver', 'queueCatCream'],
  dog: ['dog', 'queueDogChocolate', 'queueDogSilver'],
  bear: ['bear', 'queueBearBlack', 'queueBearIvory'],
  rabbit: ['rabbit'],
} as const;

/** One physical queue, with two ways to count its members. */
export function queueCountingModel(evidence: QueueEvidence) {
  const sharedRabbit = evidence.kind === 'overlapQueue';
  const left = evidence.kind === 'queuePositionAndTail' ? evidence.leftPosition : evidence.left;
  const right = evidence.kind === 'queuePositionAndTail' ? evidence.behind : evidence.right;
  const total = left + right - Number(sharedRabbit);
  const rabbitIndex = left - 1;
  let otherIndex = 0;
  const appearances = { cat: 0, dog: 0, bear: 0, rabbit: 0 };
  const friends = Array.from({ length: total }, (_, index) => {
    const character: keyof typeof friendNames = index === rabbitIndex ? 'rabbit' : otherFriends[otherIndex++ % otherFriends.length];
    const imageKey = friendImageKeys[character][appearances[character]++ % friendImageKeys[character].length];
    return { character, imageKey, name: friendNames[character], position: index + 1 } as const;
  });
  const leftCounts = friends.map((_, index) => index <= rabbitIndex ? index + 1 : null);
  const rightCounts = friends.map((_, index) => sharedRabbit
    ? index >= rabbitIndex ? total - index : null
    : index > rabbitIndex ? index - rabbitIndex : null);
  const groups = evidence.kind === 'overlapQueue' && evidence.wording === 'groups';
  const leftLabel = groups ? `左边这一组：${left}位` : `从左数到小兔：${left}位`;
  const rightLabel = sharedRabbit
    ? groups ? `右边这一组：${right}位` : `从右数到小兔：${right}位`
    : `小兔后面还有：${right}位`;
  const explanation = sharedRabbit
    ? '小兔被两边各数了一次，合起来时只算一次。'
    : '小兔已经在绿色这一组里，蓝色从它后面一位开始数。';
  const equation = `${left} + ${right}${sharedRabbit ? ' − 1' : ''} = ${total} 位`;
  const count = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join('，');
  const speech = `从左边开始数：${count(left)}。数到小兔，是${left}位。` + (sharedRabbit
    ? `再从右边数：${count(right)}。也数到这只小兔，是${right}位。${explanation}${left}加${right}再减一，一共${total}位。`
    : `小兔后面的朋友，从下一位开始数：${count(right)}。后面还有${right}位。${left}加${right}，一共${total}位。`);
  return { friends, left, right, total, rabbitIndex, sharedRabbit, leftCounts, rightCounts,
    leftLabel, rightLabel, explanation, equation, speech };
}
