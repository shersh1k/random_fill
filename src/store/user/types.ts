export const REGISTRATION = 'REGISTRATION';
export const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTRATION_FAIL = 'REGISTRATION_FAIL';
export const AUTHORIZATION = 'AUTHORIZATION';
export const AUTHORIZATION_SUCCESS = 'AUTHORIZATION_SUCCESS';
export const AUTHORIZATION_FAIL = 'AUTHORIZATION_FAIL';
export const LOGOUT = 'LOGOUT'
export const SET_COLOR = 'SET_COLOR';

export interface User {
  isAuthorized: boolean;
  isLoading: boolean;
  name: string | null;
  mail: string | null;
  color: PlayerColor | null;
  token: string | null;
  error?: Error;
}

export type PlayerColor = 'Red' | 'Green' | 'Yellow' | 'Blue';

interface Registration {
  type: typeof REGISTRATION;
  isLoading: true;
  isAuthorized: false;
}

interface RegistrationSuccess {
  type: typeof REGISTRATION_SUCCESS;
  isLoading: false;
  name: string;
  mail: string;
  isAuthorized: true;
}

interface RegistrationFail {
  type: typeof REGISTRATION_FAIL;
  isLoading: false;
  isAuthorized: false;
  error: Error;
}

interface Authorization {
  type: typeof AUTHORIZATION;
  isLoading: true;
  isAuthorized: false;
}

interface AuthorizationSuccess {
  type: typeof AUTHORIZATION_SUCCESS;
  isLoading: false;
  name: string;
  mail: string;
  isAuthorized: true;
}

interface AuthorizationFail {
  type: typeof AUTHORIZATION_FAIL;
  isLoading: false;
  isAuthorized: false;
  error: Error;
}

interface Logout {
  type: typeof LOGOUT;
  isAuthorized: false;
  isLoading: false;
  name: null;
  mail: null;
  color: null;
  token: null;
}

interface SetColor {
  type: typeof SET_COLOR;
  color: PlayerColor;
}

export type UserActionTypes =
  | Authorization
  | AuthorizationSuccess
  | AuthorizationFail
  | Registration
  | RegistrationSuccess
  | RegistrationFail
  | Logout
  | SetColor;
