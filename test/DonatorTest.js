var Donator = artifacts.require("../contracts/Donator.sol");

contract('Donator', function(accounts) {

  beforeEach(async function() {
    donator = await Donator.new();
  });

  it("Securing players balances adds amount", async function() {
    
  });

});
