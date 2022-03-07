// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import scss from "rollup-plugin-scss";

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
        scss()
        // resolve({
        //     dedupe: [ 'preact', 'preact/hooks' ]
        // })
    ],
};
