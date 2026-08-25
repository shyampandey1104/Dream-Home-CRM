// Universal Cross-Browser Microphone Recorder (WAV 16-bit PCM & MediaRecorder)
// Works on iOS Safari, Android Chrome, macOS Chrome & Desktop

export class UniversalAudioRecorder {
  constructor() {
    this.stream = null;
    this.audioContext = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecording = false;
    this.audioBlob = null;
    this.audioUrl = null;
    this.base64Data = null;
    this.inputSource = null;
    this.processor = null;
    this.leftChannel = [];
    this.recordingLength = 0;
    this.sampleRate = 44100;
  }

  async start() {
    this.audioChunks = [];
    this.leftChannel = [];
    this.recordingLength = 0;
    this.audioBlob = null;
    this.audioUrl = null;
    this.base64Data = null;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("Microphone access is not supported in this browser.");
    }

    // 1. Request microphone access
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    this.isRecording = true;

    // 2. Try native MediaRecorder first with broad fallback
    try {
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        const types = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/mp4",
          "audio/aac",
          "audio/ogg"
        ];
        for (const t of types) {
          if (MediaRecorder.isTypeSupported(t)) {
            mimeType = t;
            break;
          }
        }

        const options = mimeType ? { mimeType } : undefined;
        this.mediaRecorder = new MediaRecorder(this.stream, options);
        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };
        this.mediaRecorder.start(250);
        console.log("[UniversalAudioRecorder] Native MediaRecorder active with mime:", mimeType || "default");
        return;
      }
    } catch (e) {
      console.log("[UniversalAudioRecorder] MediaRecorder fallback to WebAudio PCM WAV:", e);
    }

    // 3. Fallback to Web Audio PCM WAV recording (100% compatible on Safari & older devices)
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
      this.sampleRate = this.audioContext.sampleRate;
      this.inputSource = this.audioContext.createMediaStreamSource(this.stream);
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        const input = e.inputBuffer.getChannelData(0);
        this.leftChannel.push(new Float32Array(input));
        this.recordingLength += 4096;
      };

      this.inputSource.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      console.log("[UniversalAudioRecorder] WebAudio PCM WAV active");
    } catch (err) {
      console.error("[UniversalAudioRecorder] WebAudio start failed:", err);
    }
  }

  async stop() {
    this.isRecording = false;

    // Stop native MediaRecorder if running
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      await new Promise((resolve) => {
        this.mediaRecorder.onstop = () => {
          const mime = this.mediaRecorder.mimeType || "audio/webm";
          this.audioBlob = new Blob(this.audioChunks, { type: mime });
          this.audioUrl = URL.createObjectURL(this.audioBlob);
          resolve();
        };
        try {
          this.mediaRecorder.stop();
        } catch (e) {
          resolve();
        }
      });
    } else if (this.leftChannel.length > 0) {
      // Encode PCM to WAV
      this.audioBlob = this.encodeWAV(this.leftChannel, this.recordingLength, this.sampleRate);
      this.audioUrl = URL.createObjectURL(this.audioBlob);
    }

    // Stop Web Audio Processor
    if (this.processor) {
      try { this.processor.disconnect(); } catch (e) {}
    }
    if (this.inputSource) {
      try { this.inputSource.disconnect(); } catch (e) {}
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (e) {}
    }

    // Stop all microphone stream tracks
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    // Convert blob to base64 for backend persistence
    if (this.audioBlob) {
      this.base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(this.audioBlob);
      });
    }

    return {
      blob: this.audioBlob,
      url: this.audioUrl,
      base64: this.base64Data
    };
  }

  encodeWAV(samplesArray, totalLength, sampleRate) {
    const flattened = new Float32Array(totalLength);
    let offset = 0;
    for (let i = 0; i < samplesArray.length; i++) {
      flattened.set(samplesArray[i], offset);
      offset += samplesArray[i].length;
    }

    const buffer = new ArrayBuffer(44 + flattened.length * 2);
    const view = new DataView(buffer);

    // RIFF chunk descriptor
    this.writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + flattened.length * 2, true);
    this.writeString(view, 8, "WAVE");
    // FMT sub-chunk
    this.writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    // data sub-chunk
    this.writeString(view, 36, "data");
    view.setUint32(40, flattened.length * 2, true);

    // Write PCM 16-bit samples
    let index = 44;
    for (let i = 0; i < flattened.length; i++) {
      let s = Math.max(-1, Math.min(1, flattened[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      index += 2;
    }

    return new Blob([view], { type: "audio/wav" });
  }

  writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
