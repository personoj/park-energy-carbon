import { Module } from '@nestjs/common';
import { DemoModule } from './modules/demo/public';

@Module({ imports: [DemoModule] })
export class AppModule {}
