var Banker = artifacts.require('./Banker.sol');
var MonopolyBoard = artifacts.require('./MonopolyBoard.sol');
var MonopolyGame = artifacts.require('./MonopolyGame.sol');

module.exports = function(deployer) {
  deployer.deploy(Banker).then(async () => {
    deployer.deploy(MonopolyBoard, Banker.address).then(async () => {
      await deployer.deploy(MonopolyGame, Banker.address, MonopolyGame.address);
    })
  });
}
