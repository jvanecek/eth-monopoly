var Banker = artifacts.require('../contracts/Banker.sol');
var MonopolyBoard = artifacts.require('../contracts/MonopolyBoard.sol');
var MonopolyGame = artifacts.require("../contracts/MonopolyGame.sol");

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

contract('MonopolyGame', function(accounts) {
  let banker;
  let board;
  let game;

  let playerOne = accounts[0];

  beforeEach(async function() {
    banker = await Banker.new();
    board = await MonopolyBoard.new(banker.address);
    game = await MonopolyGame.new(banker.addres, board.address);
  });

  it('Cant add player to a not created game', async function(){
    let gameId = 1;

    await expectThrow(
      game.addPlayer(gameId, playerOne, 1500),
      'Should not be able to add to an inexistent game');

    await game.createNew();
    gameId = 1;
    await game.addPlayer(gameId, playerOne, 1500);

  });
  
});
