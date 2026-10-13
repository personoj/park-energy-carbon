import { Controller, Get } from '@nestjs/common';
import type { DemoCampus } from '@park/contracts';

@Controller()
export class DemoController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'park-api', mode: 'bootstrap', database: 'not-configured' };
  }

  @Get('demo/campus')
  campus(): DemoCampus {
    return {
      mode: 'synthetic-demo',
      period: {
        start: '2026-01-01T00:00:00+08:00',
        endExclusive: '2026-01-02T00:00:00+08:00',
        timezone: 'Asia/Shanghai',
      },
      assets: [
        {
          id: 'demo-pv-01',
          name: '屋顶光伏阵列',
          kind: 'solar',
          position: [-4, 0.4, -2],
          size: [5, 0.8, 3],
          color: '#41b6d6',
          energyLabel: '演示发电量',
          energyKwh: 1260,
          alarms: 0,
          carbonStatus: 'not-calculated',
        },
        {
          id: 'demo-ess-01',
          name: '储能单元',
          kind: 'storage',
          position: [3, 1, -2],
          size: [2, 2, 3],
          color: '#62c9a7',
          energyLabel: '演示放电量',
          energyKwh: 420,
          alarms: 1,
          carbonStatus: 'not-calculated',
        },
        {
          id: 'demo-factory-01',
          name: '一号厂房',
          kind: 'factory',
          position: [0, 1.5, 4],
          size: [6, 3, 4],
          color: '#b6bde1',
          energyLabel: '演示用电量',
          energyKwh: 2680,
          alarms: 2,
          carbonStatus: 'not-calculated',
        },
      ],
    };
  }
}
