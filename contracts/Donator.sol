pragma solidity ^0.4.11;

contract Donator {

  mapping(address => uint256) donations;
  mapping(address => uint256) withdrawlMinimumAmount;
  mapping(address => bool) hasOpenDonation;

  event LogDonatorFallback();
  event LogDonation(address beneficiary, address donator, uint256 amount);
  event LogWithdrawl(address beneficiary, uint256 expectedMinimum, uint256 withdrawlAmount);

  function createNew(uint256 expectedFinalBalance) public {
    require(!hasOpenDonationCampaign());

    hasOpenDonation[msg.sender] = true;
    withdrawlMinimumAmount[msg.sender] = expectedFinalBalance;
  }

  function donate(address donationAddress) public payable {
    require( donationAddress != msg.sender );
    donations[donationAddress] += msg.value;
    LogDonation(donationAddress, msg.sender, msg.value);
  }

  function donatedBalance() public view returns(uint256){
    return donations[msg.sender];
  }

  function withdrawl() public {
    require( donations[msg.sender] >= withdrawlMinimumAmount[msg.sender] );

    uint256 donated = donations[msg.sender];
    msg.sender.transfer(donated);
    LogWithdrawl(msg.sender, withdrawlMinimumAmount[msg.sender], donated);

    donations[msg.sender] = 0;
    withdrawlMinimumAmount[msg.sender] = 0;
    hasOpenDonation[msg.sender] = false;
  }

  function hasOpenDonationCampaign() public view returns(bool){
    return hasOpenDonation[msg.sender];
  }

  function withdrawlMinimum() public view returns(uint256){
    return withdrawlMinimumAmount[msg.sender];
  }

  function () public {
     LogDonatorFallback();
  }
}
