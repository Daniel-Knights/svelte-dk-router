import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

module.exports = {
    input: 'src/router/router.ts',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'dist/router.js',
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            preprocess: sveltePreprocess(),
        }),

        resolve({
            browser: true,
            dedupe: ['svelte'],
        }),
        commonjs(),
        typescript({
            sourceMap: !production,
            inlineSources: !production,
        }),

        production && terser(),
    ],
    watch: {
        clearScreen: false,
    },
};
