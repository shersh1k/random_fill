import Cookies from 'js-cookie';
import {
  User,
  UserActionTypes,
  AUTHORIZATION,
  SET_COLOR,
  AUTHORIZATION_SUCCESS,
  AUTHORIZATION_FAIL,
  LOGOUT,
  REGISTRATION,
  REGISTRATION_SUCCESS,
  REGISTRATION_FAIL,
} from './types';

const token = Cookies.get('UserToken');
const mail = Cookies.get('UserEmail');
const name = Cookies.get('UserName');

const initialState: User = {
  mail: mail || null,
  token: token || null,
  name: name || null,
  isAuthorized: mail && token && name ? true : false,
  isLoading: false,
  color: null,
};

export function userReducer(state = initialState, action: UserActionTypes) {
  switch (action.type) {
    case AUTHORIZATION:
      return { ...state, ...action };
    case AUTHORIZATION_SUCCESS:
      return { ...state, ...action };
    case AUTHORIZATION_FAIL:
      return { ...state, ...action };

    case REGISTRATION:
      return { ...state, ...action };
    case REGISTRATION_SUCCESS:
      return { ...state, ...action };
    case REGISTRATION_FAIL:
      return { ...state, ...action };

    case LOGOUT:
      return { ...state, ...action };

    case SET_COLOR:
      return { ...state, ...action };
    default:
      return state;
  }
}
