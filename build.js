const { rollup } = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const { name } = require('./package.json');

async function build() {
    const bundle = await rollup({
        input: './src/index.ts',
        plugins: [
            typescript({
                clean: true,
                useTsconfigDeclarationDir: true
            }),
            babel({
                extensions: ['.js', '.ts']
            })
        ]
    });
    await bundle.write({
        file: `dist/${name}.js`,
        name: 'wfs',
        format: 'umd'
    });
}

build();
console.log('build success');