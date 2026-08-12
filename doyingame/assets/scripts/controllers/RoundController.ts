import type { MathRound, RoundState } from "../models/MathIslandModels";

export type RoundResult = { kind: "retry"; message: string } | { kind: "correct"; message: string };

export class RoundController {
  state: RoundState = "idle";
  selected: string | null = null;
  private locked = false;

  constructor(public round: MathRound) {}

  select(value: string) {
    if (this.locked || this.state === "correct" || !this.round.choices.some((choice) => choice.value === value)) return false;
    this.selected = value;
    this.state = "selected";
    return true;
  }

  check(): RoundResult | null {
    if (this.locked || !this.selected) return null;
    this.locked = true;
    this.state = "checking";
    if (this.selected === this.round.answer) {
      this.state = "correct";
      this.locked = false;
      return { kind: "correct", message: this.round.success };
    }
    this.selected = null;
    this.state = "retry";
    this.locked = false;
    return { kind: "retry", message: this.round.retry };
  }

  replaceRound(round: MathRound) {
    if (this.locked) return false;
    this.round = round;
    this.selected = null;
    this.state = "idle";
    return true;
  }
}
