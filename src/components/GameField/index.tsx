import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { iState } from '../../store';
import { setTempFieldMatrix, setCellSides } from '../../store/game/actions';
import {
  isInsideGameField,
  setRectangleCells,
  isFirstMove,
  isOverEdge,
  isInCorner,
  isInsertByRules,
  fillFieldMatrix,
} from '../../Helpers';

import './GameField.css';
import { Card } from 'antd';
import Title from './Title';
import Cell from './Cell';

function GameField() {
  const fieldMatrixRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  const tempFieldMatrix = useSelector((state: iState) => state.game.tempFieldMatrix);
  const cellWidth = useSelector((state: iState) => state.game.cellWidth);
  const cellHeight = useSelector((state: iState) => state.game.cellHeight);

  const config = useSelector((state: iState) => state.game.config);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const dice = useSelector((state: iState) => state.game.dice);
  const currentFigureX = useSelector((state: iState) => state.game.currentFigureX);
  const currentFigureY = useSelector((state: iState) => state.game.currentFigureY);
  const [geometry, setGeometry] = useState<DOMRect | null>(null);

  useEffect(() => {
    const resizeHandler = () => {
      if (!fieldMatrixRef.current) return;
      const geometry = fieldMatrixRef.current.getBoundingClientRect();
      setGeometry(geometry);
      if (config) dispatch(setCellSides(geometry.width / config.x, geometry.height / config.y));
    };
    resizeHandler();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [fieldMatrixRef]);
  useEffect(() => {
    if (!fieldMatrixRef.current || !geometry || !config || !tempFieldMatrix || !fieldMatrix || !dice || !currentPlayer)
      return;
    if (!isInsideGameField(geometry, currentFigureX, currentFigureY)) dispatch(setTempFieldMatrix(fieldMatrix));
    else {
      const mouseOverCellX = (currentFigureX - geometry.left) / cellWidth;
      const mouseOverCellY = (currentFigureY - geometry.top) / cellHeight;
      const rectCoord = setRectangleCells(mouseOverCellX, mouseOverCellY, dice);
      const isFM = isFirstMove(currentPlayer?.count);
      //Если фигура залазит за край поля, выходим
      if (isOverEdge(rectCoord, config)) dispatch(setTempFieldMatrix(fieldMatrix));
      //Если первый ход и не в углу, выходим
      else if (isFM && !isInCorner(rectCoord, config)) dispatch(setTempFieldMatrix(fieldMatrix));
      //Проверка по правилам ли вставка
      else if (!isInsertByRules(fieldMatrix, rectCoord, currentPlayer, isFM)) dispatch(setTempFieldMatrix(fieldMatrix));
      else {
        const newFieldMatrix = fillFieldMatrix(fieldMatrix, rectCoord, currentPlayer.color, isFM);
        dispatch(setTempFieldMatrix(newFieldMatrix));
      }
    }
  }, [
    currentFigureX,
    currentFigureY,
    cellWidth,
    cellHeight,
    config,
    dispatch /*currentPlayer, dice, fieldMatrix, geometry, tempFieldMatrix */,
  ]);
  return (
    <Card title={<Title />}>
      <div ref={fieldMatrixRef} className='game-field'>
        {tempFieldMatrix &&
          tempFieldMatrix.map((item, index) => (
            <div key={index} className='game-field__row'>
              {item.map((item, index) => (
                <Cell key={index} item={item} width={cellWidth} height={cellHeight} />
              ))}
            </div>
          ))}
      </div>
    </Card>
  );
}

export default GameField;
