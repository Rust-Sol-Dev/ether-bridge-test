import GlobalStyle from "@styles/globalStyles";
import { Card } from "./components";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { sepolia, holesky } from 'viem/chains'
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = "2df9f30d36d5d649ec3262f5b2cb0b90";

const metadata = {
  name: "Bridge Test",
  description: "Bridge Test for all chain",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};

// 0. Setup queryClient
const queryClient = new QueryClient()
const chains = [sepolia, holesky];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: sepolia
})



export default function App() {
  return ( 
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Card />
      </QueryClientProvider>
    </WagmiConfig>
  );
}
