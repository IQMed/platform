require('es6-promise').polyfill();
require('isomorphic-fetch');
window.fetch2 = require("fetch-formify")(fetch);

require.ensure([], function(require){
    require('./Router.js');
});
