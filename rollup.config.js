import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import typescript from 'rollup-plugin-typescript';

const version = process.env.VERSION || require('./package.json').version;

const banner = `/**
 * Blocke Router v${version}
 * (C) 2017-${new Date().getFullYear()} Niek Saarberg
 * Released under the MIT License.
 */`;

const external = ['react', 'prop-types', 'history/createHashHistory', 'path-to-regexp'];

const plugins = [
	resolve({
		extensions: ['.js', '.jsx'],
	}),
	commonjs({
		include: ['node_modules/**'],
	}),
	babel({
		exclude: 'node_modules/**', // only transpile our source code
	}),
];

export default [
	{
		input: 'src/index.js',
		output: {
			file: 'dist/blockle-router.esm.js',
			format: 'es',
			banner,
			sourcemap: true,
		},
		external,
		plugins,
	},
	{
		input: 'src/index.js',
		output: {
			file: 'dist/blockle-router.common.js',
			format: 'cjs',
			banner,
			sourcemap: true,
		},
		external,
		plugins,
	},
];
