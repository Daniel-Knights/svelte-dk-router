import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

module.exports = {
    input: 'src/router/index.ts',
    output: {
        format: 'umd',
        name: 'SvelteDKRouter',
        file: 'dist/router.umd.min.js',
        sourcemap: true,
    },
    plugins: [
        svelte({
            preprocess: sveltePreprocess(),
        }),
        resolve(),
        typescript(),
        terser(),
    ],
};
