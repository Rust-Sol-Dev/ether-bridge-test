type Chain = 'Sepolia' | 'Holesky';

type ChainConfig = {
  chain: Chain;
  rpcUrl: string;
  bridge: string;
};
