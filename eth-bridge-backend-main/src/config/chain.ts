export const evmChains: ChainConfig[] = [
  {
    chain: 'Sepolia',
    rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
    bridge: '0xd74797C50bdBA015eCF6E55ca5869e8cb9F0Cdb2',
  },
  {
    chain: 'Holesky',
    rpcUrl: 'https://ethereum-holesky-rpc.publicnode.com',
    bridge: '0xb2a0dE1D4422676E6306e66559b6C11b579a0eBA',
  },
];

export const chainIds: Record<Chain, number> = {
  Sepolia: 11155111,
  Holesky: 17000,
};
