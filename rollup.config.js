// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';

export default {
    input: 'src/index.ts',
    output: {
        // dir: 'dist',
        format: 'cjs',
        file: 'dist/bundle.js',
        sourcemap: 'inline'
    },
    plugins: [
        typescript(),
        // resolve({
        //     dedupe: [ 'preact', 'preact/hooks' ]
        // })
    ],
};
