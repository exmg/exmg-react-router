import resolve from 'rollup-plugin-node-resolve';
import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

const banner = `/**
 * exmg-react-router v${pkg.version}
 * (C) 2017-${new Date().getFullYear()} ${pkg.author}
 * Released under the MIT License.
 */`;

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const plugins = [
  typescript(),
  resolve({
    extensions: ['.ts', '.tsx'],
  }),
];

export default [{
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  output: [
	{
      banner,
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      banner,
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js', '.ts'],
    }),
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ]
}];
