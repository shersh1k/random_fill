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
      if (isFirstMove(currentPlayer?.count) && !isInCorner(rectangleCoordinates, config)) return;
      if (!isInsertByRules(fieldMatrix, rectangleCoordinates, currentPlayer, isFirstMove(currentPlayer.count))) return;

      const newFieldMatrix = fillFieldMatrix(fieldMatrix, rectangleCoordinates, currentPlayer);
      dispatch(setTempFieldMatrix(newFieldMatrix));
    }
  }, [currentFigureX, currentFigureY]);
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
  let isErrors = [];
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
};

const fillFieldMatrix = (fieldMatrix: GameArray, rectCoord: iRectangleCells, currentPlayer: iPlayer) =>
  fieldMatrix.map((item, indexY) => {
    if (rectCoord.yStart <= indexY && indexY < rectCoord.yEnd) {
      return item.map((item, indexX) => {
        if (rectCoord.xStart <= indexX && indexX < rectCoord.xEnd) return currentPlayer.color;
        return item;
      });
    }
    return item;
  });

interface iRectangleCells {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}
