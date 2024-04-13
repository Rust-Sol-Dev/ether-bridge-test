// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {INativeBridge} from "./interfaces/INativeBridge.sol";
import {Sig} from "./libraries/Structs.sol";

/**
 * @title BTC Bridge contract
 *        bridges wbtc to another networks
 */
contract NativeBridge is INativeBridge, AccessControl, ReentrancyGuard {
  uint256 public chainId;

  /// @dev roles
  bytes32 public constant ADMIN_ROLE = keccak256("Admin");
  bytes32 public constant KEEPER_ROLE = keccak256("Keeper");

  event PoolChanged(uint256 amount);

  /**
   * @dev initialize bridge
   * @param _admin admin address of bridge
   */
  constructor(address _admin) {
    uint _chainId;
    assembly {
      _chainId := chainid()
    }
    chainId = _chainId;

    _setRoleAdmin(KEEPER_ROLE, ADMIN_ROLE);
    _grantRole(ADMIN_ROLE, _admin);
  }

  /**
   * @dev deposit wbtc to bridge. Users call this function
   * @param _key transaction key
   * @param _sig signature of keeper
   */
  function deposit(bytes32 _key, Sig calldata _sig) external payable {
    require(_checkDeposit(msg.sender, _key, msg.value, _sig), "NativeBridge: invalid parameters");

    emit Deposit(_key, _msgSender());
    emit PoolChanged(address(this).balance);
  }

  /**
   * @dev send wbtc to user. Keepers call this function to send btc to users
   * @param _key transaction key
   * @param _to address of user
   * @param _amount wbtc amount to send
   */
  function withdraw(
    bytes32 _key,
    address _to,
    uint256 _amount
  ) external nonReentrant onlyRole(KEEPER_ROLE) {
    payable(_to).transfer(_amount);

    emit Withdraw(_key, _to);
    emit PoolChanged(address(this).balance);
  }

  /// @dev checks keeper signature
  function _checkDeposit(
    address _sender,
    bytes32 _key,
    uint256 _amount,
    Sig calldata _sig
  ) private view returns (bool) {
    bytes32 messageHash = keccak256(abi.encodePacked(_sender, _key, _amount, chainId));

    bytes32 ethSignedMessageHash = keccak256(
      abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
    );

    address signer = ecrecover(ethSignedMessageHash, _sig.v, _sig.r, _sig.s);

    return hasRole(KEEPER_ROLE, signer);
  }

  /// @dev owner can withdraw tokens of contract
  function withdrawPool(address _to, uint256 _amount) external onlyRole(ADMIN_ROLE) {
    payable(_to).transfer(_amount);
  }

  /// @dev revert eth deposit and another calls
  fallback() external payable {
    emit PoolChanged(address(this).balance);
  }

  receive() external payable {
    emit PoolChanged(address(this).balance);
  }
}
