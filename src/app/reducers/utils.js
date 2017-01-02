import {RESET_SYS_ERROR, LOCAL_LOG, SYS_ERROR} from './ActionTypes';

export function checkStatus(dispatch) {
  return (response) => {
    if (response && response.status >= 200 && response.status < 300) {
      dispatch({type: RESET_SYS_ERROR});
      return response;
    } else if (response.status == 401) {
      //dispatch({type: LOCAL_LOG, msg: response.json().message || 'unautherization'});
      return response;
    } 

    var error = new Error(response.statusText);
    error.response = response;
    throw error;

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