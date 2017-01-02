const assert = require('assert');
const path = require('path');
const compression = require('compression');

const express = require('express');
const session = require('express-session');
const MongoSessionStore = require('connect-mongodb-session')(session);
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const csp = require('express-csp-header');

//const JwtStrategy = require('passport-jwt').Strategy;
//const ExtractJwt = require('passport-jwt').ExtractJwt;

const webpackConfig = require('./webpack/webpack.config');
const config = require('./config');

/* CONFIG --------------------------------------------------------------------*/
const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
app.set('superSecret', config.secret);
mongoose.connect(config.database);
const store = new MongoSessionStore({
  uri: config.database,
  collection: 'sessions'
});
store.on('error', err => { assert.ifError(err); assert.ok(false);}); 
/* END CONFIG ----------------------------------------------------------------*/

/* AUTH CONFIG ---------------------------------------------------------------*/
/* END AUTH CONFIG -----------------------------------------------------------*/

// static resource
app.use(express.static(__dirname + '/static'));

/* MIDDLEWARES ---------------------------------------------------------------*/
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  },
  store,
  resave: false,
  saveUninitialized: false
}));
app.use(cors());
app.use(compression());
app.use(csp({
  policies: {
    'default-src': [csp.SELF],
    'script-src': [csp.SELF, csp.INLINE],
    'style-src': [csp.SELF],
    'img-src': [csp.SELF, 'data:'],
    'worker-src': [csp.NONE],
    'block-all-mixed-content': true
  }
}));
/* END MIDDLEWARES -----------------------------------------------------------*/

/* WEBPACK middleware --------------------------------------------------------*/
if (isDeveloping) {
  const compiler =webpack(webpackConfig);
  const middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      color: true,
      hash: false,
      timing: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  /*
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(
    path.resolve(__dirname, 'dist', 'index.html')));
    res.end();
  });*/
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname , 'dist', 'index.html'));
  });
}
/* END WEBPACK middleware ----------------------------------------------------*/

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});
require('./src/server/routers/api')(app);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> IQMED-PLATFORM listening on port %s', port);
});