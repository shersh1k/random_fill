export const AUTHORIZATION = 'AUTHORIZATION';
export const SET_COLOR = 'SET_COLOR';

export interface User {
  isAuthorized: boolean;
  name: string | null;
  mail: string | null;
  color: PlayerColor | null;
}

export type PlayerColor = 'Red' | 'Green' | 'Yellow' | 'Blue';

interface Authorization {
  type: typeof AUTHORIZATION;
  name: string;
  mail: string;
  isAuthorized: boolean;
}

interface SetColor {
  type: typeof SET_COLOR;
  color: PlayerColor;
}

export type UserActionTypes =
  | Authorization
  | SetColor;
