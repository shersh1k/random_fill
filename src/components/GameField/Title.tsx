import React from 'react';
import { useSelector } from 'react-redux';
import { iState } from '../../store';
import { Space } from 'antd';

const Title = () => {
  const players = useSelector((state: iState) => state.game.players);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const additionScore = useSelector((state: iState) => state.game.tempFieldMatrix)
    ?.flat()
    .filter((item) => item?.opacity === 0.5).length;
  if (!players || !currentPlayer) return null;
  return (
    <Space style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
      {players.map((item) => (
        <div key={`${item.color}${item.count}`}>
          <div>{item.name}</div>
          <div style={{ color: item.color, fontSize: 12 }}>
            score: {item.count + (currentPlayer.color === item.color ? additionScore || 0 : 0)}
          </div>
        </div>
      ))}
    </Space>
  );
};

export default Title;
