import { Dispatch } from 'redux';
import {
  RoomActionTypes,
  SET_USERS,
} from './types';

export function setUsers() {
  return function (dispatch: Dispatch<RoomActionTypes>) {
    dispatch({
      type: SET_USERS,
    });
  };
}
