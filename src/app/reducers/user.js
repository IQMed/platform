import update from 'immutability-helper';
import * as types from './userActions';

const initialState = {
  email: "",
  name: "",
  token: "",
  isLogin: false
};

const userReducer = (state = initialState, action) => {
  switch(action.type) 
  {
    case types.USER_LOGGED_IN:
      return update(state, {
        email: {$set: action.email},
        name: {$set: action.name},
        token: {$set: action.token},
        isLogin: {$set: true}
      });
    case types.USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;