import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import {routerReducer, syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Routes from './Routes.jsx';
import userReducer from './reducers/user';
import sysReducer from './reducers/sys';

const reducers = combineReducers({
  routing: routerReducer,
  user: userReducer,
  sys: sysReducer
});

const routingMiddleware = routerMiddleware(browserHistory);

const store = createStore(
  reducers,
  applyMiddleware(thunk, routingMiddleware)
);

const history = syncHistoryWithStore(browserHistory, store);

var rootInstance = render((
  <Provider store={store}>
    <Router history={history}>
        {Routes}
    </Router>
  </Provider>
), document.getElementById('app-root'));

if (module.hot) {
    require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: function () {
            // Help React Hot Loader figure out the root component instances on the page:
            return [rootInstance];
        }
    });
}