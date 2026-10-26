import { imageGallery } from '../data/imageGallery';
import { publicAsset } from '../publicAsset';
import './math-evidence.css';

export function MoneyPiece({ value }: { value: number }) {
  const coin = value === 1;
  return <span className={`math-money-piece ${coin ? 'is-coin' : 'is-note'}`} role="img" aria-label={`${value}元${coin ? '硬币' : '纸币'}`}>
    <img src={publicAsset((coin ? imageGallery.items.mathPlayCoin : imageGallery.items.mathPlayNote).src)} alt="" />
    <strong>{value}<span>元</span></strong>
  </span>;
}

export function MoneyCollection({ values }: { values: number[] }) {
  return <span className="math-money-collection">{values.map((value, index) => <MoneyPiece value={value} key={index} />)}</span>;
}
