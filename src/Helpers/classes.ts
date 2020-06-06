export class TCell {
  content: boolean | '?' | null;
  opacity: number;
  constructor(content: boolean | '?' | null, opacity: number) {
    this.content = content;
    this.opacity = opacity;
  }
}

export class Cell {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  currentContent = (gameField: TCell[][]) => {
    return gameField[this.y]?.[this.x];
  };
}
