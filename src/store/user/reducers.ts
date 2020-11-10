import {
  User,
  UserActionTypes,
  AUTHORIZATION,
  SET_COLOR,
} from './types';

const initialState: User = {
  isAuthorized: false,
  name: null,
  mail: null,
  color: null
};

export function userReducer(state = initialState, action: UserActionTypes) {
  switch (action.type) {
    case AUTHORIZATION:
      return { ...state, ...action };
    case SET_COLOR:
      return { ...state, ...action };
    default:
      return state;
  }
}
