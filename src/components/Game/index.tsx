import React from 'react';
import ControlPanel from '../ControlPanel';
import GameField from '../GameField';

import './Game.css';

function Game() {
  return (
    <div className='game'>
      <ControlPanel />
      <GameField />
    </div>
  );
}

export default Game;
