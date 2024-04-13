import { Module } from '@nestjs/common';
import { evmChains } from 'src/config/chain';
import { EvmIndexerService } from './evm-indexer.service';

@Module({
  providers: [
    {
      provide: 'Indexers',
      useFactory: () => evmChains.map((chain) => new EvmIndexerService(chain)),
      inject: [],
    },
  ],
  exports: [],
})
export class IndexerModule {}
