import Axios from 'axios';
import { Dispatch } from 'redux';
import {
  UserActionTypes,
  AUTHORIZATION,
  SET_COLOR,
  PlayerColor
} from './types';

export function authorization({ name, mail }: { name: string, mail: string }) {
  return async function (dispatch: Dispatch<UserActionTypes>) {
    dispatch({
      type: AUTHORIZATION,
      name: name,
      mail: mail,
      isAuthorized: true,
    });
    Axios.post('/api/users', { user: { username: name, email: mail, password: '1111' } }).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.error(error);
    })
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
