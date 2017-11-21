var Banker = artifacts.require("../contracts/Banker.sol");
var Purchasable = artifacts.require("../contracts/Purchasable.sol");

contract('Purchasable', function(accounts) {
  let banker;
  let purchasable;

  beforeEach(async function() {
    banker = await Banker.new(1500, accounts);
    purchasable = await Purchasable.new("Park Place", 350, banker.address);
  });

  it("Creation", async function(){
      let assetName = await purchasable.assetName();
      let priceAmount = await purchasable.priceAmount();
      let bankerAddress = await purchasable.bankerAddress();

      assert.equal( assetName, "Park Place" );
      assert.equal( priceAmount, 350 );
      assert.equal( bankerAddress, banker.address );
  });

  it("Purchased by player zero", async function() {
    let assetOwner = await purchasable.owner();
    let buyersBalance = await banker.balanceOf( accounts[0] );

    assert.equal( buyersBalance, 1500 );
    assert.equal( assetOwner, "0x0000000000000000000000000000000000000000")

    await purchasable.purchasedBy( accounts[0] );

    assetOwner = await purchasable.owner();
    buyersBalance = await banker.balanceOf( accounts[0] );

    assert.equal( assetOwner, accounts[0] );
    assert.equal( buyersBalance.toString(), "1150" );
  });

});
