/* eslint-disable @typescript-eslint/naming-convention */
const {resolve} = require('path');

module.exports.transform = () => ({
    '\\.(ts|js|mjs|css|html)$': resolve(__dirname, 'file-transformer.js'),
});
