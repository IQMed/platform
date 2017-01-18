// polyfill and old browser
require('es6-promise').polyfill();
require('isomorphic-fetch');
window.fetch2 = require("fetch-formify")(fetch);
// load style sheets for semantic ui

window.IQMED = {};
// load async JS of application
require.ensure([], function(require){
    require('./Router');
    require('./pages/misc/Sound');
});