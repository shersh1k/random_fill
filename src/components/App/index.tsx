import React from 'react';
import './App.css';
import Configurator from '../Configurator';
import GameField from '../GameField';
import ControlPanel from '../ControlPanel';
import { useSelector } from 'react-redux';
import { iState } from '../../store';

function App() {
  const config = useSelector((state: iState) => state.game.config);
  return (
    <div className='app'>
      {!config && <Configurator />}
      {!!config && (
        <>
          <GameField />
          <ControlPanel />
        </>
      )}
    </div>
  );
}

export default App;
