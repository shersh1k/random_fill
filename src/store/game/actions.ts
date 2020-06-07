import { Dispatch } from 'redux';
import {
  ROLL_THE_DICE,
  GameActionTypes,
  Dice,
  ROTATE_FIGURE,
  Dices,
  iConfig,
  SET_CONFIG,
  iPlayer,
  PlayerColor,
  GameArray,
  SET_FIGURE_POSITION,
  SET_FIELD_MATRIX,
  SET_FINAL_FIGURE_POSITION,
  SET_TEMP_FIELD_MATRIX,
  SET_PLAYER,
  SET_CELL_SIDES,
  SET_NEW_GAME,
} from './types';
import { getRandomInt, makeFieldMatrix } from '../../Helpers';

export function rollTheDice(playerColor?: PlayerColor) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    const firstDice: Dice = getRandomInt();
    const secondDice: Dice = getRandomInt();
    dispatch({
      type: ROLL_THE_DICE,
      dice: [firstDice, secondDice],
      currentFigure: makeFieldMatrix(firstDice, secondDice, playerColor),
    });
  };
}

export function rotateFigure(dices: Dices, playerColor?: PlayerColor) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    const firstDice = dices[1];
    const secondDice = dices[0];
    dispatch({
      type: ROTATE_FIGURE,
      dice: [firstDice, secondDice],
      currentFigure: makeFieldMatrix(firstDice, secondDice, playerColor),
    });
  };
}

export function setConfig(config: iConfig) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    const players: Array<iPlayer> = config.players.map(
      (item, index) => ({ name: item, color: ['Red', 'Green', 'Yellow', 'Blue'][index], count: 0 } as iPlayer)
    );
    const currentPlayer = players[getRandomInt(players.length) - 1];
    dispatch({
      type: SET_CONFIG,
      config: config,
      fieldMatrix: makeFieldMatrix(config.x, config.y),
      tempFieldMatrix: makeFieldMatrix(config.x, config.y),
      players: players,
      currentPlayer: currentPlayer,
    });
  };
}

export function setFigurePosition(x: number, y: number) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_FIGURE_POSITION,
      currentFigureX: x,
      currentFigureY: y,
    });
  };
}

export function setFieldMatrix(newFieldMatrix: GameArray) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_FIELD_MATRIX,
      fieldMatrix: newFieldMatrix,
    });
  };
}

export function setTempFieldMatrix(newFieldMatrix: GameArray) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_TEMP_FIELD_MATRIX,
      tempFieldMatrix: newFieldMatrix,
    });
  };
}

export function setFinalFigurePosition(newFieldMatrix: GameArray) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_FINAL_FIGURE_POSITION,
      tempFieldMatrix: newFieldMatrix,
    });
  };
}

export function setPlayer(player: iPlayer) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_PLAYER,
      dice: null,
      currentFigure: null,
      currentPlayer: player,
    });
  };
}

export function setCellSides(width: number, height: number) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_CELL_SIDES,
      cellWidth: width,
      cellHeight: height,
    });
  };
}

export function setNewGame() {
  return function (dispatch: Dispatch<GameActionTypes>) {
    dispatch({
      type: SET_NEW_GAME,
      config: null,
    });
  };
}
