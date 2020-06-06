import React from 'react';
import { useSelector } from 'react-redux';
import { iState } from '../../store';
import Configurator from '../Configurator';
import Header from '../Header';
import Game from '../Game';
import Footer from '../Footer';
import './App.css';

function App() {
  const config = useSelector((state: iState) => state.game.config);
  return (
    <div className='app'>
      <Header />
      {!config ? <Configurator /> : <Game />}
      <Footer />
    </div>
  );
}

export default App;
