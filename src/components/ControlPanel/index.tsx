import React, { useEffect, useRef } from 'react';
import './ControlPanel.css';
import { useDispatch, useSelector } from 'react-redux';
import { rollTheDice, rotateFigure } from '../../store/game/actions';
import { iState } from '../../store';

function ControlPanel() {
  const newFigureRef = useRef<HTMLDivElement>(null);
  const dices = useSelector((state: iState) => state.game.dice);
  const currentFigure = useSelector((state: iState) => state.game.currentFigure);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const dispatch = useDispatch();
  const clickHandlerRoll = () => {
    dispatch(rollTheDice());
  };
  const clickHandlerRotate = () => {
    dispatch(rotateFigure(dices || [1, 1]));
  };
  const onMouseDownHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!newFigureRef.current) return;
    newFigureRef.current.style.position = 'absolute';
    newFigureRef.current.style.top = e.pageY - newFigureRef.current.offsetHeight / 2 + 'px';
    newFigureRef.current.style.left = e.pageX - newFigureRef.current.offsetWidth / 2 + 'px';
    document.addEventListener('mousemove', mouseMoveHandler);
  };
  const onMouseUpHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    document.removeEventListener('mousemove', mouseMoveHandler);
  };
  const mouseMoveHandler = (e: MouseEvent) => {
    moveAt(e);
  };
  function moveAt(e: MouseEvent) {
    if (!newFigureRef.current) return;
    newFigureRef.current.style.left = e.pageX - newFigureRef.current.offsetWidth / 2 + 'px';
    newFigureRef.current.style.top = e.pageY - newFigureRef.current.offsetHeight / 2 + 'px';
  }
  return (
    <div className='curent-step'>
      <div>{currentPlayer?.name}</div>
      <div>{currentPlayer?.count}</div>
      <button onClick={clickHandlerRoll}>roll the dice</button>
      <button disabled={!dices} onClick={clickHandlerRotate}>
        rotate
      </button>
      <div>{dices && dices[1]}</div>
      <div>{dices && dices[0]}</div>
      <div ref={newFigureRef} className='new-figure' onMouseDown={onMouseDownHandler} onMouseUp={onMouseUpHandler}>
        {currentFigure &&
          currentFigure.map((item, index) => (
            <div key={index} className='new-figure__row'>
              {item.map((item, index) => (
                <span key={index} className='new-figure__cell'></span>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export default ControlPanel;
