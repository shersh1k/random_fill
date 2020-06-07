import React from 'react';
import './Footer.css';
import { GithubOutlined, LinkedinOutlined, SkypeOutlined, GoogleOutlined } from '@ant-design/icons';

const GITHUB_COLOR = '#323131';
const GOOGLE_COLOR = '#db493c';
const SKYPE_COLOR = '#00a4e8';
const LINKEDIN_COLOR = '#0073b2';

const style = (color: string): React.CSSProperties => ({
  fontSize: 22,
  color: color,
  fontWeight: 'bold',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

function Footer() {
  return (
    <div className='footer'>
      <a href='https://github.com/shersh1k' style={style(GITHUB_COLOR)}>
        <GithubOutlined />
        <span style={{ fontSize: 16, marginLeft: 5 }}>shersh1k</span>
      </a>
      <a href='mailto:shershnev942@gmail.com' style={style(GOOGLE_COLOR)}>
        <GoogleOutlined />
        <span style={{ fontSize: 16, marginLeft: 5 }}>shershnev942@gmail.com</span>
      </a>
      <a href='skype:anshersh?userinfo' style={style(SKYPE_COLOR)}>
        <SkypeOutlined />
        <span style={{ fontSize: 16, marginLeft: 5 }}>anshersh</span>
      </a>
      <a
        href='https://www.linkedin.com/in/%D0%B0%D0%BD%D0%B4%D1%80%D0%B5%D0%B9-%D1%88%D0%B5%D1%80%D1%88%D0%BD%D0%B5%D0%B2-3ba8bb128/'
        style={style(LINKEDIN_COLOR)}>
        <LinkedinOutlined />
        <span style={{ fontSize: 16, marginLeft: 5 }}>Андрей Шершнев</span>
      </a>
    </div>
  );
}

export default Footer;
