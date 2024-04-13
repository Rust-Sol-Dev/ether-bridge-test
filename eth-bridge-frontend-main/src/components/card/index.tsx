import { Button, InputPanel } from "@features/ui";
import * as S from "./index.styled";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useChainId,  useContractWrite } from "wagmi";
import { brideContract } from "@config/index";
import { BridgeAbi } from "@config/Bridge.abi";
import axios from "axios";
import { parseEther } from "viem";
import { waitForTransaction } from "wagmi/actions";


export function Card() {
  const { open } = useWeb3Modal();
  const { address,  isConnected } = useAccount();
  const chainId = useChainId();

  const contractAddress = useMemo(() => brideContract[chainId], [chainId])

  const {writeAsync} = useContractWrite({
    address: contractAddress,
    abi: BridgeAbi,
    functionName: "deposit"
  })
  const [currentChain, setCurrentChain] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>();

  const handleDeposit = useCallback(async () => {
    if(!writeAsync || !amount) {
      return;
    }

    try {
      const {data: tx} = await axios.post('http://localhost:8000/api/create', {
        fromChain: currentChain ? "Sepolia" : "Holesky",  
        toChain: currentChain ? "Holesky" : "Sepolia",
        amountIn: parseEther(amount.toString()).toString(),
        toAddress: address,
      })

      const {data: params} = await axios.get(`http://localhost:8000/api/sign/${tx.key}?from=${address}`);

      const {hash} = await writeAsync({
        args: [params.key, params.sig],
        value: params.amount
      })

      await waitForTransaction({hash: hash})
    } catch (err){
      console.log(err)
    }
   }, [writeAsync, amount, currentChain, address])


  useEffect(() => {
    console.log("Current", amount);
  }, [amount]);

  return (
    <S.Container>
      <Button
        $width="120px"
        $height="36px"
        $backgroundColor="#0fa884"
        $borderRadius="6px"
        $color="white"
        $border="none"
        $fontSize="12px"
        $fontWeight="400"
        $title={isConnected ? address : "Connect Wallet"}
        $justifySef="end"
        $transform="scale(1.05)"
        $onClick={() => open()}
      />
      <InputPanel
        $label="Source Chain"
        $plaseHolder={currentChain ? "Sepolia" : "Holesky"}
        $color="white"
        chainType={false}
        currentChain={currentChain}
        setCurrentChain={setCurrentChain}
        setAmount={setAmount}
        amount={amount}
      />
      <InputPanel
        $label="Destination Chain"
        $plaseHolder={!currentChain ? "Sepolia" : "Holesky"}
        $color="white"
        chainType={true}
        currentChain={currentChain}
        setCurrentChain={setCurrentChain}
      />
      <Button
        $width="120px"
        $height="36px"
        $backgroundColor="#0fa884"
        $borderRadius="6px"
        $color="white"
        $border="none"
        $fontSize="12px"
        $fontWeight="400"
        $title="Deposit"
        $justifySef="center"
        $transform="scale(1.05)"
        $onClick={() => handleDeposit()}
      />
    </S.Container>
  );
}
