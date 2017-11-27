var Banker = artifacts.require("../contracts/Banker.sol");
var MonopolyBoard = artifacts.require("../contracts/MonopolyBoard.sol");

async function expectThrow(promise,descriptionOnNoThrow){
  try {
    await promise;
  } catch (error) {
    // TODO: Check jump destination to destinguish between a throw
    //       and an actual invalid jump.
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    // TODO: When we contract A calls contract B, and B throws, instead
    //       of an 'invalid jump', we get an 'out of gas' error. How do
    //       we distinguish this from an actual out of gas event? (The
    //       testrpc log actually show an 'invalid jump' event.)
    const outOfGas = error.message.search('out of gas') >= 0;
    const revert = error.message.search('revert') >= 0;
    assert(
      invalidOpcode || outOfGas || revert,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail(descriptionOnNoThrow);
};

contract('MonopolyBoard', function(accounts) {
  let banker;
  let board;

  let nullAddress = "0x0000000000000000000000000000000000000000";
  let gameId = 1;
  let firstAssetId = 0;
  let secondAssetId = 1;
  let inexistentAssetId = 99;
  let playerOne = accounts[0];
  let playerTwo = accounts[1];

  beforeEach(async function() {
    banker = await Banker.new();
    board = await MonopolyBoard.new(banker.address);
  });

  it('Assets amount test when created', async function(){

    await expectThrow(
      board.priceAmountOf(gameId, firstAssetId),
      'Cant ask price if board has not yet been created'
    );

    await board.newInstanceFor(gameId);

    let priceAmount = await board.priceAmountOf(gameId, firstAssetId);
    assert.equal( priceAmount.toString(), '15', 'Price of first asset' );

    priceAmount = await board.priceAmountOf(gameId, secondAssetId);
    assert.equal( priceAmount.toString(), '20', 'Price of second asset' );

    await expectThrow(
      board.priceAmountOf(gameId, inexistentAssetId),
      'Should be no other asset');

    await expectThrow(
      board.priceAmountOf(gameId+1, firstAssetId),
      'Cant ask price of other board not created');
  });

  it('Assets ownership test when created', async function(){
    await expectThrow(
      board.ownerOf(gameId, firstAssetId),
      'Cant ask owner if board has not yet been created');

    await board.newInstanceFor(gameId);

    let owner = await board.ownerOf(gameId, firstAssetId);
    assert.equal( owner.toString(), nullAddress, 'Owner of first asset' );

    owner = await board.ownerOf(gameId, secondAssetId);
    assert.equal( owner.toString(), nullAddress, 'Owner of second asset' );

    await expectThrow(
      board.ownerOf(gameId, inexistentAssetId),
      'Should be no other asset');

    await expectThrow(
      board.ownerOf(gameId+1, firstAssetId),
      'Cant ask owner of other board not created');
  });

  it('Asset purchase', async function(){
    await board.newInstanceFor(gameId);

    await expectThrow(
      board.purchase(gameId, firstAssetId, {from: playerOne}),
      'Cant buy if has no secured balance');

    await banker.secureBalance(gameId, playerOne, 100);
    await board.purchase(gameId, firstAssetId, {from: playerOne});

    let owner = await board.ownerOf(gameId, firstAssetId);
    let playerBalance = await banker.balanceOf(gameId, playerOne);

    assert.equal(owner, playerOne, 'Owner of asset after purchase');
    assert.equal(playerBalance.toString(), '85', 'Balance of player after purchase');
  });

  it('Player pays rent', async function(){
    await board.newInstanceFor(gameId);
    await banker.secureBalance(gameId, playerOne, 100);
    await banker.secureBalance(gameId, playerTwo, 50);

    await board.purchase(gameId, secondAssetId, {from: playerOne});
    await board.payRent(gameId, secondAssetId, {from: playerTwo});

    let playerOneBalance = await banker.balanceOf(gameId, playerOne);
    let playerTwoBalance = await banker.balanceOf(gameId, playerTwo);

    assert.equal(playerOneBalance.toString(), '82', 'Balance owner plus rent');
    assert.equal(playerTwoBalance.toString(), '48', 'Balance of second player minus rent');
  })
});
