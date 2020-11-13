import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: 'src/router/index.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'dist/router.js',
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
        }),

        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
        typescript(),
        terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
