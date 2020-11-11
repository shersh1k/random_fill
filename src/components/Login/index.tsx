import React from 'react';
// import './App.css';
import { Tabs } from 'antd';
import Authorization from './Authorization';
import Registration from './Registration';

export default function Login() {
  return (
    <Tabs defaultActiveKey="Authorization">
      <Tabs.TabPane tab={<span>Authorization</span>} key="Authorization">
        <Authorization />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<span>Register</span>} key="Register">
        <Registration />
      </Tabs.TabPane>
    </Tabs>

  );
}
