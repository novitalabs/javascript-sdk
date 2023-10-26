import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import nodePolyfills from "rollup-plugin-polyfill-node";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace"
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "index.ts",
  output: {
    name: "@novita/sdk",
    file: pkg.browser,
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    json(),
    nodePolyfills(),
    babel({ babelHelpers: "bundled" }),
    replace({
      'process.env.VERSION': JSON.stringify(pkg.version),
    }),
  ],
  external: ['axios']
};
