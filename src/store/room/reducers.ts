import Cookies from 'js-cookie';
import {
  Room,
  RoomActionTypes,
  SET_USERS,
} from './types';

const initialState: Room = {
  users: []
};

export function userReducer(state = initialState, action: RoomActionTypes) {
  switch (action.type) {
    case SET_USERS:
      return { ...state, ...action };

    default:
      return state;
  }
}
