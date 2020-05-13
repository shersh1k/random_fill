import { Dice, PlayerColor } from '../store/game/types';

export function makeFieldMatrix(x: number, y: number, color?: PlayerColor): Array<Array<PlayerColor | null>> {
  const fieldMatrix: Array<Array<PlayerColor | null>> = [];
  for (let iX = 0; iX < x; iX++) {
    const firstLevelArray: Array<PlayerColor | null> = [];
    for (let iY = 0; iY < y; iY++) firstLevelArray.push(color || null);
    fieldMatrix.push(firstLevelArray);
  }
  return fieldMatrix;
}

export function getRandomInt(max: number = 6): Dice {
  return (Math.floor(Math.random() * max) + 1) as Dice;
}
