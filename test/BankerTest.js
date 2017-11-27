var Banker = artifacts.require("../contracts/Banker.sol");

contract('Banker', function(accounts) {
  let banker;
  let gameId = 1;
  let anotherGameId = 2;

  beforeEach(async function() {
    banker = await Banker.new();
  });

  it("Securing players balances adds amount", async function() {

    let playerBalance = await banker.balanceOf( gameId, accounts[0] );
    assert.equal(playerBalance, 0);

    await banker.secureBalance(gameId, accounts[0], 1500);

    playerBalance = await banker.balanceOf( gameId, accounts[0] );
    assert.equal(playerBalance, 1500);

    playerBalance = await banker.balanceOf( anotherGameId, accounts[0] );
    assert.equal(playerBalance, 0);

  });

  it("Balance transfers substracts amount", async function() {
    await banker.secureBalance(gameId, accounts[0], 1500);
    await banker.transferFrom(gameId, accounts[0], 100)

    let playerBalance = await banker.balanceOf( gameId, accounts[0] );
    assert.equal(playerBalance, 1400);
  });

  it("Balance transfering between players", async function() {
    await banker.secureBalance(gameId, accounts[0], 1500);

    let playerZeroBalance = await banker.balanceOf( gameId, accounts[0] );
    let playerOneBalance = await banker.balanceOf( gameId, accounts[1] );
    assert.equal(playerZeroBalance, 1500);
    assert.equal(playerOneBalance, 0);

    await banker.transferBetween(gameId, accounts[0], accounts[1], 1400);

    playerZeroBalance = await banker.balanceOf( gameId, accounts[0] );
    playerOneBalance = await banker.balanceOf( gameId, accounts[1] );
    assert.equal(playerZeroBalance, 100);
    assert.equal(playerOneBalance, 1400);
  });
});
