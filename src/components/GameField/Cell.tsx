import React from 'react';
import { TypeCell } from '../../store/game/types';

export default function Cell({ item, width, height }: { item: TypeCell | null; width: number; height: number }) {
  return (
    <span
      style={{ backgroundColor: item?.color || '', opacity: item?.opacity, width, height }}
      className='game-field__cell'></span>
  );
}
