import React, { useState } from 'react';
import './Configurator.css';
import { useDispatch, useSelector } from 'react-redux';
import { rollTheDice, rotateFigure, setConfig } from '../../store/game/actions';
import { iState } from '../../store';

function Configurator() {
  const dispatch = useDispatch();
  const [x, setX] = useState(10);
  const [y, setY] = useState(10);
  const [players, setPlayers] = useState(['player1', 'player2']);
  const playersHandler = (value: string, index: number) => {
    const newPlayers = players.map((item, i) => {
      if (i === index) return value;
      else return item;
    });
    setPlayers(newPlayers);
  };
  const submit = () => {
    if (x < 10 || y < 10 || x > 45 || y > 45) return;
    dispatch(
      setConfig({
        players: players,
        x: x,
        y: y,
      })
    );
  };
  return (
    <div className='configurator'>
      <input min={10} max={45} value={x} onChange={(e) => setX(Number(e.target.value))} type='number' />
      <input min={10} max={45} value={y} onChange={(e) => setY(Number(e.target.value))} type='number' />
      {players.map((item, i) => (
        <div key={i}>
          <input type='text' value={item} onChange={(e) => playersHandler(e.target.value, i)} />
          <button
            disabled={players.length <= 2}
            onClick={(e) => setPlayers(players.filter((player, index) => index !== i))}>
            delete player
          </button>
        </div>
      ))}
      <button disabled={players.length >= 4} onClick={(e) => setPlayers([...players, `player${players.length + 1}`])}>
        add player
      </button>
      <button onClick={submit}>submit config</button>
    </div>
  );
}

export default Configurator;
