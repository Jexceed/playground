import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { GalleryImage } from '../data/imageGallery';
import { ACTIVITY_COPY } from '../domain/activity';
import { ActivityImage } from './ActivityTokenArt';

/** A view of an already-visible card, independent of answer/session state. */
export function ImageViewer({ images, index, onIndexChange, onClose }: {
  images: GalleryImage[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const current = index === null ? null : images[index];
  useEffect(() => {
    if (current && !dialog.current?.open) dialog.current?.showModal();
    if (!current && dialog.current?.open) dialog.current.close();
  }, [current]);
  return <dialog ref={dialog} className="picture-viewer" aria-label={ACTIVITY_COPY.viewPicture}
    onCancel={onClose} onClose={onClose}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (index === null) return;
      if (event.key === 'ArrowLeft' && index > 0) { event.preventDefault(); onIndexChange(index - 1); }
      if (event.key === 'ArrowRight' && index < images.length - 1) { event.preventDefault(); onIndexChange(index + 1); }
    }}>
    {current && index !== null && <>
      <header><span>{index + 1} / {images.length}</span><button type="button" autoFocus onClick={onClose}><X size={18} />{ACTIVITY_COPY.closePicture}</button></header>
      <figure><ActivityImage image={current} className="picture-viewer-image" /><figcaption>{current.alt}</figcaption></figure>
      <nav aria-label="切换大图"><button type="button" disabled={index === 0} onClick={() => onIndexChange(index - 1)}><ChevronLeft size={20} />{ACTIVITY_COPY.previousPicture}</button><button type="button" disabled={index === images.length - 1} onClick={() => onIndexChange(index + 1)}>{ACTIVITY_COPY.nextPicture}<ChevronRight size={20} /></button></nav>
    </>}
  </dialog>;
}
