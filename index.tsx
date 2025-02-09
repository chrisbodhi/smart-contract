import React, { useEffect, useState } from "react";
import { ethers, Contract } from "ethers";
import { BrowserProvider } from "ethers";
import { JsonRpcSigner } from "ethers";

import LockABI from "./Lock.json"; // Make sure to place your contract ABI here

const CONTRACT_ADDRESS = "0x958D9A6a5150e06e664C932EA43Fb1240131A533";

export default function LockContract() {
  const [provider, setProvider] = useState<BrowserProvider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [contract, setContract] = useState<Contract>();
  const [unlockTime, setUnlockTime] = useState(0);
  const [owner, setOwner] = useState("");
  const [balance, setBalance] = useState("0");
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      if (!window.ethereum) {
        setError("Please install MetaMask");
        return;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, LockABI, signer);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      await fetchContractData(contract);
    }
    init();
  }, []);

  async function fetchContractData(contract: Contract) {
    if (!provider) return;
    try {
      const unlockTime = await contract.unlockTime();
      const owner = await contract.owner();
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setUnlockTime(Number(unlockTime));
      setOwner(owner);
      setBalance(ethers.formatEther(balance));
    } catch (err) {
      setError("Failed to fetch contract data");
    }
  }

  async function withdrawFunds() {
    if (!contract) return;
    try {
      const tx = await contract.withdraw();
      await tx.wait();
      alert("Withdrawal successful!");
      await fetchContractData(contract);
    } catch (err) {
      setError("Withdrawal failed: " + err.message);
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold">Lock Contract</h1>
      {error && <p className="text-red-500">{error}</p>}
      <p>
        <strong>Unlock Time:</strong>{" "}
        {new Date(unlockTime * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Owner:</strong> {owner}
      </p>
      <p>
        <strong>Balance:</strong> {balance} ETH
      </p>
      <button
        onClick={withdrawFunds}
        disabled={Date.now() / 1000 < unlockTime}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Withdraw
      </button>
    </div>
  );
}
