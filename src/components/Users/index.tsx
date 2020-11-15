import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { iState } from '../../store/index';
import { socket } from '../../socketIO';
import { Button, Card, List, Modal } from 'antd';
import { logout } from '../../store/user/actions';
import { setConfig } from '../../store/game/actions';

export default function Users() {
  const { name, mail } = useSelector((state: iState) => state.user);
  const [users, setUsers] = useState<iUser[]>([]);
  const [startDialog, setStartDialog] = useState(false);
  const [mailFrom, setMailFrom] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('login', { name, mail });
  }, [name, mail]);

  const startGame = () => {
    socket.emit('startGame', mailFrom);
  };

  useEffect(() => {
    const addUser = (user: iUser) => {
      setUsers((u) => u.concat(user));
    };
    const addUsers = (users: iUser[]) => {
      setUsers((u) => users);
    };
    const deleteUser = (email: string) => {
      setUsers((u) => u.filter((item) => item.mail !== email));
    };
    const letsPlay = (mailFrom: string) => {
      setMailFrom(mailFrom);
      setStartDialog(true);
    };
    const startGame = (mailFrom: string) => {
      debugger;
      if (!mail) return;
      dispatch(setConfig({ players: [mailFrom, mail], x: 30, y: 30 }));
      setMailFrom(mailFrom);
      setStartDialog(false);
    };

    socket.on('login', addUsers);
    socket.on('newUser', addUser);
    socket.on('logout', deleteUser);
    socket.on('letsPlay', letsPlay);
    socket.on('startGame', startGame);
    return () => {
      socket.off('login', addUsers);
      socket.off('newUser', addUser);
      socket.off('logout', deleteUser);
      socket.off('letsPlay', letsPlay);
      socket.off('startGame', startGame);
    };
  }, []);

  const logoutHandler = () => {
    socket.emit('logout', { mail, name });
    dispatch(logout());
  };

  const playHandler = (mail: string) => {
    socket.emit('letsPlay', mail);
  };

  return (
    <>
      <List
        header={<div>Онлайн: {users.length}</div>}
        footer={<Button onClick={logoutHandler}>Exit</Button>}
        bordered
        itemLayout='horizontal'
        dataSource={users}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<span>{item.name}</span>}
              description={
                <Card title={item.mail} style={{ color: item.mail === mail ? 'red' : void 0 }}>
                  {item.mail === mail && 'It`s you'}
                  {item.mail !== mail && <Button /* loading */ onClick={() => playHandler(item.mail)}>Play</Button>}
                </Card>
              }
            />
          </List.Item>
        )}
      />
      <Modal
        title={'Start Game'}
        visible={startDialog}
        onOk={startGame}
        onCancel={() => {
          setStartDialog(false);
        }}
      />
    </>
  );
}

interface iUser {
  name: string;
  mail: string;
}
