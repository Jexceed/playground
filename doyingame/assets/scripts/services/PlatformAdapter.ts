export type LaunchContext = Record<string, unknown>;
export type ViewportInsets = { width: number; height: number; safeTop: number; safeRight: number; safeBottom: number; safeLeft: number };

export interface PlatformAdapter {
  readStorage(key: string): unknown;
  writeStorage(key: string, value: unknown): void;
  getLatestLaunchContext(): LaunchContext | null;
  onShow(listener: (context: LaunchContext | null) => void): () => void;
  onHide(listener: () => void): () => void;
  getViewport(): ViewportInsets;
  checkSidebar(): Promise<boolean>;
  navigateToSidebar(): Promise<"opened" | "unsupported" | "cancelled" | "failed">;
  isSidebarLaunch(context: LaunchContext | null): boolean;
  report(event: string, details?: unknown): void;
}

export class LocalPlatformAdapter implements PlatformAdapter {
  readStorage(key: string): unknown {
    try { const raw = globalThis.localStorage?.getItem(key); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  writeStorage(key: string, value: unknown): void {
    try { globalThis.localStorage?.setItem(key, JSON.stringify(value)); } catch (error) { this.report("storage-write-failed", error); }
  }
  getLatestLaunchContext(): LaunchContext | null { return null; }
  onShow(): () => void { return () => undefined; }
  onHide(): () => void { return () => undefined; }
  getViewport(): ViewportInsets {
    const width = globalThis.innerWidth || 750;
    const height = globalThis.innerHeight || 1334;
    return { width, height, safeTop: 0, safeRight: 0, safeBottom: 0, safeLeft: 0 };
  }
  async checkSidebar() { return false; }
  async navigateToSidebar() { return "unsupported" as const; }
  isSidebarLaunch() { return false; }
  report(event: string, details?: unknown) { console.info(`[thinking-house] ${event}`, details ?? ""); }
}
