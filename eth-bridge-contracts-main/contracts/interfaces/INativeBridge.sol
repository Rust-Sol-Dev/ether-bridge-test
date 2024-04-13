// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import {Sig} from "../libraries/Structs.sol";

interface INativeBridge {
  function deposit(bytes32 key, Sig calldata sig) external payable;

  event Deposit(bytes32 indexed key, address from);
  event Withdraw(bytes32 indexed key, address to);
}
