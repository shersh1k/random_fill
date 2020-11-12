export const SET_USERS = 'SET_USERS';

export interface Room {
  users: iUser[];
}

interface iUser {
  email: string;
  name: string;
}

interface SetUsers {
  type: typeof SET_USERS;
}

export type RoomActionTypes =
  | SetUsers;
