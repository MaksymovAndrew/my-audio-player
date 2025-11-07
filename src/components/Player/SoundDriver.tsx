import Drawer from './Drawer';

class SoundDriver {
  private readonly audioFile;

  private drawer?: Drawer;

  private context: AudioContext;

  private gainNode?: GainNode = undefined; // sound volume controller

  private audioBuffer?: AudioBuffer = undefined;

  private bufferSource?: AudioBufferSourceNode = undefined; // audio buffer source, to play the sound

  private startedAt = 0;

  private pausedAt = 0;

  private isRunning = false;

  private currentVolume = 1;

  private startAnimationCallback?: () => void;
  private stopAnimationCallback?: () => void;

  constructor(audioFile: Blob) {
    this.audioFile = audioFile;
    this.context = new AudioContext();
  }

  public setAnimationCallbacks(start: () => void, stop: () => void) {
    this.startAnimationCallback = start;
    this.stopAnimationCallback = stop;
  }

  static showError(error: string) {
    return error;
    alert(
      'SoundParser constructor error. Can not read audio file as ArrayBuffer'
    );
  }

  public init(parent: HTMLElement | null) {
    return new Promise((resolve, reject) => {
      if (!parent) {
        reject(new Error('Parent element not found'));
        return;
      }

      const reader = new FileReader();
      reader.readAsArrayBuffer(this.audioFile);
      reader.onload = (event: ProgressEvent<FileReader>) =>
        this.loadSound(event).then(buffer => {
          this.audioBuffer = buffer;
          this.drawer = new Drawer(buffer, parent, (time: number) => {
            this.onCursorDrag(time);
          });
          resolve(undefined);
        });
      reader.onerror = reject;
    });
  }

  private loadSound(readerEvent: ProgressEvent<FileReader>) {
    if (!readerEvent?.target?.result) {
      throw new Error('Can not read file');
    }

    return this.context.decodeAudioData(
      readerEvent.target.result as ArrayBuffer
    );
  }

  public async play() {
    if (!this.audioBuffer) {
      throw new Error(
        'Play error. Audio buffer is not exists. Try to call loadSound before Play.'
      );
    }

    if (this.isRunning) {
      return;
    }

    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = this.currentVolume;

    this.bufferSource = this.context.createBufferSource();
    this.bufferSource.buffer = this.audioBuffer;

    this.bufferSource.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);

    await this.context.resume();

    const startPosition = this.pausedAt;

    this.bufferSource.start(0, startPosition);

    this.startedAt = this.context.currentTime - startPosition;
    this.pausedAt = 0;

    this.isRunning = true;

    this.drawer?.updateCursor(startPosition);
  }

  public async pause(reset?: boolean) {
    if (!this.bufferSource || !this.gainNode) {
      throw new Error(
        'Pause - bufferSource is not exists. Maybe you forgot to call Play before?'
      );
    }

    this.pausedAt = reset ? 0 : this.context.currentTime - this.startedAt;
    await this.stopAudio();

    if (reset) {
      this.drawer?.resetCursor();
    }
  }

  private async stopAudio() {
    if (!this.bufferSource || !this.gainNode) {
      return;
    }

    await this.context.suspend();
    this.bufferSource.stop();
    this.bufferSource.disconnect();
    this.gainNode.disconnect();
    this.isRunning = false;
  }

  public changeVolume(volume: number) {
    this.currentVolume = volume;

    if (!this.gainNode) {
      return;
    }

    this.gainNode.gain.value = volume;
  }

  public drawChart() {
    this.drawer?.init();
  }

  public getCurrentTime(): number {
    if (this.isRunning) {
      return this.context.currentTime - this.startedAt;
    }
    return this.pausedAt;
  }

  public getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public updateCursor() {
    if (this.isRunning) {
      this.drawer?.updateCursor(this.getCurrentTime());
    }
  }

  public async onCursorDrag(time: number) {
    if (!this.audioBuffer) {
      throw new Error('onCursorDrag error. Audio buffer is not exists.');
    }

    const duration = this.getDuration();
    const clampedTime = Math.max(0, Math.min(time, duration)); // track dimension

    const wasRunning = this.isRunning;

    if (wasRunning) {
      this.stopAnimationCallback?.();
      await this.stopAudio(); //kill old audio
    }

    this.pausedAt = clampedTime;
    this.drawer?.updateCursor(clampedTime);

    if (wasRunning) {
      await this.play();
      this.startAnimationCallback?.();
    }
  }

  public destroy() {
    this.drawer?.destroy();
    this.context.close();

    this.drawer = undefined;
    this.audioBuffer = undefined;
    this.bufferSource = undefined;
    this.gainNode = undefined;
  }
}

export default SoundDriver;