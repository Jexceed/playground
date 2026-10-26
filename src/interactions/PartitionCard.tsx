import { imageGallery } from '../data/imageGallery';
import { publicAsset } from '../publicAsset';
import './math-evidence.css';

export function PartitionCard({ left, right }: { left: number; right: number }) {
  return <span className="partition-card" aria-hidden="true">
    {[left, right].map((count, index) => <span className="partition-side" key={index}>
      <span className="partition-side-title">{index === 0 ? '左盒' : '右盒'}</span>
      <span className="partition-box">{count === 0 ? <span className="partition-empty">空</span> : Array.from({ length: count }, (_, i) => <img key={i} src={publicAsset(imageGallery.items.patternBlueDisc.src)} alt="" />)}</span>
      <strong>{count} 个</strong>
    </span>)}
  </span>;
}
