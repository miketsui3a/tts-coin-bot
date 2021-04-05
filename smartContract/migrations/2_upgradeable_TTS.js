const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const TTS = artifacts.require('TTS');

module.exports = async function (deployer) {
  const instance = await deployProxy(TTS, ["Tang Tong Shing Coin","TTS"], { deployer });
  console.log('Deployed', instance.address);
};