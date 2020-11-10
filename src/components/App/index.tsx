import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { iState } from '../../store';
import Configurator from '../Configurator';
import Header from '../Header';
import Game from '../Game';
import Footer from '../Footer';
import './App.css';
import { Button, Input } from 'antd';
import { socket } from '../../socketIO';

function App() {
  const config = useSelector((state: iState) => state.game.config);

  const [value, setValue] = useState('')
  const onClickHandler = () => {
    console.log('emit')
    socket.emit('chat message', value);
  }
  useEffect(() => {
    const func = (msg: string) => {
      console.log(msg)
    }
    socket.on('chat message', func);
    return () => { socket.off('chat message', func) }
  }, [])

  return (
    <div className='app'>
      <Input onChange={(e) => setValue(e.target.value)} value={value} />
      <Button onClick={onClickHandler}>Login</Button>
      <Header />
      {!config ? <Configurator /> : <Game />}
      <Footer />
    </div>
  );
}

export default App;
