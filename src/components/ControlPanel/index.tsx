import React, { useEffect, useRef, useState, useCallback } from 'react';
import './ControlPanel.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  rollTheDice,
  rotateFigure,
  setFigurePosition,
  setFieldMatrix,
  setTempFieldMatrix,
  setPlayer,
} from '../../store/game/actions';
import { iState } from '../../store';
import { Button } from 'antd';
import { GameArray, PlayerColor } from '../../store/game/types';

function ControlPanel() {
  const newFigureRef = useRef<HTMLDivElement>(null);
  const dices = useSelector((state: iState) => state.game.dice);
  const currentFigure = useSelector((state: iState) => state.game.currentFigure);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const players = useSelector((state: iState) => state.game.players);
  const tempFieldMatrix = useSelector((state: iState) => state.game.tempFieldMatrix);
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  const [stepDone, setStepDone] = useState(false);
  const [rollDiceDone, setRollDiceDone] = useState(false);
  const dispatch = useDispatch();
  const mouseMoveHandler = useCallback((e: MouseEvent) => {
    if (!newFigureRef.current) return;
    newFigureRef.current.style.left = e.pageX - newFigureRef.current.offsetWidth / 2 + 'px';
    newFigureRef.current.style.top = e.pageY - newFigureRef.current.offsetHeight / 2 + 'px';
    dispatch(setFigurePosition(e.x, e.y));
  }, []);
  const clickHandlerRoll = () => {
    setRollDiceDone(true);
    dispatch(rollTheDice(currentPlayer?.color));
  };
  const clickHandlerRotate = () => {
    dispatch(rotateFigure(dices || [1, 1], currentPlayer?.color));
  };
  const onMouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!newFigureRef.current || stepDone) return;
    newFigureRef.current.style.position = 'absolute';
    newFigureRef.current.style.top = e.pageY - newFigureRef.current.offsetHeight / 2 + 'px';
    newFigureRef.current.style.left = e.pageX - newFigureRef.current.offsetWidth / 2 + 'px';
    document.addEventListener('mousemove', mouseMoveHandler);
  };
  const onMouseUpHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.removeEventListener('mousemove', mouseMoveHandler);
    if (!newFigureRef.current) return;
    newFigureRef.current.style.position = 'static';
    newFigureRef.current.style.top = 'auto';
    newFigureRef.current.style.left = 'auto';
    const isDifferent = tempFieldMatrix?.join() !== fieldMatrix?.join();
    // if (tempFieldMatrix && currentPlayer && currentPlayer.count) autofill(tempFieldMatrix, currentPlayer.color);
    if (tempFieldMatrix && isDifferent) {
      setStepDone(true);
    }
  };
  const undoHandler = () => {
    if (fieldMatrix) {
      setStepDone(false);
      dispatch(setTempFieldMatrix(fieldMatrix));
    }
  };

  const passHandler = () => {
    if (!players || !currentPlayer || !fieldMatrix) return;
    const playerIndex = players.findIndex((item) => item.name === currentPlayer.name);
    const nextPlayerIndex = playerIndex + 1;
    const nextPlayer = players[nextPlayerIndex] || players[0];
    setStepDone(false);
    setRollDiceDone(false);
    dispatch(setPlayer(nextPlayer));
    dispatch(setTempFieldMatrix(fieldMatrix));
  };

  const submitHandler = () => {
    if (!players || !currentPlayer || !tempFieldMatrix) return;
    const isDifferent = tempFieldMatrix?.join() !== fieldMatrix?.join();
    if (tempFieldMatrix && isDifferent) {
      dispatch(setFieldMatrix(tempFieldMatrix));
    }
    const playerIndex = players.findIndex((item) => item.name === currentPlayer.name);
    const nextPlayerIndex = playerIndex + 1;
    const nextPlayer = players[nextPlayerIndex] || players[0];
    setStepDone(false);
    setRollDiceDone(false);
    currentPlayer.count = tempFieldMatrix.flat().filter((item) => item === currentPlayer.color).length;
    dispatch(setPlayer(Object.assign({}, currentPlayer)));
    dispatch(setPlayer(nextPlayer));
  };
  return (
    <div className='curent-step'>
      <div>{currentPlayer?.name}</div>
      <div>{currentPlayer?.count}</div>
      <Button disabled={rollDiceDone} type='primary' onClick={clickHandlerRoll}>
        roll the dice
      </Button>
      <Button type='primary' disabled={!dices} onClick={clickHandlerRotate}>
        rotate
      </Button>
      <Button onClick={passHandler}>pass</Button>
      <div>{dices && dices[1]}</div>
      <div>{dices && dices[0]}</div>
      <div ref={newFigureRef} className='new-figure' onMouseDown={onMouseDownHandler} onMouseUp={onMouseUpHandler}>
        {currentFigure &&
          currentFigure.map((item, index) => (
            <div key={index} className='new-figure__row'>
              {item.map((item, index) => (
                <span
                  key={index}
                  style={{ backgroundColor: stepDone ? 'grey' : item || '' }}
                  className='new-figure__cell'></span>
              ))}
            </div>
          ))}
      </div>
      {stepDone && (
        <>
          <Button onClick={undoHandler}>undo</Button>
          <Button onClick={submitHandler}>submit</Button>
        </>
      )}
    </div>
  );
}

export default ControlPanel;
/* 
const autofill = (gameField: GameArray, color: PlayerColor) => {
  // const newGameField = gameField.map()
  gameField.forEach((itemY, iY, arrY) => {
    itemY.forEach((itemX, iX, arrX) => {
      if (itemX === null && canBeFilled(arrY, iX, iY, color)) {
        debugger;
      }
    });
  });
};

const canBeFilled = (gameField: GameArray, iX: number, iY: number, col: PlayerColor) => {
  if (checkSiblings(gameField, iX, iY, col)) return true;
  return false;
};

const checkSiblings = (gameField: GameArray, iX: number, iY: number, col: PlayerColor): boolean => {
  const left = gameField[iY]?.[iX - 1];
  const right = gameField[iY]?.[iX + 1];
  const up = gameField[iY - 1]?.[iX];
  const bottom = gameField[iY + 1]?.[iX];
  if (!byRule(left, col) || !byRule(right, col) || !byRule(up, col) || !byRule(bottom, col)) return false;
  return (
    (left === undefined || checkSiblings(gameField, iX - 1, iY, col)) &&
    (right === undefined || checkSiblings(gameField, iX + 1, iY, col)) &&
    (up === undefined || checkSiblings(gameField, iX, iY - 1, col)) &&
    (bottom === undefined || checkSiblings(gameField, iX, iY + 1, col))
  );
};

const byRule = (cell: PlayerColor | null | undefined, color: PlayerColor) =>
  cell === undefined || cell === null || cell === color;
 */