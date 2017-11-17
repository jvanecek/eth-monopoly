pragma solidity ^0.4.11;

import './Banker.sol';

contract Purchasable {
  address public owner;
  address public bankerAddress;
  uint public priceAmount;

  function Purchasable(address _bankerAddress, uint _priceAmount) public {
    owner = msg.sender;
    bankerAddress = _bankerAddress;
    priceAmount = _priceAmount;
  }

  function purchasedBy(address _buyer) public {
    require( owner == bankerAddress );

    var banker = Banker(bankerAddress);
    require( banker.isTurn(_buyer) );
    require( banker.transferFrom(_buyer, priceAmount) );
    owner = _buyer;
  }

}
