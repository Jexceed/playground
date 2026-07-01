import { Volume2 } from "lucide-react";

export function GuideMascot({ onSpeak }: { onSpeak: () => void }) {
  return (
    <button className="listen-card" type="button" onClick={onSpeak} aria-label="听题">
      <Volume2 size={18} aria-hidden="true" />
      <strong>听题</strong>
    </button>
  );
}
