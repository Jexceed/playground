import './math-evidence.css';

export function PlaceValueBlocks({ tens, ones }: { tens: number; ones: number }) {
  return <div className="math-place-value">
    <div className="math-place-value-pieces" role="img" aria-label="长条和小方块">
      {tens > 0 && <div className="math-tens">{Array.from({ length: tens }, (_, i) => <span className="math-ten-rod" key={i}>{Array.from({ length: 10 }, (_, n) => <i key={n} />)}</span>)}</div>}
      {ones > 0 && <div className="math-ones">{Array.from({ length: ones }, (_, i) => <span key={i} />)}</div>}
    </div>
    <p className="math-place-value-key"><span>一长条代表10</span><span>一小块代表1</span></p>
  </div>;
}
