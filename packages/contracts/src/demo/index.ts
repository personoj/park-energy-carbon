import type { SceneAsset } from '../scene';
export interface DemoAsset extends SceneAsset {
  energyLabel: string;
  energyKwh: number;
  alarms: number;
  carbonStatus: 'not-calculated';
}
export interface DemoCampus {
  mode: 'synthetic-demo';
  period: { start: string; endExclusive: string; timezone: string };
  assets: DemoAsset[];
}
