export interface HNItem {
  id: number;
  title: string;
  score: number;
  by: string;
  time: number;
  url?: string;
  type: string;
  descendants?: number;
  kids?: number[];
}
