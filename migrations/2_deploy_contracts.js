var CharityDapp = artifacts.require("./CharityDapp.sol");

module.exports = function(deployer) {
    deployer.deploy(CharityDapp);
};