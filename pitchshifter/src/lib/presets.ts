export const presets = {
	gain: {
		name: 'volume',
		default: 0.5,
		min: 0,
		max: 1,
		step: 0.01,
		value: 1
	},
	playbackrate: {
		name: 'speed',
		default: 1,
		min: 0.1,
		max: 2,
		step: 0.1,
		value: 1
	},
	pitch: {
		name: 'pitch',
		default: 1,
		min: 0.1,
		max: 2,
		step: 0.1,
		value: 1
	},
	reverb: {
		name: 'reverb',
		default: 0,
		time: 5,
		decay: 5,
		min: 0,
		max: 1,
		step: 0.1,
		value: 0
	},
	bass: {
		name: 'bass',
		frequency: 200,
		default: 0,
		min: 0,
		max: 10,
		step: 1,
		value: 0
	},
	muffle: {
		name: 'muffle',
		default: 0,
		min: 0,
		max: 1,
		step: 0.1,
		value: 0,
		frequency: {
			min: 500,
			max: 22000
		},
	},
	fadein: {
		name: 'fade in',
		default: 0,
		min: 0,
		max: 20,
		step: 1,
		value: 0
	},
	fadeout: {
		name: 'fade out',
		default: 0,
		min: 0,
		max: 20,
		step: 1,
		value: 0
	}
}