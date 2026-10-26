/**
 * ระบบเสียงสังเคราะห์ด้วย Web Audio API (ไม่ต้องพึ่งพาไฟล์เสียงภายนอก เล่นได้ 100% ทุกอุปกรณ์)
 * Sound Manager for Adventure Game
 */

class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.bgmNoteIndex = 0;

    // โหลดสถานะการปิดเสียงจาก localStorage
    const savedMute = localStorage.getItem('thai_game_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
  }

  // เริ่มต้น Audio Context เมื่อผู้ใช้กดปุ่มครั้งแรก (ตามนโยบายเบราว์เซอร์)
  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('thai_game_muted', this.isMuted);
    if (this.isMuted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
    return this.isMuted;
  }

  // เสียงกดปุ่ม (Click Pop)
  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // เสียงดาว / เหรียญ (Coin / Star Chime)
  playStar() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.26);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // เสียงปรบมือยินดี + ชัยชนะ (Applause & Correct Fanfare)
  playCorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      // 1. Fanfare คอร์ดใสๆ
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = this.audioCtx.currentTime;

      chord.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.18, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.45);
      });

      // 2. เสียงปรบมือสังเคราะห์ (Rhythmic Clap bursts)
      for (let c = 0; c < 12; c++) {
        const clapTime = now + 0.15 + c * 0.07 + (Math.random() * 0.03);
        this.synthesizeClap(clapTime);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  synthesizeClap(time) {
    if (!this.audioCtx) return;
    try {
      // White noise buffer
      const bufferSize = this.audioCtx.sampleRate * 0.06;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Bandpass filter for clapping crispness
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200 + Math.random() * 400;
      filter.Q.value = 1.5;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(time);
      noise.stop(time + 0.06);
    } catch (e) {}
  }

  // เสียงให้กำลังใจเมื่อตอบผิด (Gentle Warm Chime & Cheer-up)
  playIncorrect() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // ทำนองอบอุ่น ให้กำลังใจ F4 -> A4 -> C5 (เมเจอร์ คอร์ด อบอุ่น)
      const notes = [349.23, 440.00, 523.25];

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.15, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.45);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.5);
      });
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // เสียงเคลียร์ด่าน / ชนะเกมสูงสุด (Grand Victory Fanfare)
  playVictory() {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      // Do Mi Sol Do (High)
      const victoryNotes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.50];
      const durations = [0.15, 0.15, 0.15, 0.25, 0.25, 0.7];
      let offset = 0;

      victoryNotes.forEach((freq, i) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + offset);

        const dur = durations[i];
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + dur);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + dur + 0.05);

        offset += (i === 2 ? 0.3 : 0.18);
      });

      // ปรบมือรัวๆ ฉลอง
      for (let c = 0; c < 20; c++) {
        const clapTime = now + 0.8 + c * 0.06;
        this.synthesizeClap(clapTime);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // ดนตรีประกอบพื้นหลัง (Cute 8-bit / Marimba BGM loop)
  startBGM() {
    if (this.isMuted || this.bgmPlaying) return;
    this.init();
    if (!this.audioCtx) return;

    this.bgmPlaying = true;
    const melody = [
      261.63, 329.63, 392.00, 329.63,
      293.66, 349.23, 440.00, 349.23,
      329.63, 392.00, 523.25, 392.00,
      392.00, 349.23, 329.63, 293.66
    ];

    const playNextNote = () => {
      if (!this.bgmPlaying || this.isMuted || !this.audioCtx) return;

      const freq = melody[this.bgmNoteIndex % melody.length];
      this.bgmNoteIndex++;

      try {
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.3);
      } catch (e) {}

      this.bgmTimer = setTimeout(playNextNote, 320);
    };

    playNextNote();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

// สร้าง Instance หลักของระบบเสียง
window.audioMgr = new SoundManager();
