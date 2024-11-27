export class Muffle {
    public muffleNode: BiquadFilterNode;

    constructor(private audioContext: AudioContext | OfflineAudioContext, private frequencyMax: number, private frequencyMin: number) {
        this.muffleNode = this.audioContext.createBiquadFilter();
        this.muffleNode.type = 'lowpass';
        this.muffleNode.frequency.setValueAtTime( frequencyMax, this.audioContext.currentTime);
        this.muffleNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.muffleNode.Q.value = 0;
    };

    setValue(value: number): void {
        const frequency = this.mapRange(value, 0, 1, this.frequencyMax,  this.frequencyMin);        
        this.muffleNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        this.muffleNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    };

    mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    };

    connect(node: AudioNode): void {
        this.muffleNode.connect(node);
    };

    disconnect(): void {
        this.muffleNode.disconnect();
    };
};