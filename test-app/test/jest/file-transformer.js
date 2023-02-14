/* eslint-disable @typescript-eslint/no-var-requires */
const swcNodeJest = require('@swc-node/jest');

module.exports = {
  getCacheKey: swcNodeJest.getCacheKey,

  process(sourceText, sourcePath, options) {
    if (/\.(html|css)$/.test(sourcePath)) {
      return {code: `module.exports = ${JSON.stringify(sourceText)}`};
    }

    if (/\.(mjs|jsx?|tsx?)$/.test(sourcePath)) {
      return swcNodeJest.process(sourceText, sourcePath, {
        ...options,
        transformerConfig: {
          swc: {
            jsc: {
              "parser": {
                "syntax": "typescript",
                "tsx": false,
                "decorators": true
              },
              "transform": {
                "legacyDecorator": true,
                "decoratorMetadata": true
              },
            }
          },
          target: 'es2015',
          module: 'commonjs',
          allowJs: true,
          esModuleInterop: true,
          dynamicImport: true,
          sourcemap: 'inline',
        },
      });
    }

    throw new Error(`extension of file ${sourcePath} not supported`)
  },
};
