import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { gameReducer } from './game/reducers';
import { GameState } from './game/types';

export const store = createStore(
  combineReducers({
    game: gameReducer,
  }),
  applyMiddleware(thunkMiddleware, logger)
);

export interface iState {
  game: GameState;
}
