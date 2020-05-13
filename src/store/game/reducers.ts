import { GameState, GameActionTypes, ROLL_THE_DICE, ROTATE_FIGURE, SET_CONFIG } from './types';
import { makeFieldMatrix } from '../../Utils';

const initialState: GameState = {
  config: null,
  fieldMatrix: null,
  dice: null,
  currentFigure: null,
  players: null,
  currentPlayer: null,
};

export function gameReducer(state = initialState, action: GameActionTypes) {
  switch (action.type) {
    case ROLL_THE_DICE:
      return { ...state, ...action };
    case ROTATE_FIGURE:
      return { ...state, ...action };
    case SET_CONFIG:
      return { ...state, ...action };

    default:
      return state;
  }
}
