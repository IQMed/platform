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
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const csrf = require('csurf');

//const JwtStrategy = require('passport-jwt').Strategy;
//const ExtractJwt = require('passport-jwt').ExtractJwt;

const webpackConfig = require('./webpack/webpack.config');
const config = require('./config');
const Account = require('./src/server/models/account');
const csrfProtection = csrf({ cookie: true });

/* CONFIG --------------------------------------------------------------------*/
const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const isSecure = (process.env.HTTPS && process.env.HTTPS !== 'false'  );
const port = process.env.PORT || 3000;
app.set('superSecret', config.secret);
mongoose.connect(config.database);
const store = new MongoSessionStore({
  uri: config.database,
  collection: 'sessions'
});
store.on('error', err => { assert.ifError(err); assert.ok(false);}); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/server/views/'));
/* END CONFIG ----------------------------------------------------------------*/

/* AUTH CONFIG ---------------------------------------------------------------*/
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  (email, password, done) => {
    Account.findOne({email}, (err, account) => {
      const json = {message: 'authentication fail'};
      if (err) return done(err);
      if (!account) return done(null, false, json);
      if (!account.verifyPasswordSync(password)) return done(null, false, json);
      return done(null, account);
    });
  }
));
passport.serializeUser( (account, done) => {
  const sessionUser = {_id: account._id, name: account.name, email: account.email};
  done(null, sessionUser);
});
passport.deserializeUser( (sessionUser, done) => {
  done(null, sessionUser);
});
const ensureLogin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.returnTo = req.originUrl || req.url;
    return res.redirect('/login');
  }
  next();
};
/* END AUTH CONFIG -----------------------------------------------------------*/

// static resource
app.use(express.static(__dirname + '/static'));

/* MIDDLEWARES ---------------------------------------------------------------*/
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser('156879qweasacve651hrty65n1my65usffm329[vkljaeioqwmc;asdq3=='));
app.use(session({
  secret: config.secret,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: isSecure,
    sameSite: true
  },
  store,
  name: 'iqid23',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
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
  passport.authenticate('local', {failureRedirect: '/login'}),
  (req, res) => {
    console.log(req.user, req.session);
    res.render('index');
  }
);
app.get('/login', csrfProtection, (req, res) => {
  const error = req.flash('error');
  res.render('login', {nonce: req.csrfToken(), message: error});
});
app.post('/login',
  csrfProtection,
  passport.authenticate('local', {successReturnToOrRedirect: '/', failureRedirect: '/login', failureFlash: true})
);
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});
app.get('/test', ensureLogin,
  (req, res) => {
    res.send('ok');
  }
);
require('./src/server/routers/api')(app, passport);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> IQMED-PLATFORM listening on port %s', port);
  if (!isDeveloping) console.info('==> Running in Product Mode');
  if (isSecure) console.info('==>  Enable Secure Mode');
}); 