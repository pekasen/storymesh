// rollup.config.js
import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: {
        // dir: 'dist',
        format: 'cjs',
        file: 'dist/bundle.js',
        sourcemap: 'inline'
    },
    plugins: [
        typescript({
            emitDeclarationOnly: false
        }),
        // resolve({
        //     dedupe: [ 'preact', 'preact/hooks' ]
        // })
    ],
};
