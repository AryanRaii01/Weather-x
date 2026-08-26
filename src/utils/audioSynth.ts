// Ambient Nature Synthesizer using Web Audio API
// Synthesizes soothing organic wind breeze, rain, and harmonic ambient tones

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private lfoNode: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private chimeTimer: any = null;
  private analyser: AnalyserNode | null = null;

  public init() {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Fade in master
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.35, now + 2);

    // Create 5-second buffer of pink/brown noise
    const bufferSize = this.ctx.sampleRate * 5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Resonant bandpass filter to model wind breeze in leaves / mountain valley
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(380, now);
    this.filterNode.Q.setValueAtTime(2.5, now);

    // Slow LFO to modulate breeze intensity
    this.lfoNode = this.ctx.createOscillator();
    this.lfoNode.type = 'sine';
    this.lfoNode.frequency.setValueAtTime(0.18, now); // ~5.5 second breath cycle

    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(220, now);

    this.lfoNode.connect(this.lfoGain);
    this.lfoGain.connect(this.filterNode.frequency);

    this.noiseNode.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);

    this.noiseNode.start(0);
    this.lfoNode.start(0);

    // Periodic gentle bird/crystal chime harmonics
    this.scheduleChimes();
  }

  private scheduleChimes() {
    if (!this.isPlaying) return;

    const playHarmonic = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      const freqs = [587.33, 659.25, 880.00, 1046.50, 1174.66, 1318.51];
      const randomFreq = freqs[Math.floor(Math.random() * freqs.length)];

      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomFreq, now);

      oscGain.gain.setValueAtTime(0.0001, now);
      oscGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 2.6);

      const nextDelay = 3500 + Math.random() * 4500;
      this.chimeTimer = setTimeout(playHarmonic, nextDelay);
    };

    this.chimeTimer = setTimeout(playHarmonic, 2000);
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    this.isPlaying = false;

    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }

    if (this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    }

    setTimeout(() => {
      try {
        if (this.noiseNode) {
          this.noiseNode.stop();
          this.noiseNode.disconnect();
          this.noiseNode = null;
        }
        if (this.lfoNode) {
          this.lfoNode.stop();
          this.lfoNode.disconnect();
          this.lfoNode = null;
        }
      } catch (e) {
        // ignore already stopped
      }
    }, 1300);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const ambientSound = new AmbientSoundEngine();
