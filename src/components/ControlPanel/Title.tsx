import React from 'react';
import { iPlayer } from '../../store/game/types';
import { useSelector } from 'react-redux';
import { iState } from '../../store';

const Title = ({ player }: { player: iPlayer | null }) => {
  const additionScore = useSelector((state: iState) => state.game.tempFieldMatrix)
    ?.flat()
    .filter((item) => item?.opacity === 0.5).length;
  if (!player) return null;
  const { name, count, color } = player;
  return (
    <div>
      <div>{name}</div>
      <div style={{ color, fontSize: 12 }}>
        score: {count} {additionScore ? `+ ${additionScore} = ${count + additionScore}` : ''}
      </div>
    </div>
  );
};

export default Title;
