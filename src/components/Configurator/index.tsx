import React, { useState } from 'react';
import './Configurator.css';
import { useDispatch } from 'react-redux';
import { setConfig } from '../../store/game/actions';
import { Button, Input, InputNumber } from 'antd';

function Configurator() {
  const dispatch = useDispatch();
  const [x, setX] = useState(20);
  const [y, setY] = useState(20);
  const [players, setPlayers] = useState(['player1', 'player2']);
  const playersHandler = (value: string, index: number) => {
    const newPlayers = players.map((item, i) => {
      if (i === index) return value;
      else return item;
    });
    setPlayers(newPlayers);
  };
  const submit = () => {
    if (x < 20 || y < 20 || x > 45 || y > 45) return;
    dispatch(setConfig({ players, x, y }));
  };
  return (
    <div className='configurator'>
      <InputNumber min={20} max={45} value={x} onChange={(e) => setX(Number(e))} type='number' />
      <InputNumber min={20} max={45} value={y} onChange={(e) => setY(Number(e))} type='number' />
      <div className='players'></div>
      {players.map((item, i) => (
        <div className='players__item' key={i}>
          <Input type='text' value={item} onChange={(e) => playersHandler(e.target.value, i)} />
          <Button
            type='primary'
            danger
            disabled={players.length <= 2}
            onClick={(e) => setPlayers(players.filter((player, index) => index !== i))}>
            X
          </Button>
        </div>
      ))}
      <Button
        type='primary'
        block
        disabled={players.length >= 4}
        onClick={(e) => setPlayers([...players, `player${players.length + 1}`])}>
        add player
      </Button>
      <Button type='primary' block onClick={submit}>
        submit config
      </Button>
    </div>
  );
}

export default Configurator;
