const {resolve} = require('path');

/**
 * pipe all requires through our custom transformer. Even node_modules, so node.js doesn't choke on
 * esmodule code from angular. swc is being used to convert everything to common.js.
 */
module.exports.transform = () => ({
    '\\.(ts|js|mjs|css|html)$': resolve(__dirname, 'file-transformer.js'),
});
