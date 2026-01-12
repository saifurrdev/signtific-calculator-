
export enum AngleMode {
  DEG = 'DEG',
  RAD = 'RAD'
}

export type OperationType = 'number' | 'operator' | 'function' | 'constant' | 'action';

export interface CalculatorState {
  expression: string;
  result: string | null;
  mode: AngleMode;
  error: string | null;
}
