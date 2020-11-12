import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { iState } from "../../store/index";
import { socket } from '../../socketIO';
import { Button, Card, List } from 'antd';
import { logout } from '../../store/user/actions';

export default function Users() {
  const { name, mail } = useSelector((state: iState) => state.user)
  const [users, setUsers] = useState<iUser[]>([])
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit('login', { name, mail });
  }, [name, mail])

  useEffect(() => {
    const addUser = (user: iUser) => {
      setUsers(u => u.concat(user))
    }
    const addUsers = (users: iUser[]) => {
      setUsers(u => users)
    }
    const deleteUser = (email: string) => {
      setUsers(u => u.filter(item => item.mail !== email))
    }
    const letsPlay = (mailFrom: string) => {
      alert('letsPlay from ' + mailFrom)
    };

    socket.on('login', addUsers);
    socket.on('newUser', addUser);
    socket.on('logout', deleteUser);
    socket.on('letsPlay', letsPlay);
    return () => {
      socket.off('login', addUsers);
      socket.off('newUser', addUser);
      socket.off('logout', deleteUser);
      socket.off('letsPlay', letsPlay);
    }
  }, [])

  const logoutHandler = () => {
    socket.emit('logout', { mail, name });
    dispatch(logout())
  }

  const playHandler = (mail: string) => {
    socket.emit('letsPlay', mail);
  }

  return (
    <List
      header={<div>Онлайн: {users.length}</div>}
      footer={<Button onClick={logoutHandler}>Exit</Button>}
      bordered
      itemLayout="horizontal"
      dataSource={users}
      renderItem={item => (
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
  )
}

interface iUser {
  name: string;
  mail: string;
}