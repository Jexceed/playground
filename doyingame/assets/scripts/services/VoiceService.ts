import { AudioClip, AudioSource, Node, resources } from "cc";
import type { VoiceReference } from "../models/MathIslandModels";

export class VoiceService {
  private readonly audio: AudioSource;
  private request = 0;
  constructor(host: Node) { this.audio = host.addComponent(AudioSource); this.audio.volume = 0.9; }

  play(reference: VoiceReference) {
    this.stop();
    const request = this.request;
    const path = `math-island/${reference.src.replace(/\.[^.]+$/, "")}`;
    resources.load(path, AudioClip, (error, clip) => {
      if (request !== this.request || error || !clip) return;
      this.audio.clip = clip;
      this.audio.play();
    });
  }

  stop() { this.request += 1; this.audio.stop(); this.audio.clip = null; }
}
