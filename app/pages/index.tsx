import { createSession, SessionAccount, supportsSessions } from "@argent/x-sessions";
import { utils } from "ethers";
import { getStarknet } from "get-starknet";
import { useEffect, useState } from "react";
import { Abi, AccountInterface, Contract, ec, number, uint256 } from "starknet";
import { toFelt } from "starknet/dist/utils/number";

import contractAbi from "../../contracts/build/main_abi.json";
import deployments from "../../contracts/deployments.json";
import Erc20Abi from "../lib/abi/ERC20.json";

const { genKeyPair, getStarkKey, getKeyPair } = ec;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starknet?: any;
  }
}

type Network = "localhost" | "testnet";

const ethAddress = "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7";

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: "struct" as const, ...uint256.bnToUint256(bn) };
}

export function parseInputAmountToUint256(input: string, decimals = 18) {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString());
}

export default function Home() {
  const [account, setAccount] = useState<AccountInterface>();
  const [sessionAccount, setSessionAccount] = useState<SessionAccount>();

  const [balance, setBalance] = useState("0");
  const [isSupportsSession, setIsSupportsSession] = useState(false);

  const [network, setNetwork] = useState<Network>("testnet");

  const connectWallet = async () => {
    try {
      const starknet = getStarknet();
      // const starknet = await connect();
      await starknet?.enable();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setAccount(starknet?.account);
    } catch (e) {
      console.error(e);
    }
  };

  const increaseBalance = async () => {
    if (!account) {
      throw new Error("account is not defined");
    }

    if (sessionAccount) {
      const erc20Contract = new Contract(Erc20Abi as Abi, ethAddress, sessionAccount);
      const result = await erc20Contract.transfer(account.address, parseInputAmountToUint256("0.000000001"));
      console.log(result);
      // await sessionAccount.execute({
      //   contractAddress: deployments[network],
      //   entrypoint: "increase_balance",
      //   calldata: [toFelt(1)],
      // });
    } else {
      const contract = new Contract(contractAbi as any, deployments[network], account);
      await contract.increase_balance(toFelt(1));
    }
  };

  const getBalance = async () => {
    if (!account) {
      throw new Error("account is not defined");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract = new Contract(contractAbi as any, deployments[network], account);
    const { res } = await contract.get_balance();
    setBalance(res.toString());
  };

  const enableSessionKey = async () => {
    if (!account) {
      throw new Error("account is not defined");
    }
    let sessionSigner;
    const savedSessionSignerPk = window.localStorage.getItem("session-key-pk");
    if (!savedSessionSignerPk) {
      sessionSigner = genKeyPair();
      window.localStorage.setItem("session-key-pk", sessionSigner.priv.toString());
    } else {
      sessionSigner = getKeyPair(savedSessionSignerPk);
    }
    const signedSession = await createSession(
      {
        key: getStarkKey(sessionSigner),
        expires: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000),
        policies: [
          {
            // contractAddress: deployments[network],
            // selector: "increase_balance",
            contractAddress: ethAddress,
            selector: "transfer",
          },
        ],
      },
      account
    );
    setSessionAccount(new SessionAccount(account, account.address, sessionSigner, signedSession));
  };

  useEffect(() => {
    if (!account) {
      return;
    }
    supportsSessions(account.address, account).then((result) => setIsSupportsSession(result));
  }, [account]);

  return (
    <div>
      <p>Network</p>
      <select disabled onChange={(e) => setNetwork(e.target.value as Network)}>
        <option value="testnet">Testnet</option>
        <option value="localhost">Localhost</option>
      </select>
      <p>Account</p>
      <button disabled={!!account} onClick={connectWallet}>
        connect
      </button>

      {!account && <p>Please connect argent x wallet</p>}
      {account && (
        <div>
          <p>address: {account.address}</p>
          <p>isConnected: {(!!account).toString()}</p>
          <p>isSupportsSession: {(!!isSupportsSession).toString()}</p>
          <p>Session Key</p>
          <button disabled={!!sessionAccount} onClick={enableSessionKey}>
            Enable
          </button>
          <p>isEnabled: {(!!sessionAccount).toString()}</p>
          <p>Deployed Contract</p>
          <p>This is the main contract in protostar quickstart</p>
          <p>{deployments[network]}</p>
          <button onClick={increaseBalance}>increase_balance 1</button>
          <button onClick={getBalance}>get_balance</button>
          <p>get_balance: {balance}</p>
        </div>
      )}
    </div>
  );
}
