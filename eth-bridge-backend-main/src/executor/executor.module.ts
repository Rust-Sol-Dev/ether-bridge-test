import { Module } from '@nestjs/common';
import { ExecutorService } from './executor.service';
import { ExecutorController } from './executor.controller';

@Module({
  controllers: [ExecutorController],
  providers: [ExecutorService],
})
export class ExecutorModule {}
