import React, { useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Popconfirm, Space } from 'antd';
import {
  UndoOutlined,
  RotateRightOutlined,
  FastForwardOutlined,
  CaretRightOutlined,
  FallOutlined,
} from '@ant-design/icons';
import { iState, store } from '../../store';
import {
  rollTheDice,
  rotateFigure,
  setFigurePosition,
  setFieldMatrix,
  setTempFieldMatrix,
  setPlayer,
  setNewGame,
} from '../../store/game/actions';

import './ControlPanel.css';
import Title from './Title';
import Cell from '../GameField/Cell';

function ControlPanel() {
  const newFigureRef = useRef<HTMLDivElement>(null);
  const dices = useSelector((state: iState) => state.game.dice);
  const currentFigure = useSelector((state: iState) => state.game.currentFigure);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const cellWidth = useSelector((state: iState) => state.game.cellWidth);
  const cellHeight = useSelector((state: iState) => state.game.cellHeight);
  const players = useSelector((state: iState) => state.game.players);
  const tempFieldMatrix = useSelector((state: iState) => state.game.tempFieldMatrix);
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  const [stepDone, setStepDone] = useState(false);
  const [rollDiceDone, setRollDiceDone] = useState(false);
  const dispatch = useDispatch();
  const mouseMoveHandler = useCallback(
    (e: MouseEvent) => {
      if (!newFigureRef.current) return;
      newFigureRef.current.style.left = e.pageX - newFigureRef.current.offsetWidth / 2 + 'px';
      newFigureRef.current.style.top = e.pageY - newFigureRef.current.offsetHeight / 2 + 'px';
      dispatch(setFigurePosition(e.x, e.y));
    },
    [dispatch]
  );
  const clickHandlerRoll = () => {
    if (!currentPlayer?.color) return;
    setRollDiceDone(true);
    dispatch(rollTheDice(currentPlayer?.color));
  };
  const clickHandlerRotate = () => {
    if (!currentPlayer?.color) return;
    dispatch(rotateFigure(dices || [1, 1], currentPlayer?.color));
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
    if (!newFigureRef.current) return;
    newFigureRef.current.style.position = 'static';
    newFigureRef.current.style.top = 'auto';
    newFigureRef.current.style.left = 'auto';
    const isDifferent = tempFieldMatrix?.join() !== fieldMatrix?.join();
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
      dispatch(
        setFieldMatrix(
          tempFieldMatrix.map((
            item //filling opacity to 1;
          ) =>
            item.map((item) => {
              if (item) item.opacity = 1;
              return item;
            })
          )
        )
      );
    }
    const playerIndex = players.findIndex((item) => item.name === currentPlayer.name);
    const nextPlayerIndex = playerIndex + 1;
    const nextPlayer = players[nextPlayerIndex] || players[0];
    setStepDone(false);
    setRollDiceDone(false);
    currentPlayer.count = tempFieldMatrix.flat().filter((item) => item?.color === currentPlayer.color).length;
    dispatch(setPlayer(Object.assign({}, currentPlayer)));
    dispatch(setPlayer(nextPlayer));
    const emptyCells = tempFieldMatrix.flat().filter((item) => item === null).length;
    const sortByCount = players.slice().sort((a, b) => b.count - a.count);
    if (emptyCells < sortByCount[0].count - sortByCount[1].count) {
      alert(`PLAYER ${sortByCount[0].name} WIN`);
      dispatch(setNewGame());
    }
  };
  return (
    <Card
      style={{ position: 'static' }}
      title={<Title player={currentPlayer} />}
      actions={[
        <Button
          block
          type='link'
          title='Undo'
          icon={<UndoOutlined style={{ fontSize: '28px', color: !stepDone ? 'grey' : '#ff4d4f' }} />}
          disabled={!stepDone}
          onClick={undoHandler}
          key='undo'
        />,
        <Button
          block
          type='link'
          title='Submit move'
          icon={<CaretRightOutlined style={{ fontSize: '28px', color: !stepDone ? 'grey' : 'green' }} />}
          disabled={!stepDone}
          onClick={submitHandler}
          key='submit'
        />,
      ]}>
      <Space style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type='primary'
          size='large'
          title='Roll dice/Get figure'
          disabled={rollDiceDone}
          onClick={clickHandlerRoll}
          icon={<FallOutlined />}
        />
        <Button
          title='Rotate figure'
          type='primary'
          size='large'
          disabled={!dices}
          onClick={clickHandlerRotate}
          icon={<RotateRightOutlined />}
        />
        <Popconfirm title='Are you sure to skip move' onConfirm={passHandler}>
          <Button danger title='Skipping' size='large' icon={<FastForwardOutlined />} />
        </Popconfirm>
      </Space>
      <div className='new-figure-wrapper'>
        <div className='new-figure' ref={newFigureRef} onMouseDown={onMouseDownHandler} onMouseUp={onMouseUpHandler}>
          {currentFigure &&
            currentFigure.map((item, index) => (
              <div key={index} className='new-figure__row'>
                {item.map((item, index) => (
                  <Cell key={index} item={item} width={cellWidth} height={cellHeight} />
                ))}
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
}

export default ControlPanel;
