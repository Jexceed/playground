import { Volume2 } from "lucide-react";
import type { DialogueLine } from "../domain/activity";
import { speak } from "../speech";

export function EnglishDialogue({ lines }: { lines: DialogueLine[] }) {
  return <section className="english-dialogue" aria-label="英语对话示范">
    <h3>听一听，轮流说</h3>
    <ol>
      {lines.map((line, index) => <li key={`${index}-${line.english}`}>
        <span className="dialogue-speaker">{line.speaker}</span>
        <div className="dialogue-words">
          <p className="dialogue-english" lang="en-US">{line.english}</p>
          <p className="dialogue-meaning">{line.chinese}</p>
        </div>
        <button type="button" className="dialogue-listen" aria-label={`听${line.speaker}说英语：${line.english}`} onClick={() => void speak(line.english, "en-US")}>
          <Volume2 size={20} aria-hidden="true" /><span>听英语</span>
        </button>
      </li>)}
    </ol>
  </section>;
}
