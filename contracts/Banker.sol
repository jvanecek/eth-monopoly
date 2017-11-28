pragma solidity ^0.4.11;

import './zeppelin/BasicToken.sol';
import './OwnableNotTransferible.sol';

contract Banker is OwnableNotTransferible {

  mapping(uint256 => mapping(address => uint256)) balances;

  event LogBalanceSecured(uint256 gameId, address payer, uint priceAmount);
  event LogTransferToNoOne(uint256 gameId, address payer, uint priceAmount);
  event LogTransferBetween(uint256 gameId, address payer, address beneficiary, uint priceAmount);
  event LogBankerFallback();

  function secureBalance(uint256 gameId, address player, uint256 amount) public{
    // chequear como sacarle el balance al jugador
    balances[gameId][player] += amount;
    LogBalanceSecured(gameId, player, amount);
  }

  function transferFrom(uint256 gameId, address _buyer, uint priceAmount) public returns (bool){
    require( priceAmount <= balances[gameId][_buyer] );
    balances[gameId][_buyer] -= priceAmount;
    LogTransferToNoOne(gameId, _buyer, priceAmount);
    return true;
  }

  function transferBetween(uint256 gameId, address payer, address beneficiary, uint priceAmount) public returns (bool){
    require( priceAmount <= balances[gameId][payer] );
    balances[gameId][payer] -= priceAmount;
    balances[gameId][beneficiary] += priceAmount;
    LogTransferBetween(gameId, payer, beneficiary, priceAmount);
    return true;
  }

  function balanceOf( uint256 _gameId, address _player ) public view returns(uint256) {
    return balances[_gameId][_player];
  }

  function () public {
     LogBankerFallback();
  }
}
