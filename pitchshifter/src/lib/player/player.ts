import audioBufferToWav from 'audiobuffer-to-wav';
import { PitchShifter } from "soundtouchjs";
import { presets } from '$lib/presets';
import { Reverb } from '$lib/effects/reverb';
import { Bass } from '$lib/effects/bass';
import { Muffle } from '$lib/effects/muffle';

export class Player {
  soundtouch!: PitchShifter;
  reverb!: Reverb;
  bass!: Bass;
  audioContext!: AudioContext;
  audioBuffer!: AudioBuffer;
  modifiedAudioBuffer!: AudioBuffer;
  gainNode!: GainNode;
  muffle!: Muffle;
  tempo: number;
  pitch: number;
  volume: number;
  bassBoost: number;
  reverbMix: number;
  fadeIn: number; 
  fadeOut: number;
  muffleFrequency: number;
  isPlaying: boolean;
  currentTime: number;

  constructor() {
    this.tempo = presets.playbackrate.value;
    this.pitch = presets.pitch.value;
    this.volume = presets.gain.value;
    this.reverbMix = presets.reverb.value;
    this.bassBoost = presets.bass.value;
    this.fadeIn = presets.fadein.value;
    this.fadeOut = presets.fadeout.value;
    this.muffleFrequency = presets.muffle.value;
    this.currentTime = 0;
    this.isPlaying = false;
  };

  fadeBuffer = (audioBuffer: AudioBuffer, attack: number, release: number, start: number = 0, end: number = this.audioBuffer.duration) => {
    const startSample = Math.floor(start * audioBuffer.sampleRate);
    const endSample = Math.floor(end * audioBuffer.sampleRate);

    // Attack and release lengths in samples
    const fadeInLength = Math.floor(attack * audioBuffer.sampleRate);
    const fadeOutLength = Math.floor(release * audioBuffer.sampleRate);

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);

        // Apply fade in
        for (let i = 0; i < fadeInLength && (startSample + i) < channelData.length; i++) {
            const fadeInPos = startSample + i;
            channelData[fadeInPos] = channelData[fadeInPos] * (i / fadeInLength);
        }

