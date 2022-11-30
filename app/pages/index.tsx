import { createSession, SessionAccount, SignedSession } from "@argent/x-sessions";
import { getStarknet } from "get-starknet";
import { useMemo, useState } from "react";
import { AccountInterface, Contract, ec, Signer } from "starknet";
import { toFelt } from "starknet/dist/utils/number";

import contractAbi from "../../contracts/build/main_abi.json";
import deployments from "../../contracts/deployments.json";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starknet?: any;
  }
}

type Network = "localhost" | "testnet";

interface Policy {
  contractAddress: string;
  selector: string;
}

interface RequestSession {
  key: string;
  expires: number;
  policies: Policy[];
}

export default function Home() {
  const [provider, setProvider] = useState<AccountInterface>();
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [sessionSigner, setSessionSigner] = useState<Signer>();
  const [signedSession, setSignedSession] = useState<SignedSession>();

  const [network, setNetwork] = useState<Network>("testnet");

  const connectWallet = async () => {
    try {
      const starknet = getStarknet();
      // const starknet = await connect();
      await starknet?.enable();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setAddress(starknet?.selectedAddress as string);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      setProvider(starknet?.account);
    } catch (e) {
      console.error(e);
    }
  };

  const increaseBalance = async () => {
    if (!provider) {
      throw new Error("provider is not defined");
    }

    if (isSessionEnabled) {
      if (!signedSession) {
        throw new Error("signed session is not defined");
      }
      const sessionAccount = new SessionAccount(provider, provider.address, sessionSigner, signedSession);
      const contract = new Contract(contractAbi as any, deployments[network], sessionAccount);
      await contract.increase_balance(toFelt(1));
    } else {
      const contract = new Contract(contractAbi as any, deployments[network], provider);
      await contract.increase_balance(toFelt(1));
    }
  };

  const getBalance = async () => {
    if (!provider) {
      throw new Error("provider is not defined");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contract = new Contract(contractAbi as any, deployments[network], provider);
    const { res } = await contract.get_balance();
    setBalance(res.toString());
  };

  const enableSessionKey = async () => {
    if (!provider) {
      throw new Error("provider is not defined");
    }
    let sessionSigner;
    const savedSessionSignerPk = window.localStorage.getItem("session-key-pk");
    if (!savedSessionSignerPk) {
      const temp = new Signer() as any;
      window.localStorage.setItem("session-key-pk", temp.keyPair.priv.toString());
      sessionSigner = temp as Signer;
    } else {
      const keyPair = ec.getKeyPair(savedSessionSignerPk);
      sessionSigner = new Signer(keyPair);
    }
    const sessionSignerPubKey = await sessionSigner.getPubKey();
    console.log(sessionSignerPubKey);
    const requestSession: RequestSession = {
      key: await sessionSignerPubKey,
      expires: Math.floor((Date.now() + 1000 * 60 * 60 * 24) / 1000),
      policies: [
        {
          contractAddress: deployments[network],
          selector: "increase_balance",
        },
      ],
    };
    const signedSession = await createSession(requestSession, provider);
    setSessionSigner(sessionSigner);
    setSignedSession(signedSession);
  };

  const isConnected = useMemo(() => {
    return !!provider;
  }, [provider]);

  const isSessionEnabled = useMemo(() => {
    return !!sessionSigner && !!signedSession;
  }, [sessionSigner, signedSession]);

  return (
    <div>
      <p>Network</p>
      <select disabled onChange={(e) => setNetwork(e.target.value as Network)}>
        <option value="testnet">Testnet</option>
        <option value="localhost">Localhost</option>
      </select>
      <p>Account</p>
      <button disabled={isConnected} onClick={connectWallet}>
        connect
      </button>
      <p>address: {address}</p>
      <p>isConnected: {isConnected.toString()}</p>

      {!provider && <p>Please connect argent x wallet</p>}
      {provider && (
        <div>
          <p>Session Key</p>
          <button disabled={isSessionEnabled} onClick={enableSessionKey}>
            Enable
          </button>
          <p>isEnabled: {isSessionEnabled.toString()}</p>
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
