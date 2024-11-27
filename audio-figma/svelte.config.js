import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/kit/vite';

import path from 'path';
import 'dotenv/config';

const __dirname = path.resolve();
const projectDir = path.resolve(__dirname);
const srcDir = path.resolve(projectDir, "src");
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		vitePreprocess({
			postcss: true,
			scss: {includePaths: ["node_modules","src"]}
		})
	],
	kit: {
		adapter: adapter(),
		alias: {
			'@components': path.resolve(srcDir, './editor/components'),
			'@app': path.resolve(srcDir, './editor'),
			'@api': path.resolve(srcDir, './editor/api'),
		}
	},
};

export default config;
