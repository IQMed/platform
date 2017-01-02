import {
  SYS_ERROR, RESET_SYS_ERROR, SYS_LOG, RESET_SYS_LOG,
  RESET_LOCAL_LOG, LOCAL_LOG, LOCATION_CHANGE
} from './ActionTypes';
import update from 'immutability-helper';

const initialState = {
  type: '',
  msg: '',
  isLoading: false
};

const sysReducer = (state = initialState, action) => {
  switch(action.type) {
    case SYS_ERROR:
      return update(state, {type: {$set: 'error'}, msg: {$set: action.msg}, isLoading: {$set: false}});
    case SYS_LOG:
      return update(state, {type: {$set: 'info'}, msg: {$set: action.msg}, isLoading: {$set: action.isLoading}});
    case LOCAL_LOG:
      return update(state, {type: {$set: 'local'}, msg: {$set: action.msg}, isLoading: {$set: action.isLoading}});
    case RESET_SYS_ERROR:
    case RESET_SYS_LOG:
      return update(state, {msg: {$set:''}, isLoading: {$set: false}});
    case RESET_LOCAL_LOG:
      return update(state, {type: {$set: ''},msg: {$set: ''}, isLoading: {$set: false}});
    case LOCATION_CHANGE:
      // used action.payload
      //if (action.payload.pathname.startsWith('/om'))
      //  return Object.assign({}, state, {structure: {selectRef: null}, tree: {selectRef: null}, node: {selectRef: null}});
      return update(state, {type: {$set: ''},msg: {$set: ''}, isLoading: {$set: false}});
    default:
      return state;
  }
};

export default sysReducer;