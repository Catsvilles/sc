export class Reverb {
    private context: AudioContext | OfflineAudioContext;
    public inputNode: GainNode;
    private reverbNode: ConvolverNode;
    private outputNode: GainNode;
    private wetGainNode: GainNode;
    private dryGainNode: GainNode;
    private options: { mix: number; time: number; decay: number; reverse: boolean };

    constructor(context: AudioContext | OfflineAudioContext, options?: { mix?: number; time?: number; decay?: number; reverse?: boolean }) {
        this.context = context;
        this.options = {
            mix: options?.mix ?? 0.5,
            time: options?.time ?? 0.01,
            decay: options?.decay ?? 0.01,
            reverse: options?.reverse ?? false
        };

        this.inputNode = this.context.createGain();
        this.reverbNode = this.context.createConvolver();
        this.outputNode = this.context.createGain();
        this.wetGainNode = this.context.createGain();
        this.dryGainNode = this.context.createGain();

        this.inputNode.connect(this.reverbNode);
        this.reverbNode.connect(this.wetGainNode);
        this.inputNode.connect(this.dryGainNode);
        this.dryGainNode.connect(this.outputNode);
        this.wetGainNode.connect(this.outputNode);

        this.setMix(this.options.mix);
        this.setTime(this.options.time);
        this.setDecay(this.options.decay);
        this.setReverse(this.options.reverse);

        this.buildImpulse();
    };

    async load(): Promise<void> {
        await this.buildImpulse();
    };

    connect(target: AudioNode): void {
        this.outputNode.connect(target);
    };

    disconnect(): void {
        this.outputNode.disconnect();
    };

    setMix(value: number): void {
        if (value < 0 || value > 1) return;
        this.options.mix = value;
        
        this.dryGainNode.gain.setValueAtTime(1, this.context.currentTime);
        this.wetGainNode.gain.setValueAtTime(value, this.context.currentTime);
    }

    setTime(value: number): void {
        if (value < 0.0001 || value > 10) return;
        this.options.time = value;
        this.buildImpulse();
    };

    setDecay(value: number): void {
        if (value < 0.0001 || value > 10) return;
        this.options.decay = value;
        this.buildImpulse();
    };

    setReverse(value: boolean): void {
        this.options.reverse = value;
        this.buildImpulse();
    };

    private async buildImpulse(): Promise<void> {
        const length = this.context.sampleRate * this.options.time;
        const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);
        let n: number;

        for (let i = 0; i < length; i++) {
            n = this.options.reverse ? length - i : i;
            impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.options.decay);
            impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, this.options.decay);
        }

        // Ensure that the reverbNode is not already connected to a buffer
        if (this.reverbNode.buffer) {
            this.inputNode.disconnect(this.reverbNode);
            this.reverbNode.disconnect(this.wetGainNode);

            this.reverbNode = this.context.createConvolver();
            this.inputNode.connect(this.reverbNode);
            this.reverbNode.connect(this.wetGainNode);
        }

        this.reverbNode.buffer = impulse;
    };
}
