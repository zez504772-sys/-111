
export enum TreeState {
  CHAOS = 'CHAOS',
  FORMED = 'FORMED'
}

export interface OrnamentData {
  id: number;
  chaosPosition: [number, number, number];
  targetPosition: [number, number, number];
  type: 'ball' | 'gift' | 'light';
  color: string;
  weight: number; // For physics-like push responsiveness
  rotation: [number, number, number];
  scale: number;
}
