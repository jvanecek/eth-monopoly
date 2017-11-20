pragma solidity ^0.4.11;

import './Banker.sol';

contract Purchasable {
  address public owner;
  address public bankerAddress;
  uint public priceAmount;
  string public assetName;

  event LogPurchase(string _assetName, address _buyer, uint _priceAmount);

  function Purchasable(string _assetName, uint _priceAmount, address _bankerAddress) public {
    bankerAddress = _bankerAddress;
    priceAmount = _priceAmount;
    assetName = _assetName;
  }

  function purchasedBy(address _buyer) public {
    // Can only be bougth if has no owner already
    require( address(0) == owner );

    // Not working!
    // let banker = Banker(bankerAddress);
    // banker.transferFrom(_buyer, priceAmount);
    require( bankerAddress.call(bytes4(sha3("transferFrom(address,uint)")), _buyer, priceAmount) );

    owner = _buyer;

    LogPurchase(assetName, _buyer, priceAmount);
  }

  function (){
    // fallback
  }
}
