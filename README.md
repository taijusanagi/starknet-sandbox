# Starknet Sandbox

- This is the StarkNet sandbox to know how to deploy contracts and interact from frontend
- Also setup solidity to Cairo development workflow

## Devnet

https://shard-labs.github.io/starknet-devnet/docs/guide/run#run-with-docker

```
docker pull shardlabs/starknet-devnet
docker run -p 127.0.0.1:5050:5050 shardlabs/starknet-devnet
```

## Reference

This tutorial is nice
https://medium.com/@darlingtonnnam/an-in-depth-guide-to-getting-started-with-starknet-js-a55c04d0ccb7

## Setup Argen X

https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb

## Local

- please replace the private key, account address, contract address
- original config file does not work, so I modified based on the shared cheat sheet

### Obtain account key

```
http://localhost:5050/predeployed_accounts
```

### Build, Declare, Deploy

```
protostar build
protostar -p devnet declare ./build/main.json
protostar -p devnet deploy ./build/main.json
```

### Invoke and Call

```
protostar -p devnet invoke --contract-address 0x0253b3190a4458d0ec4f67d856b92d34339142e09c212deb5fe67d8d2b85a621 --function "increase_balance" --account-address 0x2d8c183ad449a794beda163d6906fcedf221743ce284b0c60e4a17a15ca6238  --max-fee auto --inputs 3 --private-key-path ./.pkey
```

```
protostar -p devnet call --contract-address 0x0253b3190a4458d0ec4f67d856b92d34339142e09c212deb5fe67d8d2b85a621  --function "get_balance"
```

## Interact with Testnet Starknet Contract

## Bridge

This is to get test token

https://goerli.starkgate.starknet.io/

https://testnet.starkscan.co/eth-tx/0xd2053ca772f45c0a51932fd4119979cea17d263828d0b540532982b7aa0333e5

### Build

```
protostar build
```

### Declare

```
protostar declare ./build/main.json --network testnet
```

```
Class hash: 0x05ae1ac28930b6630ba1068f5e9ee21050a8aecc6f8aecadf2b7c5d3ea93512f
StarkScan https://testnet.starkscan.co/class/0x05ae1ac28930b6630ba1068f5e9ee21050a8aecc6f8aecadf2b7c5d3ea93512f
Voyager   https://goerli.voyager.online/class/0x05ae1ac28930b6630ba1068f5e9ee21050a8aecc6f8aecadf2b7c5d3ea93512f

Transaction hash: 0x033e0259ee9972db7baf8bf679aeb89e9f7efb3e49389d44ea90f0ae3eb0bdf5
StarkScan https://testnet.starkscan.co/tx/0x033e0259ee9972db7baf8bf679aeb89e9f7efb3e49389d44ea90f0ae3eb0bdf5
Voyager   https://goerli.voyager.online/tx/0x033e0259ee9972db7baf8bf679aeb89e9f7efb3e49389d44ea90f0ae3eb0bdf5
```

### Deploy

```
protostar deploy ./build/main.json --network testnet
```

```
12:10:17 [INFO] Deploy transaction was sent.
Contract address: 0x071ee47afb19f5886d361d79d93e9d12c829b53644a502fbac036898afc6147b
StarkScan https://testnet.starkscan.co/contract/0x071ee47afb19f5886d361d79d93e9d12c829b53644a502fbac036898afc6147b
Voyager   https://goerli.voyager.online/contract/0x071ee47afb19f5886d361d79d93e9d12c829b53644a502fbac036898afc6147b

Transaction hash: 0x017b2c4fe35633ada5c514fb2048cffb3f84950998cf8f333ae51c6d483e338d
StarkScan https://testnet.starkscan.co/tx/0x017b2c4fe35633ada5c514fb2048cffb3f84950998cf8f333ae51c6d483e338d
Voyager   https://goerli.voyager.online/tx/0x017b2c4fe35633ada5c514fb2048cffb3f84950998cf8f333ae51c6d483e338d
12:10:17 [INFO] Execution time: 2.63 s
```
