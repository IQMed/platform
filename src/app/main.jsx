window.jQuery = window.$ =  require("jquery");
require("jquery-ui");
require("jquery-validate");
require("bootstrap");
require("fastclick");
require("moment");
require("moment-timezone");
require("fullcalendar");
require("notification");
require("smartwidgets");
require("easy-pie");
require("sparkline");
require('jvectormap');
require('jvectormap-world-mill-en');
require('es6-promise').polyfill();
require('isomorphic-fetch');
window.fetch2 = require("fetch-formify")(fetch);

window.SMARTADMIN_GLOBALS = require('./config/config');

require.ensure([], function(require){
    require('./Router.jsx');
});
