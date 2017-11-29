pragma solidity ^0.4.11;

contract Donator {

  mapping(address => uint256) donations;
  mapping(address => uint256) minimumDonation;

  event LogDonatorFallback();

  function createNew(uint256 expectedFinalBalance) public {
    require( donations[msg.sender] == 0 );

    minimumDonation[msg.sender] = expectedFinalBalance;
  }

  function donate(address donationAddress) public payable {
    require( donationAddress != msg.sender );
    donations[donationAddress] += msg.value;
  }

  function donationStatus() public returns(uint256){
    return donations[msg.sender];
  }

  function withdrawl() public {
    require( donations[msg.sender] >= minimumDonation[msg.sender] );
    msg.sender.transfer(donations[msg.sender]);
    donations[msg.sender] = 0;
  }

  function () public {
     LogDonatorFallback();
  }
}
