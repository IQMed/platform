import React from 'react';
import {render} from 'react-dom';
import {Router, hashHistory} from 'react-router';
import {Provider} from 'react-redux';
import {syncHistoryWithStore, routerMiddleware} from 'react-router-redux';
import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import Routes from './Routes';
import rootReducer from './reducers';
import {checkAuthentication} from './reducers/userActions';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

const routingMiddleware = routerMiddleware(hashHistory);

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk, routingMiddleware))
);
// load authentication from localStorage
store.dispatch(checkAuthentication());

const history = syncHistoryWithStore(hashHistory, store);

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
  module.hot.accept('./reducers', () =>
    store.replaceReducer(require('./reducers').default)
  );
}
