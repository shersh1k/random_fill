import React from 'react';
import { Space } from 'antd';
import ControlPanel from '../ControlPanel';
import GameField from '../GameField';

import './Game.css';

function Game() {
  return (
    <Space>
      <ControlPanel />
      <GameField />
    </Space>
  );
}

export default Game;
