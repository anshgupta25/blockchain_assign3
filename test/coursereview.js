var CourseReview = artifacts.require("./CourseReview.sol");

contract("CourseReview",function(accounts){
    it("initialize with two courses",()=>{
          return CourseReview.deployed().then((instance)=>{
               return instance.coursesCount(); 
          }).then((count)=>{
              assert.equal(count,2);
          })
    })
})  