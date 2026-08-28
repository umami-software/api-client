import ts from 'rollup-plugin-ts';

/** Emit a package.json next to the bundle so Node picks the right module type without warnings. */
function moduleType(type) {
  return {
    name: 'module-type',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'package.json',
        source: JSON.stringify({ type }, null, 2),
      });
    },
  };
}

export default {
  input: 'src/index.ts',
  external: ['node:crypto', 'crypto', 'jsonwebtoken', 'debug'],
  output: [
    {
      file: 'dist/cjs/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      plugins: [moduleType('commonjs')],
    },
    {
      file: 'dist/esm/index.js',
      format: 'esm',
      sourcemap: true,
      plugins: [moduleType('module')],
    },
  ],
  plugins: [ts({ tsconfig: 'tsconfig.json' })],
};
