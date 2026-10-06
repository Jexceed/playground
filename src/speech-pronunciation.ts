/** Speech-only input; keep displayed text and local-audio lookup keys unchanged. */
export function prepareSpeechText(text: string, locale = "zh-CN"): string {
  if (!locale.toLowerCase().startsWith("zh")) return text;

  const xingPositions = new Set<number>();
  for (const match of text.matchAll(/执行|进行|运行|旅行|通行|飞行|步行|逆行|顺行|先行|平行|并行|可行|不行|才行|能行|自行车|行动|行人|行走|行驶|行为|行程|行星|行李|行礼/gu)) {
    xingPositions.add(match.index + match[0].indexOf("行"));
  }

  return text.replace(/行/gu, (character, index: number) => {
    if (xingPositions.has(index)) return character;
    const before = text.slice(0, index);
    const after = text.slice(index + 1);
    const rowPrefix = /(?:(?:第\s*)?[零〇一二两三四五六七八九十百千万\dA-Za-zＡ-Ｚａ-ｚ０-９]+|字母|完整|整|每|逐|按|跨|蓝白|颜色)\s*$/u;
    const rowSuffix = /^(?:列|和列|、列|的颜色|的字母|既要)/u;
    // Edge accepts plain text only. 航 supplies the same unambiguous hang2 sound.
    return rowPrefix.test(before) || rowSuffix.test(after) ? "航" : character;
  });
}
