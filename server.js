const express = require('express');
const path = require('path');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const uuid = require('uuid/v4');
const ExtractJwt = require('passport-jwt').ExtractJwt;

const webpackConfig = require('./webpack/webpack.config');
const config = require('./config');
const Account = require('./src/server/models/account');
const Session = require('./src/server/models/session');

/* CONFIG --------------------------------------------------------------------*/
const app = express();
const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;
app.set('superSecret', config.secret);
mongoose.connect(config.database);
/* END CONFIG ----------------------------------------------------------------*/

/* AUTH CONFIG ---------------------------------------------------------------*/
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
  },
  (payload, next) => {
    Session.findOne({authId: payload.jti}, (err, session) => {
      if (err) return next(err, false);
      if (session) {
        Account.findOne({email: session.email}, (err, account) => {
          if (err) return next(err, false);
          if (account) return next(null, {authId: payload.jti, email: account.email, name: account.name});
          else return next(null, false);
        });
      }
      else return next(null, false);
    });
  }
));
/* END AUTH CONFIG -----------------------------------------------------------*/

/* MIDDLEWARES ---------------------------------------------------------------*/
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());
app.use(compression());
/* END MIDDLEWARES -----------------------------------------------------------*/

// static resource
app.use(express.static(__dirname + '/static'));

// webpack middleware
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
    res.write(middleware.fileSystem.readFileSync(path.resolve(__dirname, 'dist', 'index.html')));
    res.end();
  });*/
} else {
  app.use(express.static(__dirname + '/dist'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname , 'dist', 'index.html'));
  });
}

/* API ROUTES ----------------------------------------------------------------*/
var apiRoutes = express.Router();

// route (GET http://localhost:8080/api/)
apiRoutes.get('/', (req, res) => {
  res.json({ message: 'Welcome to IQMED-PLATFORM!'});
});

// route return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', (req, res) => {
  Account.find({}, (err, users) => {
    res.json(users);
  });
});

// debug only
apiRoutes.get('/setup', (req, res) => {
  var user = new Account({
    email: 'nodtem66@gmail.com',
    name: 'Jirawat I',
    password: '123456789'
  });
  user.save( err => {
    if (err) throw err;
    console.log('User saved successfully');
    res.json({success: true});
  });
});

apiRoutes.post('/login', (req, res) => {
  var email, password;
  
  if (req.body.email && req.body.password) {
    email = req.body.email;
    password = req.body.password;
  } else {
    return res.status(401).json({message: 'invalid parameters'});
  }

  Account.findOne({email}, (err, account) => {
    if (err) {
      return res.status(401).json({message: 'internal server error', err});
    }
    
    account.verifyPassword(password, (err, valid) => {
      if (err)
        return res.status(401).json({message: 'internal server error', err});
      if (valid) {
        const authId = uuid();
        var session = new Session({email: account.email, authId});
        session.save( err => {
          if (err) throw err;
          const payload = {sub: account.email, name: account.name};
          const token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: '3h',
            jwtid: authId
          });
          return res.json({message: "ok", token, email: account.email, name: account.name});
        });
      } else {
        res.status(401).json({message: 'authentication fail'});
      }
    });
  });
});

apiRoutes.get('/logout', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (req.user)
    Session.remove({authId: req.user.authId}, err => {
      if (err) return res.status(500).json({message: "internal server error: cannot remove session with token id"});
      else return res.json({message: "ok"});    
    });
  else
    return res.status(500).json({message: "internal server error: missing `user` key in request"});
});
app.use('/api', apiRoutes);
/* END API ROUTES ------------------------------------------------------------*/


// end webpack middleware

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }
  console.info('==> IQMED-PLATFORM listening on port %s', port);
});