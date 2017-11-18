pragma solidity ^0.4.11;

import './Banker.sol';

contract Purchasable {
  address public owner;
  address public bankerAddress;
  uint public priceAmount;
  string public assetName;

  function Purchasable(string _assetName, uint _priceAmount, address _bankerAddress) public {
    // Only the banker can emit purchasables
    bankerAddress = _bankerAddress;
    priceAmount = _priceAmount;
    assetName = _assetName;
  }

  function purchasedBy(address _buyer) public {
    // Can only be bougth if has no owner already
    require( address(0) == owner );

    var banker = Banker(bankerAddress);
    require( banker.isTurnOf(_buyer) );
    require( banker.transferFrom(_buyer, priceAmount) );
    owner = _buyer;
  }

  function (){
    // fallback
  }
}
