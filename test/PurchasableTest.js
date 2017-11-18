var Banker = artifacts.require("../contracts/Banker.sol");
var Purchasable = artifacts.require("../contracts/Purchasable.sol");

contract('Purchasable', function(accounts) {
  let banker;
  let purchasable;

  beforeEach(async function() {
    banker = await Banker.new(1500, accounts);
    purchasable = await Purchasable.new("Park Place", 350, banker);
  });

  it("First purchasable test", async function() {
    let assetOwner = await purchasable.owner();
    let buyersBalance = await banker.balanceOf( accounts[0] );

    assert.equal( buyersBalance, 1500 );
    assert.equal( assetOwner, "0x0000000000000000000000000000000000000000")

    await purchasable.purchasedBy( accounts[0] );

    assetOwner = await purchasable.owner();
    buyersBalance = await banker.balanceOf( accounts[0] );

    assert.equal( buyersBalance, 1150 );
    assert.equal( assetOwner, accounts[0] );
  });

});
