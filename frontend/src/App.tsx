import { useState, useEffect } from "react";
import {
  BrowserProvider,
  Contract,
  JsonRpcSigner,
  JsonRpcProvider,
} from "ethers";
import { Button, Card } from "@chakra-ui/react";

import "./App.css";

const SEPOLIA_RPC_URL =
  "https://eth-sepolia.g.alchemy.com/v2/lSMLEKVMZpn89Xyh-yP17SgJyvjGXZkp";
const CONTRACT_ADDRESS = "0x958D9A6a5150e06e664C932EA43Fb1240131A533";
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_unlockTime", type: "uint256" }],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "unlockTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function LockContract() {
  const [provider, setProvider] = useState<JsonRpcProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [unlockTime, setUnlockTime] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      // const web3Provider = new BrowserProvider(window.ethereum);
      const provider = new JsonRpcProvider(SEPOLIA_RPC_URL);
      setProvider(provider);
    }
  }, []);

  const connectWallet = async () => {
    try {
      if (!provider) return;
      // const accounts = await provider.listAccounts();
      // const firstAccount = accounts[0];
      // if (firstAccount) {
      // setAccount(firstAccount.address);
      // }
      // const signer = await provider.getSigner();
      // setSigner(signer);
      const contractInstance = new Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider,
      );
      setContract(contractInstance);
      fetchUnlockTime(contractInstance);
    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  };

  const fetchUnlockTime = async (contractInstance: Contract) => {
    const time = await contractInstance.unlockTime();
    setUnlockTime(Number(time));
  };

  const withdraw = async () => {
    if (!contract) return;
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Withdraw successful!");
    } catch (error) {
      console.error(error);
      alert("Withdraw failed!");
    }
  };

  return (
    <Card.Root>
      <Card.Body>
        <Button onClick={connectWallet}>Connect Wallet</Button>
        {account && <p>Connected: {account}</p>}
        {unlockTime !== null && (
          <p>Unlock Time: {new Date(unlockTime * 1000).toLocaleString()}</p>
        )}
        <Button onClick={withdraw} disabled={!contract}>
          Withdraw
        </Button>
      </Card.Body>
    </Card.Root>
  );
}
