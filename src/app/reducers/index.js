import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import user from './user';
import sys from './sys';

const rootReducer = combineReducers({
  user,
  sys,
  routing: routerReducer
});

export default rootReducer;
