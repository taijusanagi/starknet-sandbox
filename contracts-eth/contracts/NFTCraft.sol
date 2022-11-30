// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTCraft is ERC721 {

  constructor() ERC721("NFTCraft", "NFTC") {}

  struct Info {
    uint256 x;
    uint256 y;
    uint256 z;
    uint256 tokenId;
  }

  event Set(uint256 indexed x, uint256 indexed y, uint256 indexed z, uint256 tokenId);

  uint256 public constant length = 200;
  // x => y => z => nft
  mapping(uint256 => mapping(uint256 => mapping(uint256=> uint256))) public objects;

  function faucet(address to, uint256 tokenId) public {
    require(tokenId > 0, "NFTCraft: tokenId invalid");
    _mint(to, tokenId);
  }

  function set(uint256 x, uint256 y, uint256 z, uint256 tokenId) public {
    require(x < length, "NFTCraft: x length invalid");
    require(y < length, "NFTCraft: y length invalid");
    require(z < length, "NFTCraft: z length invalid");
    if(objects[x][y][z] > 0) {
      transferFrom(address(this), msg.sender, tokenId);
    }
    transferFrom(msg.sender, address(this), tokenId);
    objects[x][y][z] = tokenId;
    emit Set(x, y, z, tokenId);
  }

}