        // Apply fade out
        for (let i = 0; i < fadeOutLength && (endSample - fadeOutLength + i) < channelData.length; i++) {
            const fadeOutPos = endSample - fadeOutLength + i;
            channelData[fadeOutPos] = channelData[fadeOutPos] * (1 - (i / fadeOutLength));
        }
    }
    
    return audioBuffer;
};

  cloneAudioBuffer(from: AudioBuffer, nOfChannels : number): AudioBuffer {
    const cloned = new AudioBuffer({
      length: from.length,
      numberOfChannels: nOfChannels,
      sampleRate: from.sampleRate,
    });
    for (let i = 0; i < cloned.numberOfChannels; ++i) {
      cloned.copyToChannel(from.getChannelData(i), i);
    }
    return cloned;
  };

  // NOTE: for rendering waveform animation we just need one channel, and 2 channels for playback, that's why we have 2 similar functions
  // NOTE: otherwise execution time is doubled
  fadesAnimation = (attack: number, release: number, start: number, end: number) => {    
    let bufferCopy: AudioBuffer | null = this.cloneAudioBuffer(this.audioBuffer, 1);
    this.modifiedAudioBuffer = this.fadeBuffer(bufferCopy, attack, release, start, end);
    bufferCopy = null;
  };

  // Create original number of channels Audiobuffer for playback
  finalizeFades(progress: number, isPlaying: boolean, start: number, end: number) {    
    let bufferCopy: AudioBuffer | null = this.cloneAudioBuffer(this.audioBuffer, this.audioBuffer.numberOfChannels);
    this.modifiedAudioBuffer = this.fadeBuffer(bufferCopy, this.fadeIn, this.fadeOut, start, end);
    bufferCopy = null;
    this.isPlaying = false;
    this.disconnectSoundtouch();
    
    if (isPlaying) {
      this.play(progress);
    }
  };

  disconnectSoundtouch = () => {
    if(this.soundtouch){
      this.soundtouch.disconnect();
      this.soundtouch = null;
    };
  };

  initializeAudioContext = async (url: RequestInfo | URL) => {
    this.disconnectSoundtouch();
    this.audioContext = new AudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.modifiedAudioBuffer = this.audioBuffer;
    this.gainNode = this.audioContext.createGain();
    this.soundtouch = new PitchShifter(this.audioContext, this.audioBuffer, 2048);
    this.bass = new Bass(this.audioContext, presets.bass.frequency);
    this.muffle = new Muffle(this.audioContext, presets.muffle.frequency.max, presets.muffle.frequency.min);
    this.reverb = new Reverb(this.audioContext, {
        mix: this.reverbMix,
        time: presets.reverb.time,
        decay: presets.reverb.decay,
        reverse: false
    });
    await this.reverb.load();
    this.soundtouch.tempo = this.tempo;
    this.soundtouch.pitch = this.pitch;
    this.soundtouch.volume = this.volume;
  };

  play = (from: number = 0) => {
    if(!this.soundtouch){ 
      this.soundtouch = new PitchShifter(this.audioContext, this.modifiedAudioBuffer, 2048);
      this.soundtouch.percentagePlayed = from / 100;
      this.soundtouch.tempo = this.tempo;
      this.soundtouch.pitch = this.pitch;
      this.soundtouch.volume = this.volume;
    } else {
      this.soundtouch.connect(this.gainNode);
      this.gainNode.connect(this.reverb.inputNode);
      this.reverb.connect(this.bass.bassNode);
      this.bass.connect(this.muffle.muffleNode);
      this.muffle.connect(this.audioContext.destination);
      this.audioContext.resume();
    };
  };

  pause = () => {
      this.soundtouch.disconnect();    
  };

  renderOffline = async (start: number | undefined, end: number | undefined) => {
    if (!this.audioContext) {
      return;
    };

    let bufferToProcess;
    
    if (!start && !end) {
      bufferToProcess = this.modifiedAudioBuffer;
    } else {
      const startTime = Math.floor(start! * this.modifiedAudioBuffer.sampleRate);
      const endTime = Math.floor(end! * this.modifiedAudioBuffer.sampleRate);
      const length = endTime - startTime;

      bufferToProcess = this.audioContext.createBuffer(this.modifiedAudioBuffer.numberOfChannels, length, this.modifiedAudioBuffer.sampleRate);

      for (let channel = 0; channel < this.modifiedAudioBuffer.numberOfChannels; channel++) {
        const channelData = this.modifiedAudioBuffer.getChannelData(channel);
        bufferToProcess.copyToChannel(channelData.subarray(startTime, endTime), channel);
      };
    };
  
    const bufferLength = Math.round(bufferToProcess.duration / this.tempo);
    const offlineAudioContext = new OfflineAudioContext(
      bufferToProcess.numberOfChannels,
      bufferLength * this.audioContext.sampleRate,
      bufferToProcess.sampleRate
    );
  
    const gainNode = offlineAudioContext.createGain();
    const soundtouch = new PitchShifter(offlineAudioContext, bufferToProcess, 2048);
    soundtouch.tempo = this.tempo;
    soundtouch.pitch = this.pitch;
  
    const bass = new Bass(offlineAudioContext, presets.bass.frequency);
    bass.setValue(this.bassBoost);
  
    const muffle = new Muffle(offlineAudioContext, presets.muffle.frequency.max, presets.muffle.frequency.min);
    muffle.setValue(this.muffleFrequency);
  
    const reverb = new Reverb(offlineAudioContext, {
      mix: this.reverbMix,
      time: presets.reverb.time,
      decay: presets.reverb.decay,
      reverse: false
    });
    await reverb.load();
  
    soundtouch.connect(gainNode);
    gainNode.connect(reverb.inputNode);
    reverb.connect(muffle.muffleNode);
    muffle.connect(bass.bassNode);
    bass.connect(offlineAudioContext.destination);
  
    const resultAudioBuffer = await offlineAudioContext.startRendering();
    const wav = audioBufferToWav(resultAudioBuffer);
    const blob = new Blob([wav], { type: 'audio/wav' });
    this.downloadBlob(blob);
  };
  
  downloadBlob(blob: Blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audio.wav'; 
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a); 
  };

  changeVolume = (value: number) => {
    if(!this.audioContext){
      return
    };
    this.volume = value;
    this.gainNode.gain.value = this.volume;
  };

  changePlaybackRate = (value: number) => {
    if(!this.audioContext){
      return
    };
    this.tempo = value
    this.soundtouch.tempo = this.tempo;
  };

  changePitch = (value: number) => {
    if(!this.audioContext){
      return
    }; 
    this.pitch = value
    this.soundtouch.pitch = this.pitch;
  };

  setReverbMix = (value: number) => {
    if(!this.audioContext){
      return
    };
    this.reverbMix = value;
    this.reverb.setMix(this.reverbMix);
  };

  setBass(value: number){
    if(!this.audioContext){
      return
    };
    this.bassBoost = value;
    this.bass.setValue(this.bassBoost);
  };

  setFadeIn(value: number, start: number, end: number){
    if(!this.audioContext){
      return
    };
    this.fadeIn = value;
    this.fadesAnimation(this.fadeIn, this.fadeOut, start, end);
  };

  setFadeOut(value: number, start: number, end: number){
    if(!this.audioContext){
      return
    };
    this.fadeOut = value;
    this.fadesAnimation(this.fadeIn, this.fadeOut, start, end);
  };

  setMuffle(value: number){
    if(!this.audioContext){
      return
    };
    this.muffleFrequency = value;
    this.muffle.setValue(this.muffleFrequency);
  };
};