export const ROLL_THE_DICE = 'ROLL_THE_DICE';
export const ROTATE_FIGURE = 'ROTATE_FIGURE';
export const SET_CONFIG = 'SET_CONFIG';
export const SET_FIGURE_POSITION = 'SET_FIGURE_POSITION';
export const SET_FIELD_MATRIX = 'SET_FIELD_MATRIX';
export const SET_TEMP_FIELD_MATRIX = 'SET_TEMP_FIELD_MATRIX';
export const SET_FINAL_FIGURE_POSITION = 'SET_FINAL_FIGURE_POSITION';
export const SET_PLAYER = 'SET_PLAYER';

export interface GameState {
  config: iConfig | null;
  cellSide: number;
  fieldMatrix: GameArray | null;
  tempFieldMatrix: GameArray | null;
  dice: Dices | null;
  currentFigure: GameArray | null;
  currentFigureX: number;
  currentFigureY: number;
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
export type GameArray = Array<Array<PlayerColor | null>>;
export type PlayerColor = 'Red' | 'Green' | 'Yellow' | 'Blue';
export type Dices = [Dice, Dice];
export type Dice = 1 | 2 | 3 | 4 | 5 | 6;

interface RollTheDice {
  type: typeof ROLL_THE_DICE;
  dice: Dices;
  currentFigure: GameArray;
}

interface RotateFigure {
  type: typeof ROTATE_FIGURE;
  dice: Dices;
  currentFigure: GameArray;
}

interface SetConfig {
  type: typeof SET_CONFIG;
  config: iConfig;
  fieldMatrix: GameArray;
  tempFieldMatrix: GameArray;
  players: Array<iPlayer> | null;
  currentPlayer: iPlayer;
}

interface SetFigurePosition {
  type: typeof SET_FIGURE_POSITION;
  currentFigureX: number;
  currentFigureY: number;
}

interface SetFinalFigurePosition {
  type: typeof SET_FINAL_FIGURE_POSITION;
  tempFieldMatrix: GameArray | null;
}

interface SetFieldMatrix {
  type: typeof SET_FIELD_MATRIX;
  fieldMatrix: GameArray | null;
}

interface SetTempFieldMatrix {
  type: typeof SET_TEMP_FIELD_MATRIX;
  tempFieldMatrix: GameArray | null;
}

interface SetPlayer {
  type: typeof SET_PLAYER;
  currentPlayer: iPlayer | null;
}

export type GameActionTypes =
  | RollTheDice
  | RotateFigure
  | SetConfig
  | SetFigurePosition
  | SetFieldMatrix
  | SetFinalFigurePosition
  | SetTempFieldMatrix
  | SetPlayer;
