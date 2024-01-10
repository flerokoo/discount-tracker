const esbuild = require("esbuild");
const tscPlugin = require("esbuild-plugin-tsc");

esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  minify: false,
  plugins: [tscPlugin()],
  platform: 'node',
  outfile: 'dist/index.js',
  keepNames: true,
  // logLevel: 'verbose'
});