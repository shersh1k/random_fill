import { createStore, combineReducers, applyMiddleware, Middleware, Dispatch, AnyAction } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { gameReducer } from './game/reducers';
import { GameState } from './game/types';
import { User } from './user/types';
import { userReducer } from './user/reducers';

const middlewares: Middleware<{}, any, Dispatch<AnyAction>>[] = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') middlewares.push(logger);

export const store = createStore(
  combineReducers({
    game: gameReducer,
    user: userReducer,
  }),
  applyMiddleware(...middlewares)
);

export interface iState {
  game: GameState;
  user: User
}
