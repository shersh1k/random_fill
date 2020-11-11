import Axios from 'axios';
import { Dispatch } from 'redux';
import {
  UserActionTypes,
  AUTHORIZATION,
  AUTHORIZATION_SUCCESS,
  AUTHORIZATION_FAIL,
  REGISTRATION,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
  LOGOUT,
  SET_COLOR,
  PlayerColor,
} from './types';
import { notification } from "antd";
import Cookies from 'js-cookie';

export function authorization({ mail, password }: { mail: string, password: string }) {
  return async function (dispatch: Dispatch<UserActionTypes>) {
    dispatch({
      type: AUTHORIZATION,
      isAuthorized: false,
      isLoading: true
    });
    Axios.post('/api/users/login', { user: { email: mail, password: password } }).then((res) => {
      Cookies.set('UserToken', res.data.user.token, { expires: 7 });
      Cookies.set('UserEmail', res.data.user.email, { expires: 7 });
      Cookies.set('UserName', res.data.user.username, { expires: 7 });
      dispatch({
        type: AUTHORIZATION_SUCCESS,
        name: res.data.user.username,
        mail: res.data.user.email,
        isAuthorized: true,
        isLoading: false
      });
    }).catch((error) => {
      dispatch({
        type: AUTHORIZATION_FAIL,
        isAuthorized: false,
        isLoading: false,
        error: error
      });
      notification['error']({
        message: 'Error!',
        description: error.response.data
      })
    })
  };
}

export function registration({ name, mail }: { name: string, mail: string }) {
  return async function (dispatch: Dispatch<UserActionTypes>) {
    dispatch({
      type: REGISTRATION,
      isAuthorized: false,
      isLoading: true
    });
    Axios.post('/api/users', { user: { email: mail, username: name, password: '1111' } }).then((res) => {
      Cookies.set('UserToken', res.data.user.token, { expires: 7 });
      Cookies.set('UserEmail', res.data.user.email, { expires: 7 });
      Cookies.set('UserName', res.data.user.username, { expires: 7 });
      dispatch({
        type: REGISTRATION_SUCCESS,
        name,
        mail,
        isAuthorized: true,
        isLoading: false
      });
    }).catch((error) => {
      dispatch({
        type: REGISTRATION_FAIL,
        isAuthorized: false,
        isLoading: false,
        error: error
      });
      notification['error']({
        message: 'Error!',
        description: error.response.data
      })
    })
  };
}

export function logout() {
  return function (dispatch: Dispatch<UserActionTypes>) {
    dispatch({
      type: LOGOUT,
      mail: null,
      name: null,
      token: null,
      isAuthorized: false,
      isLoading: false,
      color: null,
    });
  };
}

export function setColor(color: PlayerColor) {
  return function (dispatch: Dispatch<UserActionTypes>) {
    dispatch({
      type: SET_COLOR,
      color: color,
    });
  };
}
