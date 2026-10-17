import type { DrumKit, DrumPiece } from "./kits";

type SourceHandle = {
  source: AudioBufferSourceNode;
  gain: GainNode;
};

export class DrumAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private compressor: DynamicsCompressorNode | null = null;
  private buffers = new Map<string, Map<DrumPiece, AudioBuffer>>();
  private loading = new Map<string, Promise<void>>();
  private activeSources = new Set<SourceHandle>();
  private activeOpenHiHats = new Set<SourceHandle>();
  private volume = 0.82;
  private muted = false;
  private destroyed = false;

  private ensureContext(): AudioContext {
    if (this.context) return this.context;

    const AudioContextConstructor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) throw new Error("Web Audio is not supported in this browser.");

    const context = new AudioContextConstructor({ latencyHint: "interactive" });
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -8;
    compressor.knee.value = 12;
    compressor.ratio.value = 5;
    compressor.attack.value = 0.002;
    compressor.release.value = 0.12;
    master.connect(compressor);
    compressor.connect(context.destination);

    this.context = context;
    this.master = master;
    this.compressor = compressor;
    this.applyVolume();
    return context;
  }

  async preload(kit: DrumKit): Promise<void> {
    if (this.buffers.has(kit.id)) return;
    const existing = this.loading.get(kit.id);
    if (existing) return existing;

    const context = this.ensureContext();
    const pending = Promise.all(
      Object.entries(kit.pieces).map(async ([piece, asset]) => {
        const response = await fetch(asset.audio);
        if (!response.ok) throw new Error(`Unable to load ${asset.audio}`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        return [piece as DrumPiece, buffer] as const;
      }),
    )
      .then((entries) => {
        if (!this.destroyed) this.buffers.set(kit.id, new Map(entries));
      })
      .catch((error) => {
        this.loading.delete(kit.id);
        throw error;
      });

    this.loading.set(kit.id, pending);
    return pending;
  }

  async play(kit: DrumKit, piece: DrumPiece): Promise<void> {
    const context = this.ensureContext();
    if (context.state === "suspended") await context.resume();
    if (!this.buffers.has(kit.id)) await this.preload(kit);
    if (this.destroyed) return;

    const buffer = this.buffers.get(kit.id)?.get(piece);
    if (!buffer || !this.master) return;

    if (piece === "close_hh") this.chokeOpenHiHat();

    const source = context.createBufferSource();
    const gain = context.createGain();
    const handle = { source, gain };
    source.buffer = buffer;
    source.connect(gain);
    gain.connect(this.master);
    this.activeSources.add(handle);
    if (piece === "open_hh") this.activeOpenHiHats.add(handle);

    source.addEventListener("ended", () => {
      this.activeSources.delete(handle);
      this.activeOpenHiHats.delete(handle);
      source.disconnect();
      gain.disconnect();
    });
    source.start();
  }

  setVolume(volume: number): void {
    this.volume = Math.min(1, Math.max(0, volume));
    this.applyVolume();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyVolume();
  }

  async suspend(): Promise<void> {
    if (this.context?.state === "running") await this.context.suspend();
  }

  async destroy(): Promise<void> {
    this.destroyed = true;
    for (const handle of this.activeSources) {
      try {
        handle.source.stop();
      } catch {
        // The source may already have ended.
      }
    }
    this.activeSources.clear();
    this.activeOpenHiHats.clear();
    if (this.context && this.context.state !== "closed") await this.context.close();
    this.context = null;
    this.master = null;
    this.compressor = null;
  }

  private applyVolume(): void {
    if (!this.master || !this.context) return;
    const value = this.muted ? 0 : this.volume ** 2;
    this.master.gain.setTargetAtTime(value, this.context.currentTime, 0.01);
  }

  private chokeOpenHiHat(): void {
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const handle of this.activeOpenHiHats) {
      handle.gain.gain.cancelScheduledValues(now);
      handle.gain.gain.setValueAtTime(handle.gain.gain.value, now);
      handle.gain.gain.linearRampToValueAtTime(0, now + 0.035);
      try {
        handle.source.stop(now + 0.04);
      } catch {
        // The source may already have ended.
      }
    }
    this.activeOpenHiHats.clear();
  }
}
