export default {
  input: 'build/index.js',
  output: {
    file: 'bin/index.bundle.js',
    format: 'es',
    compact: true,
    minifyInternalExports: true
  },
  external: ['fs', 'path', 'node-fetch']
};
