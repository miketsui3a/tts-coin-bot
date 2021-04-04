const Migrations = artifacts.require("Migrations");
const TTS = artifacts.require("TTS");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(TTS);
};
