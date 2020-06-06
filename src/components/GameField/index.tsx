import React, { useRef, useState, useEffect } from 'react';
import './GameField.css';
import { useSelector, useDispatch } from 'react-redux';
import { iState } from '../../store';
import { setTempFieldMatrix } from '../../store/game/actions';
import { iConfig, iPlayer, Dices, GameArray, PlayerColor } from '../../store/game/types';

function GameField() {
  const fieldMatrixRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  const tempFieldMatrix = useSelector((state: iState) => state.game.tempFieldMatrix);
  const cellSide = useSelector((state: iState) => state.game.cellSide);
  const config = useSelector((state: iState) => state.game.config);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const dice = useSelector((state: iState) => state.game.dice);
  const currentFigureX = useSelector((state: iState) => state.game.currentFigureX);
  const currentFigureY = useSelector((state: iState) => state.game.currentFigureY);
  const [geometry, setGeometry] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!fieldMatrixRef.current) return;
    setGeometry(fieldMatrixRef.current.getBoundingClientRect());
  }, [fieldMatrixRef]);
  useEffect(() => {
    if (!fieldMatrixRef.current || !geometry || !config || !tempFieldMatrix || !fieldMatrix || !dice || !currentPlayer)
      return;
    if (!isInsideGameField(geometry, currentFigureX, currentFigureY)) dispatch(setTempFieldMatrix(fieldMatrix));
    else {
      const mouseOverCellX = (currentFigureX - geometry.left) / cellSide;
      const mouseOverCellY = (currentFigureY - geometry.top) / cellSide;
      const rectangleCoordinates = setRectangleCells(mouseOverCellX, mouseOverCellY, dice);
      //Если фигура залазит за край поля, выходим
      if (isOverEdge(rectangleCoordinates, config)) return;
      //Если первый ход и не в углу, выходим
      const isFM = isFirstMove(currentPlayer?.count);
      if (isFM && !isInCorner(rectangleCoordinates, config)) return;
      if (!isInsertByRules(fieldMatrix, rectangleCoordinates, currentPlayer, isFM)) return;

      const newFieldMatrix = fillFieldMatrix(fieldMatrix, rectangleCoordinates, currentPlayer);
      if (!isFM) autofilling(newFieldMatrix, currentPlayer.color);
      dispatch(setTempFieldMatrix(newFieldMatrix));
    }
  }, [
    currentFigureX,
    currentFigureY,
    cellSide,
    config,
    dispatch /*currentPlayer, dice, fieldMatrix, geometry, tempFieldMatrix */,
  ]);
  return (
    <div ref={fieldMatrixRef} className='game-field'>
      {tempFieldMatrix &&
        tempFieldMatrix.map((item, index) => (
          <div key={index} className='game-field__row'>
            {item.map((item, index) => (
              <span key={index} style={{ backgroundColor: item || '' }} className='game-field__cell'></span>
            ))}
          </div>
        ))}
    </div>
  );
}

export default GameField;

const isFirstMove = (count?: number) => count === 0;

const isInsideGameField = (geometry: DOMRect, currentFigureX: number, currentFigureY: number) => {
  const insideX = geometry.left < currentFigureX && geometry.right > currentFigureX;
  const insideY = geometry.top < currentFigureY && geometry.bottom > currentFigureY;
  if (insideX && insideY) return true;
  return false;
};

const isInCorner = (rectCoord: iRectangleCells, { x, y }: iConfig) => {
  if (
    (rectCoord.xStart <= 0 && rectCoord.yStart <= 0) ||
    (rectCoord.xEnd === x && rectCoord.yStart <= 0) ||
    (rectCoord.xStart === 0 && rectCoord.yEnd === y) ||
    (rectCoord.xEnd === x && rectCoord.yEnd === y)
  )
    return true;
  return false;
};

const isOverEdge = (rectCoord: iRectangleCells, { x, y }: iConfig) => {
  if (rectCoord.xStart < 0 || rectCoord.xEnd > x || rectCoord.yStart < 0 || rectCoord.yEnd > y) return true;
  return false;
};

