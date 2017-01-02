import store from 'store';

import * as types from './ActionTypes';
import {checkStatus, defaultShowLocalError, throwError} from './utils';

const fetch2 = window.fetch2;

/** Login to mongoDB with email and password
  * if no expire is true; token will not be expired
  * usage: dispatch(login('username', 'password', false))
  */
export function login(email, password, noExpire=false) {
  return dispatch => {
    dispatch({type: types.LOCAL_LOG, isLoading: true});
    return fetch2('/api/login',
      {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        form: {email, password, noExpire}
      })
    .then(checkStatus(dispatch))
    .then(response => response.json())
    .then(json => {
      if (json && json.token) {
        dispatch({type: types.USER_LOGGED_IN, token: json.token, email: json.email, name: json.name});
        store.set('token', json.token);
        store.set('email', json.email);
        store.set('name', json.name);
      } else {
        defaultShowLocalError(dispatch, json.message);
      }
    }).catch(err => throwError(err, dispatch));
  };
}

/** check the auth info from localStorage
  * usage: dispatch(checkAuthentication)
  */
export function checkAuthentication() {
  const token = store.get('token');
  const email = store.get('email');
  const name = store.get('name');
  const project = store.get('project');
  if (token && email && name)
    return {type: types.USER_LOGGED_IN, token, email, name, project};
  else
    return {type: ''};
}

/** logout with token
  * usage: dispatch(logout(token));
  */
export function logout() {
  const token = store.get('token');
  return dispatch => {
    dispatch({type: types.LOCAL_LOG, isLoading: true});
    return fetch('/api/logout', {headers: {"Authorization": "JWT " + token}})
      .then(checkStatus(dispatch))
      .then(response => response.json())
      .then(json => {
        if (json.message && json.message == 'ok') {
          dispatch({type: types.USER_LOGGED_OUT});
          store.clear();
        }
      }).catch( err => throwError(err, dispatch));
  };
}