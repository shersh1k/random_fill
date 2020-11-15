import React from 'react';
import { useSelector } from 'react-redux';
import { iState } from '../../store';
import Header from '../Header';
import Login from '../Login';
import Users from '../Users';
// import Configurator from '../Configurator';
import Game from '../Game';
import Footer from '../Footer';

import './App.css';

function App() {
  const config = useSelector((state: iState) => state.game.config);
  const isAuthorized = useSelector((state: iState) => state.user.isAuthorized);

  return (
    <div className='app'>
      <Header />
      {!isAuthorized && <Login />}
      {isAuthorized && <Users />}
      {/* {isAuthorized && !config && <Configurator />} */}
      {isAuthorized && config && <Game />}
      <Footer />
    </div>
  );
}

export default App;
