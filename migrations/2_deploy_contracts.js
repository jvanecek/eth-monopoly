var Donator = artifacts.require('./Donator.sol');

module.exports = function(deployer) {
  deployer.deploy(Donator);
}
