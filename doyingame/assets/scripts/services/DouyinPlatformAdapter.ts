import type { LaunchContext, PlatformAdapter, ViewportInsets } from "./PlatformAdapter";
import { LocalPlatformAdapter } from "./PlatformAdapter";

type DouyinApi = {
  getStorageSync(key: string): unknown;
  setStorageSync(key: string, value: unknown): void;
  onShow(listener: (context: LaunchContext) => void): void;
  offShow?(listener: (context: LaunchContext) => void): void;
  onHide(listener: () => void): void;
  offHide?(listener: () => void): void;
  getSystemInfoSync(): { windowWidth?: number; windowHeight?: number; safeArea?: { left: number; right: number; top: number; bottom: number } };
  checkScene(options: { scene: string; success(res: { isExist?: boolean }): void; fail(): void }): void;
  navigateToScene(options: { scene: string; success(): void; fail(error: unknown): void }): void;
};

declare const tt: DouyinApi | undefined;
declare const GameGlobal: { __THINKING_HOUSE_LATEST_SHOW__?: LaunchContext; __THINKING_HOUSE_SHOW_LISTENERS__?: Array<(context: LaunchContext) => void> } | undefined;

export function createPlatformAdapter(): PlatformAdapter {
  return typeof tt === "undefined" ? new LocalPlatformAdapter() : new DouyinPlatformAdapter(tt);
}

export class DouyinPlatformAdapter implements PlatformAdapter {
  constructor(private readonly api: DouyinApi) {}
  readStorage(key: string) { try { return this.api.getStorageSync(key); } catch { return null; } }
  writeStorage(key: string, value: unknown) { try { this.api.setStorageSync(key, value); } catch (error) { this.report("storage-write-failed", error); } }
  getLatestLaunchContext() { return typeof GameGlobal !== "undefined" ? GameGlobal.__THINKING_HOUSE_LATEST_SHOW__ ?? null : null; }
  onShow(listener: (context: LaunchContext | null) => void) {
    if (typeof GameGlobal !== "undefined") {
      const listeners = GameGlobal.__THINKING_HOUSE_SHOW_LISTENERS__ ??= [];
      const typed = listener as (context: LaunchContext) => void;
      listeners.push(typed);
      return () => { const index = listeners.indexOf(typed); if (index >= 0) listeners.splice(index, 1); };
    }
    const typed = listener as (context: LaunchContext) => void;
    this.api.onShow(typed);
    return () => this.api.offShow?.(typed);
  }
  onHide(listener: () => void) { this.api.onHide(listener); return () => this.api.offHide?.(listener); }
  getViewport(): ViewportInsets {
    const info = this.api.getSystemInfoSync();
    const width = info.windowWidth ?? 750;
    const height = info.windowHeight ?? 1334;
    const safe = info.safeArea;
    return {
      width, height,
      safeTop: safe?.top ?? 0,
      safeLeft: safe?.left ?? 0,
      safeRight: safe ? Math.max(0, width - safe.right) : 0,
      safeBottom: safe ? Math.max(0, height - safe.bottom) : 0,
    };
  }
  checkSidebar() { return new Promise<boolean>((resolve) => this.api.checkScene({ scene: "sidebar", success: (res) => resolve(res.isExist === true), fail: () => resolve(false) })); }
  async navigateToSidebar() {
    if (!(await this.checkSidebar())) return "unsupported" as const;
    return new Promise<"opened" | "failed">((resolve) => this.api.navigateToScene({ scene: "sidebar", success: () => resolve("opened"), fail: () => resolve("failed") }));
  }
  isSidebarLaunch(context: LaunchContext | null) { return context?.scene === "021036" || (context?.launch_from === "homepage" && context?.location === "sidebar_card"); }
  report(event: string, details?: unknown) { console.info(`[thinking-house] ${event}`, details ?? ""); }
}
