import { existsSync } from "node:fs";
import { join } from "node:path";
import { activitySolutions } from "./activity-solutions.mjs";

export function auditActivityCurriculum(
  { activitySets, legacyGames, imageGallery, activityVoiceLines },
  voiceLines,
  manifest,
) {
  const problems = [];
  const gameIds = new Set(legacyGames.map((game) => game.id));
  const ids = new Set(
    legacyGames.flatMap((game) => game.rounds.map((round) => round.id)),
  );
  const registered = new Set(
    Object.values(imageGallery).flatMap((group) =>
      Object.values(group).map((image) => image.src),
    ),
  );
  const linesByText = new Set(
    voiceLines.lines.map((line) => normalize(line.text)),
  );
  const manifestText = new Set(
    manifest.entries.map((line) => normalize(line.text)),
  );
  const solutionCounts = {};
  for (const group of activitySets) {
    if (gameIds.has(group.id)) problems.push(`Duplicate game ID: ${group.id}`);
    gameIds.add(group.id);
    if (group.kind !== "activitySet" || !group.rounds.length)
      problems.push(`Invalid activity set: ${group.id}`);
    for (const activity of group.rounds) {
      const prefix = activity.id;
      if (ids.has(activity.id))
        problems.push(`Duplicate activity ID: ${prefix}`);
      ids.add(activity.id);
      if (
        activity.schemaVersion !== 1 ||
        !Number.isInteger(activity.revision) ||
        activity.revision < 1
      )
        problems.push(`Invalid schema/revision: ${prefix}`);
      for (const key of [
        "prompt",
        "instruction",
        "difficultyNote",
        "success",
        "retry",
        "parentPrompt",
        "primaryFamilyId",
      ])
        if (!activity[key]?.trim()) problems.push(`${prefix}: missing ${key}`);
      if (!activity.sourceRefs?.length || activity.hints.length < 2)
        problems.push(`${prefix}: source mapping and two hint stages required`);
      if (prefix.startsWith('explore-')) {
        const load = activity.difficulty;
        if (!activity.prerequisites?.trim() || load?.calibration !== 'design-estimate' || !load?.basis?.trim()
          || ['rules','steps','memory','reading','motor'].some(key => !Number.isInteger(load?.[key]) || load[key] < 0))
          problems.push(`${prefix}: missing explicit design-load profile or prerequisites`);
      }
      const tokens = new Set(activity.tokens.map((token) => token.id));
      if (tokens.size !== activity.tokens.length)
        problems.push(`${prefix}: duplicate token IDs`);
      for (const token of [
        ...activity.tokens,
        ...(activity.example ? [activity.example] : []),
      ]) {
        if (
          !token.label?.trim() ||
          !token.image?.alt?.trim() ||
          !registered.has(token.image?.src) ||
          !existsSync(
            join("public", token.image?.src?.replace(/^\//, "") ?? ""),
          )
        )
          problems.push(`${prefix}: invalid or unregistered token ${token.id}`);
      }
      if(activity.illustration && (!registered.has(activity.illustration.src)||!existsSync(join('public',activity.illustration.src))))problems.push(`${prefix}: missing or unregistered illustration`);
      if (activity.presentation?.evidence?.kind === 'storySequence' && activity.presentation.evidence.tokenIds) {
        const order = activity.presentation.evidence.tokenIds;
        if (activity.kind !== 'orderedPlacement' || order.length !== tokens.size || new Set(order).size !== tokens.size || !order.every(id=>tokens.has(id)))
          problems.push(`${prefix}: story palette must include every token exactly once`);
      }
      if (activity.presentation?.evidence?.kind === 'visualComparison') {
        const panels = activity.presentation.evidence.panels;
        if (panels.length !== 2) problems.push(`${prefix}: comparisons require two panels`);
        for (const panel of panels) {
          if (!panel.label?.trim()) problems.push(`${prefix}: comparison label is missing`);
          if (panel.kind === 'dots') {
            if (!Number.isInteger(panel.count) || panel.count < 0 || !Number.isInteger(panel.columns) || panel.columns < 1)
              problems.push(`${prefix}: invalid comparison quantity/layout`);
          } else if (panel.kind === 'placeValue') {
            if (!Number.isInteger(panel.tens) || panel.tens < 0 || !Number.isInteger(panel.ones) || panel.ones < 0 || panel.ones > 9)
              problems.push(`${prefix}: invalid comparison place value`);
          } else if (panel.kind !== 'image' || !registered.has(panel.image?.src) || !existsSync(join('public', panel.image.src)))
            problems.push(`${prefix}: missing or unregistered comparison image`);
        }
      }
      if (
        !["multiSelect", "orderedPlacement", "gridPlacement", "singleChoice", "matching", "network", "route", "construction", "parentObservation"].includes(
          activity.kind,
        )
      ) {
        problems.push(`${prefix}: unsupported kind`);
        continue;
      }
      if (
        activity.kind === "multiSelect" &&
        (!activity.expectedTokenIds.every((id) => tokens.has(id)) ||
          new Set(activity.expectedTokenIds).size !==
            activity.expectedTokenIds.length)
      )
        problems.push(`${prefix}: invalid selection answer`);
      if (activity.kind === "orderedPlacement") {
        if (!Number.isInteger(activity.slotCount) || activity.slotCount < 1)
          problems.push(`${prefix}: invalid slot count`);
        if (
          activity.evaluation.kind === "sequence" &&
          (activity.evaluation.tokenIds.length !== activity.slotCount ||
            !activity.evaluation.tokenIds.every((id) => tokens.has(id)))
        )
          problems.push(`${prefix}: invalid sequence`);
        if (activity.evaluation.kind === "constraints") {
          if (
            activity.tokenUse !== "once" ||
            activity.slotCount !== tokens.size
          )
            problems.push(
              `${prefix}: constraint ordering requires each token once`,
            );
          for (const rule of activity.evaluation.rules) {
            if (
              rule.type === "position" &&
              (!tokens.has(rule.tokenId) ||
                !rule.positions.length ||
                rule.positions.some(
                  (p) =>
                    !Number.isInteger(p) || p < 0 || p >= activity.slotCount,
                ))
            )
              problems.push(`${prefix}: invalid position rule`);
            if (
              rule.type !== "position" &&
              (!tokens.has(rule.first) ||
                !tokens.has(rule.second) ||
                rule.first === rule.second)
            )
              problems.push(`${prefix}: invalid relation`);
          }
          if (
            !activity.cluesFromIllustration && JSON.stringify(activity.clues) !==
            JSON.stringify(activity.evaluation.rules.map((rule) => rule.text))
          )
            problems.push(`${prefix}: visible clues differ from the rules`);
          if(activity.cluesFromIllustration&&!activity.illustration)problems.push(`${prefix}: visual ordering needs an illustration`);
        }
      }
      if (activity.kind === "gridPlacement") {
        const pyramid = activity.presentation?.pyramid;
        if (pyramid && (activity.evaluation.kind !== 'exact' || activity.tokenUse !== 'unlimited'
          || pyramid.baseTokenIds.length < 2 || !pyramid.baseTokenIds.every(id => tokens.has(id))
          || pyramid.rowSizes.length !== pyramid.baseTokenIds.length - 1
          || pyramid.rowSizes.some((size, index) => size !== pyramid.baseTokenIds.length - index - 1)
          || pyramid.rowSizes.reduce((a,b) => a+b,0) !== activity.cells.length
          || !pyramid.choiceIds.length || new Set(pyramid.choiceIds).size !== pyramid.choiceIds.length
          || !pyramid.choiceIds.every(id => tokens.has(id))
          || Object.values(activity.evaluation.cells ?? {}).some(id => !pyramid.choiceIds.includes(id))))
          problems.push(`${prefix}: invalid pyramid layers or palette`);
        if (
          activity.columns < 1 ||
          activity.cells.length % activity.columns ||
          !activity.cells.some((id) => id === null) ||
          activity.cells.some((id) => id !== null && !tokens.has(id))
        )
          problems.push(`${prefix}: invalid grid`);
        if (activity.evaluation.kind === "exact") {
          const required = activity.cells.flatMap((value, index) =>
            value === null ? [`cell-${index}`] : [],
          );
          if (
            Object.keys(activity.evaluation.cells).length !== required.length ||
            required.some((key) => !tokens.has(activity.evaluation.cells[key]))
          )
            problems.push(`${prefix}: missing/extra exact cell answers`);
        } else if (
          !activity.evaluation.tokenIds.every((id) => tokens.has(id)) ||
          new Set(activity.evaluation.tokenIds).size !== activity.columns
        )
          problems.push(`${prefix}: invalid Latin symbols`);
      }
      if (activity.protocol.kind === "memory") {
        const length =
          activity.kind === "orderedPlacement"
            ? activity.slotCount
            : activity.kind === "gridPlacement"
              ? activity.cells.length
              : activity.protocol.preview.length;
        if (
          (!(activity.protocol.audioText || activity.protocol.soundSrc) && (!length || activity.protocol.preview.length !== length)) ||
          !activity.protocol.preview.every((id) => tokens.has(id)) ||
          activity.protocol.observeMs < 1000 ||
          activity.protocol.retainMs < 0
        )
          problems.push(`${prefix}: invalid memory protocol`);
        if(activity.protocol.audioLocale==='en-US'&&!manifest.entries.some(e=>e.text===activity.protocol.audioText&&e.locale==='en-US'&&e.voice?.startsWith('en-US-')))problems.push(`${prefix}: missing English stimulus voice`);
        if(activity.protocol.soundSrc&&!existsSync(join('public',activity.protocol.soundSrc)))problems.push(`${prefix}: missing non-language sound`);
        if (
          activity.kind === "gridPlacement" &&
          activity.cells.some((id) => id !== null)
        )
          problems.push(
            `${prefix}: pilot memory must not leave fixed recall clues`,
          );
      }
      const solutions = activitySolutions(activity);
      solutionCounts[prefix] = solutions.length;
      if (!solutions.length) problems.push(`${prefix}: no solution`);
    }
  }
  for (const line of activityVoiceLines(activitySets)) {
    if (!linesByText.has(normalize(line.text)))
      problems.push(`Missing exported activity speech: ${line.text}`);
    if (!manifestText.has(normalize(line.text)))
      problems.push(`Missing local activity voice: ${line.text}`);
  }
  return {
    problems,
    solutionCounts,
    activitySets: activitySets.length,
    activities: activitySets.reduce(
      (sum, group) => sum + group.rounds.length,
      0,
    ),
  };
}
function normalize(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/([。？！])。/g, "$1")
    .trim();
}