const setRectangleCells = (mouseOverCellX: number, mouseOverCellY: number, dice: Dices): iRectangleCells => ({
  xStart: Math.round(mouseOverCellX - dice[1] / 2),
  xEnd: Math.round(mouseOverCellX + dice[1] / 2),
  yStart: Math.round(mouseOverCellY - dice[0] / 2),
  yEnd: Math.round(mouseOverCellY + dice[0] / 2),
});

const isInsertByRules = (field: GameArray, figure: iRectangleCells, player: iPlayer, isFirstMove: boolean) => {
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
  if (siblingCells.filter((item) => item === player.color).length > 0) return true;
  return false;
};

const fillFieldMatrix = (fieldMatrix: GameArray, rectCoord: iRectangleCells, currentPlayer: iPlayer) => {
  const newFieldMatrix = fieldMatrix.map((item, indexY) => {
    if (rectCoord.yStart <= indexY && indexY < rectCoord.yEnd) {
      return item.map((item, indexX) => {
        if (rectCoord.xStart <= indexX && indexX < rectCoord.xEnd) return currentPlayer.color;
        return item;
      });
    }
    return item.slice();
  });
  return newFieldMatrix;
};

interface iRectangleCells {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}

const autofilling = (fieldMatrix: GameArray, color: PlayerColor) => {
  const boolArr = fieldMatrix.map((itemY, iY) => {
    return itemY.map((itemX, iX) => {
      if (itemX === color) return true;
      if (itemX === null) return null;
      else return false;
    });
  });
  if (boolArr.filter((item) => item.filter((item) => item === false).length).length) {
    let a = fillTrue(boolArr);
    a.forEach((item, iY) =>
      item.forEach((item, iX) => {
        if (item === true) fieldMatrix[iY][iX] = color;
      })
    );
  }
};

const fillTrue = (gameField: Array<Array<TCellContent>>): TCellContent[][] => {
  gameField.forEach((itemY, iY) =>
    itemY.forEach((itemX, iX) => {
      if (gameField[iY][iX] === false) return;
      else {
        checkSiblings(gameField, { y: iY, x: iX });
        gameField.forEach((item, iY) =>
          item.forEach((item, iX) => {
            if (item === '?') gameField[iY][iX] = true;
          })
        );
      }
    })
  );
  return gameField;
};

const checkSiblings = (gameField: Array<Array<TCellContent>>, { x, y }: iPosition): boolean => {
  if (gameField[y][x] === true || isInsideField(x, y, gameField)) return true;

  const top = new Cell(x, y - 1);
  const right = new Cell(x + 1, y);
  const bottom = new Cell(x, y + 1);
  const left = new Cell(x - 1, y);
  const siblingCellsArr = [top, right, bottom, left];

  if (siblingCellsArr.filter((item) => item.currentContent(gameField) === false).length > 0) {
    siblingCellsArr.forEach((item) => {
      if (item.currentContent(gameField) !== undefined && item.currentContent(gameField) !== true)
        gameField[item.y][item.x] = false;
    });
    if (gameField[y][x] !== undefined && gameField[y][x] !== true) gameField[y][x] = false;
    gameField.forEach((item, iY) =>
      item.forEach((item, iX) => {
        if (item === '?') gameField[iY][iX] = false;
      })
    );
    return false;
  } else {
    gameField[y][x] = '?';
    const arr = siblingCellsArr.filter((item) => {
      if (
        item.currentContent(gameField) === undefined ||
        item.currentContent(gameField) === true ||
        item.currentContent(gameField) === '?'
      )
        return true;
      if (item.currentContent(gameField) === null) {
        return checkSiblings(gameField, { x: item.x, y: item.y });
      }
      return false;
    });
    return arr.length >= 4;
  }
};

const isInsideField = (x: number, y: number, field: TCellContent[][]) => {
  if (y < 0 || x < 0 || y >= field.length || x >= field[0].length) return true;
  return false;
};

interface iPosition {
  x: number;
  y: number;
}

type TCellContent = boolean | '?' | null;

class Cell {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  currentContent = (gameField: TCellContent[][]) => {
    return gameField[this.y]?.[this.x];
  };
}
