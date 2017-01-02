import update from 'immutability-helper';
import * as types from './ActionTypes';

const initialState = {
  email: "",
  name: "",
  token: "",
  project: null,
  isLogin: false,
};

const userReducer = (state = initialState, action) => {
  switch(action.type) 
  {
    case types.USER_LOGGED_IN:
      return update(state, {
        email: {$set: action.email},
        name: {$set: action.name},
        token: {$set: action.token},
        project: {$set: action.project},
        isLogin: {$set: true}
      });
    case types.USER_LOGGED_OUT:
      return initialState;
    case types.SELECT_PROJECT:
      return update(state, {
        project: {$set: action.project}
      });
    default:
      return state;
  }
};

export default userReducer;