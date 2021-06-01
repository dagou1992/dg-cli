import nodeResolve from 'rollup-plugin-node-resolve'; // 帮助寻找node_modules里的包
import babel from 'rollup-plugin-babel'; // rollup 的 babel 插件，ES6转ES5
import commonjs from 'rollup-plugin-commonjs'; // 将非ES6语法的包转为ES6可用
import uglify from 'rollup-plugin-uglify'; // 压缩包
import { eslint } from 'rollup-plugin-eslint'; // eslint
import json from '@rollup/plugin-json' // json

const env = process.env.NODE_ENV;

const config = {
  input: 'src/main.js',
  output: [
    {
      banner: '#!/usr/bin/env node',
      name: 'dg',
      file: 'bin/dg.js',
      format: 'umd',
    },
  ],
  external: [
    'commander',
    'log-symbols',
    'ora',
    'chalk',
    'child_process',
    'path',
    'fs',
    'os',
    'events',
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码
      runtimeHelpers: true,
    }),
    nodeResolve(),
    commonjs(),
    eslint({
      include: ['src/**'],
      exclude: ['node_modules/**'],
    }),
    json(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

export default config;
