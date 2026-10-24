export class SpatialAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  
  private isAmbienceRunning = false;
  private ambientInterval: number | null = null;
  private ghostStaticNode: AudioBufferSourceNode | null = null;
  private ghostStaticGain: GainNode | null = null;

  // Motorcycle 4-Stroke Engine Sound Nodes
  private bikeEngineRunning = false;
  private bikePistonOsc: OscillatorNode | null = null;
  private bikeHarmonicOsc: OscillatorNode | null = null;
  private bikeExhaustFilter: BiquadFilterNode | null = null;
  private bikeEngineGain: GainNode | null = null;
  private bikeThrottleNoise: AudioBufferSourceNode | null = null;
  private bikeNoiseGain: GainNode | null = null;

  // Master volume settings
  private masterVol = 0.8;
  private ambientVol = 0.7;
  private sfxVol = 0.8;
  private voiceVol = 0.9;

  constructor() {
    // Initialized lazily on first user interaction to comply with browser autoplay policies
  }

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVol, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(this.ambientVol, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVol, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(this.voiceVol, this.ctx.currentTime);
      this.voiceGain.connect(this.masterGain);

      // Auto-unlock Web Audio on first user touch/click/key
      const unlockAudio = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('click', unlockAudio, { passive: true });
      window.addEventListener('touchstart', unlockAudio, { passive: true });
      window.addEventListener('keydown', unlockAudio, { passive: true });

      // Start continuous night room tone & wind
      this.startNightAmbience();
    } catch {
      // Graceful fallback if Web Audio is unsupported
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolumes(master: number, ambient: number, sfx: number, voice: number) {
    this.masterVol = master;
    this.ambientVol = ambient;
    this.sfxVol = sfx;
    this.voiceVol = voice;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) this.masterGain.gain.setValueAtTime(master, now);
    if (this.ambientGain) this.ambientGain.gain.setValueAtTime(ambient, now);
    if (this.sfxGain) this.sfxGain.gain.setValueAtTime(sfx, now);
    if (this.voiceGain) this.voiceGain.gain.setValueAtTime(voice, now);
  }

  // --- AMBIENCE GENERATOR ---
  private startNightAmbience() {
    if (!this.ctx || !this.ambientGain || this.isAmbienceRunning) return;
    this.isAmbienceRunning = true;

    // 1. Deep Sub-bass Rumble / 3 AM atmospheric tension
    const droneOsc = this.ctx.createOscillator();
    const droneFilter = this.ctx.createBiquadFilter();
    const droneGain = this.ctx.createGain();

    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(42, this.ctx.currentTime); // 42Hz low drone
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(90, this.ctx.currentTime);
    droneGain.gain.setValueAtTime(0.09, this.ctx.currentTime);

    droneOsc.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneGain.connect(this.ambientGain);
    droneOsc.start();

    // 2. Wind gust generator (pink-filtered white noise)
    const bufferSize = this.ctx.sampleRate * 2;
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.ambientGain);
    windSource.start();

    // Periodically modulate wind filter for natural gusts
    const modulateWind = () => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const targetFreq = 180 + Math.random() * 280;
      windFilter.frequency.exponentialRampToValueAtTime(targetFreq, t + 4);
    };
    setInterval(modulateWind, 4500);

    // 3. Procedural Rural Bengali Cricket Chittering & Frog Croaks
    this.ambientInterval = window.setInterval(() => {
      if (Math.random() < 0.75) {
        this.triggerCricketBurst();
      }
      if (Math.random() < 0.25) {
        this.triggerBullfrogCroak();
      }
      if (Math.random() < 0.1) {
        this.triggerOwlHoot();
      }
    }, 1800);
  }

  // Cricket chirping using high frequency FM pulse
  private triggerCricketBurst() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4500 + Math.random() * 500, now);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, now);

    // Rapid amplitude stutter
    gain.gain.setValueAtTime(0, now);
    for (let i = 0; i < 4; i++) {
      const pulseTime = now + i * 0.04;
      gain.gain.setValueAtTime(0.03, pulseTime);
      gain.gain.exponentialRampToValueAtTime(0.001, pulseTime + 0.025);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ambientGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  // Bullfrog low resonant throat pulse
  private triggerBullfrogCroak() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.35);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.04, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.36);
  }

  // Distant owl hoot
  private triggerOwlHoot() {
    if (!this.ctx || !this.ambientGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.4);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  // --- FOOTSTEPS SOUND ---
  public playFootstep(surface: 'mud' | 'puddle' | 'wood' = 'mud') {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.12, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    if (surface === 'mud') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280 + Math.random() * 60, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    } else if (surface === 'puddle') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900 + Math.random() * 200, now);
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    } else {
      // Wood hollow thump
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(180, now);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    }

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // --- FLASHLIGHT CLICK ---
  public playFlashlightClick(state: boolean) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(state ? 2200 : 1600, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- HEARTBEAT PULSE ---
  public setHeartbeatRate(panicLevel: number) { // 0 to 1
    if (!this.ctx) return;
    if (panicLevel < 0.25) {
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }
      return;
    }

    const intervalMs = Math.max(380, 1100 - panicLevel * 700);
    if (!this.heartbeatInterval) {
      this.heartbeatInterval = window.setInterval(() => {
        this.triggerHeartbeat(panicLevel);
      }, intervalMs);
    }
  }

  private triggerHeartbeat(panicLevel: number) {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(55 + panicLevel * 15, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.16);

    gain.gain.setValueAtTime(0.15 + panicLevel * 0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  // --- 3D SPATIAL SUPERNATURAL BENGALI FORMANT WHISPER & GHOST CALL (ডাক দেওয়া) ---
  public playWhisper(direction: 'behind' | 'left' | 'right' | 'front', textBn: string) {
    // 1. Bengali Speech Synthesis voice call if supported
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(textBn);
        utter.lang = 'bn-BD';
        utter.rate = 0.8;
        utter.pitch = 0.55; // Deep supernatural pitch
        utter.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('BD') || v.lang.includes('IN'));
        if (bnVoice) utter.voice = bnVoice;
        window.speechSynthesis.speak(utter);
      } catch {
        // Fallback to synthesizer
      }
    }

    if (!this.ctx || !this.voiceGain) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    const now = this.ctx.currentTime;

    // Use Web Audio PannerNode with HRTF for spatial positioning
    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1.5;
    panner.maxDistance = 30;

    if (direction === 'behind') {
      panner.positionX.setValueAtTime(0, now);
      panner.positionY.setValueAtTime(0.5, now);
      panner.positionZ.setValueAtTime(2.2, now); // directly behind player
    } else if (direction === 'left') {
      panner.positionX.setValueAtTime(-3.5, now);
      panner.positionY.setValueAtTime(0.5, now);
      panner.positionZ.setValueAtTime(-1, now);
    } else if (direction === 'right') {
      panner.positionX.setValueAtTime(3.5, now);
      panner.positionY.setValueAtTime(0.5, now);
      panner.positionZ.setValueAtTime(-1, now);
    } else {
      panner.positionX.setValueAtTime(0, now);
      panner.positionY.setValueAtTime(0.5, now);
      panner.positionZ.setValueAtTime(-2.5, now);
    }

    // 2. Chilling Eerie Vocal Synthesizer (Ghostly "Aaah... Ooh..." calling voice)
    const duration = 2.2;

    // Larynx fundamental oscillator with descending eerie pitch
    const vocalOsc = this.ctx.createOscillator();
    vocalOsc.type = 'triangle';
    vocalOsc.frequency.setValueAtTime(175, now);
    vocalOsc.frequency.exponentialRampToValueAtTime(130, now + 0.8);
    vocalOsc.frequency.exponentialRampToValueAtTime(85, now + duration);

    // Eerie vocal vibrato LFO
    const vibrato = this.ctx.createOscillator();
    const vibratoGain = this.ctx.createGain();
    vibrato.frequency.setValueAtTime(5.5, now); // 5.5 Hz ghostly tremor
    vibratoGain.gain.setValueAtTime(8, now);
    vibrato.connect(vocalOsc.frequency);
    vibrato.start(now);
    vibrato.stop(now + duration);

    // Vocal Tract Formant Filter 1 (Male/Specter chest vowel ~600Hz)
    const formant1 = this.ctx.createBiquadFilter();
    formant1.type = 'bandpass';
    formant1.frequency.setValueAtTime(580, now);
    formant1.Q.setValueAtTime(3.5, now);

    // Vocal Tract Formant Filter 2 (Nasal / throat vowel ~1350Hz)
    const formant2 = this.ctx.createBiquadFilter();
    formant2.type = 'bandpass';
    formant2.frequency.setValueAtTime(1380, now);
    formant2.Q.setValueAtTime(4.0, now);

    // Airy breath noise layer
    const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * duration), this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, now);
    noiseFilter.Q.setValueAtTime(2.0, now);

    // Output Gain Envelope (Loud & Audible)
    const voiceMaster = this.ctx.createGain();
    voiceMaster.gain.setValueAtTime(0, now);
    voiceMaster.gain.linearRampToValueAtTime(0.75, now + 0.35); // Loud and clear!
    voiceMaster.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Connect vocal synth
    vocalOsc.connect(formant1);
    formant1.connect(voiceMaster);

    vocalOsc.connect(formant2);
    formant2.connect(voiceMaster);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(voiceMaster);

    voiceMaster.connect(panner);
    panner.connect(this.voiceGain);

    vocalOsc.start(now);
    vocalOsc.stop(now + duration);
    noiseSource.start(now);
  }

  // --- GHOST SCREAM / ENRAGE ---
  public playGhostScream() {
    if (!this.ctx || !this.voiceGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(850, now);
    osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.2);
    osc1.frequency.exponentialRampToValueAtTime(320, now + 0.9);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(870, now);
    osc2.frequency.exponentialRampToValueAtTime(1620, now + 0.2);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.voiceGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.0);
    osc2.stop(now + 1.0);
  }

  // --- DOOR CREAK & UNLOCK ---
  public playDoorCreak() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(260, now + 0.4);
    osc.frequency.linearRampToValueAtTime(110, now + 0.8);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.9);
  }

  // --- BELL CHIME (FOR GRAVEYARD / GHAT) ---
  public playTempleBell() {
    if (!this.ctx || !this.sfxGain) return;
    const now = this.ctx.currentTime;

    [440, 880, 1320, 1760].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.1 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  // --- RADIO / EMF STATIC (WHEN GHOST IS NEARBY) ---
  public updateGhostProximityStatic(proximityFactor: number) { // 0 to 1
    if (!this.ctx || !this.sfxGain) return;

    if (!this.ghostStaticGain) {
      this.ghostStaticGain = this.ctx.createGain();
      this.ghostStaticGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.ghostStaticGain.connect(this.sfxGain);

      const bufferSize = this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      this.ghostStaticNode = this.ctx.createBufferSource();
      this.ghostStaticNode.buffer = noiseBuffer;
      this.ghostStaticNode.loop = true;
      this.ghostStaticNode.connect(this.ghostStaticGain);
      this.ghostStaticNode.start();
    }

    const targetGain = proximityFactor > 0.1 ? Math.min(0.22, proximityFactor * 0.22) : 0;
    this.ghostStaticGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.1);
  }

  // --- MOTORCYCLE 4-STROKE ENGINE SOUND SYNTHESIZER ---
  public startMotorcycleEngine() {
    if (!this.ctx || !this.sfxGain || this.bikeEngineRunning) return;
    this.resume();
    this.bikeEngineRunning = true;
    const now = this.ctx.currentTime;

    // Starter kick crank burst
    const crankOsc = this.ctx.createOscillator();
    const crankGain = this.ctx.createGain();
    crankOsc.type = 'sawtooth';
    crankOsc.frequency.setValueAtTime(65, now);
    crankOsc.frequency.exponentialRampToValueAtTime(15, now + 0.18);
    crankGain.gain.setValueAtTime(0.25, now);
    crankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    crankOsc.connect(crankGain);
    crankGain.connect(this.sfxGain);
    crankOsc.start(now);
    crankOsc.stop(now + 0.22);

    // 1. Primary 4-Stroke Single Cylinder Piston Oscillator (Deep thumping rumble)
    this.bikePistonOsc = this.ctx.createOscillator();
    this.bikePistonOsc.type = 'sawtooth';
    this.bikePistonOsc.frequency.setValueAtTime(24, now + 0.15); // 24 Hz idle pulse

    // 2. Combustion Chamber Second Harmonic Oscillator
    this.bikeHarmonicOsc = this.ctx.createOscillator();
    this.bikeHarmonicOsc.type = 'triangle';
    this.bikeHarmonicOsc.frequency.setValueAtTime(48, now + 0.15);

    // 3. Exhaust Muffler Resonant Filter
    this.bikeExhaustFilter = this.ctx.createBiquadFilter();
    this.bikeExhaustFilter.type = 'lowpass';
    this.bikeExhaustFilter.frequency.setValueAtTime(190, now + 0.15);
    this.bikeExhaustFilter.Q.setValueAtTime(2.8, now + 0.15);

    // 4. Engine Master Gain
    this.bikeEngineGain = this.ctx.createGain();
    this.bikeEngineGain.gain.setValueAtTime(0, now);
    this.bikeEngineGain.gain.linearRampToValueAtTime(0.35, now + 0.35); // settles into steady idle

    // 5. Air intake & exhaust flutter noise
    const noiseBufferSize = this.ctx.sampleRate * 2;
    const noiseBuf = this.ctx.createBuffer(1, noiseBufferSize, this.ctx.sampleRate);
    const noiseData = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseBufferSize; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.15;
    }
    this.bikeThrottleNoise = this.ctx.createBufferSource();
    this.bikeThrottleNoise.buffer = noiseBuf;
    this.bikeThrottleNoise.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(450, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    this.bikeNoiseGain = this.ctx.createGain();
    this.bikeNoiseGain.gain.setValueAtTime(0.04, now);

    this.bikeThrottleNoise.connect(noiseFilter);
    noiseFilter.connect(this.bikeNoiseGain);
    this.bikeNoiseGain.connect(this.bikeEngineGain);

    this.bikePistonOsc.connect(this.bikeExhaustFilter);
    this.bikeHarmonicOsc.connect(this.bikeExhaustFilter);
    this.bikeExhaustFilter.connect(this.bikeEngineGain);
    this.bikeEngineGain.connect(this.sfxGain);

    this.bikePistonOsc.start(now + 0.12);
    this.bikeHarmonicOsc.start(now + 0.12);
    this.bikeThrottleNoise.start(now + 0.12);
  }

  public updateMotorcycleEngine(throttle: number, speedRatio: number) {
    if (!this.ctx || !this.bikeEngineRunning || !this.bikePistonOsc || !this.bikeHarmonicOsc || !this.bikeExhaustFilter || !this.bikeEngineGain) return;
    const now = this.ctx.currentTime;

    // RPM calculations: 23 Hz (idle) up to 80 Hz (revving full speed)
    const clampedThrottle = Math.max(0, Math.min(1, throttle));
    const clampedSpeed = Math.max(0, Math.min(1, speedRatio));

    const targetFreq = 23 + (clampedThrottle * 32) + (clampedSpeed * 28);
    const targetHarmonic = targetFreq * 2.0;
    const targetFilterCutoff = 190 + (clampedThrottle * 420) + (clampedSpeed * 320);
    const targetGain = 0.32 + (clampedThrottle * 0.18) + (clampedSpeed * 0.12);

    this.bikePistonOsc.frequency.setTargetAtTime(targetFreq, now, 0.08);
    this.bikeHarmonicOsc.frequency.setTargetAtTime(targetHarmonic, now, 0.08);
    this.bikeExhaustFilter.frequency.setTargetAtTime(targetFilterCutoff, now, 0.09);
    this.bikeEngineGain.gain.setTargetAtTime(targetGain, now, 0.08);

    if (this.bikeNoiseGain) {
      const noiseGainTarget = 0.04 + (clampedThrottle * 0.12);
      this.bikeNoiseGain.gain.setTargetAtTime(noiseGainTarget, now, 0.08);
    }
  }

  public stopMotorcycleEngine() {
    if (!this.ctx || !this.bikeEngineRunning) return;
    this.bikeEngineRunning = false;
    const now = this.ctx.currentTime;

    if (this.bikeEngineGain) {
      this.bikeEngineGain.gain.linearRampToValueAtTime(0, now + 0.25);
    }

    setTimeout(() => {
      try {
        this.bikePistonOsc?.stop();
        this.bikePistonOsc?.disconnect();
        this.bikeHarmonicOsc?.stop();
        this.bikeHarmonicOsc?.disconnect();
        this.bikeThrottleNoise?.stop();
        this.bikeThrottleNoise?.disconnect();
      } catch {
        // cleanup safety
      }
      this.bikePistonOsc = null;
      this.bikeHarmonicOsc = null;
      this.bikeExhaustFilter = null;
      this.bikeEngineGain = null;
      this.bikeThrottleNoise = null;
      this.bikeNoiseGain = null;
    }, 280);
  }

  public dispose() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioManager = new SpatialAudioEngine();
