import type { CSSProperties } from "react";
import type { ActivityToken } from "../domain/activity";
import type { GalleryImage } from "../data/imageGallery";
import { publicAsset } from "../publicAsset";

export function ActivityImage({ image, className = "", decorative = false }: { image: GalleryImage; className?: string; decorative?: boolean }) {
  if (image.frame) {
    const { columns, rows, index } = image.frame;
    return <span className={`activity-picture-frame ${className}`} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : image.alt} aria-hidden={decorative || undefined}>
      <img src={publicAsset(image.src)} alt="" draggable={false} style={{ width: `${columns * 100}%`, height: `${rows * 100}%`, maxWidth: "none", left: `${-(index % columns) * 100}%`, top: `${-Math.floor(index / columns) * 100}%` } as CSSProperties} />
    </span>;
  }
  return <img className={className} src={publicAsset(image.src)} alt={decorative ? "" : image.alt} width={image.width} height={image.height} draggable={false} />;
}

export function ActivityTokenArt({ token, label = false }: { token?: ActivityToken; label?: boolean }) {
  if (!token) return <span className="slot-question">?</span>;
  if (token.quantityPicture) return <div className="memory-quantity-picture"><ActivityImage image={token.quantityPicture.image} /><div aria-label={`${token.quantityPicture.count}个圆点`}>{Array.from({ length: token.quantityPicture.count }, (_, i) => <span className="quantity-dot" key={i} />)}</div></div>;
  if (token.textOnly) return <span className={`activity-text-card${Array.from(token.label).length > 5 ? ' is-phrase' : ''}`}>{token.label}</span>;
  return <><ActivityImage image={token.image} className={`activity-token-image${token.image.style === 'illustration' ? ' is-illustration' : ''}`} decorative={label} />{label && <span className="token-label">{token.label}</span>}</>;
}
