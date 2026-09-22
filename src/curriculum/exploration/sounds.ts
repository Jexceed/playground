export type SoundEvent = {
    frequency: number;
    duration: number;
    gap: number;
    timbre: 'soft' | 'bright';
};
export const soundStimuli: Record<string, SoundEvent[]> = {};
export function sound(id: string, events: SoundEvent[]) { soundStimuli[id] = events; return `/audio/stimuli/${id}.wav`; }
export function soundSequence(id: string, sequence: number[]) { return sound(id, sequence.map(n => ({ frequency: n === 0 ? 440 : 660, duration: n === 0 ? .45 : .18, gap: .28, timbre: n === 0 ? 'soft' : 'bright' }))); }
