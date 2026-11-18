import { useEffect, useState } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { imageGallery } from "../data/imageGallery";
import { checkFairShare, FAIR_SHARE_COPY, fairShareInventory } from "../domain/fair-share";
import { publicAsset } from "../publicAsset";
import { playTone, speak } from "../speech";
import type { BoardAttempt, GameRound } from "../types";
import "./sharing-boards.css";

function Pieces({ count, item }: { count: number; item: "cupcake" | "block" }) {
  return <span className="sharing-pieces" aria-hidden="true">
    {Array.from({ length: count }, (_, i) =>
      <img key={i} src={publicAsset(imageGallery.items[item].src)} alt="" draggable={false} />)}
  </span>;
}

export function BlockPartitionBoard({ round, solved }: { round: GameRound; solved: boolean }) {
  const [blue, yellow] = round.visualGroups!;
  const known = blue.items.length;
  const other = yellow.items.length;
  return <section className="block-partition-board" aria-label="一组积木分进两个盒子">
    <strong className="partition-total">两盒一共 {known + other} 块</strong>
    <div className="block-partition-boxes">
      <div className="block-box is-blue"><strong>蓝盒 · {known} 块</strong><Pieces item="block" count={known} /></div>
      <div className="block-box is-yellow"><strong>黄盒 · {solved ? other : "?"} 块</strong><Pieces item="block" count={other} /></div>
    </div>
  </section>;
}

export function FairShareBoard({ round, solved, onChange, onReset }: {
  round: GameRound;
  solved: boolean;
  onChange: (attempt: BoardAttempt) => void;
  onReset: () => void;
}) {
  const { total, children } = fairShareInventory(round);
  const [plates, setPlates] = useState<number[]>(() => Array(children).fill(0));
  const remaining = total - plates.reduce((sum, n) => sum + n, 0);
  useEffect(() => { onChange(checkFairShare(total, plates)); }, [total, plates, onChange]);

  function moveCake(index: number, delta: 1 | -1) {
    if (solved) return;
    setPlates(previous => {
      const used = previous.reduce((sum, n) => sum + n, 0);
      if ((delta === 1 && used >= total) || (delta === -1 && !previous[index])) return previous;
      return previous.map((n, i) => i === index ? n + delta : n);
    });
    playTone("tap");
  }

  return <section className="fair-share-board" aria-label="把蛋糕分到小朋友的盘子里">
    <div className="share-instructions">
      <p>{FAIR_SHARE_COPY.tap}</p>
      <button type="button" aria-label="听分蛋糕的玩法" onClick={() => void speak(FAIR_SHARE_COPY.guide)}><Volume2 size={20} /></button>
    </div>
    <div className="share-tray" data-remaining={remaining}>
      <strong aria-live="polite">桌上还剩 {remaining} 块</strong>
      <Pieces item="cupcake" count={remaining} />
    </div>
    <div className="share-children">
      {plates.map((count, i) => <div className="share-child" key={i} data-plate={i + 1} data-count={count}>
        <button className="share-give" type="button" disabled={solved || remaining === 0}
          aria-label={`给第 ${i + 1} 位小朋友分一块蛋糕，盘里已有 ${count} 块`} onClick={() => moveCake(i, 1)}>
          <span className="share-person"><img src={publicAsset(imageGallery.items.child.src)} alt="" /><span>第 {i + 1} 位</span></span>
          <span className="share-plate-target">
            <img className="share-dish-art" src={publicAsset(imageGallery.items.plate.src)} alt="" />
            {count ? <Pieces item="cupcake" count={count} /> : <b aria-hidden="true">＋</b>}
          </span>
          <strong>盘里 {count} 块</strong>
        </button>
        <button className="share-return" type="button" disabled={solved || count === 0}
          aria-label={`从第 ${i + 1} 位小朋友的盘里拿回一块蛋糕`} onClick={() => moveCake(i, -1)}>
          拿回一块
        </button>
      </div>)}
    </div>
    <button type="button" className="share-reset" onClick={onReset} disabled={remaining === total}>
      <RotateCcw size={17} />{FAIR_SHARE_COPY.reset}
    </button>
  </section>;
}
