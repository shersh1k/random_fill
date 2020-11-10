import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// import './App.css';
import { Button, Input } from 'antd';
import { authorization } from '../../store/user/actions';

function App() {
  const dispatch = useDispatch();

  const [name, setName] = useState('')
  const [mail, setMail] = useState('')
  const onClickHandler = () => {
    dispatch(authorization({ name, mail }))
  }

  return (
    <div className='authorization'>
      <Input onChange={(e) => setName(e.target.value)} value={name} placeholder={"NAME"} />
      <Input type={"email"} onChange={(e) => setMail(e.target.value)} value={mail} placeholder={"MAIL"} />
      <Button onClick={onClickHandler}>Login</Button>
    </div>
  );
}

export default App;
