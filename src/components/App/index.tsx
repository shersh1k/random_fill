import React from 'react';
import { useSelector } from 'react-redux';
import { iState } from '../../store';
import Configurator from '../Configurator';
import Header from '../Header';
import Game from '../Game';
import Footer from '../Footer';
import Authorization from '../Authorization';
import './App.css';

function App() {
  const config = useSelector((state: iState) => state.game.config);
  const isAuthorized = useSelector((state: iState) => state.user.isAuthorized);

  return (
    <div className='app'>
      <Header />
      {!isAuthorized && <Authorization />}
      {isAuthorized && !config && <Configurator />}
      {isAuthorized && config && <Game />}
      <Footer />
    </div>
  );
}

export default App;
