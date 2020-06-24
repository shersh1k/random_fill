import { Dice, PlayerColor, GameArray, TypeCell, iConfig, Dices, iPlayer } from '../store/game/types';
import { TCell, Cell } from '.';
import { iPosition, iRectangleCells } from './interfaces';

export function makeFieldMatrix(y: number, x: number, color?: PlayerColor): GameArray {
  const fieldMatrix: GameArray = [];
  for (let iX = 0; iX < x; iX++) {
    const firstLevelArray: Array<TypeCell | null> = [];
    for (let iY = 0; iY < y; iY++) firstLevelArray.push(color ? { color, opacity: 1 } : null);
    fieldMatrix.push(firstLevelArray);
  }
  return fieldMatrix;
}

export function getRandomInt(max: number = 6): Dice {
  return (Math.floor(Math.random() * max) + 1) as Dice;
}

export function autofilling(fieldMatrix: GameArray, color: PlayerColor) {
  const boolArr = fieldMatrix.map((itemY, iY) => {
    return itemY.map((itemX, iX) => {
      if (itemX?.color === color) return new TCell(true, itemX.opacity);
      if (itemX === null) return new TCell(null, 1);
      else return new TCell(false, itemX.opacity);
    });
  });
  if (boolArr.flat().filter((item) => item.content === false).length) {
    let a = fillTrue(boolArr);
    a.forEach((item, iY) =>
      item.forEach((item, iX) => {
        if (item.content === true) fieldMatrix[iY][iX] = { color, opacity: item.opacity };
      })
    );
  }
}

export function fillTrue(gameField: Array<Array<TCell>>): TCell[][] {
  gameField.forEach((itemY, iY) =>
    itemY.forEach((itemX, iX) => {
      if (gameField[iY][iX].content === false) return;
      else {
        checkSiblings(gameField, { y: iY, x: iX });
        gameField.forEach((item, iY) =>
          item.forEach((item, iX) => {
            if (item.content === '?') {
              gameField[iY][iX].content = true;
              gameField[iY][iX].opacity = 0.5;
            }
          })
        );
      }
    })
  );
  return gameField;
}

export function checkSiblings(gameField: Array<Array<TCell>>, { x, y }: iPosition): boolean {
  if (gameField[y][x].content === true || isInsideField(x, y, gameField)) return true;

  const top = new Cell(x, y - 1);
  const right = new Cell(x + 1, y);
  const bottom = new Cell(x, y + 1);
  const left = new Cell(x - 1, y);
  const siblingCellsArr = [top, right, bottom, left];

  if (siblingCellsArr.filter((item) => item.currentContent(gameField)?.content === false).length > 0) {
    siblingCellsArr.forEach((item) => {
      if (item.currentContent(gameField) !== undefined && item.currentContent(gameField).content !== true)
        gameField[item.y][item.x].content = false;
    });
    if (gameField[y][x] !== undefined && gameField[y][x].content !== true) gameField[y][x].content = false;
    gameField.forEach((item, iY) =>
      item.forEach((item, iX) => {
        if (item.content === '?') gameField[iY][iX].content = false;
      })
    );
    return false;
  } else {
    gameField[y][x].content = '?';
    const arr = siblingCellsArr.filter((item) => {
      if (
        item.currentContent(gameField) === undefined ||
        item.currentContent(gameField).content === true ||
        item.currentContent(gameField).content === '?'
      )
        return true;
      if (item.currentContent(gameField).content === null) {
        return checkSiblings(gameField, { x: item.x, y: item.y });
      }
      return false;
    });
    return arr.length >= 4;
  }
}

export function isInsideField(x: number, y: number, field: TCell[][]) {
  if (y < 0 || x < 0 || y >= field.length || x >= field[0].length) return true;
  return false;
}

export function isFirstMove(count?: number) {
  return count === 0;
}

export function isInsideGameField(geometry: DOMRect, currentFigureX: number, currentFigureY: number) {
  const insideX = geometry.left < currentFigureX && geometry.right > currentFigureX;
  const insideY = geometry.top < currentFigureY && geometry.bottom > currentFigureY;
  if (insideX && insideY) return true;
  return false;
}

export function isInCorner(rectCoord: iRectangleCells, { x, y }: iConfig) {
  if (
    (rectCoord.xStart <= 0 && rectCoord.yStart <= 0) ||
    (rectCoord.xEnd === x && rectCoord.yStart <= 0) ||
    (rectCoord.xStart === 0 && rectCoord.yEnd === y) ||
    (rectCoord.xEnd === x && rectCoord.yEnd === y)
  )
    return true;
  return false;
}

export function isOverEdge(rectCoord: iRectangleCells, { x, y }: iConfig) {
  if (rectCoord.xStart < 0 || rectCoord.xEnd > x || rectCoord.yStart < 0 || rectCoord.yEnd > y) return true;
  return false;
}

export function setRectangleCells(mouseOverCellX: number, mouseOverCellY: number, dice: Dices): iRectangleCells {
  return {
    xStart: Math.round(mouseOverCellX - dice[0] / 2),
    xEnd: Math.round(mouseOverCellX + dice[0] / 2),
    yStart: Math.round(mouseOverCellY - dice[1] / 2),
    yEnd: Math.round(mouseOverCellY + dice[1] / 2),
  };
}

export function isInsertByRules(field: GameArray, figure: iRectangleCells, player: iPlayer, isFirstMove: boolean) {
  if (isFirstMove) return true;
  const siblingCells = field.reduce((acc, itemY, iY, arr) => {
    if (figure.yStart - 1 === iY || iY === figure.yEnd)
      acc.push(...itemY.filter((itemX, iX) => figure.xStart <= iX && iX < figure.xEnd));
    if (figure.yStart <= iY && iY < figure.yEnd) {
      acc.push(...itemY.filter((itemX, iX) => figure.xStart - 1 === iX || iX === figure.xEnd));
    }
    return acc;
  }, []);
  const cellsUnderFigure = field.reduce((acc, itemY, iY, arr) => {
    if (figure.yStart <= iY && iY < figure.yEnd)
      acc.push(...itemY.filter((itemX, iX) => figure.xStart <= iX && iX < figure.xEnd));
    return acc;
  }, []);
  if (cellsUnderFigure.filter((item) => item).length > 0) return false;
  if (siblingCells.filter((item) => item?.color === player.color).length > 0) return true;
  return false;
}

export function fillFieldMatrix(fieldMatrix: GameArray, rectCoord: iRectangleCells, color: PlayerColor, isFM: boolean) {
  const newFieldMatrix = fieldMatrix.map((item, indexY) => {
    if (rectCoord.yStart <= indexY && indexY < rectCoord.yEnd) {
      return item.map((item, indexX) => {
        if (rectCoord.xStart <= indexX && indexX < rectCoord.xEnd) return { color: color, opacity: 0.5 };
        return item ? Object.assign({}, item) : null;
      });
    }
    return item.slice();
  });
  if (!isFM) autofilling(newFieldMatrix, color);
  return newFieldMatrix;
}
