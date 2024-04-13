import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import {
  JsonRpcProvider,
  Signature,
  Wallet,
  getBytes,
  solidityPackedKeccak256,
} from 'ethers';
import { chainIds, evmChains } from 'src/config/chain';
import { configService } from 'src/config/config.service';
import { BridgeDto } from './dto/bridge.dto';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class ApiService {
  private logger = new Logger('ApiService');
  private evmProviders: Record<Chain, JsonRpcProvider> = {} as any;
  private prisma: PrismaService;
  private evmSigner: Wallet;

  constructor() {
    this.evmSigner = new Wallet(configService.getEvmExecutorPrivateKey());

    for (const chain of evmChains) {
      this.evmProviders[chain.chain] = new JsonRpcProvider(chain.rpcUrl);
    }
    this.prisma = new PrismaService();
  }

  async bridge(bridgeDto: BridgeDto) {
    const now = Date.now();

    const key = solidityPackedKeccak256(
      ['string', 'string', 'string', 'uint256', 'uint256'],
      [
        bridgeDto.fromChain,
        bridgeDto.toChain,
        bridgeDto.toAddress,
        bridgeDto.amountIn,
        now,
      ],
    );

    const tx = await this.prisma.transaction.create({
      data: {
        key,
        status: 'Issued',
        fromChain: bridgeDto.fromChain,
        toChain: bridgeDto.toChain,
        toAddress: bridgeDto.toAddress,
        amountIn: BigInt(bridgeDto.amountIn),
        amountOut: BigInt(bridgeDto.amountIn),
        issuedTime: now,
        expireTime: now + 24 * 60 * 60 * 1000,
      },
    });

    return tx;
  }

  async getTransaction(key: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: {
        key,
      },
    });

    if (!tx) {
      throw new HttpException(
        { reason: "Can't find such transaction" },
        HttpStatus.NOT_FOUND,
      );
    }

    return tx;
  }

  async getTransactionSign(key: string, sender: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: {
        key,
      },
    });

    if (!tx) {
      throw new HttpException(
        { reason: "Can't find such transaction" },
        HttpStatus.NOT_FOUND,
      );
    }

    const chainId = chainIds[tx.fromChain];

    const hash = solidityPackedKeccak256(
      ['address', 'bytes32', 'uint256', 'uint256'],
      [sender, key, tx.amountIn, chainId],
    );
    const sig = await this.evmSigner.signMessage(getBytes(hash));
    const { r, s, v } = Signature.from(sig);

    return {
      key,
      amount: tx.amountIn,
      sig: { r, s, v },
    };
  }
}
