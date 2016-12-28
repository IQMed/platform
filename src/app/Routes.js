import React from 'react';
import {Route, Redirect, IndexRoute} from 'react-router';
import {routerActions} from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import Layout from './pages/layout/Layout';

import Home from './pages/home/Home';

import Login from './pages/misc/Login';

// redirect to /login by default
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user,
  predicate: user => user.isLogin,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

const Routes = (
    <Route>
      <Route path="/" component={UserIsAuthenticated(Layout)}>
          <Redirect from="/" to="/home"/>
          <IndexRoute component={Home}/>
          <Route path="home" component={Home}/>
      </Route>
      <Route path="login" component={Login}/>
    </Route>
);


export default Routes;