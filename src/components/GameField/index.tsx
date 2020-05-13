import React, { useRef, useState, useEffect } from 'react';
import './GameField.css';
import { useSelector, useDispatch } from 'react-redux';
import { iState } from '../../store';
import { setFieldMatrix, setFinalFigurePosition, setTempFieldMatrix } from '../../store/game/actions';

function GameField() {
  const fieldMatrixRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const fieldMatrix = useSelector((state: iState) => state.game.fieldMatrix);
  const tempFieldMatrix = useSelector((state: iState) => state.game.tempFieldMatrix);
  // const [tempFieldMatrix, setTempFieldMatrix] = useState(fieldMatrix);
  const cellSide = useSelector((state: iState) => state.game.cellSide);
  const config = useSelector((state: iState) => state.game.config);
  const currentFigure = useSelector((state: iState) => state.game.currentFigure);
  const currentPlayer = useSelector((state: iState) => state.game.currentPlayer);
  const dice = useSelector((state: iState) => state.game.dice);
  const currentFigureX = useSelector((state: iState) => state.game.currentFigureX);
  const currentFigureY = useSelector((state: iState) => state.game.currentFigureY);
  const [geometry, setGeometry] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!fieldMatrixRef.current) return;
    setGeometry(fieldMatrixRef.current.getBoundingClientRect());
  }, [fieldMatrixRef]);
  useEffect(() => {
    if (!fieldMatrixRef.current || !geometry) return;
    const insideX = geometry.left < currentFigureX && geometry.right > currentFigureX;
    const insideY = geometry.top < currentFigureY && geometry.bottom > currentFigureY;
    if (insideX && insideY && dice) {
      const mouseOverCellX = Math.round((currentFigureX - geometry.left) / cellSide);
      const mouseOverCellXStart = Math.floor(mouseOverCellX - dice[1] / 2);
      const mouseOverCellXEnd = Math.floor(mouseOverCellX + dice[1] / 2);

      const mouseOverCellY = Math.round((currentFigureY - geometry.top) / cellSide);
      const mouseOverCellYStart = Math.floor(mouseOverCellY - dice[0] / 2);
      const mouseOverCellYEnd = Math.floor(mouseOverCellY + dice[0] / 2);
      console.log('overX', mouseOverCellX, mouseOverCellXStart, mouseOverCellXEnd);
      console.log('overY', mouseOverCellY, mouseOverCellYStart, mouseOverCellYEnd);
      const newFieldMatrix = fieldMatrix?.map((item, indexY) => {
        if (mouseOverCellYStart <= indexY && indexY < mouseOverCellYEnd) {
          return item.map((item, indexX) => {
            if (mouseOverCellXStart <= indexX && indexX < mouseOverCellXEnd) return currentPlayer?.color || null;
            return item;
          });
        }
        return item;
      });
      if (newFieldMatrix) dispatch(setTempFieldMatrix(newFieldMatrix));
    }
  }, [currentFigureX, currentFigureY]);
  return (
    <div ref={fieldMatrixRef} className='game-field'>
      {tempFieldMatrix &&
        tempFieldMatrix.map((item, index) => (
          <div key={index} className='game-field__row'>
            {item.map((item, index) => (
              <span key={index} style={{ backgroundColor: item || '' }} className='game-field__cell'></span>
            ))}
          </div>
        ))}
    </div>
  );
}

export default GameField;
