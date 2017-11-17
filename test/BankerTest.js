var Banker = artifacts.require("../contracts/Banker.sol");

contract('Banker', function(accounts) {
  let banker;

  beforeEach(async function() {
    banker = await Banker.new(1500, accounts);
  });

  it("Initial players turn", async function() {
    let isPlayerZeroTurn = await banker.isTurn( accounts[0] );
    let isPlayerOneTurn = await banker.isTurn( accounts[1] );

    assert.isTrue(isPlayerZeroTurn);
    assert.isFalse(isPlayerOneTurn);
  });

  it("Initial players balances", async function() {

    for( i = 0; i < accounts.length; i++ ){
      let playerBalance = await banker.balanceOf( accounts[i] );

      assert.equal(playerBalance, 1500);
    }
  });

  it("Balance after player zero transfers", async function() {
    await banker.transferFrom(accounts[0], 100)

    for( i = 0; i < accounts.length; i++ ){
      let playerBalance = await banker.balanceOf( accounts[i] );

      if( i == 0 ){
        assert.equal(playerBalance, 1400);
      }else{
        assert.equal(playerBalance, 1500);
      }

    }
  });
});
