import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexerModule } from './indexer/indexer.module';
import { ApiModule } from './api/api.module';
import { ExecutorModule } from './executor/executor.module';

@Module({
  imports: [IndexerModule, ApiModule, ExecutorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
