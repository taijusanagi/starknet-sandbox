/* eslint-disable camelcase */
import { createSession, SessionAccount, supportsSessions } from "@argent/x-sessions";
import { utils } from "ethers";
import { getStarknet } from "get-starknet";
import { useEffect, useState } from "react";
import { AccountInterface, Contract, ec, number, RpcProvider, uint256 } from "starknet";
import { toFelt } from "starknet/dist/utils/number";

import contractAbi from "../../contracts/build/nftcraft_abi.json";
import deployments from "../../contracts/deployments.json";

const { genKeyPair, getStarkKey, getKeyPair } = ec;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starknet?: any;
  }
}

function getUint256CalldataFromBN(bn: number.BigNumberish) {
  return { type: "struct" as const, ...uint256.bnToUint256(bn) };
}

export function parseInputAmountToUint256(input: string, decimals = 18) {
  return getUint256CalldataFromBN(utils.parseUnits(input, decimals).toString());
}

type Network = "testnet";

export default function Home() {
  const [account, setAccount] = useState<AccountInterface>();
  const [sessionAccount, setSessionAccount] = useState<SessionAccount>();
  const [isSupportsSession, setIsSupportsSession] = useState(false);
  const [network, setNetwork] = useState<Network>("testnet");

  const [inputSetTokenId, setInputSetTokenId] = useState("0");
  const [myNFTs, setMyNFTs] = useState<string[]>([]);
  const [inputMintTokenId, setInputMintTokenId] = useState("0");

  const [inputX, setInputX] = useState("0");
  const [inputY, setInputY] = useState("0");
  const [inputZ, setInputZ] = useState("0");

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
      throw new Error("not implemented");
      // const erc20Contract = new Contract(Erc20Abi as Abi, ethAddress, sessionAccount);
      // const result = await erc20Contract.transfer(account.address, parseInputAmountToUint256("0.000000001"));
      // console.log(result);
      // await sessionAccount.execute({
      //   contractAddress: deployments[network],
      //   entrypoint: "increase_balance",
      //   calldata: [toFelt(1)],
      // });
    } else {
      const contract = new Contract(contractAbi as any, deployments[network], account);
      await contract.mint_40c10f19(toFelt(account.address), [toFelt(inputMintTokenId), ""]);
    }
  };

  const getNFTs = async () => {
    if (!account) {
      throw new Error("account is not defined");
    }
    const provider = new RpcProvider({
      nodeUrl: "https://nd-133-096-096.p2pify.com/b7703f21b16704348bf592a2245f1aaf",
    });
    const { block_number } = await provider.getBlock("latest");
    const { events } = await provider.getEvents({
      from_block: { block_number: 0 },
      to_block: { block_number },
      address: deployments[network],
      keys: ["0x26b2c4828dd5c46b480c41d84ea8dc17fcae16cfb938437ecb30c5aad25378f"],
      chunk_size: 20,
    } as any);

    const holders: { [key: string]: string } = {};
    events.forEach((event) => {
      holders[parseInt(event.data[2]).toString()] = event.data[1].toLowerCase();
    });
    console.log(holders);
    const entries = Object.entries(holders);
    const mine = entries.filter(([, value]) => value === account.address).map(([tokenId]) => tokenId);
    console.log(mine);
    setMyNFTs(mine);
    if (mine.length > 0) {
      setInputSetTokenId(mine[0]);
    }
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
            contractAddress: deployments[network],
            selector: "increase_balance",
          },
        ],
      },
      account
    );
    setSessionAccount(new SessionAccount(account, account.address, sessionSigner, signedSession));
  };

  const setMap = async () => {
    if (!account) {
      throw new Error("account is not defined");
    }
    const contract = new Contract(contractAbi as any, deployments[network], account);
    console.log([toFelt(inputX), ""], [toFelt(inputY), ""], [toFelt(inputZ), ""], [toFelt(inputSetTokenId), ""]);

    await contract.set_606ce3bf(
      [toFelt(inputX), ""],
      [toFelt(inputY), ""],
      [toFelt(inputZ), ""],
      [toFelt(inputSetTokenId), ""]
    );
  };

  const getMap = async () => {
    const provider = new RpcProvider({
      nodeUrl: "https://nd-133-096-096.p2pify.com/b7703f21b16704348bf592a2245f1aaf",
    });
    const { block_number } = await provider.getBlock("latest");
    const { events } = await provider.getEvents({
      from_block: { block_number: 0 },
      to_block: { block_number },
      address: deployments[network],
      keys: ["0x2360a635772f38ab9463ddf6391c3896b64ef3ff12419de002fcf26f9b35df8"],
      chunk_size: 20,
    } as any);

    const tokenIds: any = {};
    events.forEach((event) => {
      tokenIds[parseInt(event.data[0]).toString()] = {
        [parseInt(event.data[2]).toString()]: {
          [parseInt(event.data[4]).toString()]: parseInt(event.data[6]).toString(),
        },
      };
    });
    const map = [];
    for (let x = 0; x < 200; x++) {
      for (let y = 0; y < 200; y++) {
        for (let z = 0; z < 200; z++) {
          const id = tokenIds[x] && tokenIds[x][y] && tokenIds[x][y][z] ? tokenIds[x][y][z] : "0";
          map.push({ x, y, z, id });
        }
      }
    }
    console.log(map);
    console.log(tokenIds);
    console.log(events);
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
      <button disabled={!!account} onClick={connectWallet}>
        connect
      </button>
      {!account && <p>Please connect argent x wallet</p>}
      {account && (
        <div>
          <p>address: {account.address}</p>
          <p>isSupportsSession: {(!!isSupportsSession).toString()}</p>
          <button disabled={!!sessionAccount} onClick={enableSessionKey}>
            Enable Session Key
          </button>
          <p>isEnabled: {(!!sessionAccount).toString()}</p>
          <p>NFTCraft</p>
          <p>{deployments[network]}</p>
          <div>
            <p>Mint</p>
            <input value={inputMintTokenId} onChange={(e) => setInputMintTokenId(e.target.value)}></input>
            <button onClick={increaseBalance}>mint</button>
            <button onClick={getNFTs}>Get NFTs</button>
          </div>
          <div>
            <p>Map</p>
            <p>X</p>
            <input value={inputX} onChange={(e) => setInputX(e.target.value)} max={200} type={"number"} />
            <p>Y</p>
            <input value={inputY} onChange={(e) => setInputY(e.target.value)} max={200} type={"number"} />
            <p>Z</p>
            <input value={inputZ} onChange={(e) => setInputZ(e.target.value)} max={200} type={"number"} />
            <p>Token Id (run get NFTs)</p>
            <select
              disabled={myNFTs.length === 0}
              value={inputSetTokenId}
              onChange={(e) => setInputSetTokenId(e.target.value)}
            >
              {myNFTs.map((tokenId) => {
                return (
                  <option key={tokenId} value={tokenId}>
                    {tokenId}
                  </option>
                );
              })}
            </select>
            <button disabled={myNFTs.length === 0} onClick={setMap}>
              Set
            </button>
            <button onClick={getMap}>Get</button>
          </div>
        </div>
      )}
    </div>
  );
}
