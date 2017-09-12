pragma solidity ^0.4.11;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract ConciergeCoin is MintableToken {
  string public name = "CONCIERGE COIN";
  string public symbol = "CEC";
  uint256 public decimals = 18;
}