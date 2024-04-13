import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import { evmChains } from 'src/config/chain';
import { configService } from 'src/config/config.service';
import { PrismaService } from 'src/config/prisma.service';
import * as BridgeAbi from 'src/helper/abis/Bridge.abi.json';
import { EXECUTE_INTERVAL } from 'src/config';
import delay from 'src/helper/delay';


@Injectable()
export class ExecutorService {
  private logger: Logger;
  private prisma: PrismaService;
  private evmContracts: Record<Chain, Contract> = {} as any;

  constructor() {
    this.logger = new Logger('Executor');
    this.prisma = new PrismaService();

    for (const chain of evmChains) {
      this.evmContracts[chain.chain] = new Contract(
        chain.bridge,
        BridgeAbi,
        new Wallet(
          configService.getEvmExecutorPrivateKey(),
          new JsonRpcProvider(chain.rpcUrl),
        ),
      );
    }

    this.loopExecute();
  }

  private async loopExecute() {
    while (true) {
      const startTime = Date.now();
      const txs = await this.prisma.transaction.findMany({
        where: {
          status: 'Deposited',
        },
      });

      for (const tx of txs) {
        try {
            await this.executeEvmWithdraw(tx);
        } catch (err) {
          this.logger.error(err);
        }
      }

      const now = Date.now();
      await this.prisma.transaction.updateMany({
        where: {
          expireTime: {
            lt: now,
          },
        },
        data: {
          status: 'Expired',
        },
      });
      const endTime = Date.now();

      this.logger.log(`Execution cycle took ${(endTime - startTime) / 1000}s`);

      if (endTime - startTime < EXECUTE_INTERVAL) {
        await delay(EXECUTE_INTERVAL + startTime - endTime);
      }
    }
  }

  private async executeEvmWithdraw(tx: Transaction) {
    const contract = this.evmContracts[tx.toChain];
    const { hash } = await contract.withdraw(
      tx.key,
      tx.toAddress,
      tx.amountOut,
    );

    this.logger.log(`sending on ${tx.toChain}: ${hash}`);

    await this.prisma.transaction.update({
      where: {
        key: tx.key,
      },
      data: {
        status: 'Sent',
        sendingTx: hash,
      },
    });
  }
}
