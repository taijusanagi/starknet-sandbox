import { connect } from "get-starknet";
import { useState } from "react";
import { AccountInterface, Contract } from "starknet";
import { toFelt } from "starknet/dist/utils/number";

import contractAbi from "../../contracts/build/main_abi.json";
import deployments from "../../contracts/deployments.json";

export default function Home() {
  const [provider, setProvider] = useState<AccountInterface>();
  const [address, setAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState("0");

  const connectWallet = async () => {
    try {
      const starknet = await connect();
      if (!starknet) {
        return;
      }
      await starknet.enable();
      if (starknet.selectedAddress) {
        setAddress(starknet.selectedAddress);
      }
      setProvider(starknet.account);
      setIsConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  const increaseBalance = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract = new Contract(contractAbi as any, deployments.testnet, provider);
    await contract.increase_balance(toFelt(1));
  };

  const getBalance = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract = new Contract(contractAbi as any, deployments.testnet, provider);
    const { res } = await contract.get_balance();
    setBalance(res.toString());
  };

  return (
    <div>
      <p>Account</p>
      <button onClick={connectWallet}>connect</button>
      <p>address: {address}</p>
      <p>isConnected: {isConnected.toString()}</p>
      <p>Deployed Contract</p>
      <p>This is the main contract in protostar quickstart</p>
      {!isConnected && <p>Please connect argent x wallet</p>}
      {isConnected && (
        <div>
          <p>{deployments.testnet}</p>
          <button onClick={increaseBalance}>increase_balance 1</button>
          <button onClick={getBalance}>get_balance</button>
          <p>get_balance: {balance}</p>
        </div>
      )}
    </div>
  );
}
