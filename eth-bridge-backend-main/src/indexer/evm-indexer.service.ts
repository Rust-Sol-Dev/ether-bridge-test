import { Injectable, Logger } from '@nestjs/common';
import {
  EventFilter,
  JsonRpcProvider,
  Interface,
  Log,
  LogDescription,
} from 'ethers';
import * as BridgeAbi from 'src/helper/abis/Bridge.abi.json';
import { PrismaService } from 'src/config/prisma.service';
import { retryRPCPromise } from 'src/helper/retryRPCPromise';

@Injectable()
export class EvmIndexerService {
  private logger: Logger;
  private prisma: PrismaService;

  private filters: EventFilter[];
  private provider: JsonRpcProvider;
  private lastBlock: number;
  private bridgeInterface: Interface;

  constructor(private readonly config: ChainConfig) {
    this.logger = new Logger(`${config.chain} Indexer`);
    this.prisma = new PrismaService();

    this.init(config);
  }

  private async init(config: ChainConfig) {
    this.logger.log('Initializing...');

    this.provider = new JsonRpcProvider(config.rpcUrl);
    this.bridgeInterface = new Interface(BridgeAbi);

    this.filters = [
      {
        address: config.bridge,
        topics: [this.bridgeInterface.getEvent('Deposit').topicHash],
      },
      {
        address: config.bridge,
        topics: [this.bridgeInterface.getEvent('Withdraw').topicHash],
      },
      {
        address: config.bridge,
        topics: [this.bridgeInterface.getEvent('PoolChanged').topicHash],
      },
    ];

    this.lastBlock = await this.provider.getBlockNumber();

    this.logger.log('Initialized indexer');
    this.filterEvents();
  }

  private async filterEvents() {
    try {
      this.provider.removeAllListeners();
      const headBlock = await this.provider.getBlockNumber();
      if (this.lastBlock >= headBlock) {
        throw new Error('duplicated event');
      }

      this.logger.log(
        `Fetching blocks from ${this.lastBlock + 1} to ${headBlock}`,
      );
      let logs: Log[] = [];
      for (const filter of this.filters) {
        const getLogPromise = () =>
          this.provider.getLogs({
            ...filter,
            fromBlock: this.lastBlock,
            toBlock: headBlock,
          });
        const result = await retryRPCPromise<Log[]>(getLogPromise, 2);
        logs = logs.concat(result);
      }

      this.logger.log(`Found ${logs.length} event(s)`);

      for (const log of logs) {
        try {
          const factoryDescription = this.bridgeInterface.parseLog({
            data: log.data,
            topics: [...log.topics],
          });
          if (factoryDescription) {
            await this.handleBridgeLog(factoryDescription);
          }
        } catch (err) {
          console.log(err);
        }
      }

      this.lastBlock = headBlock;
    } catch (err) {
      this.logger.error(err);
    }
    this.provider.addListener('block', () => this.filterEvents());
  }

  private async handleBridgeLog(description: LogDescription) {
    if (description.name == 'Deposit') {
      await this.handleDeposit(description);
    }
    if (description.name == 'Withdraw') {
      await this.handleWithdraw(description);
    }
    if (description.name == 'PoolChanged') {
      await this.handlePoolChanged(description);
    }
  }

  private async handleDeposit(description: LogDescription) {
    const key = description.args[0];
    const from = description.args[1];

    const tx = await this.prisma.transaction.findUnique({ where: { key } });
    if (!tx) {
      return;
    }
    if (tx.status != 'Issued') {
      return;
    }

    await this.prisma.transaction.update({
      where: { key },
      data: {
        status: 'Deposited',
      },
    });

    this.logger.log(`New deposit ${key}:${from}`);
  }

  private async handleWithdraw(description: LogDescription) {
    const key = description.args[0];
    const from = description.args[1];

    const tx = await this.prisma.transaction.findUnique({ where: { key } });
    if (!tx) {
      return;
    }
    if (tx.status != 'Sent') {
      return;
    }

    await this.prisma.transaction.update({
      where: { key },
      data: {
        status: 'Finished',
      },
    });

    this.logger.log(`New Withdraw ${key}:${from}`);
  }

  private async handlePoolChanged(description: LogDescription) {
    const amount = description.args[0] as bigint;

    const prev = await this.prisma.pool.findUnique({
      where: {
        chain: this.config.chain,
      },
    });

    if (!prev) {
      await this.prisma.pool.create({
        data: {
          chain: this.config.chain,
          amount: amount,
        },
      });
      return;
    }

    await this.prisma.pool.update({
      where: {
        chain: this.config.chain,
      },
      data: {
        amount: amount,
      },
    });
  }
}
