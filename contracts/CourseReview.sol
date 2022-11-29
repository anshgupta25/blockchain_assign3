// SPDX-License-Identifier: MIT License

pragma solidity >=0.4.0 <0.7.0;

contract CourseReview{
    // model a condidate 
    struct Course{
      uint id;
      string name;
      string desc;
      uint num_donation;
      uint amt_collect;
      //make a map of the students who have voted for the course

      mapping(address => bool) students;
      mapping(address => uint) amt;
    }
    // store accounts that have voted
    
   // store a candiate 
   // fetch course 
    mapping(uint => Course) public courses;
    // store course count
   uint public charity_num;

    constructor() public{
      addCourse("Charity 1","Default Charity");
    }

    function addCourse (string memory _name, string memory _desc) public {
      charity_num++;
      //add a new course
      courses[charity_num] = Course(charity_num, _name,_desc, 0, 0);
      // courses[charity_num] = Course(charity_num,_name
    }
    
    function vote (uint _courseId,uint _rating) public {
      // address has not voted before
      // require(!students[msg.sender]);
      // voting for valid course
      require(_courseId>0 && _courseId<=charity_num);
      // update the voter has voted
      //amt_collect must be between 1 and 5
      require(_rating>0);

      // students[msg.sender] = true;
      //update the votes of course
      //update the amt_collect of the course
      //make a variable tempcourse
      Course memory tempCourse = courses[_courseId];
      // var tempCourse = courses[_courseId];
      uint tempCount = tempCourse.num_donation;
      uint tempRating = tempCourse.amt_collect;
      // tempRating = tempRating + _rating;

      //if the student has voted before then the vote count should not be incremented

        tempCount++;
        courses[_courseId].students[msg.sender] = true;
        tempRating = tempRating + _rating;
        courses[_courseId].amt[msg.sender] = tempRating;
        
    
      //make a for loop to calculate the average amt_collect of specific course
      // uint sum = 0;
      // uint count = 0;
      // for(uint i=1;i<=tempCount;i++){
      //   //make a for loop on amt
      //   sum = sum + courses[_courseId].amt[i];
      // }
    

      // tempCount++;
      courses[_courseId] = Course(_courseId,tempCourse.name,tempCourse.desc,tempCount,tempRating);
      // courses[_courseId].num_donation ++;
    }

}