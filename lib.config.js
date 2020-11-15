import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

module.exports = {
    input: 'src/router/index.ts',
    output: [
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true,
        },
        {
            file: pkg.main,
            format: 'umd',
            name: 'Router',
            sourcemap: true,
        },
    ],
    plugins: [
        svelte({
            format: 'umd',
            preprocess: sveltePreprocess(),
        }),
        resolve(),
        typescript(),
        terser(),
    ],
};
