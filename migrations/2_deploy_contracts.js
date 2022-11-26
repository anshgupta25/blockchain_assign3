var CourseReview = artifacts.require("./CourseReview.sol");

module.exports = function(deployer) {
  deployer.deploy(CourseReview);
};
