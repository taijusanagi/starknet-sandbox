# Starknet Sandbox
- This is the StarkNet sandbox to know how to deploy contracts and interact from frontend
- Also setup solidity to Cairo development workflow

## Reference

This tutorial is nice
https://medium.com/@darlingtonnnam/an-in-depth-guide-to-getting-started-with-starknet-js-a55c04d0ccb7

## Setup Argen X
https://chrome.google.com/webstore/detail/argent-x/dlcobpjiigpikoobohmabehhmhfoodbb

## Bridge
https://goerli.starkgate.starknet.io/

https://testnet.starkscan.co/eth-tx/0xd2053ca772f45c0a51932fd4119979cea17d263828d0b540532982b7aa0333e5

## Interact with Starknet Contract

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
