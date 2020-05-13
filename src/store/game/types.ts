export const ROLL_THE_DICE = 'ROLL_THE_DICE';
export const ROTATE_FIGURE = 'ROTATE_FIGURE';
export const SET_CONFIG = 'SET_CONFIG';

export interface GameState {
  config: iConfig | null;
  fieldMatrix: Array<Array<PlayerColor | null>> | null;
  dice: Dices | null;
  currentFigure: Array<Array<PlayerColor | null>> | null;
  players: Array<iPlayer> | null;
  currentPlayer: iPlayer | null;
}

export interface iConfig {
  x: number;
  y: number;
  players: Array<string>;
}
export interface iPlayer {
  name: string;
  color: PlayerColor;
  count: number;
}

export type PlayerColor = 'Red' | 'Green' | 'Yellow' | 'Blue';
export type Dices = [Dice, Dice];
export type Dice = 1 | 2 | 3 | 4 | 5 | 6;

interface RollTheDice {
  type: typeof ROLL_THE_DICE;
  dice: Dices;
  currentFigure: Array<Array<PlayerColor | null>>;
}

interface RotateFigure {
  type: typeof ROTATE_FIGURE;
  dice: Dices;
  currentFigure: Array<Array<PlayerColor | null>>;
}

interface SetConfig {
  type: typeof SET_CONFIG;
  config: iConfig;
  fieldMatrix: Array<Array<PlayerColor | null>>;
  players: Array<iPlayer> | null;
  currentPlayer: iPlayer;
}

export type GameActionTypes = RollTheDice | RotateFigure | SetConfig;
