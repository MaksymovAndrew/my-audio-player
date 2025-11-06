import Drawer from './Drawer';

class SoundDriver {
  private readonly audiFile;

  private drawer?: Drawer;

  private context: AudioContext;

  private gainNode?: GainNode = undefined; // sound volume controller

  private audioBuffer?: AudioBuffer = undefined;

  private bufferSource?: AudioBufferSourceNode = undefined; // audio buffer source, to play the sound

  private startedAt = 0;

  private pausedAt = 0;

  private isRunning = false;

  private currentVolume = 1;

  constructor(audioFile: Blob) {
    this.audiFile = audioFile;
    this.context = new AudioContext();
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
      reader.readAsArrayBuffer(this.audiFile);
      reader.onload = (event: ProgressEvent<FileReader>) =>
        this.loadSound(event).then(buffer => {
          this.audioBuffer = buffer;
          this.drawer = new Drawer(buffer, parent);
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

    await this.context.suspend();

    this.pausedAt = reset ? 0 : this.context.currentTime - this.startedAt;
    this.bufferSource.stop(this.pausedAt);
    this.bufferSource.disconnect();
    this.gainNode.disconnect();

    this.isRunning = false;

    if (reset) {
      this.drawer?.resetCursor();
    }
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
}

export default SoundDriver;