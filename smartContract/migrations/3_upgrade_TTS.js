const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const TTS = artifacts.require("TTS")


module.exports = async function (deployer) {
    const existing = await TTS.deployed();
    const instance = await upgradeProxy(existing.address, TTS, { deployer });
    console.log("Upgraded", instance.address);
  };    