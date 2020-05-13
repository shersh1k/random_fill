import React from 'react';
import './GameField.css';
import { useSelector } from 'react-redux';
import { iState } from '../../store';

function GameField() {
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  return (
    <div className='game-field'>
      {fieldMatrix &&
        fieldMatrix.map((item, index) => (
          <div key={index} className='game-field__row'>
            {item.map((item, index) => (
              <span key={index} className='game-field__cell'></span>
            ))}
          </div>
        ))}
    </div>
  );
}

export default GameField;
