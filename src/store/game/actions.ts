import { Dispatch } from 'redux';
import { ROLL_THE_DICE, GameActionTypes, Dice, ROTATE_FIGURE, Dices, iConfig, SET_CONFIG, iPlayer } from './types';
import { getRandomInt, makeFieldMatrix } from '../../Utils';

export function rollTheDice() {
  return function (dispatch: Dispatch<GameActionTypes>) {
    const firstDice: Dice = getRandomInt();
    const secondDice: Dice = getRandomInt();
    dispatch({
      type: ROLL_THE_DICE,
      dice: [firstDice, secondDice],
      currentFigure: makeFieldMatrix(firstDice, secondDice),
    });
  };
}

export function rotateFigure(dices: Dices) {
  return function (dispatch: Dispatch<GameActionTypes>) {
    const firstDice = dices[1];
    const secondDice = dices[0];
    dispatch({
      type: ROTATE_FIGURE,
      dice: [firstDice, secondDice],
      currentFigure: makeFieldMatrix(firstDice, secondDice),
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
      players: players,
      currentPlayer: currentPlayer,
    });
  };
}
