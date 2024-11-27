export class Bass {
    public bassNode: BiquadFilterNode;

    constructor(private audioContext: AudioContext | OfflineAudioContext, frequency: number) {
        this.bassNode = this.audioContext.createBiquadFilter();
        this.bassNode.type = 'lowshelf';
        this.bassNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    };

    setValue(value: number): void {
        this.bassNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    };

    connect(node: AudioNode): void {
        this.bassNode.connect(node);
    };

    disconnect(): void {
        this.bassNode.disconnect();
    };
};