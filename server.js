//const assert = require('assert');
const path = require('path');
const compression = require('compression');

const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const csp = require('express-csp-header');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const methodOverride = require('method-override');
const csrf = require('csurf');


//const JwtStrategy = require('passport-jwt').Strategy;
//const ExtractJwt = require('passport-jwt').ExtractJwt;

const webpackConfig = require('./webpack/webpack.config');
const config = require('./config');
const User = require('./src/server/models/user');
const logined = require('./src/server/logics/ensureLogin.js');
const Error = require('./src/server/logics/Error');


/* CONFIG --------------------------------------------------------------------*/
const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const isSecure = (process.env.HTTPS && process.env.HTTPS !== 'false'  );
const port = process.env.PORT || 3000;
app.set('superSecret', config.secret);
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/server/views/'));
mongoose.connect(config.database);
/* END CONFIG ----------------------------------------------------------------*/

/* AUTH CONFIG ---------------------------------------------------------------*/
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  (email, password, done) => {
    User.findOne({email}, (err, account) => {
      const json = {message: 'Authentication fail'};
      if (err) return done(err);
      if (!account) return done(null, false, json);
      if (!account.verifyPasswordSync(password)) return done(null, false, json);
      return done(null, account);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, {id: user._id, name: user.name, email: user.email});
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
/* END AUTH CONFIG -----------------------------------------------------------*/

// static resource
app.use(express.static(__dirname + '/static'));

/* MIDDLEWARES ---------------------------------------------------------------*/
app.use(logger('dev'));
app.use(cookieParser());
app.use(cookieSession({name: 'qid32', secret: config.secret}));
//app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(compression());
app.use(csp({
  policies: {
    'default-src': [csp.SELF],
    'script-src': isDeveloping ? [csp.SELF, csp.INLINE, csp.EVAL] : [csp.SELF],
    'style-src': [csp.SELF, '*.googleapis.com'],
    'img-src': [csp.SELF, 'data:'],
    'font-src': [csp.SELF, 'data:', '*.gstatic.com'],
    'worker-src': [csp.NONE],
    'block-all-mixed-content': true
  }
}));
app.use(methodOverride());
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({extended: false});
const parseJson = bodyParser.json();
/* END MIDDLEWARES -----------------------------------------------------------*/

/* WEBPACK middleware --------------------------------------------------------*/
if (isDeveloping) {
  const compiler = webpack(webpackConfig);
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
}
/* END WEBPACK middleware ----------------------------------------------------*/

app.get('/',
  (req, res) => {
    res.json(req.session);
  }
);
app.get('/login', csrfProtection, (req, res) => {
  var err;
  if (req.cookies.error) {
    err = req.cookies.error;
    res.clearCookie('error');
  }
  res.render('login', {nonce: req.csrfToken(), message: err || ''});
});
app.post('/login', parseForm, csrfProtection, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if(!user) {
      res.cookie('error', 'Authentication Fail');
      res.clearCookie('_csrf');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect(req.session.returnTo || '/');
    });
  })(req, res, next);
});
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});
app.get('/test', logined,
  (req, res) => {
    res.send(req.user);
  }
);
require('./src/server/routers/api')(app);
require('./src/server/routers/project')(app);
app.use(Error.logError);
app.use(Error.clientErrorHandler);
app.use(Error.errorHandler);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> IQMED-PLATFORM listening on port %s', port);
  if (!isDeveloping) console.info('==> Running in Product Mode');
  if (isSecure) console.info('==>  Enable Secure Mode');
});