import {
  GameState,
  GameActionTypes,
  ROLL_THE_DICE,
  ROTATE_FIGURE,
  SET_CONFIG,
  SET_FIGURE_POSITION,
  SET_FIELD_MATRIX,
  SET_FINAL_FIGURE_POSITION,
  SET_TEMP_FIELD_MATRIX,
  SET_PLAYER,
  SET_CELL_SIDES,
} from './types';

const initialState: GameState = {
  config: null,
  cellWidth: 0,
  cellHeight: 0,
  fieldMatrix: null,
  tempFieldMatrix: null,
  dice: null,
  currentFigure: null,
  players: null,
  currentPlayer: null,
  currentFigureX: 0,
  currentFigureY: 0,
};

export function gameReducer(state = initialState, action: GameActionTypes) {
  switch (action.type) {
    case ROLL_THE_DICE:
      return { ...state, ...action };
    case ROTATE_FIGURE:
      return { ...state, ...action };
    case SET_CONFIG:
      return { ...state, ...action };
    case SET_FIGURE_POSITION:
      return { ...state, ...action };
    case SET_FIELD_MATRIX:
      return { ...state, ...action };
    case SET_TEMP_FIELD_MATRIX:
      return { ...state, ...action };
    case SET_FINAL_FIGURE_POSITION:
      return { ...state, ...action };
    case SET_PLAYER:
      return { ...state, ...action };
    case SET_CELL_SIDES:
      return { ...state, ...action };
    default:
      return state;
  }
}
