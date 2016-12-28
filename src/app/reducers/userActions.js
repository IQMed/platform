/* SideBar Action */
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';
/* LOGGING Message in top header menu */
export const SYS_ERROR = 'SYS_ERROR';
export const RESET_SYS_ERROR = 'RESET_SYS_ERROR';
export const SYS_LOG = 'SYS_LOG';
export const RESET_SYS_LOG = 'RESET_SYS_LOG';
export const LOCAL_LOG = 'LOCAL_LOG';
export const RESET_LOCAL_LOG = 'RESET_LOCAL_LOG';
/* User action */
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

export function checkStatus(dispatch) {
  return (response) => {
    if (response && response.status >= 200 && response.status < 300) {
      dispatch({type: RESET_SYS_ERROR});
      return response;
    } else if (response.status == 401) {
      dispatch({type: LOCAL_LOG, msg: response.json().message || 'unautherization'});
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      dispatch({type: SYS_ERROR, msg: 'network connection error'});
      throw error;
    }
  };
}

export function throwError(err, dispatch) {
  if (err) 
    console.error(err);
  defaultShowError(dispatch, err);
}

export function defaultShowError(dispatch, msg = 'network connection error') {
  dispatch({type: SYS_ERROR, msg});
}

export function defaultShowLocalError(dispatch, msg = 'internal server error') {
  dispatch({type: LOCAL_LOG, msg});
}

export function serialize(obj) {
  return Object.keys(obj)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
    .join('&');
}

export function login(email, password) {
  return dispatch => {
    return fetch2('/api/login',
      {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        form: {email, password}
      })
    .then(checkStatus(dispatch))
    .then(response => response.json())
    .then(json => {
      if (json && json.token) {
        dispatch({type: USER_LOGGED_IN, token: json.token, email: json.email, name: json.name});
      } else {
        defaultShowLocalError(dispatch, json.message);
      }
    }).catch(err => throwError(err, dispatch));
  };
}