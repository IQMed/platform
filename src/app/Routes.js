import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {routerActions} from 'react-router-redux';
import { UserAuthWrapper } from 'redux-auth-wrapper';

import Layout from './pages/layout/Layout';

import Home from './pages/home';
import ProjectPage from './pages/project';
import ProfilePage from './pages/ProfilePage';

import Blank from './pages/misc/Blank';

// filter: login
// redirect to /login by default
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.user,
  predicate: user => user.isLogin,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

// filter: force the user to choose the project first
const ProjectIsSelected = UserAuthWrapper({
  authSelector: state => state.user,
  predicate: user => user.project,
  redirectAction: routerActions.replace,
  failureRedirectPath: '/project',
  wrapperDisplayName: 'ProjectIsSelected'
});

const Routes = (
    <Route>
      <Route path="/" component={UserIsAuthenticated(Layout)}>
        <IndexRoute component={ProjectIsSelected(Home)}/>
        <Route path="project" component={ProjectPage}/>
        <Route path="profile" component={ProfilePage}/>
      </Route>
      <Route path="login" component={Blank}/>
    </Route>
);


export default Routes;