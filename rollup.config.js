import ts from 'rollup-plugin-ts';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        name: 'umami-api-client',
      },
      {
        file: 'dist/esm/index.js',
        format: 'esm',
      },
    ],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      ts(),
      terser({
        format: {
          comments: false,
        },
      }),
    ],
    external: ['cross-fetch'],
  },
];
