pragma solidity ^0.4.11;

import './zeppelin/BasicToken.sol';
import './OwnableNotTransferible.sol';

contract Banker is BasicToken, OwnableNotTransferible {

  address public playersTurn;

  function Banker(uint _startingBalance, address[] _players) public{
    require( _players.length > 1 );

    for( uint i = 0; i < _players.length; i++ ){
      balances[_players[i]] = _startingBalance;
    }

    playersTurn = _players[0];
  }

  function isTurnOf(address _player) constant public returns (bool){
    return playersTurn == _player;
  }

  function transferFrom(address _buyer, uint priceAmount) public returns (bool){
    require( priceAmount <= balances[_buyer] );
    require( isTurnOf(_buyer) );
    balances[_buyer] -= priceAmount;
    return true;
  }

  function transferBetween(address payerPlayer, address beneficiaryPlayer, uint priceAmount) public returns (bool){
    balances[payerPlayer] -= priceAmount;
    balances[beneficiaryPlayer] += priceAmount;
    return true;
  }

  function () public {
    // fallback
  }
}
